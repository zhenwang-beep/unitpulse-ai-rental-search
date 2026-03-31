import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Property } from '../types';
import { X, MapPin, Bed, Bath, Ruler, Sparkles, Heart, Check, Calendar, FileText, ChevronDown, Menu, ChevronLeft, ChevronRight, Building2, MessageSquare, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ContactFormModal from './ContactFormModal';

interface PropertyDetailsModalProps {
  property: Property | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isInline?: boolean;
  isSigned?: boolean;
  onSignLease?: (id: string) => void;
  isLoggedIn?: boolean;
}

const BUILDING_AMENITIES = [
  { label: '24/7 Concierge', category: 'Building' },
  { label: 'Rooftop Deck', category: 'Building' },
  { label: 'Fitness Center', category: 'Building' },
  { label: 'Package Room', category: 'Building' },
  { label: 'Bike Storage', category: 'Building' },
  { label: 'EV Charging', category: 'Building' },
  { label: 'Co-working Lounge', category: 'Building' },
  { label: 'Dog Run', category: 'Building' },
  { label: 'In-unit W/D', category: 'Unit' },
  { label: 'Dishwasher', category: 'Unit' },
  { label: 'Central A/C', category: 'Unit' },
  { label: 'Hardwood Floors', category: 'Unit' },
  { label: 'Walk-in Closet', category: 'Unit' },
  { label: 'Private Balcony', category: 'Unit' },
  { label: 'Stainless Appliances', category: 'Unit' },
  { label: 'Smart Lock', category: 'Unit' },
  { label: 'Pet Friendly', category: 'Lifestyle' },
  { label: 'Community Garden', category: 'Lifestyle' },
  { label: 'BBQ Area', category: 'Lifestyle' },
  { label: 'Storage Unit', category: 'Lifestyle' },
];

const DEFAULT_FLOOR_PLANS = (seed: string | number) => [
  { type: 'Studio', priceRange: '$1,800 - $2,100', sqft: '450 - 550', available: 3, units: [
    { id: 'Unit 101', price: '$1,850', sqft: '480', amenities: ['City View', 'Modern Kitchen'], image: `https://picsum.photos/seed/${seed}s1/400/300`, images: [`https://picsum.photos/seed/${seed}s1/1200/800`] },
    { id: 'Unit 205', price: '$1,950', sqft: '510', amenities: ['High Floor', 'Balcony'], image: `https://picsum.photos/seed/${seed}s2/400/300`, images: [`https://picsum.photos/seed/${seed}s2/1200/800`] },
  ]},
  { type: '1B1B', priceRange: '$2,400 - $2,800', sqft: '700 - 850', available: 5, units: [
    { id: 'Unit 102', price: '$2,450', sqft: '720', amenities: ['Walk-in Closet', 'In-unit Laundry'], image: `https://picsum.photos/seed/${seed}1b1/400/300`, images: [`https://picsum.photos/seed/${seed}1b1/1200/800`] },
    { id: 'Unit 201', price: '$2,550', sqft: '780', amenities: ['Garden View', 'Quiet Side'], image: `https://picsum.photos/seed/${seed}1b2/400/300`, images: [`https://picsum.photos/seed/${seed}1b2/1200/800`] },
  ]},
  { type: '2B2B', priceRange: '$3,500 - $4,200', sqft: '1,100 - 1,300', available: 2, units: [
    { id: 'Unit 601', price: '$3,600', sqft: '1,150', amenities: ['Penthouse Level', 'Private Terrace'], image: `https://picsum.photos/seed/${seed}2b1/400/300`, images: [`https://picsum.photos/seed/${seed}2b1/1200/800`] },
  ]},
];

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  property,
  onClose,
  isFavorite,
  onToggleFavorite,
  isInline = false,
  isSigned = false,
  onSignLease,
  isLoggedIn = false,
}) => {
  const [expandedFloorPlan, setExpandedFloorPlan] = useState<string | null>(null);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [contactMode, setContactMode] = useState<'tour' | 'inquire' | null>(null);

  useEffect(() => {
    if (property && !isInline) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [property, isInline]);

  useEffect(() => {
    setIsAnalyzing(true);
    const timer = setTimeout(() => setIsAnalyzing(false), 1600);
    return () => clearTimeout(timer);
  }, [property?.id]);

  if (!property) return null;

  const images = (property.images?.length ? property.images : [property.image || `https://picsum.photos/seed/${property.imageSeed}/1200/800`]);
  const floorPlans = property.floorPlans?.length ? property.floorPlans : DEFAULT_FLOOR_PLANS(property.imageSeed);
  const matchScore = property.matchScore ?? 95;

  const openImage = (idx: number) => { setSelectedImageIndex(idx); setIsImageModalOpen(true); };

  const content = (
    <div className={`relative w-full ${isInline ? 'h-full bg-[#FCF9F8]' : 'max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl bg-white'} overflow-hidden flex flex-col`}>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">

        {/* Top navigation bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 gap-3">
          {/* Left: back / close */}
          <button
            onClick={onClose}
            aria-label={isInline ? "Back to search" : "Close property details"}
            className="flex items-center gap-1.5 pl-1 pr-3 py-1.5 bg-white/80 backdrop-blur-md shadow-sm border border-black/5 rounded-full hover:bg-white transition-colors shrink-0"
          >
            <ChevronLeft size={16} />
            {isInline && <span className="text-xs font-semibold">Back</span>}
          </button>

          <div className="flex-1" />

          {/* Right: favorite */}
          <button
            onClick={() => onToggleFavorite(property.id)}
            aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
            className={`p-2 backdrop-blur-md rounded-full transition-all duration-300 shrink-0 ${isFavorite ? 'bg-black text-white' : 'bg-white/80 shadow-sm border border-black/5 text-neutral-400 hover:bg-white hover:text-black'}`}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

          {/* Bento Box Image Grid — inset with padding, rounded corners */}
          <div className="px-4 md:px-5 mb-5">
          <div className="w-full grid grid-cols-4 grid-rows-2 gap-1 aspect-[3/2] md:aspect-[16/6] max-h-[42vh] overflow-hidden relative group rounded-2xl">
            {/* Main image */}
            <div
              className="col-span-4 md:col-span-2 row-span-2 relative cursor-pointer overflow-hidden"
              onClick={() => openImage(0)}
            >
              <img
                src={images[0]}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
                alt={property.title}
              />
            </div>
            {/* Smaller images (desktop only) */}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="hidden md:block col-span-1 row-span-1 relative cursor-pointer overflow-hidden"
                onClick={() => openImage(i)}
              >
                <img
                  src={images[i] || images[0]}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  alt=""
                />
                {i === 4 && images.length > 5 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-black text-lg">
                    +{images.length - 5}
                  </div>
                )}
              </div>
            ))}
            {/* View all button */}
            <button
              onClick={() => openImage(0)}
              className="absolute bottom-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-md border border-black/5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 hover:bg-black hover:text-white transition-all shadow-lg"
            >
              <Menu size={12} />
              View all photos
            </button>
          </div>
          </div>

        <div className="px-5 pb-6 space-y-8 max-w-3xl mx-auto w-full">

          {/* Title & Location */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-black text-white text-xs font-black uppercase tracking-wider rounded-full">New Listing</span>
              <span className="px-2.5 py-1 bg-[#4A5D23] text-white text-xs font-black uppercase tracking-wider rounded-full flex items-center gap-1">
                <Sparkles size={10} />
                {matchScore}% Match
              </span>
            </div>
            <h1 className="text-2xl font-black font-heading tracking-tight text-black leading-none">{property.title}</h1>
            <div className="flex items-center gap-1.5 text-neutral-400 font-bold text-sm">
              <MapPin size={14} className="text-black" />
              <span>{property.location}</span>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-3 border-y border-neutral-100 py-5">
            {[
              { icon: <Bed size={18} />, value: property.bedrooms, label: 'Beds' },
              { icon: <Bath size={18} />, value: property.bathrooms, label: 'Baths' },
              { icon: <Ruler size={18} />, value: property.sqft, label: 'Sq Ft' },
            ].map((stat, i) => (
              <div key={i} className={`flex items-center justify-center gap-3 ${i === 1 ? 'border-x border-neutral-100' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center text-black shrink-0">
                  {stat.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-black leading-none mb-1">{stat.value}</span>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider leading-none">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* AI Lifestyle Match */}
          <div className="bg-gradient-to-br from-[#F4F7EC] to-[#F4F7EC]/50 rounded-2xl p-5 border border-[#4A5D23]/15 relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className={`text-[#4A5D23] ${isAnalyzing ? 'animate-pulse' : ''}`} />
                <h3 className="text-xs font-black text-[#1a2609] uppercase tracking-wider">AI Lifestyle Match</h3>
              </div>
              {isAnalyzing && (
                <span className="text-[10px] font-bold text-[#4A5D23]/60 uppercase tracking-wider flex items-center gap-1">
                  <Loader2 size={10} className="animate-spin" />
                  Analyzing
                </span>
              )}
            </div>
            {isAnalyzing ? (
              <div className="space-y-2">
                <div className="h-3 bg-[#4A5D23]/10 rounded-full animate-pulse w-full" />
                <div className="h-3 bg-[#4A5D23]/10 rounded-full animate-pulse w-5/6" />
                <div className="h-3 bg-[#4A5D23]/10 rounded-full animate-pulse w-4/6 mt-3" />
                <div className="h-3 bg-[#4A5D23]/10 rounded-full animate-pulse w-full" />
                <div className="h-3 bg-[#4A5D23]/10 rounded-full animate-pulse w-3/4 mt-3" />
                <div className="h-3 bg-[#4A5D23]/10 rounded-full animate-pulse w-5/6" />
              </div>
            ) : (() => {
              const pricePerSqft = Math.round(property.price / property.sqft);
              const isPetFriendly = property.amenities.some(a => a.toLowerCase().includes('pet'));
              const hasOutdoor = property.amenities.some(a => ['balcony', 'garden', 'backyard', 'roof deck', 'rooftop'].some(k => a.toLowerCase().includes(k)));
              const hasRemoteWork = property.amenities.some(a => ['co-working', 'high speed', 'smart home', 'internet'].some(k => a.toLowerCase().includes(k)));
              const bedroomLabel = property.bedrooms === 0 ? 'studio' : `${property.bedrooms}-bed`;
              return (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-[#1a2609] leading-relaxed">
                    This {bedroomLabel} {property.type.toLowerCase()} in {property.location} aligns strongly with your search — here's why it stands out:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-xs text-[#243510] leading-relaxed">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-[#4A5D23]/15 flex items-center justify-center shrink-0 text-[#4A5D23] font-black text-[9px]">$</span>
                      <span>At <strong>${property.price.toLocaleString()}/mo</strong> (~${pricePerSqft}/sqft), it's priced {pricePerSqft < 4 ? 'competitively' : 'at market rate'} for {property.location} — good value for {property.sqft.toLocaleString()} sqft.</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs text-[#243510] leading-relaxed">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-[#4A5D23]/15 flex items-center justify-center shrink-0 text-[#4A5D23] font-black text-[9px]">✦</span>
                      <span>{property.amenities.slice(0, 2).map(a => <strong key={a}>{a}</strong>).reduce((acc, el, i) => i === 0 ? [el] : [...acc, ' and ', el], [] as React.ReactNode[])} make this ideal for {hasRemoteWork ? 'remote workers' : isPetFriendly ? 'pet owners' : 'modern city living'}.</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs text-[#243510] leading-relaxed">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-[#4A5D23]/15 flex items-center justify-center shrink-0 text-[#4A5D23] font-black text-[9px]">↑</span>
                      <span>{hasOutdoor ? `Outdoor access is a rare perk at this price — a strong lifestyle bonus for ${property.location}.` : `With ${property.amenities.length} listed amenities, the building adds meaningful value beyond the unit itself.`}</span>
                    </li>
                  </ul>
                  <p className="text-[10px] text-[#4A5D23]/60 font-medium pt-1 border-t border-[#4A5D23]/10">
                    {matchScore}% match based on your search preferences
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Floor Plans */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-black uppercase tracking-wider">Floor Plans</h3>
              <span className="text-xs font-bold text-[#4A5D23] uppercase tracking-wider">
                {floorPlans.reduce((sum, p) => sum + p.available, 0)} Units Available
              </span>
            </div>
            <div className="space-y-3">
              {floorPlans.map((plan) => (
                <div
                  key={plan.type}
                  className={`rounded-2xl border transition-all ${expandedFloorPlan === plan.type ? 'border-[#4A5D23] border-2' : 'border-black/5 hover:border-black/20'} bg-white overflow-hidden`}
                >
                  <button
                    onClick={() => setExpandedFloorPlan(expandedFloorPlan === plan.type ? null : plan.type)}
                    className="w-full p-5 flex items-center justify-between"
                  >
                    <div className="text-left space-y-1">
                      <span className="text-sm font-black text-black uppercase tracking-wider block">{plan.type}</span>
                      <div className="flex items-center gap-3 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                        <span>{plan.priceRange}</span>
                        <span>•</span>
                        <span>{plan.sqft} sqft</span>
                        <span className={plan.available > 0 ? 'text-[#4A5D23]' : 'text-neutral-300'}>
                          • {plan.available} Available
                        </span>
                      </div>
                    </div>
                    <ChevronDown size={16} className={`transition-transform duration-300 shrink-0 ${expandedFloorPlan === plan.type ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {expandedFloorPlan === plan.type && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 border-t border-black/5 space-y-3 pt-3">
                          {plan.units?.map((unit) => (
                            <div key={unit.id} className="space-y-3">
                              <div
                                onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)}
                                className={`flex gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedUnit === unit.id ? 'bg-[#4A5D23] text-white border-[#4A5D23]' : 'bg-[#F4F1EE] border-black/5 hover:border-black/20'}`}
                              >
                                {/* Unit image */}
                                <div
                                  className="w-20 h-20 rounded-lg overflow-hidden shrink-0 relative"
                                  onClick={(e) => { e.stopPropagation(); openImage(0); }}
                                >
                                  <img src={unit.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt={unit.id} />
                                </div>
                                {/* Unit info */}
                                <div className="flex-1 flex flex-col justify-between py-0.5">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <span className="text-xs font-black uppercase tracking-wider block">{unit.id}</span>
                                      <span className={`text-xs font-bold uppercase tracking-wider ${selectedUnit === unit.id ? 'text-white/60' : 'text-neutral-400'}`}>
                                        {plan.type} • {unit.sqft || plan.sqft}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-sm font-black block">{unit.price}</span>
                                      <span className={`text-xs font-black uppercase tracking-wider ${selectedUnit === unit.id ? 'text-[#8aaa4d]' : 'text-[#4A5D23]'}`}>Available Now</span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 mt-2">
                                    <button className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${selectedUnit === unit.id ? 'bg-white text-[#4A5D23]' : 'bg-[#4A5D23] text-white'}`}>
                                      Schedule Tour
                                    </button>
                                    <button className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all ${selectedUnit === unit.id ? 'border-white/30 text-white' : 'border-black/10 text-black'}`}>
                                      Contact
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <AnimatePresence>
                                {selectedUnit === unit.id && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-4 bg-[#F4F1EE] rounded-xl border border-black/5 space-y-4">
                                      <div className="space-y-2">
                                        <span className="text-xs font-black uppercase tracking-wider text-neutral-400">Unit Amenities</span>
                                        <div className="grid grid-cols-2 gap-2">
                                          {unit.amenities.map((am) => (
                                            <div key={am} className="flex items-center gap-2 px-3 py-2 bg-white border border-[#4A5D23]/15 rounded-lg">
                                              <Check size={10} className="text-[#4A5D23]" strokeWidth={3} />
                                              <span className="text-xs font-black text-black uppercase tracking-wider">{am}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <button className="w-full py-3 bg-[#4A5D23] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#3a4e1a] transition-all">
                                        <FileText size={14} />
                                        Apply for this unit
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-black uppercase tracking-wider">Amenities</h3>
            {(['Building', 'Unit', 'Lifestyle'] as const).map((cat) => {
              const propertyItems = cat === 'Unit'
                ? property.amenities.filter(a => !BUILDING_AMENITIES.some(b => b.label === a && b.category !== 'Unit'))
                : [];
              const buildingItems = BUILDING_AMENITIES.filter(b => b.category === cat).map(b => b.label);
              const items = cat === 'Unit'
                ? [...new Set([...propertyItems, ...buildingItems])]
                : buildingItems;
              return (
                <div key={cat} className="space-y-2">
                  <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">{cat}</span>
                  <div className="grid grid-cols-2 gap-2">
                    {items.map((am) => (
                      <div key={am} className="flex items-center gap-2.5 px-3 py-2.5 bg-[#F4F1EE] rounded-xl border border-black/5">
                        <Check size={11} strokeWidth={3} className="text-[#4A5D23] shrink-0" />
                        <span className="text-xs font-semibold text-neutral-700">{am}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing & Fees */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-black uppercase tracking-wider">Pricing & Fees</h3>
            <div className="bg-[#F4F1EE] rounded-2xl p-5 border border-black/5 space-y-3">
              {[
                { label: 'Rent', value: property.pricingAndFees?.rent || `$${property.price.toLocaleString()}` },
                { label: 'Deposit', value: property.pricingAndFees?.deposit || '$1,500' },
                { label: 'Application Fee', value: property.pricingAndFees?.applicationFee || '$50' },
                { label: 'Pet Fee', value: property.pricingAndFees?.petFee || '$300 (One-time)' },
                { label: 'Utilities', value: property.pricingAndFees?.utilities || 'Not Included (Water/Trash $45/mo)' },
              ].map((fee) => (
                <div key={fee.label} className="flex items-center justify-between pb-3 border-b border-black/10 last:border-0 last:pb-0">
                  <span className="text-xs font-bold text-neutral-500 tracking-wider">{fee.label}</span>
                  <span className="text-xs font-black text-black">{fee.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-black uppercase tracking-wider">About this home</h3>
            <p className="text-sm text-neutral-500 leading-relaxed font-medium">{property.description}</p>
          </div>

          {/* Nearby / Map */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-black uppercase tracking-wider">Nearby</h3>
            <div className="w-full aspect-video bg-neutral-100 rounded-2xl border border-black/5 overflow-hidden shadow-inner">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(property.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Sticky footer actions */}
      <div className="shrink-0 border-t border-black/5 bg-[#FCF9F8] px-4 lg:px-6 py-3 lg:py-5">
        <div className="max-w-3xl mx-auto w-full flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <span className="text-base lg:text-xl font-black font-heading text-black leading-tight whitespace-nowrap">
            ${property.price.toLocaleString()} <span className="font-semibold text-sm lg:text-sm opacity-70">/ mo</span>
          </span>
          <span className="text-xs text-neutral-500 mt-0.5 truncate max-w-[140px] lg:max-w-none">Unit 402 • Avail. Mar 1st</span>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setContactMode('inquire')}
            className="h-11 lg:h-12 px-4 lg:px-5 bg-neutral-100 text-black rounded-xl font-semibold text-sm hover:bg-neutral-200 transition-all"
          >
            Inquire
          </button>
          <button
            onClick={() => setContactMode('tour')}
            className="h-11 lg:h-12 px-4 lg:px-5 bg-[#4A5D23] text-white rounded-xl font-semibold text-sm hover:bg-[#3a4e1a] transition-all flex items-center gap-1.5"
          >
            <Calendar size={15} className="lg:hidden" />
            <Calendar size={16} className="hidden lg:block" />
            <span className="lg:hidden">Tour</span>
            <span className="hidden lg:inline">Schedule a tour</span>
          </button>
        </div>
        </div>
      </div>


      {/* Enlarged Image Modal — rendered via portal to escape stacking context */}
      {createPortal(
        <AnimatePresence>
          {isImageModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] bg-black/95 flex flex-col"
            >
            {/* Header */}
            <div className="p-5 flex justify-between items-center text-white border-b border-white/10">
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-wider">{property.title}</span>
                <span className="text-xs font-bold opacity-60 uppercase tracking-wider">{selectedImageIndex + 1} / {images.length}</span>
              </div>
              <button onClick={() => setIsImageModalOpen(false)} className="p-3 hover:bg-white/10 rounded-full transition-all">
                <X size={22} />
              </button>
            </div>

            {/* Main image */}
            <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
              <button
                onClick={() => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                aria-label="Previous image"
                className="absolute left-4 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white z-10 border border-white/10 transition-all"
              >
                <ChevronLeft size={28} />
              </button>
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                src={images[selectedImageIndex]}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                referrerPolicy="no-referrer"
                alt=""
              />
              <button
                onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
                aria-label="Next image"
                className="absolute right-4 p-3 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white z-10 border border-white/10 transition-all"
              >
                <ChevronRight size={28} />
              </button>
            </div>

            {/* Thumbnails */}
            <div className="p-4 bg-black/40 border-t border-white/10 flex gap-2 justify-center overflow-x-auto shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${selectedImageIndex === idx ? 'border-[#4A5D23]' : 'border-transparent opacity-40 hover:opacity-80'}`}
                >
                  <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="" />
                </button>
              ))}
            </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );

  if (isInline) return (
    <>
      {content}
      {contactMode && (
        <ContactFormModal
          mode={contactMode}
          property={property}
          isLoggedIn={isLoggedIn}
          onClose={() => setContactMode(null)}
        />
      )}
    </>
  );

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
        {content}
      </div>
      {contactMode && (
        <ContactFormModal
          mode={contactMode}
          property={property}
          isLoggedIn={isLoggedIn}
          onClose={() => setContactMode(null)}
        />
      )}
    </>
  );
};

export default PropertyDetailsModal;
