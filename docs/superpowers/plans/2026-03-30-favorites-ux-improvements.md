# Favorites UX Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix six UX problems in the favorites feature: auth-gated nav, pending-favorite auto-save after login, `/favorites` deep-link route, toast feedback, uniform card sizing, and wider page layout.

**Architecture:** Add a `Toast` component for feedback; convert `FavoritesPage` from a state-driven overlay to a proper `/favorites` route; thread `pendingFavoriteProperty` through `AppShell` so login auto-completes a pending save; clean up nav duplication in `LandingPage` and `ChatPage`.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Framer Motion (`motion/react`), React Router v7, Vite (no test framework — verify visually in browser preview).

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `components/Toast.tsx` | **Create** | Animated slide-up toast with optional action button |
| `components/PropertyCard.tsx` | **Modify** | Remove `max-w-sm mx-auto` from root div |
| `components/FavoritesPage.tsx` | **Rewrite** | Route-based page; reads from context; 3-col grid; unfavorite toast |
| `App.tsx` | **Modify** | `/favorites` route; `pendingFavoriteProperty` state; auto-favorite on login; remove overlay |
| `pages/LandingPage.tsx` | **Modify** | Remove standalone heart; auth-gate nav; add `setPendingFavoriteProperty` prop |
| `pages/ChatPage.tsx` | **Modify** | Same nav + pending-favorite changes as `LandingPage` |

---

## Task 1: Create `Toast` Component

**Files:**
- Create: `components/Toast.tsx`

- [ ] **Step 1: Create the Toast component**

```tsx
// components/Toast.tsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export interface ToastData {
  message: string;
  subtext?: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 bg-black text-white px-5 py-3.5 rounded-2xl shadow-2xl min-w-[280px] max-w-sm"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-tight">{toast.message}</p>
            {toast.subtext && (
              <p className="text-xs text-white/60 mt-0.5">{toast.subtext}</p>
            )}
          </div>
          {toast.actionLabel && toast.onAction && (
            <button
              onClick={() => { toast.onAction!(); onDismiss(); }}
              className="text-xs font-bold text-[#a3c45e] whitespace-nowrap hover:text-[#c5e07a] transition-colors shrink-0"
            >
              {toast.actionLabel}
            </button>
          )}
          <button
            onClick={onDismiss}
            aria-label="Dismiss"
            className="p-0.5 text-white/40 hover:text-white transition-colors shrink-0"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
```

- [ ] **Step 2: Verify the file compiles**

```bash
npm run lint
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add components/Toast.tsx
git commit -m "feat: add Toast component for favorites feedback"
```

---

## Task 2: Fix Property Card Sizing

**Files:**
- Modify: `components/PropertyCard.tsx:31`

- [ ] **Step 1: Remove `max-w-sm mx-auto` from the root div**

In `components/PropertyCard.tsx`, line 31, change:

```tsx
className="group relative bg-white rounded-xl hover:shadow-xl transition-all duration-500 overflow-hidden border border-black/5 cursor-pointer h-full flex flex-col max-w-sm mx-auto"
```

to:

```tsx
className="group relative bg-white rounded-xl hover:shadow-xl transition-all duration-500 overflow-hidden border border-black/5 cursor-pointer h-full flex flex-col"
```

- [ ] **Step 2: Verify the file compiles**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/PropertyCard.tsx
git commit -m "fix: remove max-w-sm from PropertyCard so cards fill grid columns"
```

---

## Task 3: Rewrite `FavoritesPage` as a Routed Page

**Files:**
- Rewrite: `components/FavoritesPage.tsx`

This task replaces the overlay-based `FavoritesPage` with a standalone routed page. It reads data from context, navigates back on close, and shows a toast when a property is removed.

- [ ] **Step 1: Rewrite `components/FavoritesPage.tsx`**

```tsx
// components/FavoritesPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import PropertyCard from './PropertyCard';
import Toast, { ToastData } from './Toast';

const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppContext();
  const [toast, setToast] = useState<ToastData | null>(null);

  const handleToggleFavorite = (property: typeof favorites[0]) => {
    const isRemoving = favorites.some(p => p.id === property.id);
    toggleFavorite(property);
    if (isRemoving) {
      setToast({ message: 'Removed from Saved Homes' });
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#FCF9F8] font-sans">
      {/* Header */}
      <div className="sticky top-0 bg-[#FCF9F8]/90 backdrop-blur-sm border-b border-black/5 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-black font-heading tracking-tight text-black">
            Saved Homes {favorites.length > 0 && `(${favorites.length})`}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-32 h-32 bg-neutral-100 rounded-full flex items-center justify-center mb-8">
              <Heart size={48} className="text-neutral-300" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-black font-heading tracking-tight text-black mb-4">
              No saved homes yet.
            </h2>
            <p className="text-neutral-500 max-w-md mx-auto mb-8">
              When you find a home you love, click the heart icon to save it here for easy access later.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-[#4A5D23] text-white rounded-xl text-sm font-semibold hover:bg-[#3a4e1a] transition-all"
            >
              Start browsing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
                onClick={(p) => navigate(`/property/${p.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};

export default FavoritesPage;
```

- [ ] **Step 2: Verify the file compiles**

```bash
npm run lint
```

Expected: no TypeScript errors.

- [ ] **Step 3: Commit**

```bash
git add components/FavoritesPage.tsx
git commit -m "feat: convert FavoritesPage to routed page with context + unfavorite toast"
```

---

## Task 4: Update `App.tsx` — Route, Pending Favorite, Auto-Save Toast

**Files:**
- Modify: `App.tsx`

This task does four things:
1. Adds the `/favorites` route
2. Adds `pendingFavoriteProperty` state
3. Passes `setPendingFavoriteProperty` to `LandingPage` and `ChatPage`
4. Auto-favorites and shows a toast in `handleLogin` when a pending property exists
5. Removes the `showFavorites` overlay and `setShowFavorites` prop

- [ ] **Step 1: Add imports**

At the top of `App.tsx`, the existing imports already include `FavoritesPage`. Add `Toast` and `ToastData` and `Property`:

```tsx
import Toast, { ToastData } from './components/Toast';
import { Property } from './types';
```

- [ ] **Step 2: Replace `AppShell` state and handlers**

Inside `AppShell`, make these changes:

**Remove** `showFavorites` state:
```tsx
// DELETE this line:
const [showFavorites, setShowFavorites] = useState(false);
```

**Add** `pendingFavoriteProperty` and `toast` state after the existing state declarations:
```tsx
const [pendingFavoriteProperty, setPendingFavoriteProperty] = useState<Property | null>(null);
const [toast, setToast] = useState<ToastData | null>(null);
```

**Replace** `handleLogin` with:
```tsx
const handleLogin = () => {
  setIsLoggedIn(true);
  setShowLoginView(false);
  if (pendingFavoriteProperty) {
    toggleFavorite(pendingFavoriteProperty);
    setPendingFavoriteProperty(null);
    setToast({
      message: 'Saved to Favorites',
      subtext: 'Find it in your account menu',
      actionLabel: 'View Saved Homes →',
      onAction: () => navigate('/favorites'),
    });
  }
};
```

- [ ] **Step 3: Add the `/favorites` route and remove the overlay**

**Remove** the entire `AnimatePresence` overlay block (currently lines ~113–126):
```tsx
// DELETE this entire block:
<AnimatePresence>
  {showFavorites && (
    <FavoritesPage
      favorites={favorites}
      onToggleFavorite={toggleFavorite}
      onPropertyClick={(property) => {
        setShowFavorites(false);
        navigate(`/property/${property.id}`);
      }}
      onClose={() => setShowFavorites(false)}
    />
  )}
</AnimatePresence>
```

**Add** `<Toast>` render just before `<Routes>`:
```tsx
<Toast toast={toast} onDismiss={() => setToast(null)} />
```

**Add** the `/favorites` route inside `<Routes>`:
```tsx
<Route path="/favorites" element={<FavoritesPage />} />
```

- [ ] **Step 4: Update `LandingPage` and `ChatPage` props**

Replace the `setShowFavorites` prop with `setPendingFavoriteProperty` in both route renders:

```tsx
// LandingPage route — replace setShowFavorites={setShowFavorites} with:
<LandingPage
  isLoggedIn={isLoggedIn}
  isDropdownOpen={isDropdownOpen}
  setIsDropdownOpen={setIsDropdownOpen}
  setShowLoginView={setShowLoginView}
  setPendingFavoriteProperty={setPendingFavoriteProperty}
  handleLogout={handleLogout}
/>
```

```tsx
// ChatPage route — replace setShowFavorites={setShowFavorites} with:
<ChatPage
  isLoggedIn={isLoggedIn}
  setShowLoginView={setShowLoginView}
  setPendingFavoriteProperty={setPendingFavoriteProperty}
/>
```

- [ ] **Step 5: Verify the file compiles**

```bash
npm run lint
```

Expected: TypeScript will flag prop-type mismatches in `LandingPage` and `ChatPage` — that's expected and will be resolved in Tasks 5 and 6.

- [ ] **Step 6: Commit**

```bash
git add App.tsx
git commit -m "feat: add /favorites route, pendingFavoriteProperty, auto-save toast on login"
```

---

## Task 5: Update `LandingPage` Nav

**Files:**
- Modify: `pages/LandingPage.tsx`

- [ ] **Step 1: Update the props interface**

Replace the `LandingPageProps` interface:

```tsx
interface LandingPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  setPendingFavoriteProperty: (p: Property | null) => void;
  handleLogout: () => void;
}
```

Update the destructuring in the component signature:

```tsx
const LandingPage: React.FC<LandingPageProps> = ({
  isLoggedIn,
  isDropdownOpen,
  setIsDropdownOpen,
  setShowLoginView,
  setPendingFavoriteProperty,
  handleLogout,
}) => {
```

- [ ] **Step 2: Update `handleToggleFavorite`**

Replace the existing `handleToggleFavorite` function:

```tsx
const handleToggleFavorite = (property: Property) => {
  if (!isLoggedIn) {
    setPendingFavoriteProperty(property);
    setShowLoginView(true);
    return;
  }
  toggleFavorite(property);
};
```

- [ ] **Step 3: Add `useNavigate` usage**

`useNavigate` is already imported. Add the hook call near the top of the component (it's already there via `const navigate = useNavigate()`).

- [ ] **Step 4: Remove standalone heart from desktop nav**

In the desktop `<nav>` (around line 197–245), **delete** this button entirely:

```tsx
// DELETE this block:
<button
  onClick={() => setShowFavorites(true)}
  aria-label="View saved homes"
  className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors"
>
  <Heart size={20} />
  {favorites.length > 0 && (
    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#4A5D23] text-white text-[9px] font-black rounded-full flex items-center justify-center">
      {favorites.length}
    </span>
  )}
</button>
```

- [ ] **Step 5: Update the user dropdown to navigate to `/favorites` and add a count badge**

Replace the existing "Favorites" dropdown button:

```tsx
// REPLACE:
<button
  onClick={() => { setShowFavorites(true); setIsDropdownOpen(false); }}
  className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2"
>
  <Heart size={16} /> Favorites
</button>

// WITH:
<button
  onClick={() => { navigate('/favorites'); setIsDropdownOpen(false); }}
  className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2"
>
  <Heart size={16} />
  Saved Homes
  {favorites.length > 0 && (
    <span className="ml-auto w-5 h-5 bg-[#4A5D23] text-white text-[10px] font-black rounded-full flex items-center justify-center">
      {favorites.length}
    </span>
  )}
</button>
```

- [ ] **Step 6: Auth-gate "Saved Homes" in the mobile sidebar**

In the mobile sidebar section, find the "Saved Homes" button and wrap it with `{isLoggedIn && (…)}`:

```tsx
{isLoggedIn && (
  <button
    onClick={() => { navigate('/favorites'); setIsHistoryOpen(false); }}
    className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium w-full text-left"
  >
    <Heart size={20} className="text-neutral-400" />
    Saved Homes
    {favorites.length > 0 && (
      <span className="ml-auto w-5 h-5 bg-[#4A5D23] text-white text-[10px] font-black rounded-full flex items-center justify-center">
        {favorites.length}
      </span>
    )}
  </button>
)}
```

- [ ] **Step 7: Remove unused `setShowFavorites` references**

Search the file for any remaining `setShowFavorites` references and delete them.

```bash
grep -n "setShowFavorites\|showFavorites" pages/LandingPage.tsx
```

Expected: no results.

- [ ] **Step 8: Verify the file compiles**

```bash
npm run lint
```

Expected: no errors.

- [ ] **Step 9: Commit**

```bash
git add pages/LandingPage.tsx
git commit -m "feat: auth-gate favorites nav in LandingPage, use /favorites route"
```

---

## Task 6: Update `ChatPage` Nav

**Files:**
- Modify: `pages/ChatPage.tsx`

- [ ] **Step 1: Update the props interface**

Find the `ChatPageProps` interface and replace `setShowFavorites` with `setPendingFavoriteProperty`:

```tsx
interface ChatPageProps {
  isLoggedIn: boolean;
  setShowLoginView: (v: boolean) => void;
  setPendingFavoriteProperty: (p: Property | null) => void;
}
```

Update the destructuring:

```tsx
const ChatPage: React.FC<ChatPageProps> = ({ isLoggedIn, setShowLoginView, setPendingFavoriteProperty }) => {
```

- [ ] **Step 2: Update `handleToggleFavorite`**

Find the `handleToggleFavorite` function in `ChatPage` and replace it:

```tsx
const handleToggleFavorite = (property: Property) => {
  if (!isLoggedIn) {
    setPendingFavoriteProperty(property);
    setShowLoginView(true);
    return;
  }
  toggleFavorite(property);
};
```

- [ ] **Step 3: Remove standalone heart from desktop nav**

In the desktop `<nav>`, **delete** the heart button (same pattern as LandingPage Task 5 Step 4):

```tsx
// DELETE this block:
<button
  onClick={() => setShowFavorites(true)}
  aria-label="View saved homes"
  className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors"
>
  <Heart size={20} />
  {favorites.length > 0 && (
    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#4A5D23] text-white text-[9px] font-black rounded-full flex items-center justify-center">
      {favorites.length}
    </span>
  )}
</button>
```

- [ ] **Step 4: Update the user dropdown to navigate to `/favorites` with count badge**

```tsx
// REPLACE:
<button
  onClick={() => { setShowFavorites(true); setIsDropdownOpen(false); }}
  className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2"
>
  <Heart size={16} /> Favorites
</button>

// WITH:
<button
  onClick={() => { navigate('/favorites'); setIsDropdownOpen(false); }}
  className="w-full text-left px-4 py-2 text-sm font-medium hover:bg-neutral-50 flex items-center gap-2"
>
  <Heart size={16} />
  Saved Homes
  {favorites.length > 0 && (
    <span className="ml-auto w-5 h-5 bg-[#4A5D23] text-white text-[10px] font-black rounded-full flex items-center justify-center">
      {favorites.length}
    </span>
  )}
</button>
```

- [ ] **Step 5: Auth-gate "Saved Homes" in the mobile sidebar**

Same as LandingPage Task 5 Step 6 — wrap the mobile sidebar "Saved Homes" button:

```tsx
{isLoggedIn && (
  <button
    onClick={() => { navigate('/favorites'); setIsHistoryOpen(false); }}
    className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 text-neutral-700 transition-colors font-medium w-full text-left"
  >
    <Heart size={20} className="text-neutral-400" />
    Saved Homes
    {favorites.length > 0 && (
      <span className="ml-auto w-5 h-5 bg-[#4A5D23] text-white text-[10px] font-black rounded-full flex items-center justify-center">
        {favorites.length}
      </span>
    )}
  </button>
)}
```

- [ ] **Step 6: Remove any remaining `setShowFavorites` / `showFavorites` references**

```bash
grep -n "setShowFavorites\|showFavorites" pages/ChatPage.tsx
```

Expected: no results.

- [ ] **Step 7: Verify the full project compiles**

```bash
npm run lint
```

Expected: no TypeScript errors across all files.

- [ ] **Step 8: Commit**

```bash
git add pages/ChatPage.tsx
git commit -m "feat: auth-gate favorites nav in ChatPage, use /favorites route"
```

---

## Task 7: Visual Verification

- [ ] **Step 1: Confirm the dev server is running and take a screenshot**

Open the app and check the landing page header — there should be no heart icon when logged out.

- [ ] **Step 2: Test the logged-out favoriting flow**

1. Click the heart on any property card → login modal should appear
2. Click "Continue with Google" or "Sign In" → you should be logged in
3. The property should be auto-saved, and a toast should appear: "Saved to Favorites" with "View Saved Homes →" action
4. Clicking "View Saved Homes →" should navigate to `/favorites`

- [ ] **Step 3: Test the favorites page**

1. Navigate to `/favorites` directly in the address bar — page should load
2. Cards should fill their grid columns evenly (3 columns on large screens)
3. Hover/click a card — should work normally
4. Click the heart on a card to remove it — "Removed from Saved Homes" toast should appear
5. Click the back arrow — should navigate back

- [ ] **Step 4: Test the logged-in nav**

1. Log in, click the user avatar → dropdown should show "Saved Homes" with a count badge if favorites exist
2. No duplicate heart icon in the top nav bar
3. Open the mobile menu — "Saved Homes" should appear only when logged in

- [ ] **Step 5: Final lint + commit**

```bash
npm run lint
git add -A
git commit -m "chore: verify favorites UX improvements complete"
```
