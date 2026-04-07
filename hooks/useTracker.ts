import { useEffect, useRef, useCallback, RefObject } from 'react';
import { track } from '../services/tracker';
import { Property, SearchFilters } from '../types';

/**
 * Convenience wrapper around the module-scoped tracker.
 * Provides typed tracking helpers for components.
 */
export function useTracker() {
  const trackView = useCallback((property: Property) => {
    track('property_view', property.id, {
      location: property.location,
      price: property.price,
      bedrooms: property.bedrooms,
      type: property.type,
      amenities: property.amenities,
    });
  }, []);

  const trackDwell = useCallback((propertyId: string, durationMs: number) => {
    if (durationMs < 1000) return; // Ignore sub-second dwells
    track('dwell_time', propertyId, { dwellMs: durationMs });
  }, []);

  const trackPhotoNav = useCallback(
    (propertyId: string, imageIndex: number, totalImages: number) => {
      track('photo_view', propertyId, { imageIndex, totalImages });
    },
    []
  );

  const trackFilterChange = useCallback((filters: SearchFilters) => {
    track('filter_change', undefined, { ...filters });
  }, []);

  const trackSearch = useCallback((query: string) => {
    track('search_query', undefined, { query });
  }, []);

  const trackFavorite = useCallback((propertyId: string, added: boolean) => {
    track(added ? 'favorite' : 'unfavorite', propertyId);
  }, []);

  const trackTourSchedule = useCallback((propertyId: string) => {
    track('tour_schedule', propertyId);
  }, []);

  const trackShare = useCallback((propertyId: string) => {
    track('share', propertyId);
  }, []);

  const trackComparison = useCallback((propertyId: string) => {
    track('comparison', propertyId);
  }, []);

  return {
    trackView,
    trackDwell,
    trackPhotoNav,
    trackFilterChange,
    trackSearch,
    trackFavorite,
    trackTourSchedule,
    trackShare,
    trackComparison,
  };
}

/**
 * Track dwell time on a component. Fires a dwell_time event on unmount
 * with the total time the component was mounted.
 */
export function useDwellTime(propertyId: string | undefined) {
  const mountTime = useRef<number>(0);

  useEffect(() => {
    if (!propertyId) return;
    mountTime.current = performance.now();

    return () => {
      const duration = performance.now() - mountTime.current;
      if (duration >= 1000) {
        track('dwell_time', propertyId, { dwellMs: Math.round(duration) });
      }
    };
  }, [propertyId]);
}

/**
 * Track scroll depth on a scrollable container.
 * Fires a scroll_depth event on unmount with the maximum scroll percentage reached.
 */
export function useScrollDepth(
  ref: RefObject<HTMLElement | null>,
  propertyId: string | undefined
) {
  const maxDepth = useRef(0);

  useEffect(() => {
    if (!propertyId) return;
    const el = ref.current;
    if (!el) return;

    maxDepth.current = 0;

    const handleScroll = () => {
      const scrollable = el.scrollHeight - el.clientHeight;
      if (scrollable <= 0) return;
      const percent = Math.round((el.scrollTop / scrollable) * 100);
      if (percent > maxDepth.current) {
        maxDepth.current = percent;
      }
    };

    el.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      el.removeEventListener('scroll', handleScroll);
      if (maxDepth.current > 0) {
        track('scroll_depth', propertyId, { scrollPercent: maxDepth.current });
      }
    };
  }, [ref, propertyId]);
}
