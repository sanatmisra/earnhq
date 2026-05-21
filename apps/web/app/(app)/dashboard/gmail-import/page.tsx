'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ParsedDeal } from '@/lib/gmail/parser'
import type { Platform, DealType, DealStatus } from '@/types'

type EditableDeal = ParsedDeal & { confirmed: boolean; skipped: boolean }

const PLATFORMS: Platform[] = ['youtube', 'instagram', 'tiktok', 'podcast', 'newsletter']
const DEAL_TYPES: DealType[] = ['integration', 'dedicated', 'ugc', 'affiliate', 'event']
const STATUSES: DealStatus[] = [
  'negotiating', 'contracted', 'in_production', 'live', 'invoiced', 'paid', 'cancelled',
]

const CONFIDENCE_COLOR: Record<string, string> = {
  high: '#22C55E',
  medium: '#F59E0B',
  low: '#EF4444',
}

export default function GmailImportPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<'scanning' | 'review' | 'saving' | 'done' | 'error'>('scanning')
  const [deals, setDeals] = useState<EditableDeal[]>([])
  const [stats, setStats] = useState({ total_scanned: 0, skipped: 0 })
  const [errorMsg, setErrorMsg] = useState('')
  const [savedCount, setSavedCount] = useState(0)

  useEffect(() => {
    async function runSync() {
      try {
        const res = await fetch('/api/gmail/sync', { method: 'POST' })
        const json = await res.json()

        if (!res.ok) {
          if (res.status === 401) {
            router.push('/api/gmail/connect')
            return
          }
          setErrorMsg(json.error ?? 'Sync failed')
          setPhase('error')
          return
        }

        setStats({ total_scanned: json.data.total_scanned, skipped: json.data.skipped })
        setDeals(
          json.data.parsed.map((d: ParsedDeal) => ({
            ...d,
            confirmed: true,
            skipped: false,
          }))
        )
        setPhase('review')
      } catch {
        setErrorMsg('Network error — check your connection and try again.')
        setPhase('error')
      }
    }
    runSync()
  }, [router])

  function updateDeal(threadId: string, updates: Partial<EditableDeal>) {
    setDeals((prev) =>
      prev.map((d) => (d.threadId === threadId ? { ...d, ...updates } : d))
    )
  }

  async function saveAll() {
    setPhase('saving')
    const toSave = deals.filter((d) => d.confirmed && !d.skipped)

    const payload = toSave.map((d) => ({
      brand_name: d.brand_name,
      brand_contact_name: d.brand_contact_name,
      brand_contact_email: d.brand_contact_email,
      title: d.title,
      description: d.description,
      platform: d.platform,
      deal_type: d.deal_type,
      status: d.status,
      amount: d.amount,
      currency: d.currency,
      deadline: d.deadline,
      deliverables: d.deliverables.map((desc, i) => ({
        id: `${i}`,
        description: desc,
        completed: false,
      })),
      notes: d.notes,
      gmail_thread_id: d.threadId,
    }))

    const res = await fetch('/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      setErrorMsg('Failed to save deals. Please try again.')
      setPhase('error')
      return
    }

    setSavedCount(toSave.length)
    setPhase('done')
  }

  const confirmed = deals.filter((d) => d.confirmed && !d.skipped)

  // ── Scanning ───────────────────────────────────────────────────────────
  if (phase === 'scanning') {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
        <h2 style={styles.scanTitle}>Scanning your Gmail inbox…</h2>
        <p style={styles.scanSub}>
          Looking for brand deals and sponsorships. This can take 1–2 minutes.
        </p>
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <div style={styles.center}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
        <h2 style={{ ...styles.scanTitle, color: '#EF4444' }}>Something went wrong</h2>
        <p style={styles.scanSub}>{errorMsg}</p>
        <button style={styles.btnPrimary} onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    )
  }

  // ── Done ──────────────────────────────────────────────────────────────
  if (phase === 'done') {
    return (
      <div style={styles.center}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
        <h2 style={styles.scanTitle}>{savedCount} deal{savedCount !== 1 ? 's' : ''} saved!</h2>
        <p style={styles.scanSub}>Your brand deals are now in your dashboard.</p>
        <button style={styles.btnPrimary} onClick={() => router.push('/dashboard')}>
          Go to Dashboard →
        </button>
      </div>
    )
  }

  // ── Saving ────────────────────────────────────────────────────────────
  if (phase === 'saving') {
    return (
      <div style={styles.center}>
        <div style={styles.spinner} />
        <h2 style={styles.scanTitle}>Saving {confirmed.length} deals…</h2>
      </div>
    )
  }

  // ── Review ────────────────────────────────────────────────────────────
  if (deals.length === 0) {
    return (
      <div style={styles.center}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>📭</div>
        <h2 style={styles.scanTitle}>No deals found</h2>
        <p style={styles.scanSub}>
          We scanned {stats.total_scanned} threads but couldn&apos;t find any brand deals.
          Try connecting a Gmail account with active sponsorship conversations.
        </p>
        <button style={styles.btnPrimary} onClick={() => router.push('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.h1}>
            We found {deals.length} potential brand deal{deals.length !== 1 ? 's' : ''}
          </h1>
          <p style={styles.headerSub}>
            Scanned {stats.total_scanned} threads · {stats.skipped} skipped (low confidence)
          </p>
        </div>
        <div style={styles.headerActions}>
          <button style={styles.btnSecondary} onClick={() => router.push('/dashboard')}>
            Cancel
          </button>
          <button
            style={{ ...styles.btnPrimary, opacity: confirmed.length === 0 ? 0.5 : 1 }}
            disabled={confirmed.length === 0}
            onClick={saveAll}
          >
            Save {confirmed.length} Deal{confirmed.length !== 1 ? 's' : ''} →
          </button>
        </div>
      </div>

      {/* Deal cards */}
      <div style={styles.grid}>
        {deals.map((deal) => (
          <div
            key={deal.threadId}
            style={{
              ...styles.card,
              opacity: deal.skipped ? 0.4 : 1,
              borderColor: deal.confirmed && !deal.skipped ? '#6366F1' : '#222',
            }}
          >
            {/* Card header */}
            <div style={styles.cardHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FAFAFA' }}>
                  {deal.brand_name}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '100px',
                    background: `${CONFIDENCE_COLOR[deal.confidence]}22`,
                    color: CONFIDENCE_COLOR[deal.confidence],
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {deal.confidence}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {!deal.skipped && (
                  <button
                    style={styles.skipBtn}
                    onClick={() => updateDeal(deal.threadId, { skipped: true, confirmed: false })}
                  >
                    Skip
                  </button>
                )}
                {deal.skipped && (
                  <button
                    style={{ ...styles.skipBtn, color: '#6366F1' }}
                    onClick={() => updateDeal(deal.threadId, { skipped: false, confirmed: true })}
                  >
                    Restore
                  </button>
                )}
              </div>
            </div>

            {/* Fields */}
            <div style={styles.fields}>
              <Field label="Deal title">
                <input
                  style={styles.input}
                  value={deal.title}
                  onChange={(e) => updateDeal(deal.threadId, { title: e.target.value })}
                  disabled={deal.skipped}
                />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field label="Amount">
                  <input
                    style={styles.input}
                    type="number"
                    placeholder="e.g. 2500"
                    value={deal.amount ?? ''}
                    onChange={(e) =>
                      updateDeal(deal.threadId, {
                        amount: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    disabled={deal.skipped}
                  />
                </Field>
                <Field label="Status">
                  <select
                    style={styles.select}
                    value={deal.status}
                    onChange={(e) =>
                      updateDeal(deal.threadId, { status: e.target.value as DealStatus })
                    }
                    disabled={deal.skipped}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <Field label="Platform">
                  <select
                    style={styles.select}
                    value={deal.platform}
                    onChange={(e) =>
                      updateDeal(deal.threadId, { platform: e.target.value as Platform })
                    }
                    disabled={deal.skipped}
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Type">
                  <select
                    style={styles.select}
                    value={deal.deal_type}
                    onChange={(e) =>
                      updateDeal(deal.threadId, { deal_type: e.target.value as DealType })
                    }
                    disabled={deal.skipped}
                  >
                    {DEAL_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <Field label="Deadline">
                <input
                  style={styles.input}
                  type="date"
                  value={deal.deadline ?? ''}
                  onChange={(e) => updateDeal(deal.threadId, { deadline: e.target.value || null })}
                  disabled={deal.skipped}
                />
              </Field>

              {deal.deliverables.length > 0 && (
                <Field label="Deliverables">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {deal.deliverables.map((d, i) => (
                      <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ color: '#6366F1', flexShrink: 0 }}>·</span>
                        <input
                          style={{ ...styles.input, flex: 1 }}
                          value={d}
                          onChange={(e) => {
                            const updated = [...deal.deliverables]
                            updated[i] = e.target.value
                            updateDeal(deal.threadId, { deliverables: updated })
                          }}
                          disabled={deal.skipped}
                        />
                      </div>
                    ))}
                  </div>
                </Field>
              )}

              {deal.brand_contact_email && (
                <Field label="Contact">
                  <span style={{ fontSize: '13px', color: '#71717A' }}>
                    {deal.brand_contact_name && `${deal.brand_contact_name} · `}
                    {deal.brand_contact_email}
                  </span>
                </Field>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sticky footer */}
      <div style={styles.footer}>
        <span style={{ color: '#71717A', fontSize: '14px' }}>
          {confirmed.length} of {deals.length} deals selected
        </span>
        <button
          style={{ ...styles.btnPrimary, opacity: confirmed.length === 0 ? 0.5 : 1 }}
          disabled={confirmed.length === 0}
          onClick={saveAll}
        >
          Save {confirmed.length} Deal{confirmed.length !== 1 ? 's' : ''} →
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(1); }
        select option { background: #111111; }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '11px', color: '#71717A', marginBottom: '4px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const styles = {
  center: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    textAlign: 'center' as const,
    padding: '40px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #222',
    borderTopColor: '#6366F1',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  scanTitle: { fontSize: '22px', fontWeight: 700, color: '#FAFAFA', margin: 0 },
  scanSub: { fontSize: '15px', color: '#71717A', maxWidth: '420px', lineHeight: 1.6, margin: 0 },
  page: { padding: '32px', maxWidth: '1100px', margin: '0 auto', paddingBottom: '100px' },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '32px',
    flexWrap: 'wrap' as const,
  },
  h1: { fontSize: '24px', fontWeight: 800, color: '#FAFAFA', margin: '0 0 6px', letterSpacing: '-0.5px' },
  headerSub: { fontSize: '14px', color: '#71717A', margin: 0 },
  headerActions: { display: 'flex', gap: '12px', alignItems: 'center' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '20px',
  },
  card: {
    background: '#111111',
    border: '1px solid #222',
    borderRadius: '12px',
    padding: '20px',
    transition: 'border-color 0.2s, opacity 0.2s',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  fields: { display: 'flex', flexDirection: 'column' as const, gap: '12px' },
  input: {
    width: '100%',
    background: '#0D0D0D',
    border: '1px solid #2A2A2A',
    borderRadius: '6px',
    padding: '8px 10px',
    color: '#FAFAFA',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  select: {
    width: '100%',
    background: '#0D0D0D',
    border: '1px solid #2A2A2A',
    borderRadius: '6px',
    padding: '8px 10px',
    color: '#FAFAFA',
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
  },
  skipBtn: {
    background: 'transparent',
    border: 'none',
    color: '#71717A',
    fontSize: '12px',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
  },
  btnPrimary: {
    background: '#6366F1',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  btnSecondary: {
    background: 'transparent',
    color: '#A1A1AA',
    border: '1px solid #333',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  footer: {
    position: 'fixed' as const,
    bottom: 0,
    left: '256px',
    right: 0,
    background: 'rgba(10,10,10,0.95)',
    backdropFilter: 'blur(12px)',
    borderTop: '1px solid #1A1A1A',
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}
