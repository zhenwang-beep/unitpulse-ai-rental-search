import { Property, SearchFilters } from '../types';

const SUPABASE_URL = 'https://qrcajdeipgefbceaxswv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyY2FqZGVpcGdlZmJjZWF4c3d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNzA1MjcsImV4cCI6MjA5MDY0NjUyN30.02X7yELYEzOmnBKRGP8fU8fKVFEA0xijLJTG63LSLhM';

const dbHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
};

const rowToProperty = (row: Record<string, unknown>): Property => ({
  id: row.id as string,
  title: row.title as string,
  location: row.location as string,
  price: row.price as number,
  bedrooms: Number(row.bedrooms),
  bathrooms: Number(row.bathrooms),
  sqft: row.sqft as number,
  bedsRange: row.beds_range as string | undefined,
  bathsRange: row.baths_range as string | undefined,
  sqftRange: row.sqft_range as string | undefined,
  image: row.image as string,
  images: (row.images as string[]) ?? [],
  imageSeed: (row.image_seed as string) ?? String(row.id),
  amenities: (row.amenities as string[]) ?? [],
  coordinates: { lat: Number(row.lat) || 34.05, lng: Number(row.lng) || -118.25 },
  type: (row.type as Property['type']) ?? 'Apartment',
  description: row.description as string,
  rating: Number(row.rating) || 4.5,
  matchReason: row.match_reason as string | undefined,
  floorPlans: (row.floor_plans as Property['floorPlans']) ?? [],
  pricingAndFees: (row.pricing_and_fees as Property['pricingAndFees']) ?? undefined,
});

const buildQuery = (filters: SearchFilters): string => {
  const params = new URLSearchParams({ select: '*', limit: '20' });
  if (filters.location && filters.location !== 'All') {
    params.set('location', `ilike.*${filters.location}*`);
  }
  if (filters.minPrice) params.set('price', `gte.${filters.minPrice}`);
  if (filters.maxPrice) {
    // Supabase allows multiple filters on same column via &
    params.append('price', `lte.${filters.maxPrice}`);
  }
  if (filters.minBedrooms) params.set('bedrooms', `gte.${filters.minBedrooms}`);
  if (filters.propertyType) params.set('type', `ilike.*${filters.propertyType}*`);
  return params.toString();
};

export const getFilteredProperties = async (filters: SearchFilters): Promise<Property[]> => {
  try {
    const query = buildQuery(filters);
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/properties?${query}`, { headers: dbHeaders });
    if (!resp.ok) {
      console.error('Property fetch failed:', resp.status, await resp.text());
      return [];
    }
    const rows: Record<string, unknown>[] = await resp.json();
    return rows.map(row => {
      let score = 85 + Math.floor(Math.random() * 10);
      if (filters.amenities && filters.amenities.length > 0) {
        const propAmenities = ((row.amenities as string[]) ?? []).map(a => a.toLowerCase());
        const reqAmenities = filters.amenities.map(a => a.toLowerCase());
        const matched = reqAmenities.filter(r => propAmenities.some(p => p.includes(r))).length;
        score += (matched / reqAmenities.length) * 5;
      }
      return { ...rowToProperty(row), matchScore: Math.min(Math.round(score), 99) };
    }).sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
  } catch (e) {
    console.error('Property fetch error:', e);
    return [];
  }
};

export const getAllProperties = async (): Promise<Property[]> => {
  try {
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/properties?select=*&limit=100`, { headers: dbHeaders });
    if (!resp.ok) {
      console.error('getAllProperties failed:', resp.status);
      return [];
    }
    const rows: Record<string, unknown>[] = await resp.json();
    return rows.map(rowToProperty);
  } catch (e) {
    console.error('getAllProperties error:', e);
    return [];
  }
};
