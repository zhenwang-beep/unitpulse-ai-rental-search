import React from 'react'

const PARTNERS = [
  { name: 'Category', logo: '/partners/Category.svg' },
  { name: 'JBG SMITH', logo: '/partners/JBG_SMITH.png' },
  { name: 'Jamison', logo: '/partners/Jamison.png' },
  { name: 'Wiseman', logo: '/partners/Wiseman.png' },
  { name: 'GPI', logo: '/partners/GPI.png' },
  { name: 'Arden', logo: '/partners/Arden.png' },
  { name: 'Audrey', logo: '/partners/Audrey.png' },
  { name: 'Roya', logo: '/partners/Roya.png' },
  { name: 'Sawyer', logo: '/partners/Sawyer.png' },
  { name: 'Sienna', logo: '/partners/Sienna.png' },
  { name: 'Somi', logo: '/partners/Somi.png' },
  { name: 'Atlas', logo: '/partners/Atlas.png' }
]

const PMS = [
  { name: 'AppFolio', logo: '/pms/Appfolio.png' },
  { name: 'Entrata', logo: '/pms/Entrata.png' },
  { name: 'Yardi', logo: '/pms/Yardi.png' }
]

const ILS = [
  { name: 'Apartments.com', logo: '/ils/Apartments.png' },
  { name: 'Apartment List', logo: '/ils/Apartsmentlist.png' },
  { name: 'Rent.com', logo: '/ils/Rent.png' },
  { name: 'Zillow', logo: '/ils/Zillow.png' }
]

const SOCIALS = [
  { name: 'Facebook', logo: '/socials/Facebook.png' },
  { name: 'Google', logo: '/socials/Google.png' },
  { name: 'Instagram', logo: '/socials/Instagram.png' },
  { name: 'Rednote', logo: '/socials/Rednote.png' },
  { name: 'TikTok', logo: '/socials/Tiktoc.png' },
  { name: 'WeChat', logo: '/socials/Wechat.png' }
]

const LogoTicker = ({
  items,
  direction = 'left',
  speed = 100,
  showLabel = false
}: {
  items: { name: string; logo: string }[]
  direction?: 'left' | 'right'
  speed?: number
  showLabel?: boolean
}) => {
  return (
    <div className="flex overflow-hidden select-none group mask-linear-fade">
      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-left {
          animation: scroll-left var(--speed) linear infinite;
        }
        .animate-scroll-right {
          animation: scroll-right var(--speed) linear infinite;
        }
        .mask-linear-fade {
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
      `}</style>

      <div
        className={`flex shrink-0 gap-16 items-center py-4 px-8 ${direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'} group-hover:[animation-play-state:paused]`}
        style={{ '--speed': `${speed}s` } as React.CSSProperties}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <div
            key={i}
            className="relative h-12 flex items-center justify-center gap-3 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
          >
            <img src={item.logo} alt={item.name} className="h-full w-auto object-contain max-w-[120px]" />
            {showLabel && <span className="text-lg font-semibold text-gray-700 whitespace-nowrap">{item.name}</span>}
          </div>
        ))}
      </div>

      <div
        className={`flex shrink-0 gap-16 items-center py-4 px-8 ${direction === 'left' ? 'animate-scroll-left' : 'animate-scroll-right'} group-hover:[animation-play-state:paused]`}
        style={{ '--speed': `${speed}s` } as React.CSSProperties}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <div
            key={i}
            className="relative h-12 flex items-center justify-center gap-3 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
          >
            <img src={item.logo} alt={item.name} className="h-full w-auto object-contain max-w-[120px]" />
            {showLabel && <span className="text-lg font-serif font-semibold text-gray-700 whitespace-nowrap">{item.name}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

const Clients: React.FC = () => {
  return (
    <section className="pt-16 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Trusted by Industry Leaders</p>
      </div>

      <div className="space-y-8">
        {/* Partners Row */}
        <LogoTicker items={PARTNERS} direction="left" speed={300} />

        {/* PMS Row
        <LogoTicker items={PMS} direction="right" speed={100} showLabel={true} />*/}

        {/* ILS Row
        <LogoTicker items={ILS} direction="left" speed={100} showLabel={true} />*/}

        {/* Socials Row
        <LogoTicker items={SOCIALS} direction="right" speed={100} showLabel={true} />*/}
      </div>
    </section>
  )
}

export default Clients
