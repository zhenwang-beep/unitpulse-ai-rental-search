# UnitPulse Rental Search — project context

This file is the cold-start guide for any future agent (Claude Code, etc.).
**Read it first** before touching anything; it captures context that isn't
obvious from the file tree, plus durable decisions that shouldn't be
relitigated.

Companion docs at the repo root:
- `TODO.md` — every paused decision and revival recipe
- `design.md` — prose-level brand and surface usage
- `PRD.md` — original product spec
- `README.md` — vanilla install/run instructions

If a strategy or planning doc is referenced but not in the repo (e.g.
`unitpulse-domain-strategy.md`), it lived in the user's Downloads at one
point — ask before assuming it's gone.

---

## What this is

A renter-facing rental search SPA. The pitch: instead of filling out
filters, you describe what you want in plain language and an AI (Gemini)
returns a curated shortlist with a "lifestyle match" rationale.

- **Live**: https://unitpulse-ai-rental-search.vercel.app/
  *(staging — Vercel Hobby auto-deploys from `main`)*
- **Production target**: AWS, owned by engineering. Deployment infra not
  in this repo yet — coming with the new-repo move (see "Migration to the
  AWS repo" below).

---

## Pre-flight checklist

Before your first edit on a fresh clone:

```bash
# 1. Install
npm install

# 2. Set the only required env var
cp .env.example .env.local
# add your GEMINI_API_KEY (https://aistudio.google.com/app/apikey)

# 3. Run dev server (Vite, port 3000)
npm run dev

# 4. (Optional) test with all AI features off — production scenario
echo 'VITE_FEATURE_AI_CHAT=false' >> .env.local
echo 'VITE_FEATURE_AI_VOICE=false' >> .env.local
echo 'VITE_FEATURE_AI_LIFESTYLE_MATCH=false' >> .env.local
echo 'VITE_FEATURE_AI_PREFERENCES=false' >> .env.local
# restart dev server; flags load at build/dev start, not at runtime
```

---

## Tech stack

- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind v3 via PostCSS plugin (NOT v4, NOT the CDN — see
  `tailwind.config.js`, `postcss.config.js`). Migration history in `git log`.
- **Routing**: react-router-dom v7
- **Animation**: `motion` (a.k.a. framer-motion v12)
- **Icons**: lucide-react (no emojis as icons — design rule)
- **Data**: Supabase REST (`services/propertyService.ts`)
- **AI**: `@google/genai` — Gemini chat + Live API (voice) + Vision (planned)

---

## Brand and design tokens

Single source of truth: `tailwind.config.js → theme.extend.colors`.

| Use | Token | Hex |
|---|---|---|
| Primary | `bg-brand` / `text-brand` | `#4A5D23` (olive) |
| Hover state | `bg-brand-hover` | `#3a4e1a` |
| On dark bg | `bg-brand-on-dark` | `#A8B97D` (sage) |
| Body text on AI tint | `text-brand-text` | `#243510` |
| Heading on AI tint | `text-brand-heading` | `#1a2609` |
| App bg / sticky bars | `bg-surface-app` | `#FCF9F8` (cream) |
| Pricing tables / chips | `bg-surface-2` | `#F4F1EE` |
| AI accent sections | `bg-surface-ai` | `#F4F7EC` |
| Footer | `bg-surface-footer` | `#F0EDEA` |

**Rule**: never hardcode `bg-[#xxxxxx]` for brand colors. Use the token. If
you need a color that isn't in the token system, add it to
`tailwind.config.js` first.

Type system: `font-sans = Inter` (default body), `font-heading = Manrope`.

See `design.md` for prose-level usage guidance per surface.

---

## URL hierarchy (canonical, Phase 1)

The consumer site is moving to a Zillow-style hierarchical URL structure.
**Phase 1 ships in this branch**:

| Route | Component | Purpose |
|---|---|---|
| `/` | `LandingPage` | Hero + chat/keyword search + 8 trending + Browse all CTA |
| `/listings` | `AllListingsPage` | Browse-all escape hatch, city filter |
| `/search?q=...` | `SearchResultsPage` (AI off) | Keyword search; suggests city hub when a city name appears in query |
| `/search/:chatId` | `ChatPage` (AI on) | Conversational AI search |
| `/{state}` | `StateIndexPage` | State hub, lists cities |
| `/{state}/{city}` | `CityIndexPage` | City hub: editorial header, neighborhoods, market stats, trending, FAQ |
| `/{state}/{city}/{slug}` | `PropertyDetailPage` (canonical mode) | Property detail page |
| `/property/:id` | `PropertyDetailPage` (legacy mode) | Legacy — fetches by id, 301s to canonical |
| `/{state}/{city}/{neighborhood}/{slug}` | *not yet* | Phase 2 — once `neighborhoodSlug` ships as a property field |

Valid states/cities are listed in `urlHelpers.ts`. Add new combos there.

URL helpers (`urlHelpers.ts`):
- `getPropertyUrl(property)` — canonical URL; falls back to `/property/:id`
  if state/city can't be resolved
- `getCityUrl(state, citySlug)`, `getStateUrl(state)`
- `isValidStateCode`, `isValidCity` — route-guard helpers
- `getPropertySlug(property)` — derived from `imageSeed` (already a kebab-
  case stable id on each property in the demo data)

**Important**: any new code that links to a property MUST use
`getPropertyUrl(property)` rather than constructing `/property/${id}`.
Canonical URLs are what we want indexed and shared.

---

## AI features status (READ BEFORE TOUCHING)

AI features are gated by env-var feature flags in `featureFlags.ts`.

- **Production default**: every flag OFF — first AWS production release
  ships traditional browse + filter UX without AI surfaces.
- **Dev default**: every flag ON — engineers see the full app locally.
- **To enable in deployed env**: set `VITE_FEATURE_*=true` (Vercel env
  settings today; AWS Parameter Store / SSM after migration).

| Flag | Gates |
|---|---|
| `VITE_FEATURE_AI_CHAT` | `/search/:chatId` route (`ChatPage`); landing-page chat input behavior |
| `VITE_FEATURE_AI_VOICE` | Voice button on LandingPage / ChatPage; `LiveInterface` mount |
| `VITE_FEATURE_AI_LIFESTYLE_MATCH` | "Lifestyle Match" section + "% Match" badge in `PropertyDetailsView` |
| `VITE_FEATURE_AI_PREFERENCES` | ChatPage preference sidebar; `useTracker` side effects (partial — see TODO.md) |

Vite tree-shakes `if (!FEATURES.X) {...}` blocks at build time when X is
statically `false`, so disabled AI code does not ship in the production
bundle (no Gemini imports, no Gemini network calls).

**To verify a clean production bundle**: `npm run build` then
`grep -r 'gemini' dist/` — should return nothing if all flags are off.

See `.env.example` for the full list. See `TODO.md` for revival recipes.

---

## What's real vs. mocked

This list matters because every "real data" item below has a `TODO(eng)`
marker in the code where engineering will swap mock → real.

| Surface | Today | Planned |
|---|---|---|
| Property listings | Supabase REST + local `MOCK_PROPERTIES` in `constants.ts` | Real listing data feed (operator-fed) |
| Property photos | Mix of operator photos and Unsplash/picsum stock fallbacks | Operator-uploaded unit photos |
| Property `state` / `city` / `slug` | Derived from `location` field + `imageSeed` (`urlHelpers.ts`) | First-class fields on the property model |
| Trending properties on home | `landingProperties.slice(0, 8)` | Server-side `?trending=true` filter using engagement signals |
| Property FAQs | `buildMockFAQs(property)` in `PropertyDetailsView.tsx` (14 templated Q&As, 5 categories) | Operator-curated + AI-extracted, 10–20+ per property, returned by API |
| State / city editorial copy | Hardcoded in `CityIndexPage.tsx → CITY_EDITORIAL` map | Hand-edited content per market |
| Market stats per city | Hardcoded in `CITY_EDITORIAL` | Live data from a market-stats feed |
| Amenity analysis | **Removed** (was Gemini Vision) | Re-add when ready — full revival recipe in `TODO.md` |

Search the code for `TODO(eng)` and `TODO(content)` markers — every
swap point is annotated.

---

## Conventions

Established and verified in this branch — please honor them on new code:

- **Touch targets**: 44pt mobile, 36–40px desktop. Pattern:
  - Buttons: `py-2.5 md:py-2 min-h-11 md:min-h-0`
  - Icon buttons: `w-11 h-11 md:w-10 md:h-10`
  - Mobile-only buttons (already gated by `md:hidden`): `w-11 h-11`
- **Images**: every below-fold `<img>` uses `loading="lazy" decoding="async"`.
  Header logos stay eager.
- **a11y**: every icon-only button has `aria-label`. Image gallery thumbs
  use `aria-current` for selection. Breadcrumbs are `<nav aria-label="Breadcrumb">`.
- **Theming**: brand hex never appears as `bg-[#xxxxxx]` — always a token.
- **Schema markup**: every page with structured content emits JSON-LD
  (`FAQPage`, `BreadcrumbList`). The full FAQ list always populates the
  schema even when the visible UI is filtered by a category tab — search
  engines and LLMs read the structured data, not the DOM.
- **Components are inlined today**; a `<Button>` / `<Chip>` / `<Card>`
  primitive extraction is in `TODO.md` as a deliberate future refactor.
  Don't extract opportunistically — coordinate with the planned effort.

---

## Git / deploy

- Author: `Zhen Wang <zhen.wang@unitpulse.ai>` (Vercel Hobby rejects
  commits from other authors).
- Default workflow: commit → push to `claude/sharp-diffie` and `main` →
  Vercel auto-deploys to staging. **The user has authorized auto-push to
  main without per-commit confirmation** — this is durable preference;
  don't ask for permission on routine pushes.
- Worktrees live at `.claude/worktrees/<branch-name>/` for parallel
  agent work. The main checkout might lag — verify with `git rev-parse`
  before assuming you're on latest.
- `main` is the production branch on Vercel today; AWS will be the target
  after the new-repo migration.

---

## Migration to the AWS repo

The plan is to move this code into a new repo deployed on AWS, owned by
engineering. **Things you (or the next agent) will need to know:**

### What to bring along
- All files in this repo
- `CLAUDE.md` (this file) — update the Live / production URL after move
- `TODO.md` — every deferred decision, with revival recipes
- `.env.example` — engineering uses this as the env-var contract
- `tailwind.config.js`, `postcss.config.js` — keep as-is
- `featureFlags.ts` — single source of truth for flag names

### What might change
- **Deploy infra**: from Vercel auto-push to AWS (CodeBuild / CodeDeploy /
  S3+CloudFront / ECS — engineering's call). Update the "Git / deploy"
  section of this file when known.
- **Env-var management**: from `.env.local` + Vercel env settings to
  AWS Parameter Store / SSM / Secrets Manager. The flag names stay the
  same; only the source changes.
- **Branch model**: may shift from "everything to main" to feature branches
  + PRs once eng controls deploys. Update the "Git / deploy" section
  accordingly.
- **Domain**: `unitpulse-ai-rental-search.vercel.app` → `unitpulse.ai`
  (consumer) and `partner.unitpulse.ai` (B2B). See URL hierarchy section.

### First task in the new repo
1. Verify `npm run build` succeeds (it should — this branch is clean).
2. Verify all four flag combinations build cleanly (every `OFF`, every `ON`).
3. Set up CI to typecheck (`npx tsc --noEmit`) on PRs.
4. Generate `sitemap.xml`, `robots.txt`, `llms.txt` (recipe in `TODO.md`).
5. Decide: keep `claude/<descriptor>` worktree pattern or switch to
   feature-branch model.

### Known tripwires (do not relitigate)

These were investigated and resolved in this branch. Don't redo without
reading the relevant commit message first:

- **Tailwind v4 plugin migration**: tried, broke `<button>` preflight,
  `translate-x-1/2`, gradients. Reverted (commit `dfe8bd9`). Stay on
  Tailwind v3 + PostCSS until the codebase is explicitly v4-ready.
- **Importmap in `index.html`**: removed because it created duplicate
  React copies and triggered "Invalid hook call" runtime errors. Don't
  re-add unless you understand why it was there in the first place.
- **`html { position: relative }` in `index.css`**: required for
  framer-motion's `useScroll` measurement. Don't remove.
- **Tailwind CDN**: removed; production-warning was real. Don't re-add.
- **Stock photos in property data**: known issue, marked TODO(eng), do
  not "fix" by deleting the fallback — the fallback prevents broken
  images on listings without uploaded photos. Wait for real photo data.

---

## Where to look for common tasks

| Task | Start here |
|---|---|
| Add a new property field | `types.ts → Property` interface, then `services/propertyService.ts → rowToProperty` |
| Add a new route | `App.tsx`, `pages/<Name>Page.tsx` (use existing pages as templates) |
| Add a new color | `tailwind.config.js → theme.extend.colors`, then use as a token |
| Add a new feature flag | `featureFlags.ts`, `.env.example`, then `if (FEATURES.X)` at gate point |
| Change touch-target sizing | Search for the `min-h-11 md:min-h-0` pattern; update consistently |
| Wire FAQ data API | `components/PropertyDetailsView.tsx → buildMockFAQs` (replace with hook) |
| Add a city to the URL hierarchy | `urlHelpers.ts → CITIES_BY_STATE`, then editorial copy in `pages/CityIndexPage.tsx → CITY_EDITORIAL` |
| Hide an AI surface | Check it's gated by the right flag in `featureFlags.ts`; add gate if missing |
| Bring back the amenity service | Recipe in `TODO.md → "Amenity analysis"` section |

---

## Outstanding work

`TODO.md` at repo root tracks all deferred work with revival recipes.
Always check it before starting something that might already be tracked.
Major sections:
- AI feature flags (still to wire `AI_PREFERENCES`)
- URL hierarchy Phase 2 (data model + neighborhood layer)
- Sitemap, robots.txt, llms.txt
- Property FAQ data API
- Editorial content for state/city pages
- Property data API (replace stock photos)
- Amenity analysis revival
- Component primitives (`<Button>`, `<Chip>`, `<Card>`)
- Touch-target sizing refinements

---

## Last verified working state

Date: 2026-05-01
Branch: `claude/sharp-diffie` ↔ `main` (in sync)
Latest commit: see `git log -1`
Vercel deploy: live at https://unitpulse-ai-rental-search.vercel.app/

Verified end-to-end with all four flag states. Property page tested with
breadcrumbs + share + favorite consolidated into a single row.
