# UnitPulse Design Guidelines

UnitPulse Search is an AI-first, conversational apartment rental platform. Users find homes through natural language instead of filters. The design language is architectural, minimal, and premium — reflecting the quality of homes on the platform.

---

## Color Palette

### Primary Colors

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Primary Black | Brand Black | `#171717` | Body text, primary CTAs, borders, icons |
| Olive Green | Brand Accent | `#4A5D23` | Primary buttons, active states, highlights, accent elements |
| Olive Dark | Accent Hover | `#3a4e1a` | Hover/pressed state for olive green elements |
| Pure White | Surface White | `#FFFFFF` | Card backgrounds, modals, input fields |

### Neutral Scale

Use Tailwind's `neutral-*` scale for all gray tones. Never mix `gray-*` and `neutral-*` in the same context.

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-50` | `#FAFAFA` | Subtle input backgrounds, hover surfaces |
| `neutral-100` | `#F5F5F5` | Tag/badge backgrounds, dividers |
| `neutral-400` | `#A3A3A3` | Placeholder text, disabled text (ensure 3:1 contrast on white) |
| `neutral-500` | `#737373` | Secondary/supporting body text |
| `neutral-600` | `#525252` | Meta text (location, details) |
| `neutral-700` | `#404040` | Active secondary text |
| `neutral-900` | `#171717` | Same as Brand Black |

### Background Surfaces

| Token | Hex | Tailwind | Usage |
|-------|-----|---------|-------|
| App Background | `#FCF9F8` | `bg-[#FCF9F8]` | Main app, chat view, property detail panel background |
| Secondary Surface | `#F4F1EE` | `bg-[#F4F1EE]` | Amenity chips, pricing table, unit cards, input backgrounds |
| Card Surface | `#FFFFFF` | `bg-white` | Property cards, modals, floor plan accordion items |
| Sticky Footer | `#FCF9F8` | `bg-[#FCF9F8]` | Property detail sticky footer |

> **Rule:** Cards and modal content areas always use `#FFFFFF`. Section-level containers and chip/tag backgrounds use `#F4F1EE`. The overall app shell and full-bleed panels use `#FCF9F8`. Never use Tailwind `neutral-50` (`#FAFAFA`) — it reads as cool-gray and clashes with the warm palette.

### Olive Green Text Scale

| Role | Hex | Usage |
|------|-----|-------|
| Primary / Icon | `#4A5D23` | Active states, icons, accent text, CTAs |
| Hover | `#3a4e1a` | Hover state for olive elements |
| Light text (on dark olive) | `#8aaa4d` | Secondary text on dark olive backgrounds |
| Dark text | `#243510` | Body text inside olive-tinted sections |
| Darkest | `#1a2609` | Headings inside olive-tinted sections |
| Light tint bg | `#F4F7EC` | Very light olive background (AI Lifestyle Match) |

### Color Usage Anti-patterns

- ❌ Do not use `#33450D` — this was a legacy brownish-olive (incorrect brand color)
- ❌ Do not use `gray-*` Tailwind utilities — use `neutral-*` instead
- ❌ Do not use pure `#000000` for text — use `#171717` (brand black)
- ❌ Do not convey information through color alone — pair with icons or labels
- ❌ Do not use `bg-emerald-*` or `bg-green-*` — always use the olive hex values above
- ❌ Do not use `bg-neutral-50` — use `#F4F1EE` (warm secondary surface) instead

---

## Typography

### Font Families

| Role | Font | CSS Class | Use For |
|------|------|-----------|---------|
| Display / Headings | **Manrope** | `font-heading` | Hero text, section titles, property names, logo |
| Body / UI | **Inter** | `font-sans` | Body copy, labels, buttons, inputs, navigation |

Both fonts are loaded from Google Fonts at all required weights (300–800 for Manrope, 300–700 for Inter).

### Type Scale

| Label | Size | Weight | Line Height | Use For |
|-------|------|--------|-------------|---------|
| Hero Title | `text-5xl` / `text-7xl` | `font-extrabold` (800) | `leading-tight` | Landing page hero heading |
| Section Heading | `text-4xl` / `text-5xl` | `font-black` (900) | `leading-tight` | FAQ, AI capabilities headings |
| Card Title | `text-lg` | `font-semibold` (600) | `leading-snug` | Property card name |
| Body | `text-base` (16px) | `font-normal` (400) | `leading-relaxed` (1.625) | Descriptions, FAQ answers |
| Secondary Body | `text-sm` (14px) | `font-medium` (500) | `leading-relaxed` | Navigation links, footer text |
| Label / Meta | `text-xs` (12px) | `font-bold` (700) | `leading-normal` | Tags, badges, stat labels |
| Caption | `text-xs` (12px) | `font-medium` (500) | `leading-normal` | Copyright, footnotes |

> **Minimum font size: 12px (`text-xs`).** Never use `text-[10px]` or `text-[8px]` in production UI.

### Font Weight Usage

| Weight | Class | Reserved For |
|--------|-------|-------------|
| 900 (Black) | `font-black` | Hero display text, key numbers only |
| 800 (ExtraBold) | `font-extrabold` | Section headings, section labels |
| 700 (Bold) | `font-bold` | Card titles, buttons, navigation, form labels |
| 600 (SemiBold) | `font-semibold` | Card subheadings, secondary headings |
| 500 (Medium) | `font-medium` | Body text, nav links, secondary labels |
| 400 (Regular) | `font-normal` | Long-form body copy, descriptions |

> **Rule:** `font-black` is reserved for hero and display sizes only. Using it on small UI text (< 14px) reduces legibility.

---

## Spacing & Layout

### Spacing Scale

Follow a strict **8px base grid**. All spacing values must be multiples of 4px (0.25rem in Tailwind).

| Use | Value | Tailwind |
|-----|-------|---------|
| Inline gap (icon + text) | 8px | `gap-2` |
| Component internal padding | 16–24px | `p-4` / `p-6` |
| Card padding | 20px | `p-5` |
| Section spacing | 64–96px | `mt-16` / `mt-24` |
| Page horizontal padding | 24px (mobile) / 32px (tablet) / 48px (desktop) | `px-6 md:px-8 lg:px-12` |

### Container Widths

| Context | Max Width | Class |
|---------|-----------|-------|
| Page content | 1280px | `max-w-7xl mx-auto` |
| Centered content (forms, hero) | 896px | `max-w-4xl mx-auto` |
| Search input | 768px | `max-w-3xl mx-auto` |
| Reading content | 672px | `max-w-2xl mx-auto` |

> **Rule:** Every section inside `<main>` must be wrapped in a `max-w-7xl mx-auto` container. Raw `w-full` without a max-width causes content to stretch on ultrawide displays.

### Border Radius

| Level | Value | Tailwind | Use For |
|-------|-------|---------|---------|
| Full | 9999px | `rounded-full` | Buttons (pill), tags, avatars |
| Large | 24px | `rounded-3xl` | Modals, large cards |
| Medium | 16px | `rounded-2xl` | Panels, inputs, dropdown menus |
| Small | 12px | `rounded-xl` | Inner cards, list items |
| Micro | 8px | `rounded-lg` | Badges, chips, small buttons |

---

## Component Patterns

### Primary Button (Olive)

The primary CTA across the product is olive green, not black. Reserve pure black buttons only for destructive/critical actions.

```
bg-[#4A5D23] text-white rounded-xl px-5 py-3 text-sm font-semibold
hover:bg-[#3a4e1a] transition-all duration-200
```

### Secondary / Ghost Button

```
bg-neutral-100 text-black rounded-xl px-5 py-3 text-sm font-semibold
hover:bg-neutral-200 transition-all duration-200
```

### Send / Submit Button (round)

```
h-8 w-8 rounded-full bg-[#4A5D23] text-white
hover:bg-[#3a4e1a] transition-all
```

### Search Input

```
bg-white rounded-full border-2 border-transparent shadow-sm
focus-within:border-[#4A5D23] focus-within:shadow-lg
transition-all duration-300
```

### Property Card

- Background: `#FFFFFF`
- Border: `border border-black/5` (1px, 3% black opacity)
- Corner radius: `rounded-xl` (12px)
- Hover shadow: `hover:shadow-xl`
- Image height: `h-56` (224px fixed)

### Tag / Badge

```
px-3 py-1 bg-neutral-100 text-neutral-700 rounded-md text-xs font-bold uppercase tracking-wider
```

---

## Property Detail Page

The property detail view renders as a split panel: **60% left** (property details) + **40% right** (AI chat). On mobile, they stack vertically.

### Section Order (top to bottom)

1. **Photo Bento Grid** — 4-col × 2-row image grid; click any tile to open full-screen carousel
2. **Title & Badges** — Property name, location, "New Listing" + match-score badges
3. **Key Stats** — Beds · Baths · Sq Ft in a 3-col divider row
4. **AI Lifestyle Match** — Olive-tinted card (`#F4F7EC` bg) with AI-generated insight
5. **Floor Plans** — Expandable accordion; selected plan uses `border-[#4A5D23]`
6. **Amenities** — Categorized into Building / Unit / Lifestyle subsections _(moved above Pricing)_
7. **Pricing & Fees** — Table on `#F4F1EE` background
8. **About this home** — Property description in `text-neutral-500`
9. **Nearby** — Google Maps embed

> **Rule:** Amenities must appear directly after Floor Plans, before Pricing. This positions high-value lifestyle information early while users are still evaluating the space.

### Amenities Display

Amenities are split into three named categories, each shown as a labeled subsection:

| Category | Contents |
|----------|----------|
| **Building** | Shared building features: concierge, rooftop, gym, bike storage, EV charging, dog run, co-working lounge |
| **Unit** | In-unit features: washer/dryer, dishwasher, A/C, floors, closet, balcony, smart lock, appliances; merged with `property.amenities` from data |
| **Lifestyle** | Policies and extras: pet-friendly, BBQ, garden, storage |

Each amenity chip: `bg-[#F4F1EE] rounded-xl border border-black/5 px-3 py-2.5` with a `text-[#4A5D23]` check icon.

### Sticky Footer

Always visible at the bottom of the left panel. Scales up on larger screens to command more visual attention.

| Element | Mobile | Desktop (lg+) |
|---------|--------|---------------|
| Price text | `text-sm font-black` | `text-xl font-black` |
| Unit/availability | `text-xs truncate max-w-[140px]` | `text-xs max-w-none` |
| Button height | `h-9` | `h-12` |
| Button padding | `px-3` | `px-5` |
| Button text | `text-xs` | `text-sm` |
| Container padding | `px-4 py-3` | `px-6 py-5` |

- Background: `#FCF9F8`
- Border: `border-t border-black/5`
- Price must use `whitespace-nowrap` to prevent wrapping on narrow screens
- Availability subtext uses `truncate` on mobile to stay on one line

### Mobile Tab Bar

On mobile (below `lg` breakpoint), a **Listing / Chat** tab bar renders as a `shrink-0` flex item stacked **inside** the property modal flex column — below the sticky footer. This ensures no z-index overlap.

- Height: `h-14` per tab
- Active tab (Listing): `text-[#4A5D23]` with `Building2` icon
- Inactive tab (Chat): `text-neutral-400`, tapping calls `onClose()` to navigate back to chat
- Adds `env(safe-area-inset-bottom)` padding for iOS home bar
- Hidden on `lg+` with `lg:hidden`

---

## Iconography

Use **Lucide React** exclusively. No emojis as icons.

| Context | Size | Stroke |
|---------|------|--------|
| Navigation / header | 24px | default (2px) |
| Card / inline | 16px | default |
| Stats / feature icons | 24px | default |
| Micro / badge | 12px | default |

---

## Grid & Breakpoints

| Breakpoint | Name | Min Width | Columns |
|------------|------|-----------|---------|
| Default | Mobile | 0 | 1 |
| `sm` | Small | 640px | 2 |
| `md` | Tablet | 768px | 2 |
| `lg` | Desktop | 1024px | 3 |
| `xl` | Wide | 1280px | 3–4 |

### Property Grid

```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8
```

### Footer Grid

```
grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12
```

---

## Animation

| Type | Duration | Easing |
|------|----------|--------|
| Micro-interactions (hover, press) | 150–200ms | `ease-out` |
| Panel/drawer enter | 300ms | `[0, 0, 0.2, 1]` (ease-out) |
| Panel/drawer exit | 200ms | `[0.4, 0, 1, 1]` (ease-in) |
| Page transitions | 400ms | `ease-out` |
| Skeleton / shimmer | 1500ms | `linear` loop |

Always respect `prefers-reduced-motion`.

---

## Accessibility

- Minimum contrast ratio: **4.5:1** for body text, **3:1** for large text and icons
- All interactive elements must have visible **focus rings**
- Icon-only buttons must have `aria-label`
- Form inputs must have associated `<label>` elements (not placeholder-only)
- Minimum touch target size: **44×44px**
- `prefers-reduced-motion` media query must disable all animations
