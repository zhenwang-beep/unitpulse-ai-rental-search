# Engineering TODO

Tracking deferred work that doesn't fit in the current sprint.

## AI feature flags — first AWS production release

The first production release on AWS ships **without AI surfaces**.
All AI code stays in the repo; visibility is controlled by env-var
feature flags in `featureFlags.ts`.

**Default in production**: every `VITE_FEATURE_AI_*` is OFF.
**Default in dev**: every flag is ON (set per-env to override).

Currently wired: `AI_CHAT` (gates `/search/:chatId` route + redirects to `/`).

Still to wire (each is a small targeted edit, do when fallback UX for
the landing page is decided):

- `AI_VOICE` — gate the voice button on `LandingPage` and the
  `<LiveInterface>` mount on both `LandingPage` and `ChatPage`.
- `AI_LIFESTYLE_MATCH` — wrap the `isAnalyzing` / `matchScore` block in
  `PropertyDetailsModal.tsx` (~line 219-275) in `if (FEATURES.AI_LIFESTYLE_MATCH)`.
- `AI_PREFERENCES` — gate the preference sidebar in `ChatPage`, neutralize
  `useTracker` to a no-op when flag is OFF, skip `preferenceSynthesizer`
  calls. Note: `useTracker` is also imported by `PropertyCard` and
  `PropertyPanel` — handle those gracefully (early return inside the hook).

### Picking up later

To turn a feature on for production:
1. Set `VITE_FEATURE_AI_<NAME>=true` in the deploy environment (Vercel
   env settings, AWS Parameter Store, etc.).
2. Redeploy. No code changes needed.
3. Verify the surface appears and Gemini calls land.

### Pending design decision: landing-page fallback when AI_CHAT is OFF

Today the LandingPage chat input navigates to `/search/:chatId` to start
an AI conversation. With `AI_CHAT=off`, that flow is dead. Options:
- **(a)** Remove the chat input entirely; show only city filter + cards
- **(b)** Keep the input but treat it as a basic keyword filter (no AI)
- **(c)** Keep input + show "AI search coming soon" badge that nudges
  email signup or routes to current grid

Decide before wiring `AI_CHAT` deeper into the landing page.

## Property data API

## Property data API

Stock photos still appear in property listings (water drops, ocean rocks,
machine parts). Once the real listing data feed is connected, swap them out:

- `services/propertyService.ts` — `rowToProperty` reads `row.image` / `row.images`
  from Supabase. Some demo rows reference Unsplash stock photos.
- `constants.ts` — `MOCK_PROPERTIES` is the local seed data with similar issues.
- `components/PropertyCard.tsx` — `picsum.photos` fallback when `property.images`
  is empty. Drop the fallback when real data is reliable.
- `components/PropertyDetailsModal.tsx` — same picsum fallback.

## Amenity analysis (Gemini Vision)

We removed `services/amenityAnalysisService.ts` for now (it was orphaned and
called a billable Gemini Vision API). The intent is to bring it back as the
**source-of-truth + proof** when users ask about a property's amenities — the
AI extracts categorized amenities (kitchen, bathroom, building, etc.) with
confidence scores from real listing photos, and we surface that in chat as
evidence rather than relying on the static `property.amenities` array.

When ready to revive:
- Restore the service from commit `a523e38` or earlier (or rewrite — the spec
  is small: send images to `gemini-3-pro-preview` with a structured-output
  schema, return categorized amenities + a one-line summary).
- Restore the types: `AmenityItem`, `CategorizedAmenities`, `AmenityAnalysisResult`,
  `toFlatAmenityArray` in `types.ts`.
- Run analysis once at build time over the property data feed (not per-page-view),
  bake the categorized amenities into the property records, and render a
  grouped section in `PropertyDetailsModal.tsx`.
- In `ChatInterface.tsx`, when the user asks about amenities, cite the
  AI-extracted list with confidence scores as evidence ("the kitchen has a
  dishwasher and stainless appliances — 0.92 confidence from photo 3").

## Component primitives

The codebase reimplements common UI elements inline ~20 times each. Extract:

- `<Button variant size>` — primary olive, secondary, destructive; sm/md/lg
  with responsive sizing (desktop slimmer, mobile 44pt for touch).
- `<IconButton>` — for icon-only buttons; ensures aria-label is required and
  hit area meets accessibility minimums.
- `<Chip>` — suggestion chips, city filters, amenity tags, type badges.
- `<Card>` — common border, radius, hover-shadow, padding scale.

Doing this would catch consistency drift, simplify global tweaks, and shrink
each component file by 20–30%.

## Touch-target sizing

44pt minimum is enforced uniformly today, but on desktop with a mouse it can
feel chunky (e.g. Login button). Consider responsive sizing once a `<Button>`
component lands: `md:h-9` (36px) on desktop, `min-h-11` (44px) on mobile.

## Sub-44pt targets still inside cards

~36 of the 196 sub-44 elements are the per-card "Call" / "Tour" CTAs at 40px
tall. Bump to 44px on mobile when the `<Button>` component is built.

## Misc

- After the Tailwind v3 PostCSS migration ships, watch for dynamically-
  constructed class names that the static scanner misses. Add them to
  `safelist` in `tailwind.config.js` if any utilities go missing.
