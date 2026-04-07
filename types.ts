// --- Amenity Analysis Types ---

export interface AmenityItem {
  name: string;
  confidence: number;
}

export interface CategorizedAmenities {
  kitchen: AmenityItem[];
  bathroom: AmenityItem[];
  living: AmenityItem[];
  bedroom: AmenityItem[];
  outdoor: AmenityItem[];
  building: AmenityItem[];
  laundry: AmenityItem[];
  other: AmenityItem[];
}

export interface AmenityAnalysisResult {
  propertyId?: string;
  amenities: CategorizedAmenities;
  summary: string;
  imageCount: number;
}

export function toFlatAmenityArray(amenities: CategorizedAmenities, minConfidence = 0.7): string[] {
  return Object.values(amenities)
    .flat()
    .filter(item => item.confidence >= minConfidence)
    .map(item => item.name);
}

// --- Property & Floor Plan Types ---

export interface FloorPlanModel {
  name: string;       // e.g. "Layout A", "Corner Suite"
  sqft: string;       // e.g. "720 sqft"
  image?: string;
  units: Unit[];
}

export interface FloorPlan {
  type: string;
  priceRange: string;
  sqft: string;
  available: number;
  image?: string;
  units?: Unit[];
  models?: FloorPlanModel[];  // optional sub-layouts within this plan type
}

export interface Unit {
  id: string;
  price: string; // Changed to string to match usage in App.tsx
  amenities: string[];
  image: string;
  images?: string[];
  sqft?: string;
}

export interface PricingAndFees {
  rent: string;
  deposit: string;
  applicationFee: string;
  petFee: string;
  utilities: string;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  bedsRange?: string;
  bathsRange?: string;
  sqftRange?: string;
  image: string;
  images: string[];
  imageSeed: string | number;
  amenities: string[];
  coordinates: { lat: number; lng: number };
  type: 'Apartment' | 'House' | 'Studio' | 'Loft';
  description: string;
  rating: number;
  isSigned?: boolean;
  matchReason?: string;
  matchScore?: number;
  floorPlans?: FloorPlan[];
  pricingAndFees?: PricingAndFees;
}

export interface SearchFilters {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  amenities?: string[];
  propertyType?: string;
}

export interface Source {
  title: string;
  url: string;
  snippet?: string;
}

export interface UserPreference {
  category: 'location' | 'budget' | 'size' | 'style' | 'amenities' | 'commute' | 'lifestyle' | 'other';
  label: string;
  confidence: 'precise' | 'vague';
  value?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  isTyping?: boolean;
  properties?: Property[];
  suggestedReplies?: string[];
  isSigningMessage?: boolean;
  interactiveType?: 'properties' | 'deep-dive' | 'application-form' | 'contract' | 'move-in-checklist' | 'style-analysis' | 'tour-scheduling';
  interactiveData?: any;
  styleTitle?: string;
  styleAvatar?: string;
  styleSummary?: string;
  sources?: Source[];
  extractedPreferences?: UserPreference[];
}

export interface GeminiResponse {
  conversationalReply: string;
  suggestedReplies?: string[];
  filters: SearchFilters;
  intentToSearch?: boolean;
  intentToSign?: boolean;
  intentToApply?: boolean;
  interactiveType?: 'properties' | 'deep-dive' | 'application-form' | 'contract' | 'move-in-checklist' | 'style-analysis' | 'tour-scheduling';
  styleTitle?: string;
  styleAvatar?: string;
  styleSummary?: string;
  sources?: Source[];
  extractedPreferences?: UserPreference[];
}

// --- Behavioral Preference Intelligence Types ---

export type EventType =
  | 'property_view'
  | 'dwell_time'
  | 'favorite'
  | 'unfavorite'
  | 'share'
  | 'tour_schedule'
  | 'filter_change'
  | 'scroll_depth'
  | 'photo_view'
  | 'search_query'
  | 'comparison';

export interface BehaviorEvent {
  type: EventType;
  propertyId?: string;
  payload: Record<string, unknown>;
  timestamp: number;
  sessionId: string;
}

export interface SessionInfo {
  sessionId: string;
  ipHash: string;
  geo: {
    city: string;
    region: string;
    country: string;
    lat: number;
    lng: number;
  } | null;
  createdAt: number;
  lastSeen: number;
}

export interface WeightedPreference {
  value: string;
  weight: number;
  source: 'behavioral' | 'chat' | 'ip-geo';
  count: number;
}

export interface PreferenceProfile {
  locationPreferences: WeightedPreference[];
  budgetRange: { min: number; max: number; confidence: number };
  bedroomPreference: WeightedPreference[];
  propertyTypePreference: WeightedPreference[];
  amenityPreferences: WeightedPreference[];
  lifestyleSignals: WeightedPreference[];
  engagementSummary: {
    totalViews: number;
    avgDwellTimeMs: number;
    favoritesCount: number;
    toursScheduled: number;
    photoEngagementRate: number;
  };
  naturalLanguageSummary: string;
  lastUpdated: number;
}
