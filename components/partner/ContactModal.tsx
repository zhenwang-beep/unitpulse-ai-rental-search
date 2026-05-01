import React, { useState, useEffect } from 'react'
import { X, CheckCircle2, ArrowRight } from 'lucide-react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  initialEmail?: string
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, initialEmail = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: initialEmail,
    company: '',
    role: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const [errorMessage, setErrorMessage] = useState<string>('')

  // Sync initialEmail if it changes (e.g. re-opening with a different email)
  useEffect(() => {
    if (isOpen && initialEmail) {
      setFormData((prev) => ({ ...prev, email: initialEmail }))
    }
  }, [isOpen, initialEmail])

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setStatus('submitting')

    const apiUrl = import.meta.env.VITE_API_BASE_URL

    try {
      const res = await fetch(`${apiUrl}/api/inquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
          company: formData.company,
          role: formData.role
        })
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `Request failed with status ${res.status}`)
      }

      setStatus('success')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send inquiry.'
      setErrorMessage(message)
      setStatus('error')
    }
  }
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={onClose}></div>

      <div className="relative w-full sm:max-w-lg h-full sm:h-auto bg-white sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:max-h-[90vh] animate-[pulse_0.2s_ease-out]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="font-serif text-2xl text-black">Get in touch</h3>
            <p className="text-sm text-gray-500 mt-1">Book a personalized demo with our team.</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-2xl font-serif text-black mb-2">Request Received</h4>
              <p className="text-gray-500 max-w-xs mb-8 mx-auto">
                Thanks {formData.name.split(' ')[0]}! We'll be in touch shortly to schedule your demo.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <form id="contact-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Jane Doe"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-0 transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email</label>
                  <input
                    required
                    type="email"
                    placeholder="jane@company.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-0 transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone</label>
                <input
                  required
                  type="tel"
                  placeholder="+1234567890"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-0 transition-colors"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Company</label>
                  <input
                    required
                    type="text"
                    placeholder="Acme Inc"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-0 transition-colors"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Role</label>
                  <input
                    type="text"
                    required
                    placeholder="Director of Operations"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-0 transition-colors"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Something specific?</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about your portfolio size or current challenges..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-0 transition-colors resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              {status === 'error' && <div className="text-sm text-red-600">{errorMessage || 'Failed to send inquiry. Please try again.'}</div>}
            </form>
          )}
        </div>

        {/* Footer Action Button */}
        {status !== 'success' && (
          <div className="p-6 border-t border-gray-100 bg-white">
            <p className="text-[11px] leading-normal text-gray-500 text-center mb-3">
              We'll text you about your inquiry. Msg frequency varies. Msg/data rates may apply. Reply STOP to opt out, HELP for help. By submitting, you agree to UnitPulse's{' '}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a>
              {' '}and{' '}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms</a>.
            </p>
            <button
              type="submit"
              form="contact-form"
              disabled={status === 'submitting'}
              className="w-full py-4 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {status === 'submitting' ? 'Sending...' : 'Request Demo'}
              {status !== 'submitting' && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ContactModal
