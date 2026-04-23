-- Create the portfolios table in Supabase
-- Run this SQL in your Supabase SQL Editor

-- Create the portfolios table in Supabase
-- Run this SQL in your Supabase SQL Editor
-- Images are stored in the bucket: portfolio-images

CREATE TABLE IF NOT EXISTS portfolios (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  linkedin VARCHAR(255),
  github VARCHAR(255),
  twitter VARCHAR(255),
  website VARCHAR(255),
  tagline TEXT,
  about_hint TEXT,
  skills TEXT,
  experience TEXT,
  research_profile TEXT,
  achievements TEXT,
  events TEXT,
  languages TEXT,
  template VARCHAR(100),
  profile_pic TEXT,
  projects JSONB,
  portfolio_html TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS portfolios_email_idx ON portfolios(email);

-- Optional: enable Row Level Security only if you are using Supabase Auth.
-- If you are not using auth, do not enable RLS or adjust policies accordingly.
-- ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Optional policies for Supabase Auth users
-- CREATE POLICY "Users can view their own portfolios" ON portfolios
--   FOR SELECT USING (auth.uid()::text = email);
--
-- CREATE POLICY "Users can insert their own portfolios" ON portfolios
--   FOR INSERT WITH CHECK (auth.uid()::text = email);
--
-- CREATE POLICY "Users can update their own portfolios" ON portfolios
--   FOR UPDATE USING (auth.uid()::text = email);
--
-- CREATE POLICY "Users can delete their own portfolios" ON portfolios
--   FOR DELETE USING (auth.uid()::text = email);