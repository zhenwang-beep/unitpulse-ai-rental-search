import {
  BehaviorEvent,
  PreferenceProfile,
  Property,
  SessionInfo,
  UserPreference,
  WeightedPreference,
} from '../types';

// --- Scoring Weights ---
const EVENT_WEIGHTS: Record<string, number> = {
  favorite: 5,
  tour_schedule: 5,
  share: 4,
  dwell_time_high: 3,   // > 30s
  dwell_time_mid: 2,    // 10-30s
  photo_view_deep: 2,   // 3+ photos viewed on same property
  comparison: 2,
  property_view: 1,
};

const CHAT_MULTIPLIER = 2;
const GEO_SEED_WEIGHT = 0.5;

// --- Helpers ---

function getDwellWeight(dwellMs: number): number {
  if (dwellMs > 30_000) return EVENT_WEIGHTS.dwell_time_high;
  if (dwellMs > 10_000) return EVENT_WEIGHTS.dwell_time_mid;
  return 0; // Sub-10s dwells don't contribute
}

interface PropertyScores {
  totalWeight: number;
  events: BehaviorEvent[];
}

function groupEventsByProperty(events: BehaviorEvent[]): Map<string, PropertyScores> {
  const map = new Map<string, PropertyScores>();

  // First pass: count photo views per property for the 3+ threshold
  const photoCountsByProp = new Map<string, number>();
  for (const event of events) {
    if (event.type === 'photo_view' && event.propertyId) {
      photoCountsByProp.set(event.propertyId, (photoCountsByProp.get(event.propertyId) || 0) + 1);
    }
  }

  for (const event of events) {
    if (!event.propertyId) continue;

    let weight = 0;
    switch (event.type) {
      case 'favorite':
        weight = EVENT_WEIGHTS.favorite;
        break;
      case 'tour_schedule':
        weight = EVENT_WEIGHTS.tour_schedule;
        break;
      case 'share':
        weight = EVENT_WEIGHTS.share;
        break;
      case 'dwell_time':
        weight = getDwellWeight((event.payload.dwellMs as number) || 0);
        break;
      case 'comparison':
        weight = EVENT_WEIGHTS.comparison;
        break;
      case 'property_view':
        weight = EVENT_WEIGHTS.property_view;
        break;
      case 'photo_view':
        // Only award deep engagement weight if 3+ photos viewed on this property
        weight = (photoCountsByProp.get(event.propertyId) || 0) >= 3
          ? EVENT_WEIGHTS.photo_view_deep
          : 0;
        break;
      default:
        weight = 1;
    }

    const existing = map.get(event.propertyId);
    if (existing) {
      existing.totalWeight += weight;
      existing.events.push(event);
    } else {
      map.set(event.propertyId, { totalWeight: weight, events: [event] });
    }
  }

  return map;
}

function normalizeWeights(items: WeightedPreference[]): WeightedPreference[] {
  if (items.length === 0) return [];
  const maxWeight = Math.max(...items.map(i => i.weight));
  if (maxWeight === 0) return items;
  return items.map(i => ({ ...i, weight: Math.round((i.weight / maxWeight) * 100) / 100 }));
}

function aggregateByAttribute(
  propertyScores: Map<string, PropertyScores>,
  properties: Property[],
  extractor: (p: Property) => string[]
): WeightedPreference[] {
  const accum = new Map<string, { weight: number; count: number }>();
  const propLookup = new Map(properties.map(p => [p.id, p]));

  for (const [propId, scores] of propertyScores) {
    const property = propLookup.get(propId);
    if (!property) continue;

    const values = extractor(property);
    for (const val of values) {
      const key = val.toLowerCase().trim();
      if (!key) continue;
      const existing = accum.get(key);
      if (existing) {
        existing.weight += scores.totalWeight;
        existing.count += 1;
      } else {
        accum.set(key, { weight: scores.totalWeight, count: 1 });
      }
    }
  }

  const result: WeightedPreference[] = Array.from(accum.entries())
    .map(([value, { weight, count }]) => ({
      value,
      weight,
      source: 'behavioral' as const,
      count,
    }))
    .sort((a, b) => b.weight - a.weight);

  return normalizeWeights(result);
}

function computeBudgetRange(
  propertyScores: Map<string, PropertyScores>,
  properties: Property[]
): { min: number; max: number; confidence: number } {
  const propLookup = new Map(properties.map(p => [p.id, p]));
  const weightedPrices: { price: number; weight: number }[] = [];

  for (const [propId, scores] of propertyScores) {
    const property = propLookup.get(propId);
    if (!property) continue;
    weightedPrices.push({ price: property.price, weight: scores.totalWeight });
  }

  if (weightedPrices.length === 0) {
    return { min: 0, max: 0, confidence: 0 };
  }

  weightedPrices.sort((a, b) => a.price - b.price);
  const totalWeight = weightedPrices.reduce((s, p) => s + p.weight, 0);

  // Weighted percentile approach: find 10th and 90th percentile by weight
  let cumWeight = 0;
  let min = weightedPrices[0].price;
  let max = weightedPrices[weightedPrices.length - 1].price;

  for (const wp of weightedPrices) {
    cumWeight += wp.weight;
    if (cumWeight / totalWeight <= 0.1) min = wp.price;
    if (cumWeight / totalWeight <= 0.9) max = wp.price;
  }

  const confidence = Math.min(weightedPrices.length / 5, 1); // 5+ properties = high confidence

  return { min, max, confidence };
}

function computeEngagement(events: BehaviorEvent[]): PreferenceProfile['engagementSummary'] {
  const views = events.filter(e => e.type === 'property_view');
  const dwells = events.filter(e => e.type === 'dwell_time');
  const favorites = events.filter(e => e.type === 'favorite');
  const tours = events.filter(e => e.type === 'tour_schedule');
  const photos = events.filter(e => e.type === 'photo_view');

  // Group photos by property to compute engagement rate
  const photosByProp = new Map<string, Set<number>>();
  for (const e of photos) {
    if (!e.propertyId) continue;
    const set = photosByProp.get(e.propertyId) || new Set();
    set.add(e.payload.imageIndex as number);
    photosByProp.set(e.propertyId, set);
  }

  let totalPhotoRate = 0;
  let photoProps = 0;
  for (const [, indices] of photosByProp) {
    // Approximate: assume ~5 photos per property if we don't know total
    totalPhotoRate += indices.size / 5;
    photoProps++;
  }

  const avgDwell = dwells.length > 0
    ? dwells.reduce((s, e) => s + ((e.payload.dwellMs as number) || 0), 0) / dwells.length
    : 0;

  return {
    totalViews: views.length,
    avgDwellTimeMs: Math.round(avgDwell),
    favoritesCount: favorites.length,
    toursScheduled: tours.length,
    photoEngagementRate: photoProps > 0 ? Math.round((totalPhotoRate / photoProps) * 100) / 100 : 0,
  };
}

function mergeChatPreferences(
  behavioralPrefs: WeightedPreference[],
  chatPrefs: UserPreference[],
  category: UserPreference['category']
): WeightedPreference[] {
  const merged = [...behavioralPrefs];
  const relevantChat = chatPrefs.filter(p => p.category === category);

  for (const cp of relevantChat) {
    const key = (cp.value || cp.label).toLowerCase().trim();
    const existing = merged.find(m => m.value === key);
    if (existing) {
      existing.weight = Math.min(existing.weight * CHAT_MULTIPLIER, 1);
      existing.source = 'chat';
    } else {
      merged.push({
        value: key,
        weight: cp.confidence === 'precise' ? 0.8 : 0.5,
        source: 'chat',
        count: 1,
      });
    }
  }

  return normalizeWeights(merged.sort((a, b) => b.weight - a.weight));
}

function inferLifestyle(amenityPrefs: WeightedPreference[]): WeightedPreference[] {
  const signals: WeightedPreference[] = [];
  const amenitySet = new Set(amenityPrefs.slice(0, 10).map(a => a.value));

  if (amenitySet.has('gym') || amenitySet.has('pool') || amenitySet.has('fitness center')) {
    signals.push({ value: 'fitness-oriented', weight: 0.8, source: 'behavioral', count: 1 });
  }
  if (amenitySet.has('pet-friendly') || amenitySet.has('dog park') || amenitySet.has('pet park')) {
    signals.push({ value: 'pet-owner', weight: 0.8, source: 'behavioral', count: 1 });
  }
  if (amenitySet.has('ev charging') || amenitySet.has('parking') || amenitySet.has('garage')) {
    signals.push({ value: 'car-dependent', weight: 0.6, source: 'behavioral', count: 1 });
  }
  if (amenitySet.has('rooftop') || amenitySet.has('lounge') || amenitySet.has('clubhouse')) {
    signals.push({ value: 'social-lifestyle', weight: 0.6, source: 'behavioral', count: 1 });
  }
  if (amenitySet.has('study room') || amenitySet.has('coworking') || amenitySet.has('business center')) {
    signals.push({ value: 'remote-worker', weight: 0.7, source: 'behavioral', count: 1 });
  }

  return signals;
}

function generateNLSummary(profile: Omit<PreferenceProfile, 'naturalLanguageSummary'>): string {
  const parts: string[] = [];

  // Property type
  const topType = profile.propertyTypePreference[0];
  if (topType) {
    parts.push(`${topType.value} properties`);
  }

  // Location
  const topLocations = profile.locationPreferences.slice(0, 2).map(l => l.value);
  if (topLocations.length > 0) {
    parts.push(`in ${topLocations.join(' and ')}`);
  }

  // Budget
  if (profile.budgetRange.min > 0 && profile.budgetRange.max > 0) {
    parts.push(`($${profile.budgetRange.min.toLocaleString()}-$${profile.budgetRange.max.toLocaleString()}/mo range)`);
  }

  // Amenities
  const topAmenities = profile.amenityPreferences.slice(0, 3).map(a => a.value);
  if (topAmenities.length > 0) {
    parts.push(`with ${topAmenities.join(', ')}`);
  }

  let summary = parts.length > 0
    ? `You seem drawn to ${parts.join(' ')}.`
    : 'Not enough browsing data yet to determine preferences.';

  // Lifestyle insight
  const topLifestyle = profile.lifestyleSignals[0];
  if (topLifestyle) {
    const insights: Record<string, string> = {
      'fitness-oriented': 'Your interest in fitness amenities suggests an active lifestyle.',
      'pet-owner': 'You appear to be a pet owner — pet-friendly features matter to you.',
      'car-dependent': 'Having parking/garage access seems important for your commute.',
      'social-lifestyle': 'You value community spaces and social amenities.',
      'remote-worker': 'Work-from-home friendly spaces catch your attention.',
    };
    const insight = insights[topLifestyle.value];
    if (insight) summary += ` ${insight}`;
  }

  return summary;
}

// --- Main Synthesizer ---

/**
 * Synthesize a PreferenceProfile from raw behavioral events, chat preferences,
 * property data, and optional IP geo seed.
 *
 * This is a pure function — no side effects, safe to call frequently.
 */
export function synthesize(
  events: BehaviorEvent[],
  chatPreferences: UserPreference[],
  properties: Property[],
  geoSeed?: SessionInfo['geo'] | null
): PreferenceProfile {
  const propertyScores = groupEventsByProperty(events);

  // Location
  let locationPrefs = aggregateByAttribute(propertyScores, properties, p => [p.location]);
  if (geoSeed?.city && locationPrefs.length === 0) {
    locationPrefs = [{
      value: geoSeed.city.toLowerCase(),
      weight: GEO_SEED_WEIGHT,
      source: 'ip-geo',
      count: 1,
    }];
  }
  locationPrefs = mergeChatPreferences(locationPrefs, chatPreferences, 'location');

  // Budget
  const budgetRange = computeBudgetRange(propertyScores, properties);
  // Merge with chat budget preferences
  const chatBudget = chatPreferences.filter(p => p.category === 'budget');
  for (const cb of chatBudget) {
    if (cb.value) {
      const match = cb.value.match(/(\d[\d,]*)/g);
      if (match) {
        const nums = match.map(n => parseInt(n.replace(/,/g, '')));
        if (nums.length >= 2) {
          budgetRange.min = budgetRange.min > 0 ? Math.min(budgetRange.min, nums[0]) : nums[0];
          budgetRange.max = Math.max(budgetRange.max, nums[1]);
          budgetRange.confidence = Math.max(budgetRange.confidence, 0.9);
        } else if (nums.length === 1) {
          budgetRange.max = nums[0];
          budgetRange.confidence = Math.max(budgetRange.confidence, 0.7);
        }
      }
    }
  }

  // Bedrooms
  let bedroomPrefs = aggregateByAttribute(propertyScores, properties, p => [
    p.bedrooms === 0 ? 'studio' : `${p.bedrooms} bedroom`,
  ]);
  bedroomPrefs = mergeChatPreferences(bedroomPrefs, chatPreferences, 'size');

  // Property type
  let typePrefs = aggregateByAttribute(propertyScores, properties, p => [p.type]);
  typePrefs = mergeChatPreferences(typePrefs, chatPreferences, 'style');

  // Amenities
  let amenityPrefs = aggregateByAttribute(propertyScores, properties, p => p.amenities);
  amenityPrefs = mergeChatPreferences(amenityPrefs, chatPreferences, 'amenities');

  // Lifestyle
  const lifestyleSignals = inferLifestyle(amenityPrefs);
  const chatLifestyle = chatPreferences.filter(p => p.category === 'lifestyle');
  for (const cl of chatLifestyle) {
    lifestyleSignals.push({
      value: cl.label.toLowerCase(),
      weight: cl.confidence === 'precise' ? 0.8 : 0.5,
      source: 'chat',
      count: 1,
    });
  }

  // Engagement
  const engagementSummary = computeEngagement(events);

  const profileWithoutNL = {
    locationPreferences: locationPrefs.slice(0, 5),
    budgetRange,
    bedroomPreference: bedroomPrefs.slice(0, 5),
    propertyTypePreference: typePrefs.slice(0, 4),
    amenityPreferences: amenityPrefs.slice(0, 10),
    lifestyleSignals: lifestyleSignals.slice(0, 5),
    engagementSummary,
    lastUpdated: Date.now(),
  };

  return {
    ...profileWithoutNL,
    naturalLanguageSummary: generateNLSummary(profileWithoutNL),
  };
}
