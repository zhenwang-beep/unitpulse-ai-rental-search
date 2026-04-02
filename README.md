<div align="center">
<img width="1200" alt="UnitPulse Homepage" src="public/homepage-screenshot.png" />
</div>

# UnitPulse — AI-Powered Rental Search

A conversational rental search experience powered by Google Gemini. Users chat with an AI concierge ("Lumina") to find, evaluate, and apply for rental properties.

---

## Tech Stack

- **React 19** + TypeScript
- **Vite** (dev server & build)
- **Tailwind CSS v4** (CDN with `@tailwindcss/typography` plugin)
- **Framer Motion** (`motion/react`)
- **React Router v7**
- **Google Gemini API** (`@google/genai` — model: `gemini-3-pro-preview`)
- **Lucide React** (icons)
- **html-to-image** (profile card export)

---

## Getting Started

```bash
npm install
```

Create a `.env` file in the project root:

```env
API_KEY=your_gemini_api_key_here
```

```bash
npm run dev
```

> If `API_KEY` is missing or the Gemini API quota is exceeded, the app falls back to mock responses automatically.

---

## Implemented Features

### Conversational AI Search
- Natural language property search via Google Gemini with structured JSON output
- Concierge persona ("Lumina") with system prompt engineering
- Thinking budget configuration (32,768 tokens) for complex query reasoning
- Suggested reply chips for guided navigation
- **Stop button** to interrupt AI generation mid-response
- Fallback mock responses when API is unavailable or quota exceeded
- 60-second request timeout with graceful error handling
- `AbortController` support for cancellable requests

### Multi-Thread Chat
- Create, rename, and delete conversation threads
- Thread history persisted to `localStorage`
- Active thread highlighting in sidebar
- Reset conversation (clear current thread)

### Gamified Renter Profile
- Circular progress ring showing preference completion level
- Level system (Lv.1–5) with fun profile names (Casual Browser → Dream Home Hunter)
- 8 preference categories: Location, Budget, Bedrooms, Move-in, Amenities, Lifestyle, Pets, Commute
- Click unfilled categories to trigger AI-authored questions with quick-reply suggestions
- Expand filled categories to view details or remove preferences
- Celebration toast animation when new preferences are collected
- Download profile card as PNG image
- Preferences persisted to `localStorage`

### Property Search & Filtering
- Filter by location, price range, bedrooms, amenities, and property type
- Pseudo-match score based on amenity overlap
- 20 mock properties across 6 cities (Los Angeles, Seattle, New York, Chicago, Houston, Irvine)

### Property Sharing
- Share button on property detail modal
- Share modal with multiple channels: Copy link, Email, Message, native Web Share API
- Short display URLs (unitpulse.ai/p/{id})
- Portal-based modal rendering to avoid z-index stacking issues

### Chat UI States
| State | Description |
|---|---|
| `properties` | Search results carousel with match scores |
| `deep-dive` | Detailed single-property view |
| `application-form` | Multi-step application with ID upload flow |
| `contract` | Lease review and signing state |
| `move-in-checklist` | Post-lease move-in guidance |
| `style-analysis` | User preference analysis from external property links |
| `tour-scheduling` | Property tour scheduling state |

### Property Cards & Detail
- Image carousel with previous/next navigation
- Price, bedrooms, bathrooms, sqft, and amenities display
- Match percentage badge
- Tour scheduling modal
- Call property button
- Favorites toggle (heart icon)
- Responsive price footer (one-line on desktop with larger price)

### Favorites
- Toggle favorites from any property card
- Dedicated favorites page with full navigation header
- Favorites persisted to `localStorage`
- Login gate — unauthenticated favorites are queued and applied after login
- Favorites cleared on logout

### Authentication (Mock)
- Login modal with Google SSO button and email/password form
- Login/logout state with user dropdown menu
- No real backend — login always succeeds

### Landing Page
- Hero chatbox with autocomplete suggestions
- Tab-to-complete ghost text
- Dropdown suggestion menu (keyboard + mouse navigation)
- Property exploration grid filtered by city
- AI capabilities section
- FAQ accordion
- Floating draggable chat bubble (bottom-right)

### Blog
- Blog listing page with category filters
- Blog post page with full prose styling (`@tailwindcss/typography`)
- Sidebar with related posts and author info

### SEO & Content Pages
- FAQ page with structured data (JSON-LD) for search engines
- Rental Markets page with city-level rental data
- City-specific rental pages with neighborhood guides
- Privacy Policy page
- Terms of Service page

### Navigation & Shell
- Consistent header across all pages with scroll hide/show behavior
- Mobile hamburger drawer with full nav
- Toast notification system with action buttons
- Responsive split-pane layout on chat page (resizable desktop, tab-switch mobile)
- Footer with Resources, Company, and Legal sections

---

## Engineering TODOs

### High Priority — Backend Integration

- **Real property data source**: Replace `MOCK_PROPERTIES` in `constants.ts` with a live API. Candidate providers: RentCast, Zillow Bridge API, Apartments.com, or MLS IDX. The expected query contract is outlined in `services/propertyService.ts`.
- **Real authentication**: Login always succeeds with no backend validation. Needs JWT/session management, password hashing, and `isLoggedIn` persistence across page reloads. Consider Supabase Auth or Firebase Auth.
- **Favorites sync to backend**: Favorites are stored in `localStorage` and cleared on logout. Once auth is real, favorites need to be synced to a user account in a database.

### Medium Priority — Feature Completion

- **Style analysis**: The `style-analysis` chat state is wired in the system prompt and UI but has no actual implementation. Needs logic to parse external property links (Zillow, Apartments.com URLs) and extract style preferences.
- **Application form**: The `application-form` state renders a personal details step but ID upload, background check, and multi-step progression are UI-only stubs. Needs real file upload and background check API integration.
- **Contract state**: Lease document display, e-signature capture, and payment processing are not implemented.
- **Move-in checklist**: State is defined but checklist content and completion tracking are missing.
- **Tour scheduling**: State is defined but no calendar integration or booking confirmation exists.
- **Lifestyle comparison section**: The system prompt references a "Lifestyle Comparison" section for top match results but it is not rendered in the chat UI.
- **Short links**: Property share URLs display `unitpulse.ai/p/{id}` but no URL shortener service is implemented.

### Low Priority — Polish & Performance

- **Remove artificial mock delay**: `getMockResponse()` in `services/geminiService.ts` has a hardcoded 1,200ms delay to make the stop button testable in development. Remove before connecting a real API.
- **Lazy-load routes**: All routes are eagerly imported in `App.tsx`. Add `React.lazy()` + `Suspense` for code splitting.
- **Test suite**: No unit, integration, or E2E tests exist. Add Vitest + React Testing Library for components, and Playwright for critical flows.
- **Input sanitization**: User chat messages are sent to Gemini without sanitization.
- **Client-side rate limiting**: No throttle on rapid message sending.
- **Error differentiation**: API timeout and quota-exceeded errors are handled identically — quota errors should surface a clear user message.
- **Logo fallback**: `LOGO_URL` points to a hardcoded S3 URL with no fallback if the CDN is unavailable.
- **Blog content source**: Blog posts are hardcoded. Consider a headless CMS (Contentful, Sanity) or markdown-based system for editorial management.
- **Extract shared navigation**: Header and mobile menu are duplicated across 10+ page components. Extract into a reusable `PageHeader` component.
- **Add `.env.example`**: Document required environment variables for new contributors.

---

## Project Structure

```
/
├── pages/
│   ├── LandingPage.tsx        # Hero, property grid, FAQ, floating chat bubble
│   ├── ChatPage.tsx           # Chat layout, thread management, AI response handling
│   ├── PropertyPanel.tsx      # Sidebar property detail (nested route)
│   ├── PropertyDetailPage.tsx # Full-page property detail
│   ├── BlogPage.tsx           # Blog listing with category filters
│   ├── BlogPostPage.tsx       # Blog post with prose styling
│   ├── FAQPage.tsx            # FAQ with JSON-LD structured data
│   ├── RentalMarketsPage.tsx  # City rental market overview
│   ├── CityRentalPage.tsx     # City-specific rental guide
│   ├── PrivacyPage.tsx        # Privacy Policy
│   └── TermsPage.tsx          # Terms of Service
├── components/
│   ├── ChatInterface.tsx      # Chat UI, message list, stop button, input
│   ├── PropertyCard.tsx       # Property card with carousel and tour modal
│   ├── PropertyDetailsModal.tsx # Property detail modal with sharing
│   ├── RenterProfilePopover.tsx # Gamified preference profile with progress
│   ├── ContactFormModal.tsx   # Tour scheduling / contact form modal
│   ├── FavoritesPage.tsx      # Saved properties page
│   ├── PageFooter.tsx         # Shared footer component
│   └── Toast.tsx              # Toast notification system
├── services/
│   ├── geminiService.ts       # Gemini API integration + mock fallback
│   └── propertyService.ts     # Property data contract (pending real integration)
├── context/
│   └── AppContext.tsx         # Favorites, threads, preferences (localStorage-backed)
├── constants.ts               # MOCK_PROPERTIES database
└── types.ts                   # Shared TypeScript types
```
