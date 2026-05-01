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

## URL hierarchy — Phase 2 (data model + neighborhood layer)

Phase 1 of the hierarchy ships in this branch (see CLAUDE.md "URL hierarchy"
table). Properties currently resolve to canonical URLs by deriving state
code from `property.location` and reusing `imageSeed` as the slug. Phase 2
needs engineering to turn these into real fields:

- Add `stateCode`, `citySlug`, `neighborhoodSlug`, `slug` columns to the
  property data source (Supabase row → API response → `Property` type).
- Backfill the existing demo data; make `slug` unique within (state, city,
  neighborhood) and append a short uniqueness suffix on collision.
- Replace the `getAllProperties().find(p => getPropertySlug(p) === slug)`
  lookup in `PropertyDetailPage.tsx` with a server-side
  `getPropertyByCanonical(state, city, neighborhood, slug)`.
- Add `/{state}/{city}/{neighborhood}` route + `NeighborhoodIndexPage`
  component (similar to `CityIndexPage`, with neighborhood-level editorial,
  walk score, transit, school context, listings, FAQ).
- Add `/{state}/{city}/{neighborhood}/{property-type}` route +
  `TypeFilteredPage` for programmatic SEO pages
  (e.g. "2-bedroom apartments in Koreatown"). Generate at build time only
  for combinations with ≥3 actual listings to avoid thin-content penalties.

## SEO when AI_CHAT re-enables (architectural)

The URL hierarchy is fully SEO-friendly today **only because AI_CHAT is off
in production**. When AI_CHAT enables later, canonical URLs like
`/ca/los-angeles/sawyer-koreatown` redirect to
`/search/<thread>/property/<id>` and render inside the chat panel — which
has no breadcrumbs, no `BreadcrumbList` JSON-LD, and no canonical URL
signal. Search engines would index the chat URL instead of the canonical
one, losing the SEO investment in the hierarchy.

This is not solved by adding breadcrumbs to the chat panel (the redirect
itself is the issue, not the panel UI). Real options when AI_CHAT enables:

1. **Don't redirect canonical URLs.** Render `PropertyDetailPage` directly
   for `/{state}/{city}/{slug}` and offer "Continue in chat" as an
   affordance. Chat lives in its own URL space (`/chat/...`); canonical
   URLs always render the indexable page. Cleanest option.
2. **Emit canonical signal + property schema in the chat panel.** Keep
   the redirect, but inject `<link rel="canonical" href="/{state}/{city}/{slug}">`
   and the full property `RealEstateListing`/`Apartment` schema into the
   chat-panel HTML. Engines may still prefer the canonical URL for
   indexing.
3. **Pre-render canonical pages for crawlers.** Detect bots, serve the
   non-redirected canonical content. Adds infra complexity (SSR or a
   pre-render service); least preferred.

Decide before flipping `AI_CHAT=true` in production. Recommend (1) — it
also keeps URL-shareability working naturally without requiring users to
mentally model the chat-thread layer.

## Sitemap, robots.txt, llms.txt

When the URL hierarchy is real (post-Phase 2):

- Generate `sitemap.xml` (or sitemap index + segmented files:
  `sitemap-properties.xml`, `sitemap-cities.xml`, `sitemap-neighborhoods.xml`,
  `sitemap-guides.xml`). Submit to Google Search Console + Bing Webmaster.
- Add `public/robots.txt` explicitly allowing AI crawlers: `GPTBot`,
  `Google-Extended`, `ClaudeBot`, `PerplexityBot`, `OAI-SearchBot`. Block
  `Bytespider` (trains without driving traffic). Disallow `/search` and
  `/favorites` (no canonical content).
- Add `public/llms.txt` per the emerging standard — flat-text index of
  the site for LLMs: list of URLs + one-line descriptions, structured by
  hierarchy.

## Property FAQ data API

`buildMockFAQs` in `PropertyDetailsView.tsx` is templated mock data. The
production version needs:

- Server-returned FAQs per property, shape: `{ q: string; a: string;
  category: 'Pricing' | 'Location' | 'Amenities' | 'Tours & Leasing' |
  'Pet Policy'; sources?: string[] }[]`. Categories drive the segmented
  tab UI; ALL FAQs (regardless of category filter) must populate the
  FAQPage JSON-LD block — search engines and LLMs read structured data,
  not the visible DOM.
- 10–20+ Q&As per property is the goal. Sources can mix operator-curated,
  AI-extracted from listing copy, and tenant-FAQ scraped from past
  inquiries.
- If the list grows past ~20, add lazy rendering / pagination inside the
  tabs to keep LCP within budget.

## Editorial content for state/city pages

`StateIndexPage` and `CityIndexPage` ship with templated copy. Each city
deserves hand-edited editorial:

- Tagline + 200–500 word intro that reads like a knowledgeable friend
  (not marketing copy).
- Real market stats sourced from a data feed (currently hardcoded in
  `CITY_EDITORIAL` map in `CityIndexPage.tsx`).
- 4–6 neighborhoods with vibe descriptions and links to neighborhood
  pages once those exist.
- Locale-specific FAQs (rent control, commute patterns, climate, etc.)
  beyond the generic 4 we ship today.

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
