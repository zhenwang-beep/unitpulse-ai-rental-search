import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse, Property } from '../types';

const apiKey = process.env.API_KEY;

const getAiClient = () => {
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const buildSystemInstruction = (properties: Property[]) => {
  const locations = Array.from(new Set(properties.map(p => p.location))).join(', ');
  const amenities = Array.from(new Set(properties.flatMap(p => p.amenities))).slice(0, 30).join(', ');
  const propertyList = properties.slice(0, 12).map(p =>
    `- ${p.title} at ${p.location}, $${p.price}/mo, ${p.bedrooms === 0 ? 'Studio' : p.bedrooms + 'bd'}, ${p.type}: ${p.amenities.slice(0, 4).join(', ')}`
  ).join('\n');

  return `
You are Lumina, a highly advanced, warm, and creative AI rental home concierge.
Your goal is to help users find their dream rental property from a specific database and guide them through the entire process, from discovery to signing a lease.

DATABASE CONTEXT:
- Available Locations: ${locations}
- Available Amenities: ${amenities}
- Current listings sample:
${propertyList}

USER JOURNEY GUIDANCE:
1. DISCOVERY: Help users find properties based on their needs.
2. EVALUATION: When a user selects a property, provide detailed information. If they ask for more info, trigger a "deep-dive" interactive state.
3. APPLICATION: When a user says "Apply", "Request Tour", "Schedule Viewing", or expresses strong interest in renting, trigger the "application-form" state.
4. CLOSING: Once the application is complete, trigger the "contract" state for signing and payment.
5. MOVE-IN: After the user has completed the payment and signed the contract, trigger the "move-in-checklist" state to guide them through the final steps (keys, utilities, insurance).
6. STYLE ANALYSIS:
   - Step A: When a user provides links to other properties (Zillow, Apartments.com) or asks to "analyze my style", analyze the links/description and provide a detailed summary of their preferences. Trigger the "style-analysis" interactive state.
   - Step B: Once the user confirms or provides updates to the summary, acknowledge the preferences and transition to recommending suitable properties from the database. Set "intentToSearch" to true to show matching results.

ANSWERING QUESTIONS NOT IN THE DATABASE:
- If a user asks about neighborhood safety, nearby restaurants, commute times, school ratings, walkability, transit access, or other contextual questions that go beyond the property listing data, answer using your general knowledge of the area.
- When you use external knowledge (Google Maps data, neighborhood info, city statistics, Zillow market data, etc.), you MUST populate the "sources" array with relevant reference links so users can verify the information.
- Each source must have a "title" (descriptive name), "url" (real, valid URL), and optionally a "snippet" (1-sentence summary of what the source shows).
- Good source examples: Google Maps for a place search, Walk Score for walkability, GreatSchools for school ratings, Zillow for market data, Yelp for restaurant info.
- Only include sources when you are referencing external knowledge beyond the property database. For standard search/filter responses, leave "sources" empty or omit it.

When a user sends a message:
1. Analyze their request to extract search filters (Location, Price, Bedrooms, Amenities).
2. IMPORTANT: Only use locations from the "Available Locations" list provided above.
3. Formulate a warm, professional, and slightly futuristic conversational reply. When "interactiveType" is "style-analysis", the "conversationalReply" MUST NOT contain the summary of the user's style preferences. Instead, provide a short introductory message like "I've analyzed your style! Here's what I found:". Use the "styleTitle", "styleAvatar", and "styleSummary" fields to provide the actual style analysis.
4. Set "intentToSearch" to true ONLY if the user is explicitly asking to search for properties, or if they have just confirmed their style preferences.
5. Set "intentToApply" to true if the user wants to start the application process.
6. Set "intentToSign" to true if the user is ready to sign the lease.
7. Set "interactiveType" based on the current stage:
   - "properties": When showing search results. This also triggers a "Lifestyle Comparison" section for the top matches.
   - "deep-dive": When providing a detailed view of a specific property. This will show a compact, focused card.
   - "application-form": When starting the ID upload/background check.
   - "contract": When showing the final summary for signature and payment.
   - "move-in-checklist": When the lease is signed and paid, showing the next steps for moving in.
   - "style-analysis": When analyzing the user's preferred style from external links or descriptions.
   - "tour-scheduling": When the user wants to schedule a viewing or tour of a property.
8. Generate 3-4 "suggestedReplies" that the user might want to say next.
9. Populate "sources" with reference links whenever you use external/contextual knowledge.

Output JSON format strictly.
`;
};

export const sendMessageToGemini = async (
  message: string,
  history: { role: string, text: string }[],
  selectedProperty?: Property | null,
  signal?: AbortSignal,
  properties?: Property[]
): Promise<GeminiResponse | null> => {
  const ai = getAiClient();

  const getMockResponse = (): GeminiResponse => {
    const lowerMessage = message.toLowerCase();
    const isSystemClickPrompt = lowerMessage.includes('i just clicked on') && lowerMessage.includes('introduce it');

    if (!isSystemClickPrompt && (lowerMessage.includes('apply') || lowerMessage.includes('tour') || lowerMessage.includes('viewing'))) {
      return {
        conversationalReply: "I'd be happy to help you with that! Let's get started with a quick application and ID verification.",
        intentToSearch: false,
        intentToApply: true,
        interactiveType: "application-form",
        filters: {},
        suggestedReplies: ["What do I need to apply?", "How long does it take?"]
      };
    }
    if (!isSystemClickPrompt && (lowerMessage.includes('sign') || lowerMessage.includes('lease') || lowerMessage.includes('ready'))) {
      return {
        conversationalReply: "Fantastic! I've prepared the lease agreement for you to review and sign.",
        intentToSearch: false,
        intentToSign: true,
        interactiveType: "contract",
        filters: {},
        suggestedReplies: ["What are the next steps?", "How do I pay the deposit?"]
      };
    }
    if (selectedProperty) {
      return {
        conversationalReply: `Based on the details for ${selectedProperty.title}, it's a fantastic ${selectedProperty.bedrooms}-bedroom property in ${selectedProperty.location} for $${selectedProperty.price}/month. It features ${selectedProperty.amenities.slice(0, 2).join(' and ')}. Would you like to schedule a tour or see the lease terms?`,
        intentToSearch: false,
        interactiveType: "deep-dive",
        filters: {},
        suggestedReplies: ["Schedule a tour", "What are the lease terms?", "Show me other properties"]
      };
    }
    return {
      conversationalReply: "I've found some excellent properties that match your criteria! Take a look at these options from our database.",
      intentToSearch: true,
      interactiveType: "properties",
      filters: {},
      suggestedReplies: ["Show me more", "I want to apply", "Tell me about the neighborhood"]
    };
  };

  if (!ai) {
    console.warn("Using mock response due to missing API client.");
    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(resolve, 1200);
      signal?.addEventListener('abort', () => { clearTimeout(t); reject(new DOMException('Aborted', 'AbortError')); });
    });
    if (signal?.aborted) return null;
    return getMockResponse();
  }

  try {
    const model = 'gemini-3-pro-preview';
    const apiHistory = history.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.text }]
    }));

    const systemInstruction = buildSystemInstruction(properties ?? []);
    let contextualInstruction = systemInstruction;

    if (selectedProperty) {
      contextualInstruction += `

CRITICAL INSTRUCTION FOR CURRENT CONTEXT:
The user is currently viewing the details of this property:
- Title: ${selectedProperty.title}
- Location: ${selectedProperty.location}
- Price: $${selectedProperty.price}
- Bedrooms: ${selectedProperty.bedrooms}
- Amenities: ${selectedProperty.amenities.join(', ')}
- Description: ${selectedProperty.description}

When the user asks a question about THIS property (e.g., "What are the lease terms?", "Does it have a pool?", "Tell me more about it"), you MUST set "intentToSearch" to false.
If you set it to true, you will break the application by showing irrelevant search results.
ONLY set "intentToSearch" to true if the user explicitly asks to search for OTHER properties or changes their search criteria (e.g., "Show me other places", "I need 3 bedrooms instead").
`;
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
      const t = setTimeout(() => reject(new Error('AI_REQUEST_TIMEOUT')), 60000);
      signal?.addEventListener('abort', () => { clearTimeout(t); reject(new DOMException('Aborted', 'AbortError')); });
    });

    const response = await Promise.race([
      ai.models.generateContent({
        model,
        contents: [
          ...apiHistory,
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: contextualInstruction,
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 32768 },
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              conversationalReply: {
                type: Type.STRING,
                description: "The warm, conversational response to the user.",
              },
              suggestedReplies: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3-4 short, probable user responses or follow-up questions based on the conversation context.",
              },
              intentToSearch: {
                type: Type.BOOLEAN,
                description: "Set to true ONLY if the user is explicitly asking to search for properties."
              },
              intentToApply: {
                type: Type.BOOLEAN,
                description: "Set to true if the user wants to start the application process."
              },
              intentToSign: {
                type: Type.BOOLEAN,
                description: "Set to true if the user is ready to sign the lease."
              },
              interactiveType: {
                type: Type.STRING,
                enum: ["properties", "deep-dive", "application-form", "contract", "move-in-checklist", "style-analysis", "tour-scheduling"],
                description: "The type of interactive UI component to render in the chat."
              },
              styleTitle: {
                type: Type.STRING,
                description: "A short, catchy title for the user's style preference. Only if interactiveType is 'style-analysis'."
              },
              styleAvatar: {
                type: Type.STRING,
                description: "A single emoji representing the user's style. Only if interactiveType is 'style-analysis'."
              },
              styleSummary: {
                type: Type.STRING,
                description: "Detailed summary of the user's style preference. Only if interactiveType is 'style-analysis'."
              },
              sources: {
                type: Type.ARRAY,
                description: "Reference sources used when answering questions beyond the property database (neighborhood info, commute times, safety, etc.). Omit for standard search responses.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING, description: "Descriptive name of the source (e.g., 'Google Maps — Koreatown')" },
                    url: { type: Type.STRING, description: "Full URL to the source" },
                    snippet: { type: Type.STRING, description: "One-sentence summary of what the source shows" }
                  },
                  required: ["title", "url"]
                }
              },
              filters: {
                type: Type.OBJECT,
                description: "Search filters inferred from the user's request.",
                properties: {
                  location: { type: Type.STRING, description: "City or neighborhood from the allowed list." },
                  minPrice: { type: Type.NUMBER },
                  maxPrice: { type: Type.NUMBER },
                  minBedrooms: { type: Type.NUMBER },
                  amenities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  propertyType: { type: Type.STRING }
                }
              }
            },
            required: ["conversationalReply", "intentToSearch"]
          }
        }
      }),
      timeoutPromise
    ]);

    const jsonText = response.text;
    if (!jsonText) return null;

    return JSON.parse(jsonText) as GeminiResponse;

  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return null;
    }
    console.error("Gemini API Error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes('AI_REQUEST_TIMEOUT') || errorMessage.toLowerCase().includes('quota') || errorMessage.toLowerCase().includes('429') || errorMessage.toLowerCase().includes('exceeded')) {
      console.warn("Using mock response due to API timeout or quota exceeded.");
      return getMockResponse();
    }

    return {
      conversationalReply: "I'm having a little trouble connecting to the neural network right now. Could you try again?",
      filters: {}
    };
  }
};
