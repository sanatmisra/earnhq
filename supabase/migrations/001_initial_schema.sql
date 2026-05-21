-- EarnHQ Initial Schema
-- Tables: profiles, deals, invoices, rate_card

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE deal_status AS ENUM (
  'negotiating',
  'contracted',
  'in_production',
  'live',
  'invoiced',
  'paid',
  'cancelled'
);

CREATE TYPE platform AS ENUM (
  'youtube',
  'instagram',
  'tiktok',
  'podcast',
  'newsletter'
);

CREATE TYPE deal_type AS ENUM (
  'integration',
  'dedicated',
  'ugc',
  'affiliate',
  'event'
);

CREATE TYPE invoice_status AS ENUM (
  'draft',
  'sent',
  'paid',
  'overdue',
  'cancelled'
);

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  website TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'US',
  timezone TEXT DEFAULT 'America/New_York',
  currency TEXT DEFAULT 'USD',
  -- Gmail integration
  gmail_connected BOOLEAN DEFAULT FALSE,
  gmail_access_token TEXT,
  gmail_refresh_token TEXT,
  gmail_token_expiry TIMESTAMPTZ,
  -- Stripe integration
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  subscription_status TEXT DEFAULT 'free',
  subscription_plan TEXT DEFAULT 'free',
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Deals table
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- Brand info
  brand_name TEXT NOT NULL,
  brand_contact_name TEXT,
  brand_contact_email TEXT,
  brand_website TEXT,
  -- Deal details
  title TEXT NOT NULL,
  description TEXT,
  status deal_status DEFAULT 'negotiating',
  platform platform NOT NULL,
  deal_type deal_type NOT NULL,
  -- Financial
  amount DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  -- Dates
  pitch_date DATE,
  contract_date DATE,
  deadline DATE,
  live_date DATE,
  payment_due_date DATE,
  -- Deliverables
  deliverables JSONB DEFAULT '[]',
  -- Communication
  gmail_thread_id TEXT,
  notes TEXT,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  -- Invoice details
  invoice_number TEXT NOT NULL,
  status invoice_status DEFAULT 'draft',
  -- Client info (can differ from deal brand)
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_address TEXT,
  -- Financial
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  -- Line items
  line_items JSONB DEFAULT '[]',
  -- Dates
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  paid_date DATE,
  -- Payment
  payment_method TEXT,
  payment_notes TEXT,
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rate card table
CREATE TABLE rate_card (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  -- Rate details
  platform platform NOT NULL,
  deal_type deal_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  base_rate DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  -- Additional info
  includes JSONB DEFAULT '[]',
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Ensure unique rate per platform/deal_type combo per user
  UNIQUE(user_id, platform, deal_type)
);

-- Create indexes for performance
CREATE INDEX idx_deals_user_id ON deals(user_id);
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_brand_name ON deals(brand_name);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_deal_id ON invoices(deal_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_rate_card_user_id ON rate_card(user_id);

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_card ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Deals RLS Policies
CREATE POLICY "Users can view own deals"
  ON deals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deals"
  ON deals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deals"
  ON deals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own deals"
  ON deals FOR DELETE
  USING (auth.uid() = user_id);

-- Invoices RLS Policies
CREATE POLICY "Users can view own invoices"
  ON invoices FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own invoices"
  ON invoices FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own invoices"
  ON invoices FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own invoices"
  ON invoices FOR DELETE
  USING (auth.uid() = user_id);

-- Rate Card RLS Policies
CREATE POLICY "Users can view own rate_card"
  ON rate_card FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rate_card"
  ON rate_card FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own rate_card"
  ON rate_card FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own rate_card"
  ON rate_card FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rate_card_updated_at
  BEFORE UPDATE ON rate_card
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
