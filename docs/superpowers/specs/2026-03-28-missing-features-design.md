# Missing Features Design Spec — UnitPulse

**Date:** 2026-03-28
**Status:** Draft
**Scope:** Implement the four frontend-implementable missing features identified in the product analysis

---

## 1. Analysis Summary

After a full codebase audit, the following features were found already implemented and require NO work:
- Photo bento grid in property detail
- "About this home" section
- Google Maps embed (Nearby section)
- Property comparison table (List/Compare toggle in chat)
- 20 mock properties across 6 cities
- `prefers-reduced-motion` CSS in `index.css`

The following features are **actually missing** and are in scope for this sprint:

| # | Feature | Why Missing |
|---|---------|-------------|
| 1 | Tour Scheduling UI | "Schedule Tour" sends a message → triggers `'contract'` incorrectly. No dedicated UI. |
| 2 | Thread Title Auto-generation | All threads persist as "New Chat". First message should seed the title. |
| 3 | Real Estate API Placeholder | `propertyService.ts` has no TODO comments; backend team has no integration point. |
| 4 | Accessibility: `aria-label` on icon buttons | Icon-only buttons (close, heart, nav arrows) have no accessible labels. |

---

## 2. Feature 1: Tour Scheduling UI

### Problem
`handleStartRentalProcess('tour')` in `ChatPage.tsx` (line 191) maps tour intent to `interactiveType: 'contract'`, which shows the payment/lease UI instead of a tour picker. Users who click "Schedule Tour" see a lease signing form.

### Solution
Add a new `'tour-scheduling'` interactive type throughout the chat system.

### UI Design

**TourScheduling component** (rendered inside the chat message, same pattern as `ApplicationForm`):

```
┌─────────────────────────────────────────────┐
│  📅  Schedule a Tour                         │
│  Property: [Property Name]                   │
│                                             │
│  Select a Date                              │
│  [Today] [Tomorrow] [Wed] [Thu] [Fri] [Sat] │  ← 6 day tiles
│                                             │
│  Select a Time                              │
│  [9:00 AM] [10:00 AM] [11:00 AM]           │
│  [2:00 PM]  [3:00 PM]  [4:00 PM]           │
│                                             │
│  Your Contact Info                          │
│  [Name input]                               │
│  [Phone input]                              │
│                                             │
│  [Confirm Tour →]                           │
└─────────────────────────────────────────────┘
```

**Confirmation state** (after submit):
```
┌─────────────────────────────────────────────┐
│  ✅  Tour Confirmed!                         │
│  [PropertyName] · [Day, Date] at [Time]      │
│  We'll send a reminder to [phone]            │
│                                             │
│  [Add to Calendar]  [Back to Chat]          │
└─────────────────────────────────────────────┘
```

### Data Shape
`TourScheduling` receives `propertyName: string` and `onComplete: () => void`.
The confirmation is local state — no backend call.

### Files Changed
| File | Change |
|------|--------|
| `types.ts` | Add `'tour-scheduling'` to `ChatMessage.interactiveType` and `GeminiResponse.interactiveType` |
| `components/ChatInterface.tsx` | Add `TourScheduling` component; add rendering branch for `msg.interactiveType === 'tour-scheduling'` |
| `pages/ChatPage.tsx` | Fix `handleStartRentalProcess('tour')` to use `interactiveType: 'tour-scheduling'`; add `propertyName` to `interactiveData` |
| `services/geminiService.ts` | Add `'tour-scheduling'` to `interactiveType` enum in schema |

---

## 3. Feature 2: Thread Title Auto-generation

### Problem
Every chat thread is created with `title: 'New Chat'` and never updated. The sidebar shows "New Chat" for all conversations regardless of content.

### Solution
After the first AI response in a new thread, derive a short title from the first user message and update the thread. Cap at 40 characters.

### Logic
```
title = firstUserMessage.slice(0, 40).trim() + (firstUserMessage.length > 40 ? '…' : '')
```

Example: "Find me a 2-bedroom loft in Seattle with a gym" → "Find me a 2-bedroom loft in Seattle wit…"

Only fires when `messages.length === 0` before sending (i.e., it's the first message of the thread). Uses a new `renameThread` action in `AppContext`.

### Files Changed
| File | Change |
|------|--------|
| `context/AppContext.tsx` | Add `renameThread(id: string, title: string)` method |
| `pages/ChatPage.tsx` | After receiving first AI response, call `renameThread(chatId, derivedTitle)` |

---

## 4. Feature 3: Real Estate API Placeholder

### Problem
`propertyService.ts` uses `MOCK_PROPERTIES` with no indication of where a real API should be integrated. Backend engineers have no clear integration point.

### Solution
Add a clearly marked `// TODO` comment block in `getFilteredProperties` showing the intended API contract, with the current mock implementation as fallback.

### Contract Shape (for backend team)
```ts
// TODO: Replace mock with real estate API call
// Expected API signature:
//   GET /api/properties?location=...&minPrice=...&maxPrice=...&minBedrooms=...
//   Response: { properties: Property[], total: number }
// Suggested providers: Zillow Bridge API, RentCast, Apartments.com API, MLS
```

### Files Changed
| File | Change |
|------|--------|
| `services/propertyService.ts` | Add TODO comment block above the mock filter implementation |

---

## 5. Feature 4: Accessibility — `aria-label` on Icon-only Buttons

### Problem
Design doc §Accessibility: "Icon-only buttons must have `aria-label`". Several key interactive controls are missing accessible labels:
- Close (X) button in `PropertyDetailsModal`
- Heart/favorite toggle button
- Carousel scroll arrows (left/right) in `ChatInterface`
- Send message button in `ChatInterface`
- History/new chat icon buttons in `ChatInterface`

### Solution
Add `aria-label` to each affected button. Do not change any visual styling.

### Buttons to Fix
| Component | Button | aria-label |
|-----------|--------|-----------|
| `PropertyDetailsModal` | Close button | `"Close property details"` |
| `PropertyDetailsModal` | Heart button (save/unsave) | `"Save to favorites"` / `"Remove from favorites"` |
| `ChatInterface` (carousel) | Left scroll | `"Scroll left"` |
| `ChatInterface` (carousel) | Right scroll | `"Scroll right"` |
| `ChatInterface` (input area) | Send button | `"Send message"` |
| `ChatInterface` (header) | History toggle | `"View chat history"` |
| `ChatInterface` (header) | New chat | `"Start new chat"` |

---

## 6. Implementation Order

1. `types.ts` — add `'tour-scheduling'` (30 seconds, no risk)
2. `services/propertyService.ts` — add TODO comments (1 minute, no risk)
3. `context/AppContext.tsx` — add `renameThread` (5 minutes)
4. `components/ChatInterface.tsx` — add `TourScheduling` component + `aria-label` fixes
5. `pages/ChatPage.tsx` — fix `handleStartRentalProcess` + wire `renameThread`
6. `services/geminiService.ts` — add `'tour-scheduling'` to schema enum

---

## 7. Out of Scope

- Authentication backend
- Payment gateway
- Document verification
- Real estate API implementation (only placeholder)
- Cloud sync / cross-device persistence
- Email/SMS notifications
- URL filter state persistence
