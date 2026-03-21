'use client'
import { useState } from 'react'

interface EmailCaptureProps {
  headline: string
  subtext: string
  buttonText: string
  source: string
  leadMagnet: string
  variant?: 'inline' | 'banner'
}

export default function EmailCapture({
  headline,
  subtext,
  buttonText,
  source,
  leadMagnet,
  variant = 'inline'
}: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address')
      return
    }
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, leadMagnet }),
      })

      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className={`rounded-xl border border-teal-200 bg-teal-50 p-6 text-center ${variant === 'banner' ? 'w-full' : ''}`} role="status" aria-live="polite">
        <span className="text-2xl">✓</span>
        <p className="text-teal-800 font-medium mt-2">Check your inbox — your results are on the way.</p>
      </div>
    )
  }

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-6 ${variant === 'banner' ? 'w-full' : ''}`} role="complementary" aria-label="Save your results">
      <p className="font-bold text-slate-800 text-lg mb-1">{headline}</p>
      <p className="text-slate-500 text-sm mb-4">{subtext}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor={`email-${source}`} className="sr-only">Email address</label>
        <input
          id={`email-${source}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="your@email.com"
          disabled={status === 'loading'}
          aria-describedby={errorMsg ? `error-${source}` : undefined}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:opacity-50"
        />
        <button
          onClick={handleSubmit}
          disabled={status === 'loading'}
          aria-busy={status === 'loading'}
          className="px-6 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-medium rounded-lg text-sm transition-colors"
        >
          {status === 'loading' ? 'Sending...' : buttonText}
        </button>
      </div>
      {errorMsg && (
        <p id={`error-${source}`} className="text-red-600 text-xs mt-2" role="alert">{errorMsg}</p>
      )}
      <p className="text-xs text-slate-400 mt-3">
        No spam. Unsubscribe anytime. We never sell your data. Your health information is never stored or shared.
      </p>
    </div>
  )
}
