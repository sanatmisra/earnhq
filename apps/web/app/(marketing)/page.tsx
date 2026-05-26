import Link from 'next/link'
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  Clock,
  FileText,
  LayoutDashboard,
  MailSearch,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { FAQ } from './_components/FAQ'
import { WaitlistForm } from './_components/WaitlistForm'
import { FadeIn } from '@/components/marketing/FadeIn'
import { ThemeToggle } from '@/components/theme/ThemeToggle'

type Feature = {
  icon: LucideIcon
  title: string
  description: string
  bullets: string[]
}

const features: Feature[] = [
  {
    icon: MailSearch,
    title: 'Gmail AI extraction',
    description: 'Your inbox becomes your deal intake — no manual entry.',
    bullets: [
      'AI scans for sponsorship emails automatically',
      'Review each deal before anything is saved',
      'Read-only OAuth — we never see your password',
    ],
  },
  {
    icon: LayoutDashboard,
    title: 'Live deal pipeline',
    description: 'Every deal, every stage, always current.',
    bullets: [
      'Kanban board from negotiating to paid',
      'Brand, platform, amount, and deadlines in one card',
      'Filter and sort across all active deals instantly',
    ],
  },
  {
    icon: Clock,
    title: 'Approval loop tracker',
    description: 'Know exactly when a brand has gone too quiet.',
    bullets: [
      'Mark content as submitted for brand review',
      'Tracks business days elapsed since submission',
      'Alerts you when it\'s time to follow up — no awkward guessing',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Exclusivity window alerts',
    description: 'Never accidentally sign a conflicting deal again.',
    bullets: [
      'Log the exclusivity category and end date per contract',
      'Get a 14-day warning before any window expires',
      'Active exclusivity shown on every deal card',
    ],
  },
  {
    icon: FileText,
    title: 'One-click invoices',
    description: 'Professional invoices that build themselves from your deal data.',
    bullets: [
      'Rate, brand name, and deliverables pre-filled',
      'PDF generated and sent via email in seconds',
      'Tracks draft, sent, paid, and overdue states',
    ],
  },
  {
    icon: CircleDollarSign,
    title: 'Payment tracking',
    description: 'Every dollar owed, visible in one place.',
    bullets: [
      'Outstanding, overdue, and paid — always current',
      'Automatic overdue alerts tell you exactly when to follow up',
      'Full pipeline value and YTD earnings on your dashboard',
    ],
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
    name: 'Pro',
    price: '$49',
    annualNote: '$39/mo billed annually — save $120/yr',
    detail: 'For solo creators running 5–15 brand deals a month.',
    features: [
      'Unlimited active deals',
      'Gmail AI extraction + deal import',
      'Full pipeline (kanban + table view)',
      'Approval loop tracker',
      'Exclusivity window alerts',
      'One-click invoices with PDF',
      'Payment tracking + overdue alerts',
      'Rate card',
    ],
    featured: true,
    cta: 'Start free 14-day trial',
    ctaHref: '#waitlist',
  },
  {
    name: 'Agency',
    price: '$129',
    annualNote: '$99/mo billed annually — save $360/yr',
    detail: 'For talent managers running deals across multiple creators.',
    features: [
      'Everything in Pro',
      'Up to 5 creator profiles',
      'White-label invoices with your branding',
      'Team member access (3 seats)',
      'Priority email support',
    ],
    featured: false,
    cta: 'Contact us',
    ctaHref: 'mailto:hello@earnhq.co',
  },
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
          <div className="truncate text-sm font-semibold">EarnHQ</div>
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
    <div className="marketing-bg min-h-screen text-foreground">
      <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-semibold tracking-[-0.02em]">
            Earn<span className="text-brand-text">HQ</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            <Link
              href="#waitlist"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-brand-hover"
            >
              Get early access
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex flex-col gap-2">
        <section className="px-4 sm:px-6">
          <div className="mx-auto grid max-w-[1200px] gap-8 bg-background px-6 py-12 sm:py-16 rounded-xl lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-center">
            <div>
              <SectionLabel>Creator sponsorship back-office</SectionLabel>
              <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.1] tracking-[-0.02em]">
                Stop losing brand deals between your inbox and your bank account.
              </h1>
              <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
                Connect Gmail once. EarnHQ extracts your deals, tracks every stage, and tells you exactly when and who to follow up with.
              </p>
              <div id="waitlist" className="mt-8 max-w-md scroll-mt-28">
                <WaitlistForm variant="hero" />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-brand-subtle bg-brand-subtle px-3 text-xs font-semibold text-brand-text">
                  <span className="size-1.5 rounded-full bg-brand-text" />
                  First 100 members — 2 months Pro free
                </span>
                <span className="text-[13px] text-muted-foreground">Free to start. No card required.</span>
              </div>
            </div>

            <div className="relative">
              <div
                className="pointer-events-none absolute -inset-4 rounded-2xl opacity-20 blur-3xl"
                style={{ background: 'radial-gradient(ellipse at center, #6366F1 0%, transparent 70%)' }}
                aria-hidden="true"
              />
              <WorkspaceMockup />
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-surface px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-[1200px]">
            <FadeIn>
              <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Sound familiar?
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  {
                    pain: '"I\'ll track that in a spreadsheet."',
                    reality: 'Three weeks later you\'re reconciling five tabs and still not sure which invoice you already sent.',
                  },
                  {
                    pain: '"The brand said they\'ll pay soon."',
                    reality: 'Net-60 quietly became net-90. You have no record of when you last followed up or what was agreed.',
                  },
                  {
                    pain: '"I just need to remember the exclusivity date."',
                    reality: 'You don\'t. You sign a competing deal. The first brand is not happy.',
                  },
                ].map(({ pain, reality }) => (
                  <div key={pain} className="rounded-lg border border-border bg-background p-4 sm:p-5">
                    <p className="text-sm font-semibold">{pain}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{reality}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="px-4 sm:px-6">
          <div className="mx-auto max-w-[1200px] bg-background px-6 py-12 sm:py-16 rounded-xl">
            <FadeIn>
              <div className="text-center mb-10">
                <SectionLabel>How it works</SectionLabel>
                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em]">
                  Three steps from inbox to paid.
                </h2>
              </div>
            </FadeIn>

            <div className="grid gap-px bg-border sm:grid-cols-3 rounded-xl overflow-hidden border border-border">
              {[
                {
                  step: '01',
                  title: 'Connect Gmail',
                  body: "EarnHQ uses Google's official OAuth — read-only access, no password ever seen. We scan for sponsorship threads. You review each one before anything is saved.",
                  icon: '📧',
                },
                {
                  step: '02',
                  title: 'Track the deal',
                  body: 'Brand, platform, amount, and deadlines live in your pipeline. Move deals through stages as work progresses.',
                  icon: '📋',
                },
                {
                  step: '03',
                  title: 'Invoice and collect',
                  body: 'One click generates a professional PDF. Track payment status until the money lands.',
                  icon: '💸',
                },
              ].map(({ step, title, body, icon }, i) => (
                <FadeIn key={step} delay={i * 100}>
                  <div className="bg-background p-6 sm:p-8 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{icon}</span>
                      <span className="text-xs font-bold tracking-[0.12em] text-muted-foreground">{step}</span>
                    </div>
                    <h3 className="text-base font-semibold tracking-[-0.01em] mb-2">{title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{body}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6">
          <div className="mx-auto max-w-[1200px] bg-background px-6 py-12 sm:py-16 rounded-xl">
            <FadeIn>
              <div className="mb-10">
                <SectionLabel>Everything included</SectionLabel>
                <h2 className="mt-5 max-w-xl text-2xl font-semibold tracking-[-0.02em]">
                  Every part of a brand deal, handled.
                </h2>
                <p className="mt-3 max-w-xl text-base text-muted-foreground">
                  From the first email to the final payment — EarnHQ covers every step most creators currently do manually, across six different apps.
                </p>
              </div>
            </FadeIn>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, description, bullets }, i) => (
                <FadeIn key={title} delay={i * 60} className="h-full">
                  <article className="rounded-lg border border-border bg-surface p-5 h-full">
                    <div className="flex size-10 items-center justify-center rounded-md border border-border bg-brand-subtle text-brand-text">
                      <Icon className="size-5" strokeWidth={1.5} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold tracking-[-0.01em]">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                    <ul className="mt-3 grid gap-1.5">
                      {bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-[7px] size-1 shrink-0 rounded-full bg-brand-text" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 sm:px-6">
          <div className="mx-auto max-w-[1200px]">
            <FadeIn>
              <div className="overflow-hidden rounded-xl border border-border">
                <div className="grid divide-y border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                  <div className="bg-surface p-5 sm:p-6">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      Without EarnHQ
                    </p>
                    <div className="grid gap-2.5">
                      {[
                        'Brand email buried — deal slips through untracked',
                        'Spreadsheet with 6 tabs, always out of date',
                        'Invoice built manually in Google Docs, once you remember',
                        'Payment chased over WhatsApp, awkwardly',
                        'Exclusivity window forgotten — you sign the wrong deal',
                        '45+ minutes of admin per deal',
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-error" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-background p-5 sm:p-6">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.08em] text-brand-text">
                      With EarnHQ
                    </p>
                    <div className="grid gap-2.5">
                      {[
                        'Gmail AI surfaces the deal before you even open it',
                        'One pipeline — all deals, all stages, always live',
                        'Invoice generated in one click from deal data',
                        'Overdue alerts remind you exactly when to follow up',
                        'Exclusivity windows tracked with 14-day expiry alerts',
                        'Under 2 minutes of admin per deal',
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-2 text-sm text-foreground">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-success" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        <section className="px-4 sm:px-6">
          <div className="mx-auto grid max-w-[1200px] gap-8 bg-background px-6 py-12 sm:py-16 rounded-xl lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] lg:items-center">
            <FadeIn>
              <ImportToInvoiceMockup />
            </FadeIn>

            <FadeIn delay={150}>
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
            </FadeIn>
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

        <section className="px-4 sm:px-6">
          <div className="mx-auto max-w-[1200px] bg-background px-6 py-10 rounded-xl">
            <FadeIn>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    quote: "I used to track everything in a Notion database. EarnHQ is what that database always wanted to be.",
                    name: "Jamie L.",
                    handle: "@jamiecreates",
                    subs: "280k YouTube",
                  },
                  {
                    quote: "The invoice flow alone saves me 20 minutes per deal. And I never forget to follow up on overdue payments anymore.",
                    name: "Priya M.",
                    handle: "@priyareviews",
                    subs: "190k Instagram",
                  },
                  {
                    quote: "Finally something built for creators, not agencies. My rate card is set once and every invoice fills itself.",
                    name: "Carlos V.",
                    handle: "@carlosbuilds",
                    subs: "95k Newsletter",
                  },
                ].map(({ quote, name, handle, subs }, i) => (
                  <FadeIn key={name} delay={i * 80}>
                    <figure className="rounded-xl border border-border bg-surface p-5 h-full">
                      <blockquote className="text-sm leading-6 text-muted-foreground">
                        &ldquo;{quote}&rdquo;
                      </blockquote>
                      <figcaption className="mt-4 flex items-center gap-3">
                        <div className="size-8 rounded-full bg-brand-subtle flex items-center justify-center text-xs font-bold text-brand-text">
                          {name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{name}</div>
                          <div className="text-xs text-muted-foreground">{handle} · {subs}</div>
                        </div>
                      </figcaption>
                    </figure>
                  </FadeIn>
                ))}
              </div>
            </FadeIn>
          </div>
        </section>

        <section id="pricing" className="border-y border-border bg-surface px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1200px]">
            {/* Introductory offer banner */}
            <FadeIn>
              <div className="mb-10 rounded-xl border border-brand/30 bg-brand-subtle px-5 py-4 sm:px-6 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-xl">🎁</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Introductory offer — first 100 waitlist members get 2 months of Pro free
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      No credit card required. Join the waitlist, get early access, and your first 2 months are on us.
                    </p>
                  </div>
                </div>
                <Link
                  href="#waitlist"
                  className="shrink-0 inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-brand-hover"
                >
                  Claim offer <ArrowRight className="size-3.5" strokeWidth={1.5} />
                </Link>
              </div>
            </FadeIn>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
              <div>
                <SectionLabel>Pricing</SectionLabel>
                <h2 className="mt-5 text-2xl font-semibold leading-tight tracking-[-0.02em]">
                  Simple pricing. No artificial limits.
                </h2>
                <p className="mt-3 text-base leading-7 text-muted-foreground">
                  One plan for solo creators, one for agencies. No feature gating, no upgrade prompts mid-deal.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 max-w-3xl">
              {pricingPlans.map((plan, i) => (
                <FadeIn key={plan.name} delay={i * 100} className="h-full">
                  <article
                    className={`relative rounded-xl border p-6 h-full flex flex-col ${
                      plan.featured
                        ? 'border-brand/40 bg-background shadow-sm'
                        : 'border-border bg-background'
                    }`}
                  >
                    {plan.featured && (
                      <div className="absolute -top-3 left-6">
                        <span className="inline-flex h-6 items-center rounded-full bg-primary px-3 text-xs font-semibold text-primary-foreground">
                          Most popular
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-semibold">{plan.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{plan.detail}</p>
                    </div>
                    <div className="mt-5 pb-5 border-b border-border">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-semibold tracking-[-0.02em]">{plan.price}</span>
                        <span className="text-sm text-muted-foreground">/ month</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{plan.annualNote}</p>
                    </div>
                    <ul className="mt-5 grid gap-2.5 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex gap-2 text-sm text-muted-foreground">
                          <Check className="mt-0.5 size-4 shrink-0 text-brand-text" strokeWidth={1.5} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={plan.ctaHref}
                      className={`mt-6 inline-flex h-11 w-full items-center justify-center rounded-md px-4 text-sm font-semibold transition-colors ${
                        plan.featured
                          ? 'bg-primary text-primary-foreground hover:bg-brand-hover'
                          : 'border border-border bg-surface text-foreground hover:border-border-strong'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                    {plan.featured && (
                      <p className="mt-3 text-center text-xs text-muted-foreground">
                        First 100 waitlist members get 2 months free
                      </p>
                    )}
                  </article>
                </FadeIn>
              ))}
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              No credit card required. Cancel any time.
            </p>
          </div>
        </section>

        <section id="faq" className="px-4 sm:px-6">
          <div className="mx-auto max-w-[1200px] bg-background px-6 py-12 sm:py-16 rounded-xl">
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
                Stop chasing payments.<br className="hidden sm:block" /> Start using EarnHQ.
              </h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                Join the waitlist for early access. First 100 members get 2 months of Pro completely free — no card required, no catch.
              </p>
            </div>
            <WaitlistForm variant="card" />
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background px-4 py-8 sm:px-6 mt-2">
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
