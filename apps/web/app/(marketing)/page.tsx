import Link from 'next/link'
import {
  ArrowRight,
  CalendarClock,
  Check,
  CircleDollarSign,
  FileText,
  LayoutDashboard,
  MailSearch,
  Receipt,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { FAQ } from './_components/FAQ'
import { WaitlistForm } from './_components/WaitlistForm'

type ValueCard = {
  title: string
  description: string
  icon: LucideIcon
}

const valueCards: ValueCard[] = [
  {
    title: 'Deals surfaced from Gmail',
    description: 'Review likely sponsorship emails before EarnHQ saves the brand, value, platform, and deadline.',
    icon: MailSearch,
  },
  {
    title: 'One command center',
    description: 'See negotiating, contracted, live, invoiced, and paid work without rebuilding a spreadsheet.',
    icon: LayoutDashboard,
  },
  {
    title: 'Invoices ready fast',
    description: 'Turn deal data into a professional invoice and keep payment state tied to the work.',
    icon: Receipt,
  },
]

const actionRows = [
  { brand: 'Apex Apparel', task: 'Review Gmail import', value: '$3,500', status: 'Ready', tone: 'brand' },
  { brand: 'Verde Matcha', task: 'Draft due tomorrow', value: '$1,200', status: 'Due soon', tone: 'warning' },
  { brand: 'North Shore Co.', task: 'Invoice overdue', value: '$2,200', status: 'Chase', tone: 'error' },
] as const

const dealColumns = [
  {
    title: 'Negotiating',
    tone: 'negotiating',
    deals: ['Apex Apparel', 'Studio Mic Co.'],
  },
  {
    title: 'In production',
    tone: 'production',
    deals: ['Verde Matcha', 'North Shore Co.'],
  },
  {
    title: 'Invoiced',
    tone: 'invoiced',
    deals: ['Trail Lens', 'Creator Stack'],
  },
  {
    title: 'Paid',
    tone: 'paid',
    deals: ['Pulse Audio'],
  },
] as const

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    detail: 'For setting up your first deal workflow.',
    features: ['3 active deals', 'Manual deal entry', 'Basic dashboard'],
  },
  {
    name: 'Pro',
    price: '$29',
    detail: 'For solo creators running deals every month.',
    features: ['Unlimited deals', 'Gmail sync', 'Invoices and payment tracking', 'Rate card and alerts'],
    featured: true,
  },
  {
    name: 'Agency',
    price: '$99',
    detail: 'For managers across multiple creators.',
    features: ['Multi-creator workspace', 'White-label invoices', 'Team workflow', 'Priority support'],
  },
]

const trustPoints = [
  { title: 'Read-only Gmail scan', icon: ShieldCheck },
  { title: 'You approve imports', icon: Check },
  { title: 'Payment deadlines visible', icon: CalendarClock },
]

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex h-7 items-center rounded-full border border-border bg-brand-subtle px-3 text-xs font-semibold tracking-[0.06em] text-brand-text">
      {children}
    </div>
  )
}

function StatusPill({
  children,
  tone,
}: {
  children: React.ReactNode
  tone: (typeof actionRows)[number]['tone']
}) {
  const tones = {
    brand: 'bg-brand-subtle text-brand-text',
    warning: 'bg-warning-bg text-warning',
    error: 'bg-error-bg text-error',
  }

  return <span className={`inline-flex h-5 items-center rounded-full px-2 text-xs font-semibold ${tones[tone]}`}>{children}</span>
}

function ColumnAccent({ tone }: { tone: (typeof dealColumns)[number]['tone'] }) {
  const tones = {
    negotiating: 'bg-[#6366F1]',
    production: 'bg-warning',
    invoiced: 'bg-[#A855F7]',
    paid: 'bg-[#10B981]',
  }

  return <span className={`h-1.5 w-1.5 rounded-full ${tones[tone]}`} />
}

function WorkspaceMockup() {
  return (
    <div
      role="img"
      aria-label="EarnHQ workspace mockup showing sponsorship earnings, deal pipeline, Gmail imports, deadlines, and payment states."
      className="overflow-hidden rounded-lg border border-border bg-background"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface px-3 py-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
            E
          </div>
          <div className="truncate text-sm font-semibold">Creator HQ</div>
        </div>
        <div className="hidden items-center gap-1 text-xs text-muted-foreground sm:flex">
          <span className="rounded-md bg-brand-subtle px-2 py-1 text-brand-text">Dashboard</span>
          <span className="px-2 py-1">Deals</span>
          <span className="px-2 py-1">Invoices</span>
        </div>
        <div className="inline-flex h-8 items-center rounded-md border border-border bg-brand-subtle px-2 text-xs font-semibold text-brand-text">
          Review 4 imports
        </div>
      </div>

      <div className="grid md:grid-cols-[108px_minmax(0,1fr)]">
        <aside className="hidden border-r border-border bg-surface p-3 text-xs text-muted-foreground md:grid md:content-start md:gap-1">
          {['Overview', 'Deals', 'Invoices', 'Payments', 'Rate card'].map((item, index) => (
            <div
              key={item}
              className={`rounded-md px-2 py-2 ${index === 0 ? 'bg-brand-subtle font-semibold text-brand-text' : ''}`}
            >
              {item}
            </div>
          ))}
        </aside>

        <div className="min-w-0 p-3 sm:p-4">
          <div className="grid gap-2 sm:grid-cols-4">
            {[
              ['Pipeline', '$24,500'],
              ['Earned', '$18,200'],
              ['Outstanding', '$6,300'],
              ['Overdue', '2 invoices'],
            ].map(([label, value], index) => (
              <div key={label} className="rounded-lg border border-border bg-surface p-3">
                <div className="text-xs font-semibold tracking-[0.06em] text-muted-foreground">{label}</div>
                <div className={`mt-2 text-base font-semibold ${index === 3 ? 'text-error' : ''}`}>{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3 xl:grid-cols-[minmax(0,1fr)_210px]">
            <div className="rounded-lg border border-border bg-surface p-3">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="text-sm font-semibold">Deal pipeline</div>
                <div className="text-xs text-muted-foreground">7 active</div>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {dealColumns.slice(0, 2).map((column) => (
                  <div key={column.title} className="min-w-0 rounded-md border border-border bg-background p-2">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <ColumnAccent tone={column.tone} />
                      {column.title}
                    </div>
                    <div className="mt-2 grid gap-2">
                      {column.deals.map((deal, index) => (
                        <div key={deal} className="min-w-0 overflow-hidden rounded-md border border-border bg-surface p-2">
                          <div className="truncate text-xs font-semibold">{deal}</div>
                          <div className="mt-1 flex min-w-0 items-center justify-between gap-1 text-[11px] text-muted-foreground">
                            <span className="truncate">{index === 0 ? 'YouTube' : 'Instagram'}</span>
                            <span className="shrink-0">{index === 0 ? '$3.5k' : '$1.2k'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-lg border border-border bg-surface p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-semibold">Gmail import</div>
                  <StatusPill tone="brand">Ready</StatusPill>
                </div>
                <div className="mt-3 rounded-md border border-border bg-background p-2">
                  <div className="text-xs font-semibold">Apex Apparel</div>
                  <div className="mt-1 text-[11px] leading-4 text-muted-foreground">60-sec integration, May 30</div>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-surface p-3">
                <div className="text-sm font-semibold">Needs action</div>
                <div className="mt-3 grid gap-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Invoice reminder</span>
                    <span className="text-error">Overdue</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Draft deadline</span>
                    <span className="text-warning">Tomorrow</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ImportToInvoiceMockup() {
  return (
    <div
      role="img"
      aria-label="EarnHQ mockup showing a sponsor email reviewed into extracted deal details and an invoice follow-up."
      className="overflow-hidden rounded-lg border border-border bg-background"
    >
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
        <div>
          <div className="text-sm font-semibold">Review imported deal</div>
          <div className="mt-1 text-xs text-muted-foreground">Nothing is saved until you confirm.</div>
        </div>
        <StatusPill tone="brand">Gmail</StatusPill>
      </div>

      <div className="grid gap-3 p-3 sm:p-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
        <div className="rounded-lg border border-border bg-surface p-3">
          <div className="flex items-start justify-between gap-3 border-b border-border pb-3">
            <div>
              <div className="text-xs text-muted-foreground">partnerships@apexapparel.com</div>
              <div className="mt-1 text-sm font-semibold">Spring collection sponsorship</div>
            </div>
            <div className="text-xs text-muted-foreground">Today</div>
          </div>
          <div className="mt-3 rounded-md border border-border bg-background p-3 text-xs leading-5">
            <p className="text-muted-foreground">Hey Sanat, we would love a YouTube integration for our launch.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-md bg-brand-subtle p-2 text-brand-text">Deliverable: 60-sec read</div>
              <div className="rounded-md bg-warning-bg p-2 text-warning">Content due: May 30</div>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-lg border border-border bg-surface p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold">Extracted deal</div>
              <span className="text-xs text-muted-foreground">$3,500</span>
            </div>
            <div className="mt-3 grid gap-2 text-xs">
              {[
                ['Brand', 'Apex Apparel'],
                ['Platform', 'YouTube integration'],
                ['Status', 'Negotiating'],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[72px_minmax(0,1fr)] gap-2 rounded-md border border-border bg-background px-2 py-2">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="truncate font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Invoice #1001</div>
                <div className="mt-1 text-xs text-muted-foreground">Sent after go-live</div>
              </div>
              <StatusPill tone="error">Overdue</StatusPill>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-md border border-border bg-background p-3">
              <span className="text-sm font-semibold">$3,500</span>
              <span className="text-xs text-brand-text">Send reminder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-semibold tracking-[-0.02em]">
            Earn<span className="text-brand-text">HQ</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/login"
              className="inline-flex h-11 items-center rounded-md px-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-[color:var(--bg-overlay)] hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="#waitlist"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-hover"
            >
              Join waitlist
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-center">
            <div>
              <SectionLabel>Creator sponsorship back-office</SectionLabel>
              <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.1] tracking-[-0.02em]">
                Your brand deal command center.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                EarnHQ connects sponsor emails, deal deadlines, invoices, and payments in one calm workspace for
                creators managing 5 to 15 paid partnerships a month.
              </p>
              <div id="waitlist" className="mt-6 max-w-md scroll-mt-28">
                <WaitlistForm variant="hero" />
              </div>
              <p className="mt-3 text-[13px] text-muted-foreground">No credit card. Join now for first access.</p>
              <div className="mt-6 grid gap-2 sm:grid-cols-3">
                {trustPoints.map(({ title, icon: Icon }) => (
                  <div key={title} className="flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-[13px] text-muted-foreground">
                    <Icon className="size-4 shrink-0 text-brand-text" strokeWidth={1.5} />
                    <span>{title}</span>
                  </div>
                ))}
              </div>
            </div>

            <WorkspaceMockup />
          </div>
        </section>

        <section className="border-y border-border bg-surface px-4 py-10 sm:px-6">
          <div className="mx-auto grid max-w-[1200px] gap-5 md:grid-cols-3">
            {valueCards.map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-lg border border-border bg-background p-4 sm:p-6">
                <div className="flex size-10 items-center justify-center rounded-md border border-border bg-brand-subtle text-brand-text">
                  <Icon className="size-5" strokeWidth={1.5} />
                </div>
                <h2 className="mt-4 text-base font-semibold tracking-[-0.01em]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] lg:items-center">
            <ImportToInvoiceMockup />

            <div>
              <SectionLabel>From inbox to paid</SectionLabel>
              <h2 className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.02em]">
                See the deal before it slips out of view.
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                EarnHQ is designed around the moments creators lose money: a sponsor email not imported, a deliverable
                date missed, or an invoice that never gets followed up.
              </p>
              <div className="mt-6 overflow-hidden rounded-lg border border-border bg-surface">
                {actionRows.map((row) => (
                  <div key={row.brand} className="grid gap-2 border-b border-border p-4 last:border-b-0 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center">
                    <div>
                      <div className="text-sm font-semibold">{row.brand}</div>
                      <div className="mt-1 text-[13px] text-muted-foreground">{row.task}</div>
                    </div>
                    <div className="text-sm font-semibold">{row.value}</div>
                    <StatusPill tone={row.tone}>{row.status}</StatusPill>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-surface px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <SectionLabel>Product sneak peek</SectionLabel>
                <h2 className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.02em]">
                  Open the dashboard and know what needs action.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                The workspace follows the product flow: review imported sponsorships, move deals through delivery,
                generate invoices, and keep overdue payments visible until they are cleared.
              </p>
            </div>

            <div className="mt-8 rounded-lg border border-border bg-background p-3 sm:p-4">
              <div className="grid gap-3 border-b border-border pb-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ['Pipeline', '$24,500'],
                  ['Earned this month', '$18,200'],
                  ['Outstanding', '$6,300'],
                  ['Due this week', '4 deliverables'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-border bg-surface p-4">
                    <div className="text-xs font-semibold tracking-[0.06em] text-muted-foreground">{label}</div>
                    <div className="mt-2 text-2xl font-semibold tracking-[-0.02em]">{value}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {dealColumns.map((column) => (
                  <div key={column.title} className="rounded-lg border border-border bg-surface p-3">
                    <div className="flex items-center gap-2 border-b border-border pb-3 text-sm font-semibold">
                      <ColumnAccent tone={column.tone} />
                      {column.title}
                    </div>
                    <div className="mt-3 grid gap-2">
                      {column.deals.map((deal) => (
                        <div key={deal} className="rounded-md border border-border bg-background p-3">
                          <div className="text-sm font-semibold">{deal}</div>
                          <div className="mt-1 text-[13px] text-muted-foreground">Sponsor deal</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionLabel>Built for creators</SectionLabel>
              <h2 className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.02em]">
                Less admin between the email and the payout.
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                Keep the business layer of sponsorships crisp without turning your creator workflow into an agency
                tool.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { title: 'Deadline tracking', body: 'Deliverables and go-live dates stay close to the deal record.', icon: CalendarClock },
                { title: 'Invoice generation', body: 'Professional invoice details come from the work already tracked.', icon: FileText },
                { title: 'Payment focus', body: 'Sent, paid, and overdue states stay visible after content goes live.', icon: CircleDollarSign },
                { title: 'Rate context', body: 'Default rates reduce repeated setup for your platforms and formats.', icon: Receipt },
              ].map(({ title, body, icon: Icon }) => (
                <article key={title} className="rounded-lg border border-border bg-surface p-4 sm:p-6">
                  <Icon className="size-6 text-brand-text" strokeWidth={1.5} />
                  <h3 className="mt-4 text-base font-semibold tracking-[-0.01em]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="border-y border-border bg-surface px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1200px]">
            <div className="max-w-2xl">
              <SectionLabel>Pricing</SectionLabel>
              <h2 className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.02em]">
                Start small. Upgrade when brand deals become a system.
              </h2>
            </div>
            <div className="mt-8 grid gap-3 lg:grid-cols-3">
              {pricingPlans.map((plan) => (
                <article
                  key={plan.name}
                  className={`rounded-lg border p-4 sm:p-6 ${
                    plan.featured ? 'border-border-strong bg-brand-subtle' : 'border-border bg-background'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold">{plan.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{plan.detail}</p>
                    </div>
                    {plan.featured && <span className="rounded-full bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">Pro</span>}
                  </div>
                  <div className="mt-6 text-4xl font-semibold tracking-[-0.02em]">
                    {plan.price}
                    <span className="ml-1 text-sm font-normal text-muted-foreground">/ month</span>
                  </div>
                  <ul className="mt-6 grid gap-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 size-4 shrink-0 text-brand-text" strokeWidth={1.5} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.name === 'Agency' ? 'mailto:hello@earnhq.co' : '#waitlist'}
                    className={`mt-6 inline-flex h-11 w-full items-center justify-center rounded-md px-4 text-sm font-semibold transition-colors ${
                      plan.featured
                        ? 'bg-primary text-primary-foreground hover:bg-brand-hover'
                        : 'border border-border bg-subtle text-foreground hover:border-border-strong'
                    }`}
                  >
                    {plan.name === 'Agency' ? 'Contact us' : 'Join waitlist'}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1200px]">
            <div className="text-center">
              <SectionLabel>FAQ</SectionLabel>
              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em]">Questions creators ask before connecting.</h2>
            </div>
            <FAQ />
          </div>
        </section>

        <section className="border-t border-border bg-surface px-4 py-12 sm:px-6">
          <div className="mx-auto grid max-w-[1200px] gap-6 rounded-lg border border-border bg-background p-4 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] lg:items-center">
            <div>
              <SectionLabel>Waitlist</SectionLabel>
              <h2 className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.02em]">
                Put brand deal admin in one place.
              </h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                Join the waitlist for EarnHQ launch access and a first look at the sponsorship back-office built for
                solo creators.
              </p>
            </div>
            <WaitlistForm variant="card" />
          </div>
        </section>
      </main>

      <footer className="border-t border-border px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-base font-semibold text-foreground">
              Earn<span className="text-brand-text">HQ</span>
            </div>
            <div className="mt-1">Your brand deal command center.</div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <a href="mailto:hello@earnhq.co" className="transition-colors hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
