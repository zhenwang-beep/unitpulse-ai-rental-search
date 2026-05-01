import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import FadeIn from './ui/FadeIn'
import { ArrowRight, Sparkles } from 'lucide-react'

const paths = [
  {
    id: 'marketing',
    title: 'Marketing',
    condition: 'Marketing strategy ineffective?',
    description: 'Start with UP Marketing. Drive high-quality leads with unparalleled efficiency.',
    bento: {
      containerClass: 'grid grid-cols-2 grid-rows-2 gap-2 md:gap-4 h-full p-0 md:p-4',
      images: [
        { src: '/products/marketing/marketing_1.png', class: 'col-span-2 row-span-1' }, // Wide (16:9)
        { src: '/products/marketing/marketing_2.png', class: 'col-span-1 row-span-1' }, // Square
        { src: '/products/marketing/marketing_3.png', class: 'col-span-1 row-span-1' } // Square
      ]
    }
  },
  {
    id: 'leasing',
    title: 'Leasing',
    condition: 'Having trouble converting leads?',
    description: 'Start with UP Leasing. Let our AI handle the entire leasing journey from lead to lease. You only pay for signed leases.',
    bento: {
      containerClass: 'grid grid-cols-2 grid-rows-3 gap-2 md:gap-4 h-full p-0 md:p-4',
      images: [
        { src: '/products/laas/laas_1.png', class: 'col-span-1 row-span-3' }, // Tall (9:16)
        { src: '/products/laas/laas_2.png', class: 'col-span-1 row-span-2' }, // Square
        { src: '/products/laas/laas_3.png', class: 'col-span-1 row-span-1' } // Wide (4:3)
      ]
    }
  },
  {
    id: 'insight',
    title: 'Insight',
    condition: 'Lacking visibility into the customer journey?',
    description: 'Start with UP Insight. Optimize first. Get deep visibility into your leasing funnel and identify bottlenecks before scaling.',
    bento: {
      containerClass: 'grid grid-cols-2 grid-rows-2 gap-2 md:gap-4 h-full p-0 md:p-4',
      images: [
        { src: '/products/insight/insight_1.png', class: 'col-span-1 row-span-1' }, // Square
        { src: '/products/insight/insight_3.png', class: 'col-span-1 row-span-1' }, // Square
        { src: '/products/insight/insight_2.png', class: 'col-span-2 row-span-1' } // Wide (16:9)
      ]
    }
  }
]

interface PathRecommendationProps {
  onOpenModal: () => void
}

const PathRecommendation: React.FC<PathRecommendationProps> = ({ onOpenModal }) => {
  const [activePath, setActivePath] = useState(paths[0])
  const [isAutoCycling, setIsAutoCycling] = useState(true)

  useEffect(() => {
    if (!isAutoCycling) return

    const interval = setInterval(() => {
      setActivePath((current) => {
        const currentIndex = paths.findIndex((p) => p.id === current.id)
        const nextIndex = (currentIndex + 1) % paths.length
        return paths[nextIndex]
      })
    }, 5000) // Change path every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoCycling])

  const handleManualSelect = (path: (typeof paths)[0]) => {
    setActivePath(path)
    setIsAutoCycling(false) // Stop auto-cycling if user manually interacts
  }

  return (
    <section className="py-24 bg-[#F8F9FA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="flex flex-col">
            <FadeIn>
              <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Not sure where to start?</p>
              <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-12 leading-tight">
                We'll Recommend <br /> a Path.
              </h2>
            </FadeIn>

            <div className="flex flex-col gap-4 mb-10">
              {paths.map((path) => (
                <button
                  key={path.id}
                  onClick={() => handleManualSelect(path)}
                  className={`text-left text-6xl md:text-7xl font-sans tracking-tight transition-colors duration-300 ${
                    activePath.id === path.id ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {path.title}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-300 pt-8 min-h-[180px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePath.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{activePath.condition}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed max-w-md">{activePath.description}</p>
                  <button
                    onClick={onOpenModal}
                    className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded font-medium hover:bg-gray-800 transition-colors group"
                  >
                    Get a Recommendation
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Content - Bento Box */}
          <div className="relative w-full aspect-square md:aspect-auto md:h-[500px] lg:h-[650px] flex items-center justify-center mt-8 lg:mt-0">
            {/* Grid background pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            ></div>

            {/* Decorative circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-black/5 rounded-full hidden md:block"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-black/5 rounded-full hidden md:block"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border border-black/5 rounded-full hidden md:block"></div>

            <div className="relative w-full h-full md:max-w-[90%] md:max-h-[90%]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePath.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className={`absolute inset-0 ${activePath.bento.containerClass}`}
                >
                  {activePath.bento.images.map((img, idx) => (
                    <div key={idx} className={`${img.class} rounded-2xl overflow-hidden shadow-lg relative bg-white border border-gray-200/50 group`}>
                      <img
                        src={img.src}
                        alt={`${activePath.title} feature ${idx + 1}`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PathRecommendation
