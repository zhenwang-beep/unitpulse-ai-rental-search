# UnitPulse Rental Search — project context

This file is the cold-start guide for any future agent (Claude Code, etc.).
Read it first; it captures context that isn't obvious from the file tree.

## What this is

A renter-facing rental search SPA. The pitch: instead of filling out filters,
you describe what you want in plain language and an AI (Gemini) returns a
curated shortlist with a "lifestyle match" rationale.

- Live: https://unitpulse-ai-rental-search.vercel.app/  *(staging — Vercel
  Hobby auto-deploys from `main`)*
- Production target: AWS, owned by engineering (deployment infra not in this
  repo yet — coming with the new repo move)

## Tech stack

- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind v3 via PostCSS plugin (NOT the v4 plugin, NOT the CDN —
  see `tailwind.config.js`, `postcss.config.js`). Migration history is in
  `git log` if needed.
- **Routing**: react-router-dom v7
- **Animation**: `motion` (a.k.a. framer-motion v12)
- **Icons**: lucide-react (no emojis as icons — design rule)
- **Data**: Supabase REST (`services/propertyService.ts`)
- **AI**: `@google/genai` — Gemini chat + Live API (voice) + Vision (planned)

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

**Rule**: never hardcode `bg-[#xxxxxx]` for brand colors. Use the token. If you
need a color that isn't in the token system, add it to `tailwind.config.js`
first.

Type system: `font-sans = Inter` (default body), `font-heading = Manrope`.

See `design.md` for prose-level usage guidance per surface.

## Conventions established this session

- **Touch targets**: 44pt on mobile, 36-40px on desktop. Pattern:
  - Buttons: `py-2.5 md:py-2 min-h-11 md:min-h-0`
  - Icon buttons: `w-11 h-11 md:w-10 md:h-10`
  - Mobile-only buttons (gated by `md:hidden`): `w-11 h-11` unconditionally
- **Images**: every below-fold `<img>` uses `loading="lazy" decoding="async"`.
  Header logos stay eager.
- **a11y**: every icon-only button has `aria-label`. Image gallery thumbs use
  `aria-current` to indicate selection.
- **Theming**: brand hex never appears as `bg-[#xxxxxx]` — always a token.
- **Components**: currently inlined; `<Button>`, `<Chip>`, `<Card>` extraction
  is in `TODO.md` as a deliberate future refactor.

## Git / deploy

- Author: `Zhen Wang <zhen.wang@unitpulse.ai>` (Vercel Hobby rejects others)
- Default workflow: commit → push to `claude/sharp-diffie` and `main` → Vercel
  auto-deploys to staging
- Worktrees live at `.claude/worktrees/<branch-name>/` for parallel agent work
- `main` is the production branch on Vercel today; AWS is the target after the
  new-repo migration

## AI features status (READ BEFORE TOUCHING)

Several AI features exist but are not all release-ready. See "AI feature
flags" section in `TODO.md` for the deferral plan and how to flip them on.

## Outstanding work

`TODO.md` at repo root tracks all deferred work, including revival recipes
for paused features. Always check it before starting something that might
already be tracked.
