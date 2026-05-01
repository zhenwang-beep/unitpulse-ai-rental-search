/**
 * Feature flags — single source of truth.
 *
 * Reads `import.meta.env.VITE_FEATURE_*` at build time so Vite can
 * tree-shake disabled branches out of the production bundle entirely
 * (no Gemini code or network calls ship if AI is off).
 *
 * Convention:
 *   - Production default: every flag OFF unless explicitly set to "true".
 *   - Dev default: ON, so engineers see the full app locally.
 *   - To override in dev: set the env var to "false" in `.env.local`.
 *
 * To enable a flag in deployed environments, set the corresponding env
 * var to the string `"true"` (e.g. via AWS Parameter Store / SSM, Vercel
 * env settings, or a `.env.production` file).
 *
 * See `.env.example` for the full list of flags + descriptions.
 * See `CLAUDE.md` (AI features section) and `TODO.md` (revival recipes)
 * for what each flag enables.
 */

const flag = (name: string, devDefault: boolean): boolean => {
  const raw = (import.meta.env as Record<string, string | undefined>)[name];
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return import.meta.env.DEV ? devDefault : false;
};

export const FEATURES = {
  /** Conversational property search via Gemini.
   *  Surfaces gated: `/search/:chatId` route, landing-page chat input behavior. */
  AI_CHAT: flag('VITE_FEATURE_AI_CHAT', true),

  /** Real-time voice search via Gemini Live API.
   *  Surfaces gated: voice button on LandingPage and ChatPage; LiveInterface mount. */
  AI_VOICE: flag('VITE_FEATURE_AI_VOICE', true),

  /** AI-generated lifestyle match section in PropertyDetailsModal.
   *  Surfaces gated: the `isAnalyzing` / `matchScore` block in PropertyDetailsModal. */
  AI_LIFESTYLE_MATCH: flag('VITE_FEATURE_AI_LIFESTYLE_MATCH', true),

  /** Behavioral preference intelligence (preferenceSynthesizer + tracker).
   *  Surfaces gated: ChatPage preference sidebar, useTracker side effects. */
  AI_PREFERENCES: flag('VITE_FEATURE_AI_PREFERENCES', true),
} as const;
