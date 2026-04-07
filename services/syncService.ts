import { supabase } from './supabaseClient';
import { getSessionSync } from './sessionService';
import { getEvents, clearSyncedEvents, getEventCount } from './tracker';
import { BehaviorEvent, PreferenceProfile } from '../types';

const SYNC_INTERVAL_MS = 60_000; // 60 seconds

let syncTimer: ReturnType<typeof setInterval> | null = null;
let isSyncing = false;

/**
 * Upsert the anonymous session record in Supabase.
 */
async function syncSession(): Promise<void> {
  const session = getSessionSync();
  if (!session) return;

  const { error } = await supabase.from('anon_sessions').upsert(
    {
      session_id: session.sessionId,
      ip_hash: session.ipHash,
      geo_city: session.geo?.city || null,
      geo_region: session.geo?.region || null,
      geo_country: session.geo?.country || null,
      geo_lat: session.geo?.lat || null,
      geo_lng: session.geo?.lng || null,
      last_seen: new Date().toISOString(),
    },
    { onConflict: 'session_id' }
  );

  if (error) console.warn('[SyncService] Session upsert error:', error.message);
}

/**
 * Batch insert buffered behavioral events to Supabase.
 */
async function syncEvents(): Promise<number> {
  const events = getEvents();
  if (events.length === 0) return 0;

  const rows = events.map(e => ({
    session_id: e.sessionId,
    event_type: e.type,
    property_id: e.propertyId || null,
    payload: e.payload,
    created_at: new Date(e.timestamp).toISOString(),
  }));

  const { error } = await supabase.from('behavior_events').insert(rows);

  if (error) {
    console.warn('[SyncService] Events insert error:', error.message);
    return 0;
  }

  // Clear only the events we successfully synced
  clearSyncedEvents(events.length);
  return events.length;
}

/**
 * Upsert the latest preference profile snapshot.
 */
async function syncProfile(profile: PreferenceProfile): Promise<void> {
  const session = getSessionSync();
  if (!session) return;

  const { error } = await supabase.from('preference_profiles').upsert(
    {
      session_id: session.sessionId,
      profile: profile,
      nl_summary: profile.naturalLanguageSummary,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'session_id' }
  );

  if (error) console.warn('[SyncService] Profile upsert error:', error.message);
}

/**
 * Run a full sync cycle: session → events → profile.
 */
export async function runSync(profile?: PreferenceProfile | null): Promise<void> {
  if (isSyncing) return;
  isSyncing = true;

  try {
    await syncSession();
    const synced = await syncEvents();
    if (profile) {
      await syncProfile(profile);
    }
    if (synced > 0) {
      console.debug(`[SyncService] Synced ${synced} events`);
    }
  } catch (err) {
    console.warn('[SyncService] Sync error:', err);
  } finally {
    isSyncing = false;
  }
}

/**
 * Load historical behavioral events from Supabase for this session.
 * Used to re-hydrate the synthesizer on page reload so preferences
 * accumulate across page visits (not just the current buffer).
 */
export async function loadHistoricalEvents(): Promise<BehaviorEvent[]> {
  const session = getSessionSync();
  if (!session) return [];

  try {
    const { data, error } = await supabase
      .from('behavior_events')
      .select('event_type, property_id, payload, created_at')
      .eq('session_id', session.sessionId)
      .order('created_at', { ascending: true })
      .limit(500);

    if (error || !data) return [];

    return data.map((row: Record<string, unknown>) => ({
      type: row.event_type as BehaviorEvent['type'],
      propertyId: (row.property_id as string) || undefined,
      payload: (row.payload as Record<string, unknown>) || {},
      timestamp: new Date(row.created_at as string).getTime(),
      sessionId: session.sessionId,
    }));
  } catch {
    return [];
  }
}

/**
 * Load the stored preference profile from Supabase for this session.
 * Returns null if no profile exists yet.
 */
export async function loadProfile(): Promise<PreferenceProfile | null> {
  const session = getSessionSync();
  if (!session) return null;

  try {
    const { data, error } = await supabase
      .from('preference_profiles')
      .select('profile')
      .eq('session_id', session.sessionId)
      .single();

    if (error || !data) return null;
    return data.profile as PreferenceProfile;
  } catch {
    return null;
  }
}

/**
 * Start the periodic sync timer.
 */
export function startSync(): void {
  if (syncTimer) return; // Already running

  syncTimer = setInterval(() => {
    if (getEventCount() > 0) {
      runSync();
    }
  }, SYNC_INTERVAL_MS);

  // Sync on page hide (tab close, navigate away)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && getEventCount() > 0) {
      // Use sendBeacon-style: fire and forget
      runSync();
    }
  });
}

/**
 * Stop the periodic sync timer.
 */
export function stopSync(): void {
  if (syncTimer) {
    clearInterval(syncTimer);
    syncTimer = null;
  }
}
