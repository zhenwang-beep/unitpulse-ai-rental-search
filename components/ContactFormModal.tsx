import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Calendar, MessageSquare, Check, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Property } from '../types';

type FormMode = 'tour' | 'inquire';

interface ContactFormModalProps {
  mode: FormMode;
  property: Property;
  isLoggedIn?: boolean;
  onClose: () => void;
}

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM',
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDisplay(ymd: string) {
  if (!ymd) return '';
  const [y, m, d] = ymd.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

// --- Custom calendar picker ---
const DatePicker: React.FC<{ value: string; minValue: string; onChange: (v: string) => void }> = ({ value, minValue, onChange }) => {
  const today = new Date();
  const initDate = value ? new Date(value + 'T00:00:00') : new Date(minValue + 'T00:00:00');
  const [viewYear, setViewYear] = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const minDate = new Date(minValue + 'T00:00:00');

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDay = (day: number) => {
    const selected = new Date(viewYear, viewMonth, day);
    if (selected < minDate) return;
    onChange(toYMD(selected));
    setOpen(false);
  };

  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full h-10 px-3 bg-neutral-50 border rounded-xl text-sm text-left flex items-center justify-between transition-all
          ${open ? 'border-[#4A5D23] ring-2 ring-[#4A5D23]/30' : 'border-black/8'}
          ${value ? 'text-black' : 'text-neutral-400'}`}
      >
        <span>{value ? formatDisplay(value) : 'Select a date'}</span>
        <Calendar size={15} className={value ? 'text-[#4A5D23]' : 'text-neutral-300'} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0, 0, 0.2, 1] }}
            className="absolute left-0 right-0 mt-1.5 z-10 bg-white border border-black/8 rounded-2xl shadow-xl p-4"
          >
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={prevMonth}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-black"
              >
                <ChevronLeft size={15} />
              </button>
              <span className="text-sm font-black text-black">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-black"
              >
                <ChevronRight size={15} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {DAYS.map(d => (
                <div key={d} className="text-center text-[10px] font-black text-neutral-400 uppercase tracking-wider py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-y-0.5">
              {cells.map((day, i) => {
                if (!day) return <div key={i} />;
                const cellDate = new Date(viewYear, viewMonth, day);
                const ymd = toYMD(cellDate);
                const isSelected = ymd === value;
                const isDisabled = cellDate < minDate;
                const isToday = toYMD(today) === ymd;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => selectDay(day)}
                    className={`mx-auto w-8 h-8 rounded-full text-sm font-semibold transition-all flex items-center justify-center
                      ${isSelected ? 'bg-black text-white' : ''}
                      ${!isSelected && isToday ? 'border border-[#4A5D23] text-[#4A5D23]' : ''}
                      ${!isSelected && !isToday && !isDisabled ? 'hover:bg-neutral-100 text-black' : ''}
                      ${isDisabled ? 'text-neutral-300 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// -------

const ContactFormModal: React.FC<ContactFormModalProps> = ({ mode, property, isLoggedIn, onClose }) => {
  const [name, setName] = useState(isLoggedIn ? 'Felix Zhou' : '');
  const [email, setEmail] = useState(isLoggedIn ? 'felix.zhou@gmail.com' : '');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState(
    mode === 'inquire'
      ? `Hi, I'm interested in ${property.title} in ${property.location}. Could you please share more details about availability and pricing?`
      : ''
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return toYMD(d);
  })();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const isValid = () => {
    if (!name.trim() || !email.trim()) return false;
    if (mode === 'tour' && (!date || !time)) return false;
    if (mode === 'inquire' && !message.trim()) return false;
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1400);
  };

  const isTour = mode === 'tour';

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        {/* Sheet */}
        <motion.div
          initial={{ y: 60, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 60, opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-visible"
        >
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-14 px-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#4A5D23]/10 flex items-center justify-center mb-5">
                <Check size={28} className="text-[#4A5D23]" strokeWidth={2.5} />
              </div>
              <h2 className="text-lg font-black text-black mb-2">
                {isTour ? 'Tour Requested!' : 'Message Sent!'}
              </h2>
              <p className="text-sm text-neutral-500 leading-relaxed mb-1">
                {isTour
                  ? `We'll confirm your tour at ${property.title} for ${formatDisplay(date)} at ${time}.`
                  : `Someone from ${property.title} will reach out to you shortly.`}
              </p>
              <p className="text-xs text-neutral-400 mb-8">Confirmation sent to {email}</p>
              <button
                onClick={onClose}
                className="px-8 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-black/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#4A5D23]/10 flex items-center justify-center">
                    {isTour
                      ? <Calendar size={17} className="text-[#4A5D23]" />
                      : <MessageSquare size={17} className="text-[#4A5D23]" />}
                  </div>
                  <div>
                    <h2 className="text-base font-black text-black">
                      {isTour ? 'Schedule a Tour' : 'Send a Message'}
                    </h2>
                    <p className="text-xs text-neutral-400 truncate max-w-[200px]">{property.title}</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-1.5 rounded-full hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-black">
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 overflow-y-auto max-h-[70vh]">
                {/* Name + Email */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Felix Zhou"
                      required
                      className="w-full h-10 px-3 bg-neutral-50 border border-black/8 rounded-xl text-sm text-black placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#4A5D23]/30 focus:border-[#4A5D23] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      required
                      className="w-full h-10 px-3 bg-neutral-50 border border-black/8 rounded-xl text-sm text-black placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#4A5D23]/30 focus:border-[#4A5D23] transition-all"
                    />
                  </div>
                </div>

                {/* Phone (optional) */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                    Phone <span className="font-medium normal-case tracking-normal text-neutral-400">(optional)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full h-10 px-3 bg-neutral-50 border border-black/8 rounded-xl text-sm text-black placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#4A5D23]/30 focus:border-[#4A5D23] transition-all"
                  />
                </div>

                {isTour ? (
                  <>
                    {/* Custom date picker */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Preferred Date</label>
                      <DatePicker value={date} minValue={minDate} onChange={setDate} />
                    </div>

                    {/* Time */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Preferred Time</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {TIME_SLOTS.map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setTime(slot)}
                            className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${time === slot ? 'bg-[#4A5D23] text-white' : 'bg-neutral-50 border border-black/8 text-neutral-600 hover:border-[#4A5D23]/40 hover:text-[#4A5D23]'}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Message</label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={4}
                      required
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-black/8 rounded-xl text-sm text-black placeholder:text-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#4A5D23]/30 focus:border-[#4A5D23] transition-all resize-none leading-relaxed"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isValid() || submitting}
                  className="w-full h-11 bg-[#4A5D23] text-white rounded-xl text-sm font-semibold hover:bg-[#3a4e1a] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting
                    ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                    : isTour ? 'Request Tour' : 'Send Message'}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default ContactFormModal;
