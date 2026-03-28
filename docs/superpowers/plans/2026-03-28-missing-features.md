# Missing Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the four missing frontend features identified in the product analysis: (1) Tour Scheduling UI, (2) Thread Title Auto-generation, (3) Real Estate API Placeholder, (4) Accessibility aria-labels.

**Spec:** `docs/superpowers/specs/2026-03-28-missing-features-design.md`

---

## File Map

### Modified files
| File | Change |
|------|--------|
| `types.ts` | Add `'tour-scheduling'` to interactiveType unions |
| `services/propertyService.ts` | Add real estate API TODO placeholder |
| `context/AppContext.tsx` | Add `renameThread` method |
| `components/ChatInterface.tsx` | Add TourScheduling component, aria-labels, wire tour-scheduling rendering |
| `pages/ChatPage.tsx` | Fix handleStartRentalProcess('tour'), wire renameThread |
| `services/geminiService.ts` | Add 'tour-scheduling' to schema enum |

---

## Task 1: Update types.ts

**Files:**
- Modify: `types.ts`

- [ ] **Step 1: Add 'tour-scheduling' to ChatMessage.interactiveType union**

In `ChatMessage`, change:
```ts
interactiveType?: 'properties' | 'deep-dive' | 'application-form' | 'contract' | 'move-in-checklist' | 'style-analysis';
```
To:
```ts
interactiveType?: 'properties' | 'deep-dive' | 'application-form' | 'contract' | 'move-in-checklist' | 'style-analysis' | 'tour-scheduling';
```

- [ ] **Step 2: Add 'tour-scheduling' to GeminiResponse.interactiveType union**

Same change in `GeminiResponse`.

- [ ] **Step 3: Verify compiles**
```bash
npx tsc --noEmit 2>&1 | head -10
```

---

## Task 2: Add Real Estate API Placeholder

**Files:**
- Modify: `services/propertyService.ts`

- [ ] **Step 1: Add TODO comment block**

At the top of `getFilteredProperties`, before the mock implementation, add:

```ts
// TODO [Backend Integration]: Replace MOCK_PROPERTIES with a real estate API call.
// Expected API contract:
//   GET /api/properties?location=...&minPrice=...&maxPrice=...&minBedrooms=...&amenities=...&propertyType=...
//   Response: { properties: Property[], total: number }
// Suggested providers: Zillow Bridge API, RentCast API, Apartments.com API, MLS IDX feed
// The frontend SearchFilters type maps directly to the query parameters above.
```

---

## Task 3: Add renameThread to AppContext

**Files:**
- Modify: `context/AppContext.tsx`

- [ ] **Step 1: Add renameThread to AppContextValue interface**

```ts
renameThread: (id: string, title: string) => void;
```

- [ ] **Step 2: Implement renameThread**

```ts
const renameThread = (id: string, title: string) => {
  setAllThreads(prev => {
    if (!prev[id]) return prev;
    return { ...prev, [id]: { ...prev[id], title } };
  });
};
```

- [ ] **Step 3: Expose in context value**

Add `renameThread` to the `<AppContext.Provider value={{...}}>` object.

- [ ] **Step 4: Verify compiles**
```bash
npx tsc --noEmit 2>&1 | head -10
```

---

## Task 4: Add TourScheduling Component to ChatInterface.tsx

**Files:**
- Modify: `components/ChatInterface.tsx`

- [ ] **Step 1: Add TourScheduling component**

Insert after the `MoveInChecklist` component (before `// --- END INTERACTIVE COMPONENTS ---`):

```tsx
const TourScheduling = ({ propertyName, onComplete }: { propertyName: string; onComplete: () => void }) => {
  const today = new Date();
  const days = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'];
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const dayLabels = ['Today', 'Tomorrow', ...['Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue'].slice(0, 4)];

  const handleConfirm = () => {
    if (selectedDay === null || !selectedTime || !name.trim() || !phone.trim()) return;
    setConfirmed(true);
  };

  if (confirmed) {
    const confirmedDay = days[selectedDay!];
    const dateStr = confirmedDay.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-[#F4F7EC] rounded-3xl border border-[#4A5D23]/15 shadow-lg mt-4 p-8 text-center"
      >
        <div className="w-12 h-12 bg-[#4A5D23] rounded-full flex items-center justify-center mx-auto mb-4">
          <Check size={24} className="text-white" strokeWidth={3} />
        </div>
        <h3 className="text-xl font-black text-black mb-1">Tour Confirmed!</h3>
        <p className="text-sm font-medium text-neutral-500 mb-4">{propertyName}</p>
        <div className="bg-white rounded-2xl border border-[#4A5D23]/15 px-6 py-4 inline-block mb-6">
          <span className="text-sm font-bold text-[#1a2609]">{dateStr} at {selectedTime}</span>
        </div>
        <p className="text-xs font-medium text-neutral-400 mb-6">We'll send a reminder to {phone}</p>
        <button
          onClick={onComplete}
          className="px-6 py-2.5 bg-[#4A5D23] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#3a4e1a] transition-all"
        >
          Back to Chat
        </button>
      </motion.div>
    );
  }

  const canConfirm = selectedDay !== null && selectedTime !== null && name.trim() && phone.trim();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-[#FCF9F4] rounded-3xl border border-black/5 shadow-lg mt-4 p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-[#4A5D23] flex items-center justify-center shrink-0">
          <Calendar size={18} className="text-white" />
        </div>
        <div>
          <h3 className="text-base font-black text-black">Schedule a Tour</h3>
          <p className="text-xs font-medium text-neutral-400 truncate max-w-[220px]">{propertyName}</p>
        </div>
      </div>

      {/* Date picker */}
      <div className="mb-6">
        <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-3">Select a Date</label>
        <div className="grid grid-cols-6 gap-2">
          {days.map((d, i) => (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`flex flex-col items-center py-2.5 rounded-xl border text-center transition-all ${
                selectedDay === i
                  ? 'bg-[#4A5D23] border-[#4A5D23] text-white'
                  : 'bg-white border-black/5 hover:border-black/20 text-black'
              }`}
            >
              <span className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 ${selectedDay === i ? 'text-white/70' : 'text-neutral-400'}`}>
                {dayLabels[i] || d.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-sm font-black">{d.getDate()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time slots */}
      <div className="mb-6">
        <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider mb-3">Select a Time</label>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedTime(slot)}
              className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                selectedTime === slot
                  ? 'bg-[#4A5D23] border-[#4A5D23] text-white'
                  : 'bg-white border-black/5 hover:border-black/20 text-black'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Contact info */}
      <div className="mb-6 space-y-3">
        <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider">Your Contact Info</label>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:ring-1 focus:ring-[#4A5D23] outline-none text-sm"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-black/5 rounded-xl focus:ring-1 focus:ring-[#4A5D23] outline-none text-sm"
        />
      </div>

      <button
        onClick={handleConfirm}
        disabled={!canConfirm}
        className="w-full py-3 bg-[#4A5D23] text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-[#3a4e1a] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Calendar size={16} />
        Confirm Tour
      </button>
    </motion.div>
  );
};
```

- [ ] **Step 2: Add rendering branch for tour-scheduling in message rendering**

In the messages render block, after `move-in-checklist` branch and before `isSigningMessage` block, add:

```tsx
{msg.interactiveType === 'tour-scheduling' && (
  <TourScheduling
    propertyName={msg.interactiveData?.propertyName || 'this property'}
    onComplete={() => onSendMessage("I've scheduled a tour!")}
  />
)}
```

- [ ] **Step 3: Add aria-labels to icon-only buttons**

Carousel left arrow button: add `aria-label="Scroll properties left"`
Carousel right arrow button: add `aria-label="Scroll properties right"`
Send message button: add `aria-label="Send message"`
History toggle button (if present): add `aria-label="View chat history"`
New chat button (if present): add `aria-label="Start new chat"`

- [ ] **Step 4: Verify compiles**
```bash
npx tsc --noEmit 2>&1 | head -20
```

---

## Task 5: Fix ChatPage.tsx

**Files:**
- Modify: `pages/ChatPage.tsx`

- [ ] **Step 1: Fix handleStartRentalProcess for 'tour'**

Change line 191 from:
```ts
interactiveType: type === 'tour' ? 'contract' : 'application-form',
```
To:
```ts
interactiveType: type === 'tour' ? 'tour-scheduling' : 'application-form',
interactiveData: type === 'tour' ? { propertyName: 'this property' } : undefined,
```

- [ ] **Step 2: Import renameThread from useAppContext**

In the `useAppContext()` destructure:
```ts
const { allThreads, updateThread, favorites, toggleFavorite, renameThread } = useAppContext();
```

- [ ] **Step 3: Auto-title thread after first AI response**

In `handleSendMessage`, after `setMessages(prev => [...prev, aiMsg])`, add:

```ts
// Auto-title thread from first user message
if (messages.length === 0) {
  const rawTitle = text.trim();
  const title = rawTitle.length > 45 ? rawTitle.slice(0, 45).trimEnd() + '…' : rawTitle;
  renameThread(chatId!, title);
}
```

- [ ] **Step 4: Verify compiles**
```bash
npx tsc --noEmit 2>&1 | head -20
```

---

## Task 6: Update geminiService.ts Schema

**Files:**
- Modify: `services/geminiService.ts`

- [ ] **Step 1: Add 'tour-scheduling' to interactiveType enum**

In the `responseSchema`, find:
```ts
enum: ["properties", "deep-dive", "application-form", "contract", "move-in-checklist", "style-analysis"],
```
Change to:
```ts
enum: ["properties", "deep-dive", "application-form", "contract", "move-in-checklist", "style-analysis", "tour-scheduling"],
```

Also update the SYSTEM_INSTRUCTION to mention `tour-scheduling`:
After the `"contract"` line in USER JOURNEY GUIDANCE, add:
```
   - "tour-scheduling": When the user wants to schedule a viewing/tour of a property.
```

- [ ] **Step 2: Verify compiles**
```bash
npx tsc --noEmit 2>&1 | head -10
```

---

## Task 7: Add aria-labels to PropertyDetailsModal.tsx

**Files:**
- Modify: `components/PropertyDetailsModal.tsx`

- [ ] **Step 1: Close button**
Add `aria-label="Close property details"` to the close button.

- [ ] **Step 2: Favorite toggle button**
Add dynamic `aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}` to the heart button.

- [ ] **Step 3: Image modal nav buttons**
Add `aria-label="Previous image"` and `aria-label="Next image"` to the chevron buttons.

---

## Task 8: Commit and Push

- [ ] **Step 1: Stage all modified files**
```bash
git add types.ts services/propertyService.ts context/AppContext.tsx components/ChatInterface.tsx pages/ChatPage.tsx services/geminiService.ts components/PropertyDetailsModal.tsx docs/superpowers/
```

- [ ] **Step 2: Commit**
```bash
git commit -m "feat: add tour scheduling UI, thread auto-titling, API placeholder, accessibility labels"
```

- [ ] **Step 3: Push**
```bash
git push -u origin claude/analyze-product-features-sGYVI
```

---

## Checklist Summary

- [ ] Task 1: Update types.ts
- [ ] Task 2: Add API placeholder to propertyService.ts
- [ ] Task 3: Add renameThread to AppContext
- [ ] Task 4: Add TourScheduling component + aria-labels to ChatInterface.tsx
- [ ] Task 5: Fix ChatPage.tsx (tour routing + renameThread)
- [ ] Task 6: Update geminiService.ts schema
- [ ] Task 7: Add aria-labels to PropertyDetailsModal.tsx
- [ ] Task 8: Commit and push
