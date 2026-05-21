CREATE TABLE waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  creator_type text,  -- youtube | instagram | tiktok | podcast | other
  created_at timestamptz default now()
);
