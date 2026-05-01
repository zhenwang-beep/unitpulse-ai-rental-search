import React, { useEffect, useState, useRef } from 'react'
import FadeIn from './ui/FadeIn'
import CaseStudy from './CaseStudy'

const AnimatedValue = ({ value }: { value: string }) => {
  const [displayValue, setDisplayValue] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  // Parse value: extracts prefix, number, and suffix
  // e.g., "< 2S" -> prefix: "< ", number: 2, suffix: "S"
  // e.g., "24/7" -> prefix: "", number: 24, suffix: "/7"
  const match = value.match(/^(\D*)([\d.]+)(\D*)$/)
  const prefix = match ? match[1] : ''
  const numberVal = match ? parseFloat(match[2]) : 0
  const suffix = match ? match[3] : ''

  // If no match (e.g. pure text without numbers), just return value
  if (!match) return <span>{value}</span>

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const duration = 2000 // 2s animation

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      // Easing (easeOutExpo)
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

      const current = numberVal * ease
      setDisplayValue(current)

      if (progress < 1) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }, [isVisible, numberVal])

  // Formatting to handle integers vs decimals
  const formattedNumber = Number.isInteger(numberVal) ? Math.round(displayValue) : displayValue.toFixed(1)

  return (
    <span ref={elementRef} className="tabular-nums">
      {prefix}
      {formattedNumber}
      {suffix}
    </span>
  )
}

const Stats: React.FC = () => {
  const stats = [
    {
      value: '3x',
      label: 'Faster Lease Signing',
      sub: 'Reduce days on market. Achieve occupancy faster.'
    },
    {
      value: '80%',
      label: 'Reduction in Operational CAC',
      sub: 'Eliminate ineffective spend. Boost NOI.'
    },
    {
      value: '6X',
      label: 'ROI (Return on Investment)',
      sub: 'Return on Investment'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-20 gap-8">
          <FadeIn>
            <h2 className="font-heading text-3xl md:text-5xl text-black">Built to deliver results. Reliably.</h2>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/10 mt-12 border-t border-b border-black/5 md:border-t-0 md:border-b-0">
          {stats.map((stat, idx) => (
            <FadeIn key={idx} delay={idx * 100 + 300} className="h-full">
              <div className="cursor-default group flex flex-col items-center gap-6 text-center justify-center h-full py-8 md:py-0 px-4">
                <div className="text-6xl md:text-7xl font-heading text-black shrink-0 leading-none">
                  <AnimatedValue value={stat.value} />
                </div>
                <div className="flex flex-col">
                  <div className="text-lg tracking-widest text-center text-neutral-500 mb-1">{stat.label}</div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <CaseStudy />
      </div>
    </section>
  )
}

export default Stats
