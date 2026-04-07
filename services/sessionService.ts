import { SessionInfo } from '../types';

const STORAGE_KEY = 'unitpulse_session';

async function hashIP(ip: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(ip);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function loadSession(): SessionInfo | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(session: SessionInfo): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage full or unavailable — silently fail
  }
}

/**
 * Get session synchronously from localStorage (may be null on first visit).
 */
export function getSessionSync(): SessionInfo | null {
  return loadSession();
}

/**
 * Initialize or resume an anonymous session.
 * On first visit: resolves IP geo via ip-api.com and creates a new session.
 * On subsequent visits: reuses existing sessionId and refreshes lastSeen.
 */
export async function getSession(): Promise<SessionInfo> {
  const existing = loadSession();

  if (existing) {
    // Refresh lastSeen timestamp
    existing.lastSeen = Date.now();
    saveSession(existing);
    return existing;
  }

  // First visit — create new session
  const sessionId = crypto.randomUUID();
  let ipHash = '';
  let geo: SessionInfo['geo'] = null;

  try {
    const response = await fetch(
      'http://ip-api.com/json/?fields=city,regionName,country,lat,lon,query',
      { signal: AbortSignal.timeout(5000) }
    );
    if (response.ok) {
      const data = await response.json();
      ipHash = await hashIP(data.query || '');
      geo = {
        city: data.city || '',
        region: data.regionName || '',
        country: data.country || '',
        lat: data.lat || 0,
        lng: data.lon || 0,
      };
    }
  } catch {
    // Geo API failed — continue without it, session identity still works
    ipHash = await hashIP(sessionId); // fallback hash
  }

  const session: SessionInfo = {
    sessionId,
    ipHash,
    geo,
    createdAt: Date.now(),
    lastSeen: Date.now(),
  };

  saveSession(session);
  return session;
}
