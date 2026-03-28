# URL Routing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add React Router DOM v6 URL routing so chat sessions and property detail pages are deep-linkable, bookmarkable, and survive page refresh.

**Architecture:** Install React Router DOM v6, wrap the app in `BrowserRouter`, create `AppContext` for shared state (`allThreads` + `favorites` persisted to localStorage), and extract the three main views (landing, chat, standalone property) into page components. The existing chat+property split view becomes a nested route (`/search/:chatId/property/:propertyId`), keeping chat context alive while browsing property detail.

**Tech Stack:** React 19, React Router DOM v7 (v7.13.2 — all v6 APIs available), TypeScript, Tailwind CSS, Vite 6

**Spec:** `docs/superpowers/specs/2026-03-27-url-routing-design.md`

---

## File Map

### New files
| File | Responsibility |
|---|---|
| `context/AppContext.tsx` | Global context: `allThreads`, `favorites`, `addThread`, `updateThread`, `toggleFavorite` + localStorage persistence |
| `pages/SearchRedirect.tsx` | Creates UUID thread, calls `addThread`, redirects to `/search/:chatId` with query in state |
| `pages/LandingPage.tsx` | Landing view extracted from App.tsx (lines 582–1115) |
| `pages/ChatPage.tsx` | Chat view extracted from App.tsx (lines 1117–2178); reads `chatId` from `useParams`; renders `<Outlet>` for property panel |
| `pages/PropertyPanel.tsx` | Wraps `PropertyDetailsModal` with `isInline={true}`; close navigates to `/search/:chatId` |
| `pages/PropertyDetailPage.tsx` | Wraps `PropertyDetailsModal` with `isInline={false}`; close navigates back or to `/` |

### Modified files
| File | Change |
|---|---|
| `index.tsx` | Wrap `<App>` with `<BrowserRouter>` |
| `App.tsx` | Become router shell: define `<Routes>`, wrap with `AppContextProvider`, remove view conditional rendering; keep login view logic |
| `package.json` | Add `react-router-dom` |

### Unchanged files
All components in `components/` — `PropertyCard`, `ChatInterface`, `PropertyDetailsModal`, `FavoritesPage`, `LiveInterface`, etc.

---

## Task 1: Install react-router-dom

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install the package**

```bash
cd /Users/wangzhen/Documents/unitpulse-ai-rental-search
npm install react-router-dom
```

Expected: `react-router-dom` added to `dependencies` in `package.json`. No errors.

- [ ] **Step 2: Verify TypeScript types are included**

```bash
ls node_modules/react-router-dom/dist/index.d.ts
```

Expected: file exists (types ship with the package, no `@types/react-router-dom` needed).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install react-router-dom v6"
```

---

## Task 2: Create AppContext

**Files:**
- Create: `context/AppContext.tsx`

AppContext holds `allThreads` and `favorites`, persists them to localStorage, and exposes `addThread`, `updateThread`, and `toggleFavorite`.

The existing `allThreads` type in App.tsx is `Record<string, ChatMessage[]>`. We extend it to store a title too:

```ts
type Thread = { messages: ChatMessage[]; title: string };
type AllThreads = Record<string, Thread>;
```

- [ ] **Step 1: Create `context/AppContext.tsx`**

```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, Property } from '../types';

type Thread = { messages: ChatMessage[]; title: string };
type AllThreads = Record<string, Thread>;

interface AppContextValue {
  allThreads: AllThreads;
  addThread: (id: string, title?: string) => void;
  updateThread: (id: string, updater: (prev: ChatMessage[]) => ChatMessage[]) => void;
  favorites: Property[];
  toggleFavorite: (property: Property) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = 'unitpulse_threads';
const FAV_STORAGE_KEY = 'unitpulse_favorites';

function loadThreads(): AllThreads {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function loadFavorites(): Property[] {
  try {
    const raw = localStorage.getItem(FAV_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allThreads, setAllThreads] = useState<AllThreads>(loadThreads);
  const [favorites, setFavorites] = useState<Property[]>(loadFavorites);

  // Persist allThreads to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allThreads));
  }, [allThreads]);

  // Persist favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addThread = (id: string, title = 'New Chat') => {
    setAllThreads(prev => {
      if (prev[id]) return prev; // Don't overwrite existing thread
      return { ...prev, [id]: { messages: [], title } };
    });
  };

  const updateThread = (id: string, updater: (prev: ChatMessage[]) => ChatMessage[]) => {
    setAllThreads(prev => {
      const current = prev[id]?.messages || [];
      return {
        ...prev,
        [id]: { ...prev[id], messages: updater(current) }
      };
    });
  };

  const toggleFavorite = (property: Property) => {
    setFavorites(prev =>
      prev.find(p => p.id === property.id)
        ? prev.filter(p => p.id !== property.id)
        : [...prev, property]
    );
  };

  return (
    <AppContext.Provider value={{ allThreads, addThread, updateThread, favorites, toggleFavorite }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppContextProvider');
  return ctx;
};
```

- [ ] **Step 2: Verify the file compiles**

```bash
cd /Users/wangzhen/Documents/unitpulse-ai-rental-search
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors related to `context/AppContext.tsx`.

- [ ] **Step 3: Commit**

```bash
git add context/AppContext.tsx
git commit -m "feat: add AppContext with allThreads and favorites persistence"
```

---

## Task 3: Create SearchRedirect

**Files:**
- Create: `pages/SearchRedirect.tsx`

`SearchRedirect` generates a UUID, creates an empty thread via `addThread`, then immediately redirects to `/search/:chatId` passing the query in navigation state.

- [ ] **Step 1: Create `pages/SearchRedirect.tsx`**

`addThread` must be called synchronously before the redirect renders — using a ref guard ensures it fires exactly once even in React StrictMode's double-invoke.

```tsx
import React, { useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const SearchRedirect: React.FC = () => {
  const { addThread } = useAppContext();
  const location = useLocation();
  const query = (location.state as { query?: string } | null)?.query;

  // Generate and register the thread synchronously — ref prevents double-creation in StrictMode
  const chatIdRef = useRef<string | null>(null);
  if (!chatIdRef.current) {
    chatIdRef.current = generateId();
    addThread(chatIdRef.current);
  }

  return (
    <Navigate
      to={`/search/${chatIdRef.current}`}
      state={{ query }}
      replace
    />
  );
};

export default SearchRedirect;
```

- [ ] **Step 2: Verify compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add pages/SearchRedirect.tsx
git commit -m "feat: add SearchRedirect to create UUID chat session and redirect"
```

---

## Task 4: Create PropertyPanel

**Files:**
- Create: `pages/PropertyPanel.tsx`

`PropertyPanel` reads `propertyId` and `chatId` from URL params, looks up the property from `MOCK_PROPERTIES`, and renders `PropertyDetailsModal` in inline mode.

- [ ] **Step 1: Create `pages/PropertyPanel.tsx`**

```tsx
import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { MOCK_PROPERTIES } from '../constants';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { useAppContext } from '../context/AppContext';

const PropertyPanel: React.FC = () => {
  const { chatId, propertyId } = useParams<{ chatId: string; propertyId: string }>();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppContext();

  const property = MOCK_PROPERTIES.find(p => p.id === propertyId) ?? null;
  const isFavorite = favorites.some(f => f.id === propertyId);

  // Use declarative redirect — never call navigate() during render
  if (!property) {
    return <Navigate to={`/search/${chatId}`} replace />;
  }

  return (
    <PropertyDetailsModal
      property={property}
      onClose={() => navigate(`/search/${chatId}`)}
      isFavorite={isFavorite}
      onToggleFavorite={(id) => {
        const prop = MOCK_PROPERTIES.find(p => p.id === id);
        if (prop) toggleFavorite(prop);
      }}
      isInline={true}
    />
  );
};

export default PropertyPanel;
```

- [ ] **Step 2: Verify compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add pages/PropertyPanel.tsx
git commit -m "feat: add PropertyPanel for inline property detail in chat split view"
```

---

## Task 5: Create PropertyDetailPage

**Files:**
- Create: `pages/PropertyDetailPage.tsx`

Standalone full-page property view — no chat context. Used for direct links at `/property/:propertyId`.

- [ ] **Step 1: Create `pages/PropertyDetailPage.tsx`**

```tsx
import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { MOCK_PROPERTIES } from '../constants';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import { useAppContext } from '../context/AppContext';

const PropertyDetailPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppContext();

  const property = MOCK_PROPERTIES.find(p => p.id === propertyId) ?? null;
  const isFavorite = favorites.some(f => f.id === propertyId);

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Use declarative redirect — never call navigate() during render
  if (!property) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm">
      <PropertyDetailsModal
        property={property}
        onClose={handleClose}
        isFavorite={isFavorite}
        onToggleFavorite={(id) => {
          const prop = MOCK_PROPERTIES.find(p => p.id === id);
          if (prop) toggleFavorite(prop);
        }}
        isInline={false}
      />
    </div>
  );
};

export default PropertyDetailPage;
```

- [ ] **Step 2: Verify compiles**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add pages/PropertyDetailPage.tsx
git commit -m "feat: add PropertyDetailPage for standalone deep-linked property view"
```

---

## Task 6: Extract LandingPage

**Files:**
- Create: `pages/LandingPage.tsx`
- Modify: `App.tsx` (remove landing view block)

The landing view currently lives in `App.tsx` from the `// --- LANDING VIEW ---` comment (line 582) to the closing `}` at line 1115. Extract it into `pages/LandingPage.tsx`.

**Key changes when extracting:**
- Replace `handleSendMessage(query)` in `handleLandingSubmit` with `navigate('/search', { state: { query: landingInput } })`
- Replace chip click handler (currently calls `handleSendMessage(chip.query)`) with `navigate('/search', { state: { query: chip.query } })`
- The extracted component receives `isLoggedIn`, `isDropdownOpen`, `setIsDropdownOpen`, `setShowLoginView`, `setShowFavorites`, `handleLogout`, `favorites`, `toggleFavorite` as props — OR accesses `favorites` and `toggleFavorite` from `useAppContext()`
- Use `useNavigate()` from react-router-dom for navigation

- [ ] **Step 1: Create `pages/LandingPage.tsx`**

Copy the body of the `// --- LANDING VIEW ---` return block from `App.tsx` (lines 582–1115) into a new component `LandingPage`. The component signature:

```tsx
interface LandingPageProps {
  isLoggedIn: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (v: boolean) => void;
  setShowLoginView: (v: boolean) => void;
  setShowFavorites: (v: boolean) => void;
  handleLogout: () => void;
  showFavorites: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ ... }) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useAppContext();
  // ... all local state from the landing block (landingInput, landingGhostText, etc.)

  const handleLandingSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!landingInput.trim()) return;
    navigate('/search', { state: { query: landingInput } });
  };

  // chip click:
  // navigate('/search', { state: { query: chip.query } });

  // ... rest of component
};
```

State to keep local to `LandingPage` (not in context):
- `landingInput`, `landingGhostText`, `isLandingFocused`, `placeholderIndex`
- `landingVisibleCount`
- `isHeaderVisible`, `lastScrollY`, `lastScrollTarget`, `isAtTop`
- `isLiveMode` — `LiveInterface` overlay on the landing page has its own local `isLiveMode` state

- [ ] **Step 2: Remove the landing view block from App.tsx**

In `App.tsx`, delete the entire `// --- LANDING VIEW ---` section (lines 582–1115) — the entire `if (messages.length === 0 && !selectedProperty) { return (...) }` block.

Also remove from `App.tsx` the state variables that have moved to `LandingPage`:
- `landingInput`, `landingGhostText`, `isLandingFocused`, `placeholderIndex`, `landingVisibleCount`
- `loadMoreRef`, `landingInputRef`
- `handleLandingSubmit`, `handleLandingInput`, `handleLandingKeyDown`

Note: `isLiveMode` appears in **both** the landing view (lines 590–596) and the chat view (lines 1121–1127). It must become **independent local state** in both `LandingPage` and `ChatPage` — each component manages its own live mode separately.

- [ ] **Step 3: Verify compiles**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors. Fix any "used before defined" or missing prop errors if present.

- [ ] **Step 4: Commit**

```bash
git add pages/LandingPage.tsx App.tsx
git commit -m "refactor: extract LandingPage from App.tsx"
```

---

## Task 7: Extract ChatPage

**Files:**
- Create: `pages/ChatPage.tsx`
- Modify: `App.tsx` (remove chat view block)

The chat view is everything from `// --- CHAT VIEW (Main Interface) ---` (line 1117) to end of file. Extract it into `pages/ChatPage.tsx`.

**Key changes when extracting:**

- Read `chatId` from URL: `const { chatId } = useParams<{ chatId: string }>()`
- Get `allThreads`, `updateThread`, `favorites`, `toggleFavorite` from `useAppContext()`
- Auto-send initial query on mount:
  ```tsx
  const location = useLocation();
  useEffect(() => {
    const initialQuery = (location.state as { query?: string } | null)?.query;
    if (initialQuery && allThreads[chatId]?.messages.length === 0) {
      handleSendMessage(initialQuery);
    }
  }, []); // run once on mount only
  ```
- Guard: if `allThreads[chatId]` is undefined, redirect to `/`:
  ```tsx
  if (!allThreads[chatId]) return <Navigate to="/" replace />;
  ```
- `messages` is derived: `const messages = allThreads[chatId]?.messages || []`
- `setMessages` uses `updateThread(chatId, updater)` from context
- Property click navigates: `navigate('./property/' + property.id)` (relative, within chat route)
- New chat button: `navigate('/search')`
- Logo click: `navigate('/')`
- Sidebar thread click: `navigate('/search/' + threadId)`
- Add `<Outlet>` in the property panel slot (right column, desktop):
  - Where the property detail view currently renders (`{selectedProperty && (...)}` at line 1289), replace with:
    ```tsx
    {/* Desktop: Property panel renders here via nested route */}
    <div className={`hidden lg:flex ${isOutletActive ? 'lg:w-[60%]' : 'lg:w-0'} ...`}>
      <Outlet />
    </div>
    ```
  - Use `const isOutletActive = !!useMatch('/search/:chatId/property/:propertyId')` to know if panel is showing
- Remove `selectedProperty` state — it is no longer needed in chat view (it's derived from URL)
- The mobile property view (the `fixed inset-0` overlay at line 1289) can remain as an `<Outlet>` rendered differently on mobile, or you can conditionally render based on screen width — simplest approach: render `<Outlet>` for both mobile and desktop, letting `PropertyPanel` handle its own layout since it already uses `isInline={true}`

**State to keep in ChatPage:**
- `isLiveMode` — independent from LandingPage's isLiveMode
- `isLoading`, `isAnalyzing`
- `currentFilters`
- `signedPropertyId`
- `isHistoryOpen`
- `isAtTop`, `isHeaderVisible`, `lastScrollY`, `lastScrollTarget`
- `isMatchPopoverOpen`, `isAiExpanded`, `aiPanelState`, `isAiDrawerOpen`, `mobileTab`
- `expandedFloorPlan`, `selectedUnit`
- `isImageModalOpen`, `modalImages`, `modalTitle`, `selectedPropertyImageIndex`
- `hasIntelligencePermission`, `recommendationStep`, `exampleLinks`, `summarizedPreference`, `isEditingPreference`
- `bottomSentinelRef`, `mapRef`, `lastTriggered`

- [ ] **Step 1: Create `pages/ChatPage.tsx`**

Create the file. Use `useParams`, `useNavigate`, `useLocation`, `useMatch`, `Navigate`, `Outlet` from `react-router-dom`. Read `chatId` from params. Guard for missing thread. Wire all navigation actions to `useNavigate`.

The complete JSX for the chat view is lines 1118–2178 of `App.tsx`. Copy it as the return value of `ChatPage`, then apply the changes listed above.

- [ ] **Step 2: Remove chat view from App.tsx**

Delete lines 1117 to end. The `App.tsx` component body should now only have:
- Shared state: `isLoggedIn`, `showLoginView`, `isDropdownOpen`, `showFavorites`, `showPassword`, `showGooglePrompt`
- Handlers: `handleLogin`, `handleLogout`
- The login view JSX
- The router `<Routes>` shell (to be added in Task 8)

- [ ] **Step 3: Verify compiles**

```bash
npx tsc --noEmit 2>&1 | head -40
```

Fix any type errors. Common issues: missing imports, `useNavigate` used outside router context (will be fixed in Task 8).

- [ ] **Step 4: Commit**

```bash
git add pages/ChatPage.tsx App.tsx
git commit -m "refactor: extract ChatPage from App.tsx"
```

---

## Task 8: Wire Up Router in App.tsx and index.tsx

**Files:**
- Modify: `App.tsx`
- Modify: `index.tsx`

- [ ] **Step 1: Update `index.tsx` to add BrowserRouter**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Could not find root element to mount to');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

- [ ] **Step 2: Rewrite `App.tsx` as the router shell**

```tsx
import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { AppContextProvider, useAppContext } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import SearchRedirect from './pages/SearchRedirect';
import ChatPage from './pages/ChatPage';
import PropertyPanel from './pages/PropertyPanel';
import PropertyDetailPage from './pages/PropertyDetailPage';
import FavoritesPage from './components/FavoritesPage';
import { X, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

const LOGO_URL = "https://tripalink-public.s3.us-east-2.amazonaws.com/Logo+-+Dark.png";

const AppShell: React.FC = () => {
  const { favorites, toggleFavorite } = useAppContext();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginView, setShowLoginView] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => { setIsLoggedIn(true); setShowLoginView(false); setShowGooglePrompt(false); };
  const handleLogout = () => { setIsLoggedIn(false); setIsDropdownOpen(false); };

  return (
    <>
      {/* Login overlay — rendered above all routes */}
      {showLoginView && (
        <div className="fixed inset-0 bg-white z-[200] flex flex-col items-center justify-center p-6">
          {/* ... login view JSX copied from App.tsx lines 514–579 ... */}
        </div>
      )}

      {/* Favorites overlay — rendered above all routes, no URL change */}
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

      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              isLoggedIn={isLoggedIn}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              setShowLoginView={setShowLoginView}
              setShowFavorites={setShowFavorites}
              handleLogout={handleLogout}
              showFavorites={showFavorites}
            />
          }
        />
        <Route path="/search" element={<SearchRedirect />} />
        <Route path="/search/:chatId" element={<ChatPage isLoggedIn={isLoggedIn} setShowLoginView={setShowLoginView} setShowFavorites={setShowFavorites} />}>
          <Route path="property/:propertyId" element={<PropertyPanel />} />
        </Route>
        <Route path="/property/:propertyId" element={<PropertyDetailPage />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => (
  <AppContextProvider>
    <AppShell />
  </AppContextProvider>
);

export default App;
```

Notes:
- `AppShell` is a separate inner component so it can call `useAppContext()` (hooks require being inside the Provider)
- The login view JSX (App.tsx lines 514–579) moves into `AppShell` as the `{showLoginView && ...}` block
- `FavoritesPage` renders as a global overlay in `AppShell` — it has no route, consistent with the spec
- `showGooglePrompt` is preserved (currently commented out in App.tsx but retained to avoid a TypeScript error)

- [ ] **Step 3: Verify app compiles and starts**

```bash
npm run dev
```

Open http://localhost:3000. Expected:
- Landing page renders at `/`
- No console errors

- [ ] **Step 4: Commit**

```bash
git add index.tsx App.tsx
git commit -m "feat: wire up React Router DOM with BrowserRouter and route definitions"
```

---

## Task 9: Fix Nav Background Mismatch

**Files:**
- Modify: `pages/ChatPage.tsx`

The chat header uses `bg-[#f5f4f0]` when at top, but the chat content uses `bg-[#FCF9F8]`. Unify both to `#FCF9F8`.

- [ ] **Step 1: Find all `bg-[#f5f4f0]` in ChatPage.tsx**

```bash
grep -n "f5f4f0" pages/ChatPage.tsx
```

- [ ] **Step 2: Replace all occurrences**

Change every `bg-[#f5f4f0]` to `bg-[#FCF9F8]` in `pages/ChatPage.tsx`.

- [ ] **Step 3: Verify visually**

Open http://localhost:3000, send a message to enter the chat view. Confirm the header background matches the chat content background when scrolled to top.

- [ ] **Step 4: Commit**

```bash
git add pages/ChatPage.tsx
git commit -m "fix: unify chat header and content background to #FCF9F8"
```

---

## Task 10: Wire Navigation Actions

**Files:**
- Modify: `pages/ChatPage.tsx`
- Modify: `pages/LandingPage.tsx`

Ensure all navigation triggers from the spec are correctly wired. Do a targeted review of each trigger.

- [ ] **Step 1: Verify landing → chat navigation**

In `LandingPage.tsx`:
- Search submit calls `navigate('/search', { state: { query: landingInput } })`
- Chip click calls `navigate('/search', { state: { query: chip.query } })`

Manually test: type a query on landing, hit Enter → should navigate to `/search/:chatId` and auto-send.

- [ ] **Step 2: Verify chat-internal navigation**

In `ChatPage.tsx`:
- `handlePropertyClick` calls `navigate('./property/' + property.id)` (relative)
- Logo click calls `navigate('/')`
- New chat calls `navigate('/search')`
- Sidebar thread click calls `navigate('/search/' + threadId)`

- [ ] **Step 3: Verify property panel close**

In `PropertyPanel.tsx`:
- Close calls `navigate('/search/' + chatId)` (absolute)
- Confirm: closing the property panel returns to chat without losing messages

- [ ] **Step 4: Verify browser back/forward**

Navigate to a chat, open a property, use browser back → should return to chat. Use browser forward → should reopen property. Confirm no blank screen.

- [ ] **Step 5: Commit if any fixes were made**

```bash
git add pages/ChatPage.tsx pages/LandingPage.tsx pages/PropertyPanel.tsx
git commit -m "fix: wire all navigation triggers to React Router"
```

---

## Task 11: Verify Chat History Persists

**Files:**
- No code changes — verification task

- [ ] **Step 1: Send a message in chat**

Navigate to `/`, enter a query, confirm you land on `/search/:chatId` and a response appears.

- [ ] **Step 2: Refresh the page**

Hit Cmd+R. Expected: `/search/:chatId` URL stays, messages are still visible (loaded from localStorage).

- [ ] **Step 3: Open a new tab with the same URL**

Copy the URL, open a new tab, paste. Expected: messages appear (from localStorage).

- [ ] **Step 4: Navigate to a stale/invalid chatId**

Visit `/search/not-a-real-id` in the browser. Expected: redirected to `/` (not a blank screen).

- [ ] **Step 5: Verify sidebar shows previous chats**

Open the sidebar. Previous chat sessions should be listed. Clicking one navigates to `/search/:chatId` and loads that session's messages.

---

## Task 12: Final Smoke Test

- [ ] **Step 1: Full user flow**

1. `/` → landing renders, no errors
2. Type query → navigates to `/search/:chatId`, AI responds
3. AI returns properties → click a property card → URL changes to `/search/:chatId/property/:propId`, split view shows
4. Close property panel → back to `/search/:chatId`
5. Click "New Chat" → navigates to new chat session
6. Visit `/property/:someId` directly → standalone property detail renders
7. Hit browser back from standalone → returns to previous page (or `/`)

- [ ] **Step 2: Mobile smoke test**

Resize browser to 375px width. Confirm:
- Landing page scrolls and chips work
- Chat view fills screen
- Property click opens detail (mobile layout)
- Sidebar opens/closes

- [ ] **Step 3: Final commit**

```bash
git add -A
git commit -m "feat: complete URL routing implementation with React Router DOM v6"
```

---

## Checklist Summary

- [ ] Task 1: Install react-router-dom
- [ ] Task 2: Create AppContext
- [ ] Task 3: Create SearchRedirect
- [ ] Task 4: Create PropertyPanel
- [ ] Task 5: Create PropertyDetailPage
- [ ] Task 6: Extract LandingPage
- [ ] Task 7: Extract ChatPage
- [ ] Task 8: Wire up router in App.tsx + index.tsx
- [ ] Task 9: Fix nav background mismatch
- [ ] Task 10: Wire navigation actions
- [ ] Task 11: Verify chat history persists
- [ ] Task 12: Final smoke test
