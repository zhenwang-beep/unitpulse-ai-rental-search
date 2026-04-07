import { BehaviorEvent, EventType } from '../types';
import { getSessionSync } from './sessionService';

/**
 * Module-scoped event buffer — lives outside React to avoid re-renders.
 * Keyed by event type for efficient grouping; flattened on read.
 */
const eventBuffer = new Map<EventType, BehaviorEvent[]>();

/**
 * Track a behavioral event. This does NOT trigger React re-renders.
 */
export function track(
  type: EventType,
  propertyId?: string,
  payload: Record<string, unknown> = {}
): void {
  const session = getSessionSync();
  if (!session) return; // Session not yet initialized — drop event

  const event: BehaviorEvent = {
    type,
    propertyId,
    payload,
    timestamp: Date.now(),
    sessionId: session.sessionId,
  };

  const bucket = eventBuffer.get(type);
  if (bucket) {
    bucket.push(event);
  } else {
    eventBuffer.set(type, [event]);
  }
}

/**
 * Return all buffered events as a flat array.
 */
export function getEvents(): BehaviorEvent[] {
  const all: BehaviorEvent[] = [];
  for (const bucket of eventBuffer.values()) {
    all.push(...bucket);
  }
  return all;
}

/**
 * Return the count of buffered events (avoids allocating a flat array).
 */
export function getEventCount(): number {
  let count = 0;
  for (const bucket of eventBuffer.values()) {
    count += bucket.length;
  }
  return count;
}

/**
 * Clear all buffered events (called after successful sync).
 */
export function clearEvents(): void {
  eventBuffer.clear();
}

/**
 * Clear only the events that were included in a sync batch,
 * keeping any new events that arrived during the sync.
 */
export function clearSyncedEvents(syncedCount: number): void {
  let remaining = syncedCount;
  for (const [type, bucket] of eventBuffer.entries()) {
    if (remaining <= 0) break;
    const toRemove = Math.min(bucket.length, remaining);
    bucket.splice(0, toRemove);
    remaining -= toRemove;
    if (bucket.length === 0) {
      eventBuffer.delete(type);
    }
  }
}
