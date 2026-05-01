import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue, useInView } from 'motion/react'
import { Megaphone, FileSignature, BarChart3, Play, Pause, CheckCircle2, Sparkles, RotateCcw } from 'lucide-react'
import { Pipeline } from './ProductSuite'

const ProductVideo = ({ src, isActive = true }: { src: string; isActive?: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressCircleRef = useRef<SVGCircleElement>(null)
  const [isFinished, setIsFinished] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasManuallyPaused, setHasManuallyPaused] = useState(false)

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && !hasManuallyPaused) {
        videoRef.current.play().catch(() => {})
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [isActive, hasManuallyPaused])

  const handleReplay = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
      setIsFinished(false)
      setIsPlaying(true)
      setHasManuallyPaused(false)
      if (progressCircleRef.current) {
        progressCircleRef.current.style.strokeDashoffset = '301.59'
      }
    }
  }

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setHasManuallyPaused(true)
      } else {
        videoRef.current.play().catch(() => {})
        setHasManuallyPaused(false)
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleEnded = () => {
    setIsFinished(true)
    setIsPlaying(false)
    if (progressCircleRef.current) {
      progressCircleRef.current.style.strokeDashoffset = '0'
    }
  }

  const handlePlay = () => {
    setIsFinished(false)
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  useEffect(() => {
    let animationFrameId: number

    const updateProgress = () => {
      if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
        const current = videoRef.current.currentTime
        const duration = videoRef.current.duration
        if (duration > 0) {
          const percent = (current / duration) * 100
          if (progressCircleRef.current) {
            const circumference = 301.59
            const offset = circumference - (circumference * percent) / 100
            progressCircleRef.current.style.strokeDashoffset = `${offset}`
          }
        }
      }
      animationFrameId = requestAnimationFrame(updateProgress)
    }

    animationFrameId = requestAnimationFrame(updateProgress)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="relative flex flex-col w-full h-full justify-center">
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        onEnded={handleEnded}
        onPlay={handlePlay}
        onPause={handlePause}
        className="w-full h-full object-contain bg-white rounded-2xl shadow-2xl border border-black/5"
      />

      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10 flex justify-center items-center">
        <div className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
          {/* Circular progress for pause/play state */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-500 flex items-center justify-center ${isFinished ? 'opacity-0' : 'opacity-100'}`}
          >
            <svg className="w-12 h-12 md:w-16 md:h-16 -rotate-90 transform" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" className="text-neutral-200" />
              <circle
                ref={progressCircleRef}
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray="301.59"
                strokeDashoffset="301.59"
                className="text-neutral-800 transition-all duration-100 ease-linear"
              />
            </svg>
          </div>

          <button
            onClick={isFinished ? handleReplay : handleTogglePlay}
            className={`
              flex items-center justify-center overflow-hidden transition-all duration-500 ease-in-out z-10 w-7 h-7 md:w-10 md:h-10 rounded-full shadow-sm border backdrop-blur-md
              ${
                isFinished ? 'bg-white hover:bg-surface-2 text-neutral-800 border-black/5' : 'bg-white/90 hover:bg-white text-neutral-800 border-black/5'
              }
            `}
          >
            <div className="relative flex items-center justify-center w-3.5 h-3.5 md:w-5 md:h-5 shrink-0">
              <div
                className={`absolute transition-all duration-500 ${isFinished ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}
              >
                <RotateCcw className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
              <div
                className={`absolute transition-all duration-500 ${!isFinished && isPlaying ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}
              >
                <Pause className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" />
              </div>
              <div
                className={`absolute transition-all duration-500 ${!isFinished && !isPlaying ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`}
              >
                <Play className="w-3 h-3 md:w-4 md:h-4 ml-0.5" fill="currentColor" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

const products = [
  {
    id: 'marketing',
    name: 'UP Marketing',
    action: 'Generate',
    titleSuffix: 'demand',
    icon: <Megaphone size={20} />,
    description: 'Turbocharge your marketing efficiency. Optimize your demand generation.',
    valuePoints: ['Omnichannel listing syndication', 'Real-time ad spend optimization', 'Automated content generation'],
    results: [
      { label: 'Increase in Qualified Leads', value: '3x' },
      { label: 'Reduction in CPA', value: '40%' }
    ],
    videoSrc: '/UP Marketing.mp4',
    caseStudy: {
      company: 'Greystar',
      quote:
        "UP Marketing completely transformed our top-of-funnel. We're seeing more qualified traffic than ever before without increasing our ad budget.",
      author: 'VP of Marketing'
    }
  },
  {
    id: 'leasing',
    name: 'UP Leasing',
    action: 'Convert',
    titleSuffix: 'leads',
    icon: <FileSignature size={20} />,
    description: 'Automates the entire conversion funnel. Handles chat, recommendations, sales, and guides prospects from inquiry to signed lease.',
    valuePoints: ['24/7 instant omnichannel response', 'Autonomous tour scheduling', 'Application & lease automation'],
    results: [
      { label: 'Faster Response Time', value: '< 2s' },
      { label: 'Higher Lease Conversion', value: '45%' }
    ],
    videoSrc: '/UP Leasing.mp4',
    caseStudy: {
      company: 'Equity Residential',
      quote:
        'Our leasing teams are no longer bogged down by repetitive inquiries. UP Leasing handles the heavy lifting, allowing us to focus on the human touch.',
      author: 'Regional Director'
    },
    reverse: true
  },
  {
    id: 'insight',
    name: 'UP Insight',
    action: 'Optimize',
    titleSuffix: 'operations',
    icon: <BarChart3 size={20} />,
    description:
      'Provides a full-funnel data dashboard and human-AI collaboration interface. Supervises and guides the Marketing and Leasing agents.',
    valuePoints: ['Unified portfolio visibility', 'Human-in-the-loop oversight', 'Predictive market analytics'],
    results: [
      { label: 'Portfolio Visibility', value: '100%' },
      { label: 'Hours Saved on Reporting', value: '20h/wk' }
    ],
    videoSrc: '/UP Insight.mp4',
    caseStudy: {
      company: 'AvalonBay',
      quote: 'UP Insight gives us the ultimate control tower. We can see exactly what the AI is doing and step in seamlessly when needed.',
      author: 'Chief Operating Officer'
    }
  }
]

const TimelineNodeHorizontal: React.FC<{ index: number; scrollYProgress: MotionValue<number>; total: number; name: string; onClick: () => void }> = ({
  index,
  scrollYProgress,
  total,
  name,
  onClick
}) => {
  const [isActive, setIsActive] = useState(false)

  useMotionValueEvent(scrollYProgress, 'change', (latest: number) => {
    const threshold = Math.max(0, index / (total - 1) - 0.1)
    setIsActive(latest >= threshold)
  })

  return (
    <div className="flex flex-col items-center gap-3 relative z-10 cursor-pointer group" onClick={onClick}>
      <motion.div
        initial={{ borderColor: 'rgba(64, 64, 64, 1)', backgroundColor: 'rgba(23, 23, 23, 1)', color: 'rgba(163, 163, 163, 1)' }}
        animate={{
          // Active: Olive On-Dark border + dark olive fill + Olive On-Dark text (per design system §1).
          borderColor: isActive ? 'rgba(168, 185, 125, 1)' : 'rgba(64, 64, 64, 1)',
          backgroundColor: isActive ? 'rgba(58, 78, 26, 1)' : 'rgba(23, 23, 23, 1)',
          color: isActive ? 'rgba(168, 185, 125, 1)' : 'rgba(163, 163, 163, 1)'
        }}
        transition={{ duration: 0.3 }}
        className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-heading text-lg shadow-lg group-hover:border-brand-on-dark/50 group-hover:text-brand-on-dark transition-colors"
      >
        {index + 1}
      </motion.div>
      <motion.span
        animate={{ color: isActive ? 'rgba(255, 255, 255, 1)' : 'rgba(107, 114, 128, 1)' }}
        className="hidden md:block text-[10px] md:text-xs font-bold uppercase tracking-widest text-center absolute top-14 w-32 -ml-16 left-1/2 group-hover:text-brand-on-dark transition-colors"
      >
        {name}
      </motion.span>
    </div>
  )
}

const ProductSlide: React.FC<{ product: any; index: number; total: number; scrollYProgress: MotionValue<number> }> = ({
  product,
  index,
  total,
  scrollYProgress
}) => {
  const [isActive, setIsActive] = useState(index === 0)

  useMotionValueEvent(scrollYProgress, 'change', (latest: number) => {
    const center = index / (total - 1)
    const threshold = 1 / (total - 1) / 2

    if (index === 0) {
      setIsActive(latest < center + threshold)
    } else if (index === total - 1) {
      setIsActive(latest >= center - threshold)
    } else {
      setIsActive(latest >= center - threshold && latest < center + threshold)
    }
  })

  return (
    <div className="w-screen h-full flex flex-col lg:flex-row items-center justify-center px-6 lg:px-24 pt-36 md:pt-48 lg:pt-32 pb-6 lg:pb-12 gap-4 md:gap-6 lg:gap-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isActive ? 1 : 0.2, y: isActive ? 0 : 20, scale: isActive ? 1 : 0.95 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full lg:w-1/3 flex flex-col md:flex-row lg:flex-col justify-between md:items-start lg:items-start lg:justify-center max-w-4xl lg:max-w-xl shrink-0 gap-6 lg:gap-0"
      >
        <div className="md:w-1/2 lg:w-full">
          <div className="flex items-center gap-4 mb-2 md:mb-4">
            <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl text-white">{product.name}</h3>
          </div>
          <div className="text-lg md:text-xl text-brand-on-dark mb-4 md:mb-6 font-light tracking-wide">
            {product.action} {product.titleSuffix}
          </div>
          <p className="text-neutral-400 mb-0 lg:mb-8 leading-relaxed text-sm md:text-lg">{product.description}</p>
        </div>
        <div className="md:w-1/2 lg:w-full space-y-3 md:space-y-4 md:self-end">
          {product.valuePoints.map((point: string, i: number) => (
            <div key={i} className="flex items-center gap-3 text-neutral-300 text-sm md:text-base">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-brand-on-dark shrink-0" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: isActive ? 1 : 0.2, scale: isActive ? 1 : 0.95 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className="w-full lg:w-2/3 flex-1 min-h-[200px] max-h-[40vh] md:max-h-[45vh] lg:max-h-[55vh] relative max-w-6xl"
      >
        <div className={`w-full h-full relative rounded-2xl overflow-hidden ${product.videoSrc ? '' : 'bg-white border border-black/5 shadow-2xl'}`}>
          {!product.videoSrc && <div className="absolute inset-0 bg-ai-tint/60 mix-blend-overlay opacity-50"></div>}
          {product.videoSrc && (
            <div className="w-full h-full relative z-10 flex items-center justify-center">
              <ProductVideo src={product.videoSrc} isActive={isActive} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

const MobileProductSlide: React.FC<{ product: any; index: number }> = ({ product, index }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: '-20% 0px -20% 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 sm:gap-8">
        <div className="sm:w-1/2">
          <div className="flex items-center gap-4 mb-2">
            <h3 className="font-heading text-3xl text-white">{product.name}</h3>
          </div>
          <div className="text-lg text-brand-on-dark mb-4 font-light tracking-wide">
            {product.action} {product.titleSuffix}
          </div>
          <p className="text-neutral-400 mb-0 leading-relaxed text-sm">{product.description}</p>
        </div>
        <div className="sm:w-1/2 space-y-3">
          {product.valuePoints.map((point: string, i: number) => (
            <div key={i} className="flex items-center gap-3 text-neutral-300 text-sm">
              <CheckCircle2 className="w-4 h-4 text-brand-on-dark shrink-0" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full aspect-video relative rounded-2xl overflow-hidden">
        {!product.videoSrc && <div className="absolute inset-0 bg-ai-tint/60 mix-blend-overlay opacity-50"></div>}
        {product.videoSrc && (
          <div className="w-full h-full relative z-10 flex items-center justify-center">
            <ProductVideo src={product.videoSrc} isActive={isInView} />
          </div>
        )}
      </div>
    </motion.div>
  )
}

const FeatureCanvas: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end']
  })
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.666666%'])

  const handleNodeClick = (index: number) => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect()
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const targetTop = rect.top + scrollTop

      const scrollableDistance = targetRef.current.offsetHeight - window.innerHeight
      const targetScrollY = targetTop + (index / (products.length - 1)) * scrollableDistance

      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section id="agents" className="bg-black text-white relative">
      <div className="pt-32 flex flex-col items-start md:items-center md:text-center text-left px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-4xl md:text-6xl mb-6 text-white"
        >
          One Unified Platform.
          <br />
          <span className="text-neutral-500">Three Powerful Agents.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-lg text-neutral-400 max-w-2xl"
        >
          AI agents that perform like your top leasing pros.
        </motion.p>
      </div>

      {/* Desktop Horizontal Scroll */}
      <div ref={targetRef} className="hidden md:block h-[300vh] relative">
        <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-black">
          <div className="absolute top-20 md:top-28 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-8 right-8 top-5 -translate-y-1/2 h-0.5 bg-neutral-900 -z-10"></div>
              <motion.div
                className="absolute left-8 right-8 top-5 -translate-y-1/2 h-0.5 bg-brand-on-dark -z-10 origin-left"
                style={{ scaleX: scrollYProgress }}
              ></motion.div>
              {products.map((product, index) => (
                <TimelineNodeHorizontal
                  key={product.id}
                  index={index}
                  total={products.length}
                  scrollYProgress={scrollYProgress}
                  name={product.name}
                  onClick={() => handleNodeClick(index)}
                />
              ))}
            </div>
          </div>

          <motion.div style={{ x }} className="flex w-[300vw] h-full items-center">
            {products.map((product, index) => (
              <ProductSlide key={product.id} product={product} index={index} total={products.length} scrollYProgress={scrollYProgress} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Mobile Stacked Layout */}
      <div className="md:hidden flex flex-col gap-24 px-6 py-16 relative z-10">
        {products.map((product, index) => (
          <MobileProductSlide key={product.id} product={product} index={index} />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="relative bg-neutral-900/80 border border-neutral-900 rounded-3xl p-8 md:p-12 md:pb-8 overflow-hidden flex flex-col"
        >
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-on-dark/10 rounded-full blur-[80px] pointer-events-none"></div>
          <div className="w-full relative z-10 mb-4">
            <Pipeline />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeatureCanvas
