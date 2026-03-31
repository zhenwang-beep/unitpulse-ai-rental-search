# Favorites UX Improvements — Design Spec

**Date:** 2026-03-30
**Status:** Approved

---

## Background

The favorites feature has six UX problems:
1. The heart nav icon shows for all users regardless of auth state
2. When logged in, favorites appears in two places (standalone heart + user dropdown)
3. After the login-to-favorite prompt, the pending property is forgotten — no auto-favorite, no feedback
4. The favorites page has no dedicated URL (overlay-only, no deep linking)
5. Property cards are constrained to `max-w-sm` inside the favorites grid — inconsistent sizing
6. Unfavoriting a property gives no feedback

---

## Design Decisions

### 1. Favorites Nav — Dropdown Only, Auth-Gated

**Problem:** The standalone heart icon in the top nav renders for all users and duplicates the "Favorites" entry already in the user dropdown.

**Decision:** Remove the standalone heart icon from the nav bar entirely. Favorites is accessible only through the user dropdown when logged in. When not logged in, there is no favorites entry point in the nav.

- Logged out: Login button only (no heart icon, no favorites)
- Logged in: User avatar → dropdown → "Saved Homes" (with count badge)
- Mobile sidebar: "Saved Homes" item is hidden when not logged in

**Rationale:** Consolidating to a single entry point eliminates duplication and aligns with the pattern that saved/personalized features live behind the user account.

---

### 2. Pending Favorite + Auto-Favorite After Login

**Problem:** When a logged-out user clicks the heart on a property, they're redirected to login. After login, the original intent (saving that property) is silently lost.

**Decision:**

- Add `pendingFavoriteProperty: Property | null` state to `AppShell` (App.tsx)
- Pass `setPendingFavoriteProperty` as a prop to `LandingPage` and `ChatPage`
- In each page's `handleToggleFavorite`: set the pending property before calling `setShowLoginView(true)`
- In `handleLogin` (AppShell): after setting `isLoggedIn = true`, check if `pendingFavoriteProperty` is set → call `toggleFavorite(pendingFavoriteProperty)` → clear pending → show success toast

**Toast on auto-favorite:**
- Message: "Saved to Favorites"
- Sub-text: "Find it in your account menu"
- Action button: "View Saved Homes →" navigates to `/favorites`
- Auto-dismisses after 4 seconds
- The count badge in the user dropdown animates with a spring scale-in

---

### 3. Favorites Page URL — `/favorites` Route

**Problem:** FavoritesPage is a full-screen overlay with no URL. It cannot be bookmarked, shared, or navigated to directly (violates deep-linking principle).

**Decision:**

- Add `<Route path="/favorites" element={<FavoritesPage />} />` to the router in App.tsx
- `FavoritesPage` reads `favorites` and `toggleFavorite` directly from `useAppContext()` — no more props needed from AppShell
- Replace all `setShowFavorites(true)` call sites with `navigate('/favorites')`
- Remove `showFavorites` state and the `AnimatePresence` overlay block from AppShell
- The close button on FavoritesPage calls `navigate(-1)` to go back

---

### 4. Toast Component

**Problem:** No toast/snackbar system exists. Needed for both "Saved to Favorites" (issue 3) and "Removed from Saved Homes" (issue 6).

**Decision:** Create `components/Toast.tsx` — a lightweight self-contained component using Framer Motion.

- Slides up from bottom-center, auto-dismisses after 4 seconds
- Accepts: `message`, `subtext?`, `actionLabel?`, `onAction?`, `onDismiss`
- Uses `AnimatePresence` for enter/exit
- Toast is managed via a `toast` state object in the relevant parent component (not a global context)
- `FavoritesPage` manages its own toast state for "Removed" feedback
- `AppShell` manages toast state for "Saved" feedback post-login

---

### 5. Property Card Sizing in Favorites

**Problem:** `PropertyCard` root div has `max-w-sm mx-auto` which caps cards at 384px regardless of the grid column width. In a 2-column grid the columns are ~496px wide — wasted space, misaligned.

**Decision:** Remove `max-w-sm mx-auto` from `PropertyCard`'s root div. Cards should fill their grid cell width, not center at a fixed max.

---

### 6. Favorites Page Layout

**Problem:** `FavoritesPage` uses `max-w-5xl` container with 2-column grid. On large screens this under-uses horizontal space and the `p-8` padding is inconsistent with app-wide layout conventions.

**Decision:**
- Container: `max-w-7xl mx-auto`
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- Padding: `px-6 md:px-10 py-8` for consistent spacing
- Keep the existing empty state design (centered icon + text)

---

## Files Changed

| File | Change |
|------|--------|
| `App.tsx` | Add `/favorites` route; add `pendingFavoriteProperty` state; pass setter to children; auto-favorite + toast in `handleLogin`; remove `showFavorites` overlay |
| `components/FavoritesPage.tsx` | Convert to routed page; read from context; update layout (`max-w-7xl`, 3-col grid); close → `navigate(-1)`; add unfavorite toast |
| `components/Toast.tsx` | New component: animated slide-up toast with optional action button |
| `components/PropertyCard.tsx` | Remove `max-w-sm mx-auto` from root div |
| `pages/LandingPage.tsx` | Remove standalone heart from nav; hide "Saved Homes" in mobile sidebar when not logged in; accept + use `setPendingFavoriteProperty` prop |
| `pages/ChatPage.tsx` | Same nav + pending favorite changes as LandingPage |

---

## Out of Scope

- Backend persistence of favorites (remains localStorage-only)
- Notification/email when saved properties change
- Favorites count in page `<title>` or browser tab
