export interface GmailMessage {
  id: string
  subject: string
  from: string
  date: string
  body: string
}

export interface GmailThread {
  threadId: string
  subject: string
  snippet: string
  messages: GmailMessage[]
}

const SEARCH_QUERY =
  '(sponsorship OR sponsor OR "brand deal" OR collaboration OR collab OR "paid partnership" OR "campaign brief" OR "content brief" OR "rate card" OR "flat fee") newer_than:180d'

async function gmailGet(url: string, accessToken: string) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (res.status === 401) throw new Error('GMAIL_UNAUTHORIZED')
  if (!res.ok) throw new Error(`Gmail API error: ${res.status}`)
  return res.json()
}

function decodeBase64Url(encoded: string): string {
  return Buffer.from(encoded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractBody(payload: any): string {
  if (payload.body?.data) {
    const text = decodeBase64Url(payload.body.data)
    return payload.mimeType === 'text/html' ? stripHtml(text) : text
  }
  if (payload.parts) {
    // Prefer plain text
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return decodeBase64Url(part.body.data)
      }
    }
    // Fall back to html
    for (const part of payload.parts) {
      if (part.mimeType === 'text/html' && part.body?.data) {
        return stripHtml(decodeBase64Url(part.body.data))
      }
      if (part.parts) {
        const nested = extractBody(part)
        if (nested) return nested
      }
    }
  }
  return ''
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getHeader(headers: any[], name: string): string {
  return headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? ''
}

export async function fetchSponsorshipThreads(accessToken: string): Promise<GmailThread[]> {
  const listData = await gmailGet(
    `https://gmail.googleapis.com/gmail/v1/users/me/threads?q=${encodeURIComponent(SEARCH_QUERY)}&maxResults=50`,
    accessToken
  )

  if (!listData.threads?.length) return []

  const threads: GmailThread[] = []

  for (const { id } of listData.threads) {
    try {
      const threadData = await gmailGet(
        `https://gmail.googleapis.com/gmail/v1/users/me/threads/${id}?format=full`,
        accessToken
      )

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const messages: GmailMessage[] = threadData.messages.map((msg: any) => ({
        id: msg.id,
        subject: getHeader(msg.payload.headers, 'Subject'),
        from: getHeader(msg.payload.headers, 'From'),
        date: getHeader(msg.payload.headers, 'Date'),
        body: extractBody(msg.payload),
      }))

      threads.push({
        threadId: id,
        subject: messages[0]?.subject ?? '(no subject)',
        snippet: threadData.snippet ?? '',
        messages,
      })
    } catch {
      // Skip threads that fail to fetch individually
    }
  }

  return threads
}
