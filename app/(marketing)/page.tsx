'use client'

import Link from 'next/link'
import { WaitlistForm } from './_components/WaitlistForm'
import { FAQ } from './_components/FAQ'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const problems = [
  {
    emoji: '📧',
    title: 'Deal terms buried in 47 emails',
    desc: "Brand reaches out in March. You negotiate for two weeks. The final rate, deliverable count, and usage rights are scattered across a thread you'll never find when you need them.",
  },
  {
    emoji: '📊',
    title: "A Google Sheet that's 3 months out of date",
    desc: "You set it up with good intentions. Now it's a graveyard of stale deal statuses, missing payment dates, and brands you forgot you were still contracted with.",
  },
  {
    emoji: '💸',
    title: 'Invoices you forgot to send',
    desc: 'You went live. The brand loved it. You got busy making the next video. Six weeks later you realise nobody paid you — because you never sent an invoice.',
  },
  {
    emoji: '⏰',
    title: 'Deliverable deadlines you almost missed',
    desc: 'The integration date was in the contract. The contract was in an email. The email got buried. Your brand contact is now sending a polite-but-panicked follow-up.',
  },
]

const steps = [
  {
    emoji: '📥',
    title: 'Connect Gmail',
    desc: 'One-click OAuth. EarnHQ gets read-only access to your inbox — nothing is stored, nothing is sent on your behalf. Takes 30 seconds.',
    detail: 'Read-only · No data stored',
  },
  {
    emoji: '🤖',
    title: 'AI Reads Your Deals',
    desc: 'GPT-4o scans your sponsor threads and automatically extracts brand name, deal value, deliverables, deadlines, and platform. You review and confirm.',
    detail: 'Powered by GPT-4o-mini',
  },
  {
    emoji: '⚡',
    title: 'Run Your Pipeline',
    desc: 'Track every deal from negotiating to paid. Send a branded invoice in one click. Get deadline reminders. Know exactly who owes you money — and how much.',
    detail: 'Invoice → Track → Get paid',
  },
]

const features = [
  { emoji: '📥', title: 'Smart Gmail Parsing', desc: 'AI scans your inbox for sponsorship threads and pulls out every deal detail automatically. Review once, save forever.' },
  { emoji: '🗂️', title: 'Deal Pipeline', desc: 'A clean board that takes every deal from Negotiating → Contracted → In Production → Live → Invoiced → Paid. One source of truth.' },
  { emoji: '📄', title: 'One-Click Invoices', desc: 'Professional, branded PDF invoices generated from your deal data. Send in one click. Looks like you have an accountant.' },
  { emoji: '💳', title: 'Payment Tracking', desc: 'Always know what\'s outstanding and what\'s cleared. Never forget to follow up on an overdue invoice again.' },
  { emoji: '💰', title: 'Rate Card Builder', desc: 'Build your standard pricing by platform and format. Share a clean rate card with any brand in seconds — no more "what do you charge?" back-and-forth.' },
  { emoji: '🔔', title: 'Deliverable Reminders', desc: 'Automatic reminders before every deadline. Never get a "where\'s the video?" email from a brand again.' },
]

const testimonials = [
  {
    quote: "I've been living in a Google Sheet for 2 years. The Gmail parser found 11 active deals I had half-forgotten about. This is exactly what I needed.",
    name: 'Jamie K.',
    handle: 'YouTube Creator · 280k subscribers',
    initials: 'JK',
    gradient: 'from-primary to-purple-500',
  },
  {
    quote: "I run about 8 podcast sponsorships a month. Tracking them was a mess. EarnHQ's pipeline view makes me feel like I actually have a business now.",
    name: 'Marcus R.',
    handle: 'Podcast Host · 120k listeners',
    initials: 'MR',
    gradient: 'from-success to-blue-500',
  },
  {
    quote: 'Sent my first EarnHQ invoice in 40 seconds. My old process was copy a Google Doc, edit it, export PDF, attach it to email. This is embarrassingly better.',
    name: 'Sophia L.',
    handle: 'Newsletter Creator · 45k subscribers',
    initials: 'SL',
    gradient: 'from-warning to-error',
  },
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: '/ month',
    desc: 'Perfect for getting started and testing the waters.',
    features: ['3 active deals', 'Basic deal pipeline', 'Manual deal entry'],
    disabledFeatures: ['Gmail sync & AI parsing', 'Invoice generation', 'Payment tracking'],
    featured: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/ month',
    desc: 'For the solo creator running a real brand deal business.',
    features: ['Unlimited active deals', 'Gmail sync & AI parsing', 'Professional invoice generation', 'Payment tracking & reminders', 'Rate card builder', 'Deliverable deadline alerts'],
    disabledFeatures: [],
    featured: true,
  },
  {
    name: 'Agency',
    price: '$99',
    period: '/ month',
    desc: 'For managers running deals across multiple creator accounts.',
    features: ['Everything in Pro', 'Multi-creator accounts', 'White-label invoices', 'Team access', 'Priority support', 'Custom branding'],
    disabledFeatures: [],
    featured: false,
  },
]

const dealCards = [
  { brand: 'NordVPN', initials: 'NR', meta: 'YouTube Integration · Due Jun 3', amount: '$4,500', status: 'In Production', statusClass: 'bg-warning/15 text-warning' },
  { brand: 'Squarespace', initials: 'SQ', meta: 'Newsletter · 3 issues', amount: '$2,200', status: 'Contracted', statusClass: 'bg-blue-500/15 text-blue-400' },
  { brand: 'Athletic Greens', initials: 'AG', meta: 'Podcast · 2 episodes', amount: '$3,000', status: 'Invoiced', statusClass: 'bg-purple-500/15 text-purple-400' },
  { brand: 'Hostinger', initials: 'HS', meta: 'YouTube Dedicated · Paid May 12', amount: '$5,000', status: 'Paid', statusClass: 'bg-success/15 text-success' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            Earn<span className="text-primary">HQ</span>
          </Link>
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6">
              <Link href="#how" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How it works</Link>
              <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
            </div>
            <Link href="#cta" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4">
              Join waitlist →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="hero" className="relative py-24 md:py-32 px-6 text-center overflow-hidden">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <Badge variant="outline" className="mb-8 px-4 py-1.5 text-sm border-border bg-[#111111]">
            <span className="w-2 h-2 rounded-full bg-success mr-2 shadow-[0_0_8px_theme(colors.success)]" />
            Now accepting waitlist signups — <strong className="text-foreground ml-1">3 months free</strong>
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            Stop managing brand deals<br />
            <span className="text-primary">in your inbox.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
            EarnHQ connects to Gmail, automatically extracts your sponsorship deals using AI, and gives you a clean command center to manage deliverables, send invoices, and track payments — all in one place.
          </p>

          <div className="flex flex-wrap gap-3 justify-center mb-5 max-w-md mx-auto">
            <WaitlistForm variant="inline" />
          </div>
          <p className="text-sm text-muted-foreground">
            No credit card. <strong className="text-foreground">3 months of Pro free</strong> for waitlist members.
          </p>

          <div className="flex justify-center gap-12 mt-16 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-extrabold tracking-tight">5–15</div>
              <div className="text-sm text-muted-foreground mt-1">deals managed per creator / month</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold tracking-tight">4 hrs</div>
              <div className="text-sm text-muted-foreground mt-1">avg. admin time saved per week</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-extrabold tracking-tight">$0</div>
              <div className="text-sm text-muted-foreground mt-1">to get started</div>
            </div>
          </div>

          {/* Product Preview */}
          <div className="mt-16 bg-[#111111] border border-border rounded-2xl overflow-hidden shadow-[0_0_0_1px_theme(colors.border),0_48px_80px_rgba(0,0,0,0.6)]">
            <div className="bg-[#0D0D0D] border-b border-border p-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-error" />
                <div className="w-2.5 h-2.5 rounded-full bg-warning" />
                <div className="w-2.5 h-2.5 rounded-full bg-success" />
              </div>
              <div className="flex-1 bg-border rounded h-6 flex items-center px-3 text-xs text-muted-foreground max-w-[280px]">
                app.earnhq.co/deals
              </div>
            </div>
            <div className="grid md:grid-cols-[200px_1fr] min-h-[380px]">
              <div className="hidden md:flex flex-col gap-1 p-5 border-r border-border">
                {['Dashboard', 'Deals', 'Invoices', 'Payments', 'Rate Card'].map((item, i) => (
                  <div
                    key={item}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm ${
                      i === 0 ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="p-5">
                <div className="text-base font-bold mb-4">Active Deals</div>
                <div className="space-y-2">
                  {dealCards.map((deal) => (
                    <div key={deal.brand} className="bg-background border border-border rounded-lg p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-primary/15 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {deal.initials}
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{deal.brand}</div>
                          <div className="text-xs text-muted-foreground">{deal.meta}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-bold">{deal.amount}</div>
                        <Badge variant="secondary" className={deal.statusClass}>
                          {deal.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Badge variant="outline" className="mb-5 text-primary border-primary/30 bg-primary/10">
            The Problem
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Running brand deals is<br />a second job. Without the tools.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            You&apos;re creative director, account manager, accountant, and project manager — all at once. Most creators manage 5–15 brand deals a month with nothing but their inbox and a spreadsheet.
          </p>

          <div className="grid md:grid-cols-2 gap-5 mt-14">
            {problems.map((problem) => (
              <Card key={problem.title} className="p-7 bg-[#111111] border-border relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-error to-transparent opacity-60" />
                <span className="text-3xl mb-3 block">{problem.emoji}</span>
                <h3 className="text-base font-bold mb-2">{problem.title}</h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed">{problem.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-24 px-6 bg-[#111111] border-y border-border">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-5 text-primary border-primary/30 bg-primary/10">
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            From inbox chaos to<br />clean pipeline in minutes.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Three steps and you&apos;re running. No manual entry, no spreadsheet migration.
          </p>

          <div className="grid md:grid-cols-3 gap-px bg-border mt-16 relative">
            <div className="hidden md:block absolute top-9 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            {steps.map((step, i) => (
              <div key={step.title} className="bg-background p-8 text-center md:text-left">
                <div className="w-[72px] h-[72px] rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto md:mx-0 mb-6 text-2xl relative z-10">
                  {step.emoji}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-3">{step.desc}</p>
                <Badge variant="outline" className="text-primary border-primary/25 bg-primary/10 text-xs">
                  {step.detail}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <Badge variant="outline" className="mb-5 text-primary border-primary/30 bg-primary/10">
            Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Everything a solo creator<br />needs to run their deal business.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            No bloat. No agency features you&apos;ll never use. Built for the creator running 5–15 deals a month on their own.
          </p>

          <div className="grid md:grid-cols-3 gap-px bg-border border border-border rounded-2xl overflow-hidden mt-14">
            {features.map((feature) => (
              <div key={feature.title} className="bg-[#111111] p-8 hover:bg-[#161616] transition-colors">
                <div className="w-12 h-12 bg-primary/10 border border-primary/25 rounded-xl flex items-center justify-center mb-4 text-xl">
                  {feature.emoji}
                </div>
                <h3 className="text-base font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 px-6 bg-[#111111] border-y border-border">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-5 text-primary border-primary/30 bg-primary/10">
            Early Feedback
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            What creators are saying.
          </h2>

          <div className="grid md:grid-cols-3 gap-5 mt-14">
            {testimonials.map((t) => (
              <Card key={t.name} className="p-6 bg-background border-border text-left">
                <div className="text-warning text-sm mb-3">★★★★★</div>
                <p className="text-[15px] leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-bold text-white`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.handle}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-5 text-primary border-primary/30 bg-primary/10">
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            Simple, creator-friendly pricing.
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start free. Upgrade when you&apos;re ready. Waitlist members get 3 months of Pro free.
          </p>

          <div className="grid md:grid-cols-3 gap-5 mt-14 items-start">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-8 text-left relative ${
                  plan.featured
                    ? 'border-primary bg-gradient-to-b from-primary/5 to-[#111111]'
                    : 'bg-[#111111] border-border'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
                <hr className="border-border mb-6" />
                <ul className="space-y-2.5 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span className="text-success font-bold">✓</span>
                      {f}
                    </li>
                  ))}
                  {plan.disabledFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span>—</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.name === 'Agency' ? 'mailto:hello@earnhq.co' : '#cta'}
                  className={cn(
                    'inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 w-full',
                    plan.featured
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {plan.name === 'Agency' ? 'Contact us' : 'Join waitlist — 3 months free →'}
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 bg-[#111111] border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-5 text-primary border-primary/30 bg-primary/10">
            FAQ
          </Badge>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Common questions.
          </h2>
          <FAQ />
        </div>
      </section>

      {/* Final CTA */}
      <section id="cta" className="py-28 px-6 text-center relative overflow-hidden border-t border-border">
        <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1)_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-2xl mx-auto relative">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-5">
            Your brand deal business<br />deserves <span className="text-primary">better tools.</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10">
            Join the waitlist today. Get 3 months of Pro free when we launch. No credit card required.
          </p>
          <div className="max-w-md mx-auto mb-4">
            <WaitlistForm variant="inline" />
          </div>
          <p className="text-sm text-muted-foreground">
            Joining takes 10 seconds. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <div className="font-extrabold">Earn<span className="text-primary">HQ</span></div>
            <div className="text-sm text-muted-foreground">© 2026 EarnHQ. All rights reserved.</div>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <a href="mailto:hello@earnhq.co" className="hover:text-foreground transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
