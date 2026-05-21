'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'Is my Gmail data safe?',
    answer: 'EarnHQ uses Google OAuth with read-only scope — we can see your emails but cannot send, delete, or modify anything. We only scan threads that match sponsorship keywords. No email content is stored on our servers; AI analysis happens in real-time and is discarded after extraction. Your data is encrypted in transit and at rest.',
  },
  {
    question: 'What platforms does EarnHQ support?',
    answer: 'EarnHQ supports deals across YouTube, Instagram, TikTok, podcasts, and newsletters. The AI parser is trained to recognise sponsorship language across all major creator formats. You can also manually add deals for any platform not in that list.',
  },
  {
    question: 'Can I use EarnHQ without connecting Gmail?',
    answer: 'Yes. The free plan lets you manually enter deals without connecting Gmail. The AI parsing and automatic deal extraction are Pro features that require Gmail access. You can still use the pipeline, invoicing, and payment tracking on the free plan with manual entry.',
  },
  {
    question: 'When does EarnHQ launch? What do I get for joining the waitlist?',
    answer: "We're in private beta and launching to the waitlist first. Waitlist members get 3 months of Pro ($87 value) completely free when we open access, plus early access before general availability. We'll email you as soon as your spot opens up — typically within 2–4 weeks of signing up.",
  },
  {
    question: 'I already use Notion / a spreadsheet. Why switch?',
    answer: "Notion and spreadsheets are general tools you've adapted for deal management. They don't read your emails, generate invoices, track payments, or send you deadline reminders. EarnHQ is purpose-built for brand deals — it does in seconds what your current setup does in an hour. Most creators keep their Notion for other things and switch EarnHQ on for brand deal ops specifically.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="max-w-3xl mx-auto mt-14 border border-border rounded-xl overflow-hidden">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-background">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold text-[15px] hover:bg-[#111111] transition-colors border-b border-border last:border-b-0"
          >
            {faq.question}
            <ChevronDown
              className={cn(
                'h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform',
                openIndex === index && 'rotate-180'
              )}
            />
          </button>
          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              openIndex === index ? 'max-h-96' : 'max-h-0'
            )}
          >
            <div className="px-5 pb-5 text-[15px] text-muted-foreground leading-relaxed border-b border-border last:border-b-0">
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
