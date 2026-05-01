import { GoogleGenAI, Type } from "@google/genai";
import {
  AmenityAnalysisResult,
  CategorizedAmenities,
  Property,
  toFlatAmenityArray,
} from "../types";

const apiKey = process.env.API_KEY;

const getAiClient = () => {
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const AMENITY_ANALYSIS_PROMPT = `You are an expert property analyst. Analyze the provided property images and identify every visible amenity.

For each amenity, assign a confidence score:
- 0.9-1.0: Clearly visible
- 0.7-0.89: Partially visible or at an angle
- 0.5-0.69: Reasonably inferred from context
- Below 0.5: Do not include

Categories to check:
- kitchen: appliances, countertops, dishwasher, island, pantry
- bathroom: tub, shower type, vanity, fixtures
- living: flooring, fireplace, ceilings, windows, layout
- bedroom: closets, en-suite, windows
- outdoor: balcony, patio, deck, yard, rooftop
- building: pool, gym, concierge, parking, elevator, amenity spaces
- laundry: in-unit, hookups, shared
- other: smart home, EV charging, storage, AC, security

If the same amenity is visible in multiple images, use the highest confidence score. Deduplicate by name.

Provide a one-line summary highlighting the property's best features.`;

const amenityItemSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "Amenity name" },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence score 0.0-1.0",
    },
  },
  required: ["name", "confidence"],
};

const amenityArraySchema = {
  type: Type.ARRAY,
  items: amenityItemSchema,
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    amenities: {
      type: Type.OBJECT,
      properties: {
        kitchen: amenityArraySchema,
        bathroom: amenityArraySchema,
        living: amenityArraySchema,
        bedroom: amenityArraySchema,
        outdoor: amenityArraySchema,
        building: amenityArraySchema,
        laundry: amenityArraySchema,
        other: amenityArraySchema,
      },
      required: [
        "kitchen",
        "bathroom",
        "living",
        "bedroom",
        "outdoor",
        "building",
        "laundry",
        "other",
      ],
    },
    summary: {
      type: Type.STRING,
      description: "One-line property highlights summary",
    },
  },
  required: ["amenities", "summary"],
};

async function fetchImageAsBase64(url: string): Promise<{
  data: string;
  mimeType: string;
}> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${url} (${response.status})`);
  }
  const contentType = response.headers.get("content-type") || "image/jpeg";
  const buffer = await response.arrayBuffer();
  const base64 = btoa(
    new Uint8Array(buffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ""
    )
  );
  return { data: base64, mimeType: contentType };
}

export async function analyzePropertyImages(
  imageUrls: string[],
  propertyId?: string
): Promise<AmenityAnalysisResult> {
  const ai = getAiClient();
  if (!ai) {
    throw new Error("API client not available — check API_KEY environment variable.");
  }

  const imageParts = await Promise.all(
    imageUrls.map(async (url) => {
      const { data, mimeType } = await fetchImageAsBase64(url);
      return { inlineData: { data, mimeType } };
    })
  );

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: [
      {
        role: "user",
        parts: [
          ...imageParts,
          {
            text: `Analyze these ${imageUrls.length} property image(s) and identify all visible amenities.`,
          },
        ],
      },
    ],
    config: {
      systemInstruction: AMENITY_ANALYSIS_PROMPT,
      responseMimeType: "application/json",
      responseSchema: responseSchema as any,
    },
  });

  const jsonText = response.text;
  if (!jsonText) {
    throw new Error("Empty response from Gemini API");
  }

  const parsed = JSON.parse(jsonText);

  return {
    propertyId,
    amenities: parsed.amenities as CategorizedAmenities,
    summary: parsed.summary,
    imageCount: imageUrls.length,
  };
}

export async function enrichProperty(
  property: Property,
  imageUrls: string[],
  minConfidence = 0.7
): Promise<Property> {
  const result = await analyzePropertyImages(imageUrls, property.id);
  return {
    ...property,
    amenities: toFlatAmenityArray(result.amenities, minConfidence),
  };
}
