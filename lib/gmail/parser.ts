import { openai } from '@/lib/openai'
import type { GmailThread } from './fetch'
import type { DealStatus, Platform, DealType } from '@/types'

export interface ParsedDeal {
  threadId: string
  subject: string
  brand_name: string
  brand_contact_name: string | null
  brand_contact_email: string | null
  title: string
  description: string | null
  platform: Platform
  deal_type: DealType
  status: DealStatus
  amount: number | null
  currency: string
  deadline: string | null
  deliverables: string[]
  notes: string | null
  confidence: 'high' | 'medium' | 'low'
}

const SYSTEM_PROMPT = `You are an expert at extracting brand deal / sponsorship information from email threads between a content creator and a brand or agency.

Extract the following fields from the email thread and return ONLY valid JSON matching this exact schema:

{
  "brand_name": string,           // Company/brand name (required)
  "brand_contact_name": string | null,
  "brand_contact_email": string | null,
  "title": string,                // Short deal title e.g. "Nike Q1 Integration"
  "description": string | null,  // Brief summary of the deal
  "platform": "youtube" | "instagram" | "tiktok" | "podcast" | "newsletter",
  "deal_type": "integration" | "dedicated" | "ugc" | "affiliate" | "event",
  "status": "negotiating" | "contracted" | "in_production" | "live" | "invoiced" | "paid" | "cancelled",
  "amount": number | null,        // Numeric value only, no currency symbols
  "currency": string,             // 3-letter ISO code, default "USD"
  "deadline": string | null,      // ISO date string YYYY-MM-DD or null
  "deliverables": string[],       // Array of deliverable descriptions
  "notes": string | null,         // Any other relevant notes
  "confidence": "high" | "medium" | "low"  // How confident you are in the extraction
}

Confidence guidelines:
- "high": brand name, platform, amount, and deal type are all clearly identifiable
- "medium": most fields extractable but some are unclear or missing
- "low": email is vague, could be a cold outreach, or very little deal info present

Return ONLY the JSON object, no markdown, no explanation.`

function buildThreadContent(thread: GmailThread): string {
  const parts = thread.messages.map((msg, i) => {
    const header = `--- Email ${i + 1} | From: ${msg.from} | Date: ${msg.date} ---`
    return `${header}\n${msg.body}`
  })

  let content = `Subject: ${thread.subject}\n\n${parts.join('\n\n')}`

  // Cost guard: truncate to 8000 chars
  if (content.length > 8000) {
    content = content.slice(0, 4000) + '\n\n[...truncated...]\n\n' + content.slice(-4000)
  }

  return content
}

export async function parseThreadWithLLM(thread: GmailThread): Promise<ParsedDeal | null> {
  const content = buildThreadContent(thread)

  let raw: string
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Parse this email thread:\n\n${content}` },
      ],
      temperature: 0.1,
      max_tokens: 600,
      response_format: { type: 'json_object' },
    })
    raw = completion.choices[0]?.message?.content ?? ''
  } catch {
    return null
  }

  let parsed: ParsedDeal
  try {
    parsed = JSON.parse(raw)
  } catch {
    // Retry once with explicit json reminder
    try {
      const retry = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Parse this email thread and return ONLY JSON:\n\n${content}` },
        ],
        temperature: 0,
        max_tokens: 600,
        response_format: { type: 'json_object' },
      })
      parsed = JSON.parse(retry.choices[0]?.message?.content ?? '{}')
    } catch {
      return null
    }
  }

  // Skip low-confidence results missing core fields
  if (parsed.confidence === 'low' && (!parsed.brand_name || !parsed.platform)) {
    return null
  }

  return {
    threadId: thread.threadId,
    subject: thread.subject,
    brand_name: parsed.brand_name ?? 'Unknown Brand',
    brand_contact_name: parsed.brand_contact_name ?? null,
    brand_contact_email: parsed.brand_contact_email ?? null,
    title: parsed.title ?? thread.subject,
    description: parsed.description ?? null,
    platform: parsed.platform ?? 'youtube',
    deal_type: parsed.deal_type ?? 'integration',
    status: parsed.status ?? 'negotiating',
    amount: parsed.amount ?? null,
    currency: parsed.currency ?? 'USD',
    deadline: parsed.deadline ?? null,
    deliverables: Array.isArray(parsed.deliverables) ? parsed.deliverables : [],
    notes: parsed.notes ?? null,
    confidence: parsed.confidence ?? 'medium',
  }
}
