import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured")
}

// Use service role key if available (production), otherwise fall back to anon key (development)
const apiKey = supabaseServiceRoleKey || supabaseAnonKey || ""

export const supabaseServer = createClient(supabaseUrl, apiKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})
