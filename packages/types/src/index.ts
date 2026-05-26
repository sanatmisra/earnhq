// Deal status enum
export type DealStatus =
  | 'negotiating'
  | 'contracted'
  | 'in_production'
  | 'live'
  | 'invoiced'
  | 'paid'
  | 'cancelled'

// Platform enum
export type Platform =
  | 'youtube'
  | 'instagram'
  | 'tiktok'
  | 'podcast'
  | 'newsletter'

// Deal type enum
export type DealType =
  | 'integration'
  | 'dedicated'
  | 'ugc'
  | 'affiliate'
  | 'event'

// Invoice status enum
export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'overdue'
  | 'cancelled'

// Subscription plan types
export type SubscriptionPlan = 'free' | 'pro' | 'agency'
export type SubscriptionStatus = 'free' | 'active' | 'cancelled' | 'past_due'

// Deliverable item in a deal
export interface Deliverable {
  id: string
  description: string
  completed: boolean
  dueDate?: string
}

// Line item in an invoice
export interface LineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

// Profile (extends Supabase auth.users)
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  company_name: string | null
  website: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  country: string
  timezone: string
  currency: string
  // Gmail integration
  gmail_connected: boolean
  gmail_access_token: string | null
  gmail_refresh_token: string | null
  gmail_token_expiry: string | null
  // Stripe integration
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: SubscriptionStatus
  subscription_plan: SubscriptionPlan
  // Metadata
  created_at: string
  updated_at: string
}

// Deal
export interface Deal {
  id: string
  user_id: string
  // Brand info
  brand_name: string
  brand_contact_name: string | null
  brand_contact_email: string | null
  brand_website: string | null
  // Deal details
  title: string
  description: string | null
  status: DealStatus
  platform: Platform
  deal_type: DealType
  // Financial
  amount: number | null
  currency: string
  // Dates
  pitch_date: string | null
  contract_date: string | null
  deadline: string | null
  live_date: string | null
  payment_due_date: string | null
  // Approval loop
  content_submitted_at: string | null
  approval_threshold_days: number
  // Deliverables
  deliverables: Deliverable[]
  // Communication
  gmail_thread_id: string | null
  notes: string | null
  // Exclusivity
  exclusivity_enabled: boolean
  exclusivity_category: string | null
  exclusivity_ends_at: string | null
  // Metadata
  created_at: string
  updated_at: string
}

// Invoice
export interface Invoice {
  id: string
  user_id: string
  deal_id: string | null
  // Invoice details
  invoice_number: string
  status: InvoiceStatus
  // Client info
  client_name: string
  client_email: string | null
  client_address: string | null
  // Financial
  subtotal: number
  tax_rate: number
  tax_amount: number
  total: number
  currency: string
  // Line items
  line_items: LineItem[]
  // Dates
  issue_date: string
  due_date: string | null
  paid_date: string | null
  // Payment
  payment_method: string | null
  payment_notes: string | null
  // Metadata
  notes: string | null
  created_at: string
  updated_at: string
}

// Rate card entry
export interface RateCard {
  id: string
  user_id: string
  platform: Platform
  deal_type: DealType
  name: string
  description: string | null
  base_rate: number
  currency: string
  includes: string[]
  notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Form types for creating/updating
export type CreateDealInput = Omit<Deal, 'id' | 'user_id' | 'created_at' | 'updated_at'>
export type UpdateDealInput = Partial<CreateDealInput>

export type CreateInvoiceInput = Omit<Invoice, 'id' | 'user_id' | 'created_at' | 'updated_at'>
export type UpdateInvoiceInput = Partial<CreateInvoiceInput>

export type CreateRateCardInput = Omit<RateCard, 'id' | 'user_id' | 'created_at' | 'updated_at'>
export type UpdateRateCardInput = Partial<CreateRateCardInput>

export type UpdateProfileInput = Partial<Omit<Profile, 'id' | 'email' | 'created_at' | 'updated_at'>>

// Deal status colors mapping
export const DEAL_STATUS_COLORS: Record<DealStatus, string> = {
  negotiating: '#6366F1',
  contracted: '#3B82F6',
  in_production: '#F59E0B',
  live: '#22C55E',
  invoiced: '#A855F7',
  paid: '#10B981',
  cancelled: '#71717A',
}

// Platform display names
export const PLATFORM_LABELS: Record<Platform, string> = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  podcast: 'Podcast',
  newsletter: 'Newsletter',
}

// Deal type display names
export const DEAL_TYPE_LABELS: Record<DealType, string> = {
  integration: 'Integration',
  dedicated: 'Dedicated',
  ugc: 'UGC',
  affiliate: 'Affiliate',
  event: 'Event',
}

// Invoice status colors
export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  draft: '#71717A',
  sent: '#3B82F6',
  paid: '#22C55E',
  overdue: '#EF4444',
  cancelled: '#71717A',
}
