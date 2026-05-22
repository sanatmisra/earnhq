import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EarnHQ — Your Brand Deal Command Center',
  description:
    'Stop losing track of sponsorships. EarnHQ connects to your Gmail, finds every brand deal, and manages payments, invoices, and deadlines — automatically.',
  openGraph: {
    title: 'EarnHQ — Your Brand Deal Command Center',
    description: 'The sponsorship back-office built for creators.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EarnHQ',
    description: 'Your brand deal command center.',
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
