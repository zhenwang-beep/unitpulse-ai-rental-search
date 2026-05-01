import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin, DollarSign, Ruler, Palette, Sparkles,
  Navigation, TreePine, FileText, LogIn,
  X, Trophy, Pencil, Download,
} from 'lucide-react';
import { UserPreference } from '../types';

const PREFERENCE_CATEGORIES = [
  {
    key: 'location',  label: 'Location',  icon: MapPin,
    prompt: 'Let\'s find your ideal neighborhood! Which city or area are you looking to live in? If you have a specific neighborhood in mind, even better.',
    suggestions: ['Downtown Los Angeles', 'Near USC campus', 'Seattle area', 'Anywhere in Chicago'],
  },
  {
    key: 'budget',    label: 'Budget',     icon: DollarSign,
    prompt: 'What\'s your monthly budget for rent? This helps me narrow down the best options for you.',
    suggestions: ['Under $1,000/mo', '$1,000 – $1,500/mo', '$1,500 – $2,500/mo', '$2,500+/mo'],
  },
  {
    key: 'size',      label: 'Size',       icon: Ruler,
    prompt: 'How much space do you need? Tell me about bedrooms, bathrooms, or square footage — whatever matters most to you.',
    suggestions: ['Studio is fine', '1 bedroom, 1 bath', '2+ bedrooms', 'At least 800 sqft'],
  },
  {
    key: 'style',     label: 'Style',      icon: Palette,
    prompt: 'What\'s your aesthetic vibe? Do you lean more modern and minimal, cozy and warm, or industrial and edgy?',
    suggestions: ['Modern & minimal', 'Cozy & warm', 'Industrial loft', 'No preference'],
  },
  {
    key: 'amenities', label: 'Amenities',  icon: Sparkles,
    prompt: 'Are there any must-have amenities? Think about things like in-unit laundry, parking, a gym, or a rooftop.',
    suggestions: ['In-unit laundry', 'Parking spot', 'Gym & pool', 'Pet-friendly building'],
  },
  {
    key: 'commute',   label: 'Commute',    icon: Navigation,
    prompt: 'Where do you commute to for work or school? I can help find places with a short commute.',
    suggestions: ['I work downtown', 'Near UCLA / USC', 'I work remotely', 'Under 30 min by transit'],
  },
  {
    key: 'lifestyle', label: 'Lifestyle',  icon: TreePine,
    prompt: 'Tell me a bit about your lifestyle! Do you have pets, prefer a quiet street, or love being walking distance to restaurants and nightlife?',
    suggestions: ['I have a dog', 'Quiet neighborhood', 'Walkable to shops & dining', 'Near parks & nature'],
  },
  {
    key: 'other',     label: 'Other',      icon: FileText,
    prompt: 'Anything else that\'s important to you? Things like lease length, move-in date, furnished vs unfurnished, or accessibility needs.',
    suggestions: ['Short-term lease OK', 'Move in ASAP', 'Furnished preferred', 'Need accessible unit'],
  },
] as const;

const TOTAL_CATEGORIES = PREFERENCE_CATEGORIES.length;

function generateProfileName(filled: Set<string>): string {
  const count = filled.size;
  if (count === 0) return 'New Renter';
  if (count === TOTAL_CATEGORIES) return 'Dream Home Expert';
  if (filled.has('commute') && filled.has('lifestyle'))  return 'Urban Explorer';
  if (filled.has('style') && filled.has('amenities'))    return 'Design Connoisseur';
  if (filled.has('budget') && filled.has('size'))         return 'Savvy Strategist';
  if (filled.has('location') && filled.has('commute'))    return 'Neighborhood Scout';
  if (filled.has('lifestyle') && filled.has('amenities')) return 'Lifestyle Curator';
  if (filled.has('location'))  return 'Location Hunter';
  if (filled.has('budget'))    return 'Budget Planner';
  if (filled.has('style'))     return 'Style Seeker';
  if (filled.has('amenities')) return 'Amenity Enthusiast';
  if (filled.has('commute'))   return 'Commute Optimizer';
  if (filled.has('lifestyle')) return 'Lifestyle Matcher';
  if (filled.has('size'))      return 'Space Planner';
  return 'Renter in Progress';
}

function getLevel(count: number): { level: number; title: string; next: string } {
  if (count === 0) return { level: 0, title: 'Newcomer',        next: 'Tell me what you\'re looking for!' };
  if (count <= 2)  return { level: 1, title: 'Explorer',        next: `${3 - count} more to reach Level 2` };
  if (count <= 5)  return { level: 2, title: 'Specialist',      next: `${6 - count} more to reach Level 3` };
  if (count <= 7)  return { level: 3, title: 'Expert',          next: `${TOTAL_CATEGORIES - count} more to complete!` };
  return                    { level: 4, title: 'Dream Home Expert', next: 'Profile complete!' };
}

// Circular progress ring for the trigger button
export const CircularProgress = ({ percentage, size = 30 }: { percentage: number; size?: number }) => {
  const strokeWidth = 2.5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="currentColor" strokeWidth={strokeWidth}
        className="text-neutral-100"
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="currentColor" strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-brand transition-all duration-700 ease-out"
      />
    </svg>
  );
};

interface RenterProfilePopoverProps {
  userPreferences?: UserPreference[];
  isLoggedIn?: boolean;
  onPreferenceLoginPrompt?: () => void;
  onClose: () => void;
  onSendMessage: (text: string) => void;
  onAiPrompt?: (text: string, suggestedReplies?: string[]) => void;
  onRemovePreference?: (category: string, label: string) => void;
}

const RenterProfilePopover: React.FC<RenterProfilePopoverProps> = ({
  userPreferences,
  isLoggedIn,
  onPreferenceLoginPrompt,
  onClose,
  onSendMessage,
  onAiPrompt,
  onRemovePreference,
}) => {
  const profileCardRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest('[title="Renter Profile"]')
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const filledCategories = new Set<string>(
    (userPreferences ?? []).map(p => p.category)
  );
  const filledCount = filledCategories.size;
  const percentage = Math.round((filledCount / TOTAL_CATEGORIES) * 100);
  const profileName = generateProfileName(filledCategories);
  const level = getLevel(filledCount);

  // Group preferences by category for display
  const prefsByCategory: Record<string, UserPreference[]> = {};
  for (const p of (userPreferences ?? [])) {
    if (!prefsByCategory[p.category]) prefsByCategory[p.category] = [];
    prefsByCategory[p.category].push(p);
  }

  const handleDownload = async () => {
    if (!profileCardRef.current) return;
    const { toPng } = await import('html-to-image');
    const dataUrl = await toPng(profileCardRef.current, {
      backgroundColor: '#ffffff',
      pixelRatio: 2,
    });
    const link = document.createElement('a');
    link.download = `unitpulse-${profileName.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleCategoryClick = (cat: typeof PREFERENCE_CATEGORIES[number]) => {
    const isFilled = filledCategories.has(cat.key);
    if (isFilled) {
      setExpandedCategory(prev => prev === cat.key ? null : cat.key);
    } else {
      // AI asks the question instead of user sending it
      if (onAiPrompt) {
        onAiPrompt(cat.prompt, [...cat.suggestions]);
      } else {
        onSendMessage(cat.prompt);
      }
      onClose();
    }
  };

  return (
    <motion.div
      ref={popoverRef}
      initial={{ opacity: 0, y: 6, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.96 }}
      transition={{ duration: 0.18 }}
      className="absolute bottom-full left-0 mb-2 w-80 bg-white rounded-2xl shadow-2xl border border-black/8 z-50 overflow-hidden"
    >
      {/* Downloadable profile card */}
      <div ref={profileCardRef} className="p-5 bg-gradient-to-br from-surface-ai via-white to-white">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand/50 mb-0.5">Renter Profile</p>
            <p className="text-base font-black text-black tracking-tight leading-tight">{profileName}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-2">
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-full text-neutral-300 hover:text-brand hover:bg-brand/10 transition-all"
              title="Save profile card"
            >
              <Download size={13} />
            </button>
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-brand/10">
              <Trophy size={11} className="text-brand" />
              <span className="text-[10px] font-bold text-brand">Lv.{level.level}</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold text-neutral-400">{level.title}</span>
            <span className="text-[10px] font-bold text-black tabular-nums">{filledCount}/{TOTAL_CATEGORIES}</span>
          </div>
          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className="h-full bg-gradient-to-r from-brand to-[#7BA832] rounded-full"
            />
          </div>
          <p className="text-[10px] text-neutral-400 mt-1 font-medium">{level.next}</p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-4 gap-1.5 mt-4">
          {PREFERENCE_CATEGORIES.map(cat => {
            const isFilled = filledCategories.has(cat.key);
            const isExpanded = expandedCategory === cat.key;
            const Icon = cat.icon;
            return (
              <button
                key={cat.key}
                onClick={() => handleCategoryClick(cat)}
                className={`group flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                  isExpanded
                    ? 'bg-brand text-white ring-2 ring-brand/30'
                    : isFilled
                      ? 'bg-brand/10 text-brand hover:bg-brand/20'
                      : 'bg-neutral-50 text-neutral-300 border border-dashed border-neutral-200 hover:border-brand/30 hover:text-brand/50 hover:bg-brand/5'
                }`}
                title={isFilled ? 'Click to view & edit' : cat.prompt}
              >
                <Icon size={14} strokeWidth={isFilled ? 2.5 : 1.5} />
                <span className="text-[8px] font-bold leading-tight text-center uppercase tracking-wider">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Expanded category detail panel */}
        <AnimatePresence mode="wait">
          {expandedCategory && prefsByCategory[expandedCategory] && (
            <motion.div
              key={expandedCategory}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div className="mt-3 p-3 bg-neutral-50 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                    {PREFERENCE_CATEGORIES.find(c => c.key === expandedCategory)?.label} preferences
                  </p>
                  <button
                    onClick={() => {
                      const cat = PREFERENCE_CATEGORIES.find(c => c.key === expandedCategory);
                      if (cat) {
                        if (onAiPrompt) {
                          onAiPrompt(`Sure, let's update your ${cat.label.toLowerCase()} preference! ${cat.prompt}`, [...cat.suggestions]);
                        } else {
                          onSendMessage(cat.prompt);
                        }
                        onClose();
                      }
                    }}
                    className="flex items-center gap-1 text-[10px] font-semibold text-brand hover:text-brand-hover transition-colors"
                    title="Update this preference"
                  >
                    <Pencil size={10} />
                    Update
                  </button>
                </div>
                {prefsByCategory[expandedCategory].map((pref, i) => (
                  <div key={i} className="flex items-center gap-2 group/item">
                    <span className={`flex-1 text-[11px] leading-snug ${
                      pref.confidence === 'precise'
                        ? 'font-semibold text-black'
                        : 'text-neutral-500 italic'
                    }`}>
                      {pref.label}
                    </span>
                    {onRemovePreference && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemovePreference(pref.category, pref.label);
                        }}
                        className="opacity-0 group-hover/item:opacity-100 p-0.5 rounded-full hover:bg-red-50 text-neutral-300 hover:text-red-400 transition-all shrink-0"
                        title="Remove preference"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filled preferences summary (collapsed view) */}
        {filledCount > 0 && !expandedCategory && (
          <div className="mt-3 pt-3 border-t border-black/5 space-y-1.5">
            {(userPreferences ?? []).map((pref, i) => {
              const cat = PREFERENCE_CATEGORIES.find(c => c.key === pref.category);
              const Icon = cat?.icon ?? FileText;
              return (
                <div key={i} className="flex items-center gap-2 group/item">
                  <Icon size={11} className="text-brand shrink-0" />
                  <span className={`flex-1 text-[11px] leading-snug ${
                    pref.confidence === 'precise'
                      ? 'font-semibold text-black'
                      : 'text-neutral-500 italic'
                  }`}>
                    {pref.label}
                  </span>
                  {onRemovePreference && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemovePreference(pref.category, pref.label);
                      }}
                      className="opacity-0 group-hover/item:opacity-100 p-0.5 rounded-full hover:bg-red-50 text-neutral-300 hover:text-red-400 transition-all shrink-0"
                      title="Remove preference"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Hint for filled categories */}
        {filledCount > 0 && !expandedCategory && (
          <p className="text-[9px] text-neutral-300 mt-2 text-center">
            Tap a green category to view & edit
          </p>
        )}
      </div>

      {/* Actions (outside downloadable area) */}
      <div className="px-5 pb-4 pt-2 border-t border-black/5 space-y-2">
        {filledCount < TOTAL_CATEGORIES && (
          <p className="text-[10px] text-neutral-400 font-medium">
            Tap a gray category to tell us your preference
          </p>
        )}

        {!isLoggedIn && (
          <button
            onClick={() => { onClose(); onPreferenceLoginPrompt?.(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl bg-brand text-white hover:bg-brand-hover transition-all"
          >
            <LogIn size={13} />
            Sign in to keep preferences
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default RenterProfilePopover;
