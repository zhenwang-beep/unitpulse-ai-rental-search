import React, { useState, useEffect, useRef } from 'react'
import FadeIn from './ui/FadeIn'
import { ChevronLeft, ChevronRight, ArrowRight, X, CheckCircle2 } from 'lucide-react'

const CASE_STUDIES = [
  {
    id: 1,
    company: 'Kara Apartments',
    focus: 'ROI',
    stat: '6X',
    statLabel: 'ROI in Year One',
    quote: 'We cut our cost-per-lease by 40% while doubling lead volume. The efficiency gains paid for the platform in the first month alone.',
    person: 'Marcus Thorne',
    role: 'Director of Operations',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    details: {
      challenge:
        'Kara Apartments faced skyrocketing CPA (Cost Per Acquisition) and significant lead leakage during off-hours across their 45-property portfolio.',
      solution: "Deployed UnitPulse's Nurture and Leasing Agents to handle 100% of inbound inquiries instantly, 24/7.",
      results: ['40% reduction in Cost Per Lease', "Zero leads lost to 'office hours'", 'Leasing team reduced admin time by 15 hours/week']
    }
  },
  {
    id: 2,
    company: 'Urbanify',
    focus: 'Time-to-Value',
    stat: '< 48h',
    statLabel: 'Time to Value',
    quote: 'We launched across 12 properties in a single weekend. By Monday morning, UnitPulse was handling 100% of our inbound traffic perfectly.',
    person: 'Elena Rodriguez',
    role: 'Asset Manager',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
    details: {
      challenge: 'Urbanify acquired a distressed portfolio with high vacancy and needed to ramp up leasing immediately without hiring new staff.',
      solution: 'Activated UnitPulse platform over a weekend, syncing with Yardi Voyager to automate listing syndication and inquiry management.',
      results: ['Full portfolio deployment in 2 days', 'Immediate response to 500+ backlog leads', '15% occupancy increase in first 60 days']
    }
  },
  {
    id: 3,
    company: 'Apex Living',
    focus: 'Renter Satisfaction',
    stat: '4.9/5',
    statLabel: 'Renter Satisfaction',
    quote: 'Our prospects constantly tell us how refreshing it is to get instant answers at 2 AM. It sets the tone for a premium leasing experience.',
    person: 'Sarah Jenkins',
    role: 'VP of Marketing',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    details: {
      challenge: 'Apex struggled with negative reviews due to slow lead response times and missed inquiries during weekends.',
      solution: 'Implemented UnitPulse Nurture Agent to answer prospect questions instantly and automate tour scheduling 24/7.',
      results: ['Google Review score improved from 3.8 to 4.9', 'Tour-to-lease conversion up 12%', 'Leasing NPS score increased by 40 points']
    }
  }
]

const CaseStudy: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isModalOpen])

  // Auto-scroll active avatar into view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeItem = scrollContainerRef.current.children[currentIndex] as HTMLElement
      if (activeItem) {
        const container = scrollContainerRef.current
        // Calculate center position: Item's center - Container's center
        // offsetLeft is relative to the container because of 'relative' class on container
        const scrollLeft = activeItem.offsetLeft - container.clientWidth / 2 + activeItem.clientWidth / 2
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
      }
    }
  }, [currentIndex])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CASE_STUDIES.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CASE_STUDIES.length) % CASE_STUDIES.length)
  }

  const currentStudy = CASE_STUDIES[currentIndex]

  return (
    <div className="mt-24">
      <div className="max-w-7xl mx-auto">
        <FadeIn delay={200}>
          <div className="bg-[#F4F1EE] border border-black/5 rounded-3xl p-8 md:p-16 relative overflow-hidden transition-all duration-500">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white rounded-full blur-[100px] -z-10 opacity-60"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-16">
              {/* Top Row: Navigation */}
              <div className="lg:col-span-12 flex flex-col lg:flex-row justify-center items-center gap-8 pb-6">
                <div className="flex items-center justify-center gap-4 md:gap-6 w-full lg:w-auto">
                  <button
                    onClick={handlePrev}
                    className="w-12 h-12 rounded-full bg-white border border-black/5 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors shadow-sm flex-shrink-0"
                    aria-label="Previous"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div
                    ref={scrollContainerRef}
                    className="relative flex min-w-0 flex items-center gap-3 md:gap-4 overflow-x-auto py-3 px-4 [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {CASE_STUDIES.map((study, idx) => (
                      <button
                        key={study.id}
                        onClick={() => setCurrentIndex(idx)}
                        className={`relative rounded-full overflow-hidden transition-all duration-300 flex-shrink-0 border-2
                                            ${
                                              idx === currentIndex
                                                ? 'w-16 h-16 border-black grayscale-0'
                                                : 'w-12 h-12 border-transparent grayscale opacity-40 hover:opacity-100 hover:grayscale-0'
                                            }`}
                      >
                        <img src={study.avatar} alt={study.person} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-12 h-12 rounded-full bg-white border border-black/5 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-colors shadow-sm flex-shrink-0"
                    aria-label="Next"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Middle Row: Quote */}
              <div className="lg:col-span-12">
                <div key={`quote-${currentIndex}`} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <h3 className="text-xl text-center md:text-2xl lg:text-3xl font-heading text-black leading-tight lg:leading-[1.5]">
                    “{currentStudy.quote}”
                  </h3>
                </div>
              </div>

              {/* Bottom Row: Footer Info */}
              <div className="lg:col-span-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pt-8 lg:pt-4 border-t border-black/5 lg:border-t-0 mt-4">
                <div className="flex flex-col gap-1" key={`info-${currentIndex}`}>
                  <div className="text-lg font-bold text-black">{currentStudy.person}</div>
                  <div className="text-sm text-neutral-500">
                    {currentStudy.role}, {currentStudy.company}
                  </div>
                </div>

                <div className="hidden lg:block">
                  <span className="text-xl font-heading font-black text-neutral-300 uppercase tracking-widest select-none">{currentStudy.company}</span>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black border-b border-black pb-0.5 hover:text-neutral-600 hover:border-neutral-600 transition-colors"
                >
                  Read the case study
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
            {/* Modal Container: Flex layout, fixed max-height, relative for close button positioning */}
            <div className="relative bg-white rounded-2xl max-w-3xl w-full shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col overflow-hidden">
              {/* Close Button: Absolute positioned to stay fixed relative to the modal container */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-full transition-colors bg-white/80 backdrop-blur-sm"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {/* Scrollable Content Area */}
              <div className="overflow-y-auto p-8 md:p-12">
                <div className="mb-8 border-b border-black/5 pb-8 pt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-neutral-100 rounded-full text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                      {currentStudy.focus} Focus
                    </span>
                    <span className="text-neutral-300">|</span>
                    <span className="text-sm font-bold text-neutral-500">{currentStudy.company}</span>
                  </div>
                  <h3 className="font-heading text-3xl md:text-4xl text-black mb-4">
                    How {currentStudy.company} achieved {currentStudy.statLabel} of {currentStudy.stat}
                  </h3>
                  <p className="text-neutral-500 text-lg leading-relaxed">"{currentStudy.quote}"</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-widest text-black mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div> The Challenge
                    </h4>
                    <p className="text-neutral-600 text-sm leading-relaxed">{currentStudy.details.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-widest text-black mb-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#4A5D23]"></div> The Solution
                    </h4>
                    <p className="text-neutral-600 text-sm leading-relaxed">{currentStudy.details.solution}</p>
                  </div>
                </div>

                <div className="bg-[#F4F1EE] rounded-2xl p-6 md:p-8">
                  <h4 className="font-bold text-xs uppercase tracking-widest text-black mb-6">Key Outcomes</h4>
                  <div className="grid gap-4">
                    {currentStudy.details.results.map((res, i) => (
                      <div key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                        <CheckCircle2 size={18} className="text-[#4A5D23] shrink-0 mt-0.5" />
                        <span className="font-medium">{res}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-black/5 flex justify-center">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-sm font-bold uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
                  >
                    Close Case Study
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CaseStudy
