# URL Routing Design — Lumina AI Rental Search

**Date:** 2026-03-27
**Status:** Draft
**Scope:** Add client-side URL routing via React Router DOM v6
**Prerequisite:** `react-router-dom` is not currently installed — must be added (`npm install react-router-dom`)

---

## 1. Problem

The app currently uses conditional rendering to switch between views (landing, chat, property detail) with no URL changes. This means:

- Refreshing the page always resets to the landing view
- Chat sessions and property detail pages cannot be bookmarked or shared
- Browser back/forward navigation does not work across views

---

## 2. URL Structure

| URL | View |
|---|---|
| `/` | Landing page |
| `/search` | Redirects to `/search/:newChatId` (creates a new UUID chat session) |
| `/search/:chatId` | Chat session |
| `/search/:chatId/property/:propertyId` | Chat session + property detail panel (split view) |
| `/property/:propertyId` | Standalone property detail (no chat context) |

### Design decisions

- **`/search` redirect**: When a user submits a query from the landing page or clicks a suggestion chip, the app navigates to `/search` first, which immediately creates a UUID and redirects to `/search/:chatId`. The initial query is passed via `state` in the `navigate()` call so `ChatPage` can auto-send it on mount. If `ChatPage` mounts without `location.state.query` (direct URL visit or refresh), it renders an empty chat with no auto-send — the user simply sees a blank conversation ready for input.
- **Nested property route under chat**: Property detail opened from within a chat renders as a split panel alongside the conversation (`/search/:chatId/property/:propertyId`). Closing the panel navigates back to `/search/:chatId`. Chat context is fully preserved.
- **Standalone property route**: `/property/:propertyId` is for direct links and shares. No chat panel shown. Uses the same `PropertyDetailsModal` in non-inline mode.

---

## 3. Architecture

### Router setup

React Router DOM v6 `BrowserRouter` wraps the app at the root level in `index.tsx`. `App.tsx` becomes the router shell with `<Routes>`.

```
BrowserRouter (index.tsx)
└── App.tsx (Routes)
    ├── /                              → <LandingPage>
    ├── /search                        → <SearchRedirect> (creates UUID, redirects)
    ├── /search/:chatId                → <ChatPage> (renders <Outlet> for child route)
    │   └── property/:propertyId      → <PropertyPanel> (renders inside ChatPage split view)
    └── /property/:propertyId         → <PropertyDetailPage>
```

**`ChatPage` and `PropertyPanel`:** `ChatPage` always renders the chat column. It also renders `<Outlet>` in a side panel slot. When the nested `property/:propertyId` route is matched, React Router renders `<PropertyPanel>` into that `<Outlet>`, showing the split view. When the nested route is not matched, the `<Outlet>` renders nothing and the full-width chat layout is shown.

### Page components (new files)

| File | Description |
|---|---|
| `pages/LandingPage.tsx` | Extracted landing view from App.tsx |
| `pages/ChatPage.tsx` | Chat session view; renders `<Outlet>` for property panel |
| `pages/PropertyPanel.tsx` | Property detail panel rendered inside ChatPage split view (new) |
| `pages/PropertyDetailPage.tsx` | Standalone property page — no chat context (new, thin wrapper) |
| `pages/SearchRedirect.tsx` | Creates UUID + redirects to `/search/:chatId`; initializes empty thread in context (new, ~15 lines) |

**Thread initialization:** `SearchRedirect` creates the UUID, calls `addThread(newId)` on the `AppContext` to register an empty thread in `allThreads`, then redirects to `/search/:newId`. `ChatPage` reads from `allThreads[chatId]` on mount. If `allThreads[chatId]` is missing (e.g., stale link), `ChatPage` redirects to `/` rather than crashing.

All existing components (`PropertyCard`, `ChatInterface`, `PropertyDetailsModal`, `FavoritesPage`, etc.) remain unchanged.

**`FavoritesPage`:** Intentionally has no URL route. It continues to render as a full-screen overlay triggered by the heart icon in the nav, with no URL change. This is consistent with its current modal-like behavior.

**`PropertyPanel` vs `PropertyDetailPage`:** `PropertyDetailsModal` already accepts an `isInline` prop (existing interface, no change needed). `PropertyPanel` wraps it with `isInline={true}` — split-view inside a chat session. `PropertyDetailPage` wraps it with `isInline={false}` — standalone full-screen view for direct links. The `close` handler in `PropertyPanel` calls `navigate('/search/' + chatId)`. The `close` handler in `PropertyDetailPage` calls `navigate(-1)` if history exists, else `navigate('/')`.

**Browser back/forward:** React Router handles this natively. `ChatPage` requires no unmount cleanup — threads remain in context and localStorage regardless of navigation direction.

---

## 4. State Management

### What changes

| State | Before | After |
|---|---|---|
| `currentThreadId` | `useState` in App.tsx | Derived via `const { chatId } = useParams()` in ChatPage |
| `selectedProperty` | `useState` in App.tsx | Derived via `const { propertyId } = useParams()` in PropertyPanel |
| `isFavoritesOpen` | `useState` in App.tsx | Stays as local state in App.tsx (no route needed) |

### What stays the same

| State | Location | Notes |
|---|---|---|
| `allThreads` | App.tsx → React Context + localStorage | Threads map (id → {messages, title}) — persisted (see below) |
| `favorites` | App.tsx → React Context | Unchanged |
| `messages` per thread | Inside `allThreads[chatId].messages` | Unchanged data structure |

`allThreads` and `favorites` are lifted into a lightweight React context (`AppContext`) so `ChatPage`, `LandingPage`, and `PropertyDetailPage` can all access them without prop-drilling through the router.

### `allThreads` persistence

`allThreads` is persisted to `localStorage` so chat history survives page refresh. App.tsx initializes from `localStorage` on mount and writes back on every change via a `useEffect`. This closes the loop on the bookmarking/sharing goal: a user can bookmark `/search/:chatId`, refresh, and see their conversation restored.

**Initial query flow:**
1. `SearchRedirect` creates a UUID and calls `addThread(newId)` with an empty thread, then redirects to `/search/:newId` passing `location.state.query`
2. `ChatPage` mounts, reads `location.state.query`, auto-sends it to the AI, and stores the resulting message in `allThreads[chatId].messages`
3. From this point, the thread is in `allThreads` and persisted to `localStorage` — a refresh restores the full conversation

If `ChatPage` mounts without `location.state` (direct URL visit, new tab, or bookmark), `location.state` must be null-checked before accessing `.query`: `const query = location.state?.query`. No auto-send occurs and the user sees an empty chat ready for input. If `allThreads[chatId]` is missing entirely (stale/invalid UUID), `ChatPage` redirects to `/`.

---

## 5. Navigation Triggers

| User action | Navigation |
|---|---|
| Landing search submit | `navigate('/search', { state: { query } })` |
| Suggestion chip click | `navigate('/search', { state: { query: chip.query } })` |
| Sidebar thread click | `navigate('/search/' + threadId)` |
| New chat button | `navigate('/search')` |
| Property card click (in chat) | `navigate('./property/' + propertyId)` (relative) |
| Property panel close (in chat) | `navigate('/search/' + chatId)` (absolute, avoids v6 relative nav ambiguity) |
| Submit new message in existing chat | No navigation — messages append in place at `/search/:chatId` |
| Property card click (standalone) | `navigate('/property/' + propertyId)` |
| Property standalone close | `navigate(-1)` if history exists, else `navigate('/')` |

---

## 6. Vite Config

Vite's dev server handles SPA routing natively — all unmatched paths already serve `index.html` in dev mode. No additional config is needed for development.

The existing `vite.config.ts` already sets `port: 3000`. No changes required.

For production deployments, the hosting platform must be configured to rewrite all paths to `index.html` (e.g., Netlify `_redirects`, Vercel `rewrites`). This is out of scope for this change.

---

## 7. Nav Background Fix (bundled)

The chat view header currently uses `bg-[#f5f4f0]` when scrolled to top, but the chat content background is `bg-[#FCF9F8]`. Fix: unify all background surfaces to `#FCF9F8`. The outer container and header `isAtTop` state both update to `bg-[#FCF9F8]`.

---

## 8. Out of Scope

- Server-side rendering
- URL persistence for filter/search state (query params)
- Authentication-gated routes
- Production hosting configuration
