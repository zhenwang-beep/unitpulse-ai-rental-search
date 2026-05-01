import React, { useState } from 'react'
import FadeIn from './ui/FadeIn'
import { SpotlightHighlight } from './ui/hero-highlight'
import { Play, ArrowRight } from 'lucide-react'

// --- VISUAL COMPONENT ---

const HeroVisual = () => {
  return (
    <div className="relative w-full h-full min-h-[350px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[650px] flex items-center justify-center overflow-visible select-none pointer-events-none origin-center">
      {/* CSS for animations */}
      <style>{`
          @keyframes float-gentle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }

          /*
             Vertical Drop Animation for Inbound Traffic
             Flows along the dotted line (single file)
             No overlapping
          */
          @keyframes vertical-drop {
             0% { opacity: 0; transform: translate(0, -250px) scale(0.5); }
             10% { opacity: 1; transform: translate(0, -220px) scale(0.9); }
             70% { opacity: 1; transform: translate(0, -70px) scale(0.9); }
             85% { opacity: 1; transform: translate(0, -50px) scale(0.4); } /* Shrink into stack */
             95% { opacity: 0; transform: translate(0, -40px) scale(0.1); }
             100% { opacity: 0; transform: translate(0, -40px) scale(0); }
          }

          /* Vertical Output Stream (Under Bottom to Down) */
          @keyframes output-stream-vertical {
             0% { opacity: 0; transform: translate(0, 40px) scale(0.5); }
             20% { opacity: 1; transform: translate(0, 80px) scale(1); }
             80% { opacity: 1; transform: translate(0, 240px) scale(1); }
             100% { opacity: 0; transform: translate(0, 280px) scale(0.8); }
          }

          @keyframes cube-color-fill {
             0%, 20% { fill: #ffffff; }
             60%, 100% { fill: var(--cube-color); }
          }
          @keyframes logo-color-shift {
             0%, 20% { filter: brightness(1) invert(0); }
             60%, 100% { filter: brightness(0) invert(1); }
          }

          /* Expanding/Compressing Hamburger Stack Animations */
          @keyframes expand-stack-1 {
             0%, 100% { transform: translateY(0); }
             50% { transform: translateY(-18px); }
          }
          @keyframes expand-stack-2 {
             0%, 100% { transform: translateY(0); }
             50% { transform: translateY(-6px); }
          }
          @keyframes expand-stack-3 {
             0%, 100% { transform: translateY(0); }
             50% { transform: translateY(6px); }
          }
          @keyframes expand-stack-4 {
             0%, 100% { transform: translateY(0); }
             50% { transform: translateY(18px); }
          }

          /* Panel Float Animations with slight variations */
          @keyframes panel-float-1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
          @keyframes panel-float-2 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
          @keyframes panel-float-3 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          @keyframes panel-float-4 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

          /* --- ICON ANIMATIONS --- */

          /* Chat Bubbles */
          @keyframes chat-pop-1 { 0%, 100% { opacity: 0; transform: translateY(4px) scale(0.8); } 10%, 90% { opacity: 1; transform: translateY(0) scale(1); } }
          @keyframes chat-pop-2 { 0%, 25% { opacity: 0; transform: translateY(4px) scale(0.8); } 35%, 90% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; } }
          @keyframes chat-pop-3 { 0%, 50% { opacity: 0; transform: translateY(4px) scale(0.8); } 60%, 90% { opacity: 1; transform: translateY(0) scale(1); } 100% { opacity: 0; } }

          /* Scanner: Updated to finish scan before badge appears */
          @keyframes scan-laser {
             0% { transform: translateY(0); opacity: 0; }
             10% { opacity: 1; }
             50% { transform: translateY(28px); opacity: 1; } /* Scan finishes earlier */
             55% { transform: translateY(28px); opacity: 0; }
             100% { opacity: 0; }
          }
          @keyframes verify-badge {
             0%, 55% { opacity: 0; } /* Wait for scan to finish */
             65%, 90% { opacity: 1; }
             100% { opacity: 0; }
          }

          /* Graph: Updated dot to simple fade in */
          @keyframes graph-draw {
             0% { stroke-dashoffset: 100; }
             50%, 100% { stroke-dashoffset: 0; }
          }
          @keyframes dot-appear {
             0%, 45% { opacity: 0; }
             55%, 100% { opacity: 1; }
          }

          /* Calendar - Changed from scale to opacity fade */
          @keyframes cal-dot-pop {
             0%, 100% { opacity: 0; }
             20%, 80% { opacity: 1; }
          }

       `}</style>

      {/* ViewBox adjusted to 280 140 840 740 to zoom out slightly and prevent cut-offs on all sides */}
      <svg viewBox="280 140 840 740" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="grad-glass-surface" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#d1fae5" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glow-core" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="drop-shadow-lg" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000000" floodOpacity="0.1" />
          </filter>
          <filter id="shadow-inner-layer" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* --- BASE GROUNDING GLOW --- */}
        <g transform="translate(700, 500) scale(1, 0.4)">
          <circle r="250" fill="url(#grad-glass-surface)" opacity="0.4" filter="url(#glow-core)" />
        </g>

        {/* --- OUTPUT STREAM (Drawn FIRST to be behind/under stack) --- */}
        <g transform="translate(700, 500)">
          {/* Path Line - Aligned Center */}
          <path d="M 0 60 L 0 280" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="8 8" strokeLinecap="round" />

          {[0, 1, 2].map((i) => (
            <g key={i} style={{ animation: `output-stream-vertical 6s ease-out infinite`, animationDelay: `${i * 2}s` }}>
              {/* Increased scale slightly (1.1) */}
              <g transform="scale(1.2)">
                {/* Shorter, wider document shape */}
                <rect x="-16" y="-14" width="32" height="28" rx="2" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />

                {/* Text Lines */}
                <path d="M -8 -6 L 8 -6" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" />
                <path d="M -8 0 L 8 0" stroke="#e5e7eb" strokeWidth="2" strokeLinecap="round" />

                {/* Badge (Circle + Check) */}
                <circle cx="10" cy="10" r="7" fill="#10b981" />
                <path d="M 7 10 L 9 12 L 13 8" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </g>
          ))}

          <g transform="translate(0, 310)">
            <text textAnchor="middle" className="font-mono text-sm font-bold fill-neutral-400 uppercase tracking-widest">
              Signed Leases
            </text>
          </g>
        </g>

        {/* --- SURROUNDING AGENT PANELS (Behind Core Stack) --- */}
        <g transform="translate(700, 500)">
          {/* Panel 1: UP Marketing (Top Left) */}
          <g transform="translate(-300, -120)">
            <g style={{ animation: 'panel-float-1 6s ease-in-out infinite' }}>
              <path d="M 160 48 L 260 100" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              <rect
                x="0"
                y="0"
                width="160"
                height="96"
                rx="12"
                fill="rgba(255,255,255,0.9)"
                stroke="#e5e7eb"
                strokeWidth="1"
                filter="url(#drop-shadow-lg)"
              />

              {/* ANIMATED ICON: Target/Marketing */}
              <g transform="translate(65, 20) scale(1.2)">
                <circle cx="15" cy="15" r="10" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                <circle cx="15" cy="15" r="5" fill="none" stroke="#10b981" strokeWidth="2" />
                <circle cx="15" cy="15" r="2" fill="#10b981" style={{ animation: 'dot-appear 2s infinite' }} />
              </g>
              <text x="80" y="78" textAnchor="middle" className="font-sans text-[13px] font-bold fill-neutral-800">
                UP Marketing
              </text>
            </g>
          </g>

          {/* Panel 2: UP Leasing (Top Right) */}
          <g transform="translate(140, -120)">
            <g style={{ animation: 'panel-float-2 7s ease-in-out infinite' }}>
              <path d="M 0 48 L -100 100" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              <rect
                x="0"
                y="0"
                width="160"
                height="96"
                rx="12"
                fill="rgba(255,255,255,0.9)"
                stroke="#e5e7eb"
                strokeWidth="1"
                filter="url(#drop-shadow-lg)"
              />

              {/* ANIMATED ICON: Chat Bubbles */}
              <g transform="translate(65, 20) scale(1.2)">
                <g style={{ animation: 'chat-pop-1 4s infinite' }}>
                  <rect x="0" y="4" width="20" height="6" rx="3" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="0.5" />
                </g>
                <g style={{ animation: 'chat-pop-2 4s infinite' }}>
                  <rect x="10" y="14" width="20" height="6" rx="3" fill="#10b981" />
                </g>
                <g style={{ animation: 'chat-pop-3 4s infinite' }}>
                  <rect x="0" y="24" width="16" height="6" rx="3" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="0.5" />
                </g>
              </g>
              <text x="80" y="78" textAnchor="middle" className="font-sans text-[13px] font-bold fill-neutral-800">
                UP Leasing
              </text>
            </g>
          </g>

          {/* Panel 3: UP Insight (Bottom Center) */}
          <g transform="translate(-80, 120)">
            <g style={{ animation: 'panel-float-3 5.5s ease-in-out infinite' }}>
              <path d="M 80 0 L 80 -100" stroke="#e5e7eb" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
              <rect
                x="0"
                y="0"
                width="160"
                height="96"
                rx="12"
                fill="rgba(255,255,255,0.9)"
                stroke="#e5e7eb"
                strokeWidth="1"
                filter="url(#drop-shadow-lg)"
              />

              {/* ANIMATED ICON: Graph */}
              <g transform="translate(60, 20) scale(1.2)">
                <path d="M 5 25 L 5 5 M 5 25 L 35 25" stroke="#e5e7eb" strokeWidth="1.5" />
                <path
                  d="M 5 20 L 15 12 L 22 16 L 32 4"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="100"
                  style={{ animation: 'graph-draw 4s ease-in-out infinite' }}
                />
                <circle
                  cx="32"
                  cy="4"
                  r="2.5"
                  fill="#10b981"
                  style={{ animation: 'dot-appear 4s ease-in-out infinite', transformOrigin: 'center' }}
                />
              </g>
              <text x="80" y="78" textAnchor="middle" className="font-sans text-[13px] font-bold fill-neutral-800">
                UP Insight
              </text>
            </g>
          </g>
        </g>

        {/* --- CORE INFRASTRUCTURE (Hamburger Stack) --- */}
        {/* Order: Bottom -> Top so Top covers Bottom */}
        <g transform="translate(700, 500) scale(1.15)">
          {/* Layer 4 - Bottom (White) - SMALLEST */}
          <g transform="translate(0, 45)">
            <g style={{ animation: 'expand-stack-4 4s ease-in-out infinite' }}>
              <ellipse cx="0" cy="0" rx="90" ry="34" fill="#10b981" strokeWidth="0" filter="url(#drop-shadow-lg)" />
            </g>
          </g>

          {/* Layer 3 - Mid Bottom - MEDIUM SMALL */}
          <g transform="translate(0, 20)">
            <g style={{ animation: 'expand-stack-3 4s ease-in-out infinite' }}>
              <ellipse cx="0" cy="0" rx="100" ry="38" fill="#d1fae5" stroke="#10b981" strokeWidth="1" />
              {/* Side Shadow for depth */}
              <path d="M -100 0 A 100 38 0 0 0 100 0 L 100 10 A 100 38 0 0 1 -100 10 Z" fill="#047857" opacity="0.1" />
            </g>
          </g>

          {/* Layer 2 - Mid Top - MEDIUM LARGE */}
          <g transform="translate(0, -5)">
            <g style={{ animation: 'expand-stack-2 4s ease-in-out infinite' }}>
              <ellipse cx="0" cy="0" rx="110" ry="42" fill="#a7f3d0" stroke="#10b981" strokeWidth="1" />
              {/* Inner detail */}
              <ellipse cx="0" cy="0" rx="80" ry="25" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
            </g>
          </g>

          {/* Layer 1 - Top (Covering everything below) - LARGEST */}
          <g transform="translate(0, -30)">
            <g style={{ animation: 'expand-stack-1 4s ease-in-out infinite' }}>
              {/* Top Surface */}
              <ellipse cx="0" cy="0" rx="120" ry="46" fill="#ecfdf5" stroke="#10b981" strokeWidth="1" />

              {/* Entry Portal Glow */}
              <ellipse cx="0" cy="0" rx="60" ry="18" fill="#10b981" opacity="0.2" filter="url(#glow-core)" />
              <ellipse cx="0" cy="0" rx="50" ry="15" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="3 3" />
            </g>
          </g>

          {/* Badge - Reverted text style, moved lower to hover around 3rd layer */}
          <g transform="translate(0, 35)">
            {/* Floating Animation for Badge */}
            <g style={{ animation: 'float-gentle 4s ease-in-out infinite' }}>
              <rect
                x="-80"
                y="-18"
                width="160"
                height="36"
                rx="18"
                fill="rgba(6, 78, 59, 0.85)"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
                filter="url(#drop-shadow-lg)"
              />
              <circle cx="-55" cy="0" r="4" fill="#34d399" className="animate-pulse" />
              <text x="10" y="5" textAnchor="middle" className="font-sans text-sm font-bold fill-white tracking-widest">
                UNITPULSE AI
              </text>
            </g>
          </g>
        </g>

        {/* --- INPUT STREAM (Drawn LAST to overlap Top Layer slightly if needed, but animation stops at top) --- */}
        <g transform="translate(700, 500)">
          {/* Path Line - Shortened */}
          <path d="M 0 -220 L 0 -50" stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4 4" strokeLinecap="round" />

          {[
            // Single file line, spaced out to prevent overlap (4.5s loop / 3 items = 1.5s gap)
            { color: '#1877F2', topColor: '#4267B2', icon: 'https://cdn.simpleicons.org/facebook/1877F2', delay: 0 },
            { color: '#FF2442', topColor: '#FF2442', icon: 'https://cdn.simpleicons.org/xiaohongshu/FF2442', delay: 1.5 },
            { color: '#0074E4', topColor: '#0074E4', icon: 'https://cdn.simpleicons.org/zillow/0074E4', delay: 3.0 }
          ].map((item, i) => (
            <g
              key={i}
              style={
                {
                  opacity: 0,
                  animation: `vertical-drop 4.5s linear infinite`,
                  animationDelay: `${item.delay}s`,
                  '--cube-color': item.color
                } as React.CSSProperties
              }
            >
              {/* Increased scale slightly (1.1) */}
              <g transform="scale(0.9)">
                {/* Left Face */}
                <path
                  d="M 0 20 L 0 50 L -25 35 L -25 5 Z"
                  stroke={item.color}
                  filter="brightness(0.95)"
                  strokeWidth="1"
                  style={{ animation: `cube-color-fill 4.5s linear infinite`, animationDelay: `${item.delay}s` }}
                />
                {/* Right Face */}
                <path
                  d="M 0 20 L 25 5 L 25 35 L 0 50 Z"
                  stroke={item.color}
                  filter="brightness(0.85)"
                  strokeWidth="1"
                  style={{ animation: `cube-color-fill 4.5s linear infinite`, animationDelay: `${item.delay}s` }}
                />
                {/* Top Face */}
                <path
                  d="M 0 20 L 25 5 L 0 -10 L -25 5 Z"
                  stroke={item.color}
                  strokeWidth="1"
                  style={{ animation: `cube-color-fill 4.5s linear infinite`, animationDelay: `${item.delay}s` }}
                />

                {/* Logo Image */}
                <image
                  href={item.icon}
                  x="-10"
                  y="2"
                  width="20"
                  height="20"
                  style={{
                    transform: 'skewY(10deg) skewX(-10deg) scale(1, 0.6)',
                    animation: `logo-color-shift 4.5s linear infinite`,
                    animationDelay: `${item.delay}s`
                  }}
                />
              </g>
            </g>
          ))}

          {/* Adjusted Text Position */}
          <g transform="translate(0, -250)">
            <text textAnchor="middle" className="font-mono text-sm font-bold fill-neutral-400 uppercase tracking-widest">
              Inbound Traffic
            </text>
          </g>
        </g>
      </svg>
    </div>
  )
}

interface HeroProps {
  onOpenModal: (email: string) => void
}

const Hero: React.FC<HeroProps> = ({ onOpenModal }) => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onOpenModal(email)
  }

  return (
    <section className="relative bg-transparent overflow-hidden pt-48 pb-20 lg:pt-56 lg:pb-32">
      <div className="max-w-5xl mx-auto px-6 w-full relative z-10 flex flex-col items-center text-center">
        {/* Content */}
        <div className="w-full relative z-20">
          <FadeIn delay={100}>
            <h1 className="leading-[1.15] tracking-tight mb-8 text-5xl sm:text-5xl md:text-7xl lg:text-8xl flex flex-row flex-wrap items-center justify-center gap-x-3 sm:gap-x-4">
              <span className="font-heading text-black font-medium">AI Agents for</span>
              <SpotlightHighlight className="font-heading italic text-neutral-400 font-light">Leasing</SpotlightHighlight>
            </h1>
          </FadeIn>

          <FadeIn delay={300}>
            <p className="text-lg md:text-xl text-neutral-500 mb-12 font-light leading-relaxed max-w-2xl mx-auto">
              AI operates, you steer. From demand generation to signed leases. Execute with speed and precision.
            </p>
          </FadeIn>

          <FadeIn delay={500}>
            <div className="flex flex-col items-center gap-10">
              {/* Email Capture */}
              <form onSubmit={handleSubmit} className="w-full max-w-md relative group mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-4 pr-16 sm:pr-40 bg-surface-2 border border-black/5 rounded-lg text-black outline-none focus:border-black focus:ring-0 transition-all placeholder:text-neutral-400 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="absolute top-1.5 right-1.5 bottom-1.5 w-11 sm:w-auto sm:px-4 bg-brand text-white text-xs sm:text-[10px] font-bold uppercase tracking-[0.1em] hover:bg-brand-hover transition-all rounded-lg flex items-center justify-center gap-2"
                  aria-label="Request Demo"
                >
                  <span className="hidden sm:inline">Request Demo</span>
                  <ArrowRight size={14} className="sm:w-3 sm:h-3" />
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

export default Hero
