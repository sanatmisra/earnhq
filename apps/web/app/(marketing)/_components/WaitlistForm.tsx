'use client'

import { useState } from 'react'

interface WaitlistFormProps {
  variant?: 'hero' | 'inline' | 'card'
}

export function WaitlistForm({ variant = 'inline' }: WaitlistFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [position, setPosition] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong')
        setStatus('error')
        return
      }
      setPosition(data.position)
      setStatus('success')
    } catch {
      setErrorMsg('Network error. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="waitlist-success">
        <span className="success-icon">🎉</span>
        <p>
          You&apos;re <strong>#{position}</strong> on the waitlist.
        </p>
        <p className="success-sub">We&apos;ll let you know when EarnHQ is ready.</p>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <form onSubmit={handleSubmit} className="waitlist-form-card">
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="waitlist-input"
          disabled={status === 'loading'}
        />
        <button type="submit" className="waitlist-btn-primary waitlist-btn-pulse" disabled={status === 'loading'}>
          {status === 'loading' ? 'Joining...' : 'Join the waitlist →'}
        </button>
        {status === 'error' && <p className="waitlist-error">{errorMsg}</p>}
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="waitlist-form-inline">
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="waitlist-input"
        disabled={status === 'loading'}
      />
      <button type="submit" className="waitlist-btn-primary waitlist-btn-pulse" disabled={status === 'loading'}>
        {status === 'loading' ? 'Joining...' : 'Join the waitlist →'}
      </button>
      {status === 'error' && <p className="waitlist-error">{errorMsg}</p>}
    </form>
  )
}
