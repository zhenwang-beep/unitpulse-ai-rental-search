import { Property } from './types';

// Maps the cities currently in our property data to US state codes. Eventually
// engineering will add `stateCode` and `cityCode` as first-class fields on the
// property model (see TODO.md "Property URL hierarchy"); this lookup is the
// front-end fallback until then.
const CITY_TO_STATE: Record<string, string> = {
  'Los Angeles': 'ca',
  'San Francisco': 'ca',
  'Irvine': 'ca',
  'Seattle': 'wa',
  'Chicago': 'il',
  'Houston': 'tx',
  'New York': 'ny',
  'Brooklyn': 'ny',
  'Queens': 'ny',
  'Bronx': 'ny',
};

export const STATE_NAMES: Record<string, string> = {
  ca: 'California',
  wa: 'Washington',
  il: 'Illinois',
  tx: 'Texas',
  ny: 'New York',
};

// Cities we have content for, grouped by state. Drives the StateIndexPage
// listing and validates URLs like `/ca/los-angeles`.
export const CITIES_BY_STATE: Record<string, { slug: string; name: string }[]> = {
  ca: [
    { slug: 'los-angeles', name: 'Los Angeles' },
    { slug: 'san-francisco', name: 'San Francisco' },
    { slug: 'irvine', name: 'Irvine' },
  ],
  wa: [{ slug: 'seattle', name: 'Seattle' }],
  il: [{ slug: 'chicago', name: 'Chicago' }],
  tx: [{ slug: 'houston', name: 'Houston' }],
  ny: [{ slug: 'new-york', name: 'New York' }],
};

export function isValidStateCode(state: string | undefined): state is keyof typeof STATE_NAMES {
  return !!state && state in STATE_NAMES;
}

export function isValidCity(state: string, citySlug: string): boolean {
  const cities = CITIES_BY_STATE[state] ?? [];
  return cities.some((c) => c.slug === citySlug);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function getCitySlug(cityName: string | undefined): string {
  if (!cityName) return '';
  return slugify(cityName);
}

export function getStateCodeForLocation(location: string | undefined): string | null {
  if (!location) return null;
  // Properties currently store `location` as the city display name (e.g. "Los Angeles").
  // When state codes ship as a real field, this fallback can be removed.
  const code = CITY_TO_STATE[location];
  return code ?? null;
}

// Property URL slug — prefer the curated `imageSeed` (already a stable kebab-
// case identifier on each property), fall back to a slugified title.
//
// TODO(eng): for collision safety in production, append a short uniqueness
// suffix (e.g. last 6 chars of the UUID) when two properties produce the same
// slug. For the demo data set this never collides.
export function getPropertySlug(property: Property): string {
  if (property.imageSeed) return slugify(String(property.imageSeed));
  return slugify(property.title || property.id);
}

// Canonical URL for a property in the new state/city/slug hierarchy.
// Falls back to the legacy `/property/:id` URL when we can't resolve a
// state code (e.g. a city we haven't mapped yet) — the legacy route stays
// in place and 301s to canonical when it can.
export function getPropertyUrl(property: Property): string {
  const state = getStateCodeForLocation(property.location);
  const city = getCitySlug(property.location);
  const slug = getPropertySlug(property);
  if (!state || !city || !slug) return `/property/${property.id}`;
  return `/${state}/${city}/${slug}`;
}

export function getCityUrl(state: string, citySlug: string): string {
  return `/${state}/${citySlug}`;
}

export function getStateUrl(state: string): string {
  return `/${state}`;
}
