// Gmail parser placeholder
// This will be implemented to parse sponsor threads from Gmail

export const SPONSOR_KEYWORDS = [
  'partnership',
  'sponsorship',
  'collaboration',
  'brand deal',
  'paid promotion',
  'influencer',
  'campaign',
  'rate card',
  'media kit',
]

export async function filterSponsorThreads(threads: unknown[]) {
  // Implementation will filter Gmail threads by sponsor keywords
  return threads
}

export async function extractDealInfo(thread: unknown) {
  // Implementation will use GPT-4o-mini to extract deal information
  return null
}
