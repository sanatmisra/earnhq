'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface GmailConnectButtonProps {
  connected: boolean
  lastSynced?: string | null
}

export function GmailConnectButton({ connected, lastSynced }: GmailConnectButtonProps) {
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)

  async function handleSync() {
    setSyncing(true)
    try {
      const res = await fetch('/api/gmail/sync', { method: 'POST' })
      if (res.status === 401) {
        router.push('/api/gmail/connect')
        return
      }
      router.push('/dashboard/gmail-import')
    } finally {
      setSyncing(false)
    }
  }

  if (connected) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#22C55E' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Gmail Connected
          {lastSynced && (
            <span style={{ color: '#71717A', marginLeft: '4px' }}>
              · synced {new Date(lastSynced).toLocaleDateString()}
            </span>
          )}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={handleSync}
          disabled={syncing}
        >
          {syncing ? (
            <>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', border: '2px solid #6366F1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite', marginRight: '6px' }} />
              Scanning...
            </>
          ) : (
            'Re-sync Gmail'
          )}
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => router.push('/api/gmail/connect')}
      style={{ background: '#6366F1', color: '#fff' }}
    >
      <GmailIcon />
      Connect Gmail
    </Button>
  )
}

function GmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.910 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  )
}
