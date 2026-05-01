# UnitPulse Design System

UnitPulse is an AI-first, conversational apartment rental platform. The design language is **architectural, minimal, and premium** — reflecting the quality of homes on the platform. Every new feature must follow this system to ensure a consistent, polished experience.

---

## 1. Color Tokens (Canonical)

All colors are defined as hex values applied via Tailwind's arbitrary value syntax. Never introduce new colors outside this table.

### Background Surfaces

| Token | Hex | Tailwind Class | Use |
|---|---|---|---|
| App Background | `#FCF9F8` | `bg-[#FCF9F8]` | Main app bg, sticky bars, modal panels, footer |
| Surface White | `#FFFFFF` | `bg-white` | Cards, modals, inputs, dropdowns |
| Secondary Surface | `#F4F1EE` | `bg-[#F4F1EE]` | Pricing tables, amenity chip bg, tag bg |
| AI Tint | `#F4F7EC` | `bg-[#F4F7EC]` | AI Lifestyle Match card, olive-accent info sections |
| Footer | `#F0EDEA` | `bg-[#F0EDEA]` | Landing page footer **only** |

### Brand Colors

| Token | Hex | Tailwind | Use |
|---|---|---|---|
| Brand Black | `#171717` | `text-black` / `bg-black` | Body text, icon buttons, primary text |
| Primary Olive | `#4A5D23` | `bg-[#4A5D23]` | Primary buttons, active states, match badges |
| Primary Olive Hover | `#3a4e1a` | `hover:bg-[#3a4e1a]` | Hover/active state for all olive elements |
| Olive Text (body) | `#243510` | `text-[#243510]` | Body text inside AI-tint sections |
| Olive Text (heading) | `#1a2609` | `text-[#1a2609]` | Headings inside AI-tint sections |

### Borders

| Token | Value | Tailwind | Use |
|---|---|---|---|
| Default border | `rgba(0,0,0,0.05)` | `border-black/5` | All card and surface borders |
| Strong border | `rgba(0,0,0,0.10)` | `border-black/10` | Dividers, active tab underlines |
| Olive border | `rgba(74,93,35,0.15)` | `border-[#4A5D23]/15` | AI-tint card borders |

### Anti-Patterns ❌
- **Never** use `bg-emerald-*`, `text-emerald-*`, or `border-emerald-*` — use `#4A5D23` (Olive) instead. Emerald-* is a brighter, bluer green that clashes with the rental site's woodsy olive.
- **Never** use `bg-gray-*` or `text-gray-*` — use `bg-neutral-*` / `text-neutral-*`. Tailwind's `gray` and `neutral` are visually similar but the rental site standardizes on `neutral` for consistency.
- **Never** use `bg-gray-50` or `bg-neutral-50` — use `#F4F1EE` instead.
- **Never** use `#FCF9F4` — the canonical warm bg is `#FCF9F8`.
- **Never** introduce raw hex values not in this table.

---

## 2. Typography

### Font Families

| Role | Family | CSS Class | Weights Available |
|---|---|---|---|
| Display / Headings | Manrope | `font-heading` | 300–900 |
| Body / UI | Inter | `font-sans` (default) | 300–700 |
| Code / Mono | JetBrains Mono | `font-mono` | 400–500 |

### Type Scale

| Role | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| Display / Hero | `text-5xl`–`text-7xl` | `font-black` (900) | `leading-tight` | Landing page hero headline |
| Page Heading | `text-2xl`–`text-4xl` | `font-black` (900) | `leading-tight` | Section and modal headings |
| Section Heading | `text-lg`–`text-xl` | `font-bold` (700) | `leading-snug` | Card section headings |
| Card Title | `text-base` | `font-bold` (700) | `leading-snug` | Property card names |
| Body | `text-sm` (14px) | `font-medium` (500) | `leading-relaxed` | Descriptions, message text |
| Secondary / Meta | `text-xs` (12px) | `font-medium` (500) | `leading-normal` | Location, timestamps, stats |
| Label / Badge | `text-xs` (12px) | `font-bold` (700) | `leading-none` | `uppercase tracking-wider` tags, badges |

### Typography Rules
- **Minimum size is `text-xs` (12px).** Never use `text-[10px]` — it fails WCAG AA readability.
- Use `font-heading` (Manrope) for all display, page, and section headings.
- Use default `font-sans` (Inter) for all body text, labels, and UI text.
- Heading hierarchy: `font-black` for display → `font-bold` for section → `font-semibold` for card titles.

### Anti-Patterns ❌
- **Never** use `font-serif`. The rental site has no serif tier — all headings use `font-heading` (Manrope).
- **Never** introduce a third type family. We have exactly three: Manrope (heading), Inter (body), JetBrains Mono (code).

---

## 3. Spacing (8px Grid)

All spacing follows an 8px base grid. Use Tailwind spacing tokens; never use arbitrary pixel values like `mt-[13px]`.

| Token | Value | Tailwind | Use |
|---|---|---|---|
| `space-1` | 4px | `gap-1 / p-1` | Icon micro-gap |
| `space-2` | 8px | `gap-2 / p-2` | Icon + label inline gap |
| `space-3` | 12px | `gap-3 / p-3` | Dense component padding, icon buttons |
| `space-4` | 16px | `gap-4 / p-4` | Standard padding, form elements |
| `space-5` | 20px | `gap-5 / p-5` | **Card internal padding (canonical)** |
| `space-6` | 24px | `gap-6 / p-6` | Section padding, modal padding |
| `space-8` | 32px | `gap-8 / p-8` | Feature card padding (landing page) |
| `space-section` | 64–96px | `py-16`–`py-24` | Between page-level sections |

**Rules:**
- Property card content padding: always `p-5`
- Landing page feature cards: always `p-8`
- Modal padding: `p-6`

---

## 4. Border Radius (5 Levels)

| Level | Value | Tailwind | Use |
|---|---|---|---|
| Full | 9999px | `rounded-full` | Pills, avatars, chips, icon buttons |
| XL | 20px | `rounded-3xl` | Modals, overlays, large containers |
| Large | 16px | `rounded-2xl` | Panels, inputs, expandable cards, bento grid cells |
| Medium | 12px | `rounded-xl` | Standard cards, action buttons, tags |
| Small | 8px | `rounded-lg` | Badges, small chips, inner sub-cards |

**Exception:** `rounded-[2rem]` (32px) is used **only** for landing page feature capability cards.

---

## 5. Elevation / Shadows (4 Levels)

| Level | Class | Use |
|---|---|---|
| Subtle | `shadow-sm` | Frosted glass buttons, badges, icon buttons |
| Card default | `shadow-md` | Resting card shadow (use sparingly; prefer border) |
| Card hover | `shadow-xl` | Card hover state, dropdown menus |
| Modal | `shadow-2xl` | Modals, chat input box, overlays |
| Olive colored | `shadow-xl shadow-[#4A5D23]/10` → `shadow-2xl shadow-[#4A5D23]/20` on hover | Primary CTA buttons **only** |

**Rule:** Default cards use `border border-black/5` without shadow for a clean, flat look. Apply shadow only on hover or for floating elements.

---

## 6. Component Patterns

### Buttons

| Variant | Classes | Size: sm / md / lg |
|---|---|---|
| **Primary** | `bg-[#4A5D23] text-white rounded-xl font-semibold hover:bg-[#3a4e1a] transition-all` | `h-9 px-4 text-xs` / `h-11 px-5 text-sm` / `h-12 px-6 text-sm` |
| **Secondary** | `bg-neutral-100 text-black rounded-xl font-semibold hover:bg-neutral-200 transition-all` | Same sizes |
| **Ghost / Chip** | `bg-white border border-black/5 text-black rounded-full font-medium hover:bg-black hover:text-white transition-all` | Pill only — `px-4 py-2 text-xs` |
| **Icon** | `p-2 bg-white/80 backdrop-blur-md shadow-sm border border-black/5 rounded-full hover:bg-white transition-colors` | Fixed `p-2` |
| **Destructive** | `bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all` | Same as Primary |

**Disabled state (all variants):** add `opacity-40 cursor-not-allowed pointer-events-none`

### Cards / Surfaces

| Card Type | Background | Border | Radius | Padding |
|---|---|---|---|---|
| Property Card | `bg-white` | `border-black/5` | `rounded-xl` | `p-5` |
| Chat Message Bubble | `bg-white` | `border-black/5` | `rounded-2xl` | `p-4`–`p-5` |
| AI Insight (olive-tinted) | `bg-[#F4F7EC]` | `border-[#4A5D23]/15` | `rounded-2xl` | `p-5` |
| Pricing / Fee Table | `bg-[#F4F1EE]` | `border-black/5` | `rounded-2xl` | `p-5` |
| Interactive Form | `bg-white` | `border-black/5` | `rounded-3xl` | `p-6` |
| Feature Card (landing) | `bg-white` | `border-black/5` | `rounded-[2rem]` | `p-8` |

---

## 7. Motion & Animation

### Duration Scale

| Duration | Use |
|---|---|
| `150ms` / `duration-150` | Button press, toggle switch, micro-interaction |
| `200ms` / `duration-200` | Hover color and shadow transitions |
| `300ms` / `duration-300` | Panel enter/exit, modal open, component mount |
| `500ms` / `duration-500` | Header hide/show, route page transitions, large reveals |
| `700ms` / `duration-700` | Image zoom on hover, background blur effects |

### Framer Motion Defaults
```tsx
// Standard enter animation
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: 8 }}
transition={{ duration: 0.3, ease: 'easeOut' }}

// Modal overlay
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.2 }}
```

### Custom Keyframes (defined in `index.css`)
| Name | Use |
|---|---|
| `fadeInUp` | Staggered content reveal on landing page |
| `fadeIn` | Lazy-loaded card appearance |
| `breathing` | AI "thinking" status indicator |
| `float` | Decorative floating elements |

---

## 8. Navigation Patterns

Every page and view must have a **clear back-navigation affordance** and the **UnitPulse logo visible** (or the back button when in a sub-view).

| Context | Pattern |
|---|---|
| Landing Page | Sticky top nav: logo left · links center · Login CTA right. Hides on scroll-down, shows on scroll-up. |
| Chat Page | Same sticky nav header. |
| Property Detail (inline split-view) | Frosted pill button: `← Back` + truncated address in center + heart icon right. |
| Property Detail (modal overlay) | Frosted pill `×` button top-left + heart icon top-right. |
| Mobile | Hamburger → drawer sidebar with full nav, user info, logout. |

---

## 9. Property Detail Page

### Section Order (top → bottom)
1. Top navigation bar (sticky, frosted glass)
2. Bento image grid (inset `px-5`, `rounded-2xl`, `aspect-[3/2] md:aspect-[16/6]`)
3. Title · location · match badges
4. Key stats (beds / baths / sqft)
5. AI Lifestyle Match (olive-tinted card, **dynamic text** from `property.matchReason` + amenities)
6. Amenities (Building / Unit / Lifestyle categories)
7. Floor Plans
8. Pricing & Fees
9. About this home (description)
10. Nearby / Map embed
11. Sticky footer: price + Inquire + Schedule Tour buttons

### Responsive Sticky Footer

| Element | Mobile | Desktop (`lg:`) |
|---|---|---|
| Price | `text-sm font-black` | `text-xl font-black` |
| `/mo` unit | `text-xs` | `text-sm` |
| Buttons | `h-9 px-3 text-xs` | `h-12 px-5 text-sm` |
| Max-width | full | `max-w-3xl mx-auto` |

### AI Lifestyle Match — Dynamic Text
**Never hardcode** the match text. Always derive it from property data:
```tsx
`This ${property.type} in ${property.location} stands out for its ${property.amenities.slice(0, 2).join(' and ')}.${property.matchReason ? ' ' + property.matchReason : ''}`
```

---

## 10. Chat Interface Patterns

### Empty State (no messages)
Show a centered Lumina greeting with suggestion chips when `messages.length === 0`. Use `SUGGESTION_CHIPS` from `constants.ts` displayed in a 2-column grid.

### Loading State
Use a shimmer skeleton (3 rows of `animate-pulse bg-neutral-100` divs at varying widths) — never just a text line.

### Suggested Reply Chips
Use the **Ghost / Chip** button variant. Horizontally scrollable with fade-out gradient on right edge.

### Active Filter Pills
When `currentFilters` has values, show dismissible pills above the input:
```
[📍 Los Angeles ×]  [$1,500–$3,000 ×]  [2+ Beds ×]
```
Pills use the Ghost / Chip style with `×` to clear individual filters.

### Error State
Use an amber-bordered card with a "Try again" retry button. Never render API errors as normal chat bubbles.

---

## 11. Partner / Marketing Page (`/partner`)

The partner-facing B2B marketing page lives at `/partner` (and via subdomain rewrite at `partner.unitpulse.ai`). It uses the same tokens as the rental site — no separate brand. Specifics:

### Section Backgrounds
- **Above-the-fold (Hero, Clients, Stats):** `bg-[#FCF9F8]` (cream) — flows continuously from `TopNav`.
- **Dark feature canvas (`#agents`):** `bg-black text-white` is permitted **only** for the scroll-driven 3-product section. All other partner sections use cream or white.
- **Pricing, CallToAction, Footer:** cream background with `bg-white` cards on top — same as rental landing page.

### Required
- Use the shared `TopNav` from `components/TopNav.tsx`. No separate partner navbar.
- Use `PageFooter` from `components/PageFooter.tsx` (the four-column "For renters / For partners / Company / Legal" footer). No separate partner footer.
- Use natural body scroll (no `h-[100dvh] overflow-y-auto` wrapper) so framer-motion's `useScroll` can drive the scroll-linked animations in `FeatureCanvas`.
- Headings: `font-heading` (Manrope). The original partner site used `font-serif` — that's an anti-pattern here.
- Accent green: `#4A5D23` (Olive). The original partner site used `emerald-*` — that's an anti-pattern here.
- Imported partner components live under `components/partner/` and follow the same color tokens as the rest of the app.

### Do Not
- Don't add a separate set of brand colors for the partner audience. One brand, one design system.
- Don't reach into rental-side components from partner sections. They are siblings, not parent/child.

---

## 12. Mobile-Specific Patterns

- Minimum touch target: `44×44px` (use `min-h-[44px] min-w-[44px]` on interactive elements)
- Tab bar inside modal (Listing / Chat): `shrink-0 lg:hidden`, stacked inside flex column to avoid z-index conflicts
- iOS safe area: `padding-bottom: env(safe-area-inset-bottom, 0px)` on bottom-anchored elements
- Font size floor: `text-xs` (12px) — never `text-[10px]`

---

## 13. Accessibility Requirements

- All icon-only buttons must have `aria-label`
- Minimum color contrast: 4.5:1 for body text, 3:1 for large text (WCAG AA)
- `text-[10px]` is forbidden — use `text-xs` (12px) minimum
- Focus states: use `focus-visible:ring-2 focus-visible:ring-[#4A5D23]` on interactive elements
- Images need `alt` text; decorative images use `alt=""`
