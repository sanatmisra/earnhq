'use client'

import { useState } from 'react'
import { ArrowRight, CircleCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

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
      <div className="flex w-full items-start gap-3 rounded-lg border border-border bg-surface p-4 text-left">
        <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" strokeWidth={1.5} />
        <div>
          <p className="text-sm font-semibold">
            You&apos;re <strong className="font-semibold">#{position}</strong> on the waitlist.
          </p>
          <p className="mt-1 text-[13px] text-muted-foreground">We&apos;ll let you know when EarnHQ is ready.</p>
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'grid w-full gap-2 text-left sm:grid-cols-[minmax(0,1fr)_auto]',
        variant === 'card' && 'rounded-lg border border-border bg-surface p-3',
        variant === 'hero' && 'max-w-md'
      )}
    >
      <label htmlFor={`waitlist-email-${variant}`} className="sr-only">
        Email address
      </label>
      <input
        id={`waitlist-email-${variant}`}
        type="email"
        placeholder="you@creator.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="h-11 min-w-0 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-[border,box-shadow] duration-150 placeholder:text-[color:var(--text-muted)] focus:border-primary focus:ring-3 focus:ring-brand-subtle disabled:cursor-not-allowed disabled:opacity-40"
        disabled={status === 'loading'}
      />
      <button
        type="submit"
        className="inline-flex h-11 min-w-44 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-40"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Joining...' : 'Join waitlist'}
        {status !== 'loading' && <ArrowRight className="size-4" strokeWidth={1.5} />}
      </button>
      {status === 'error' && (
        <p className="text-[13px] text-error sm:col-span-2" role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  )
}
