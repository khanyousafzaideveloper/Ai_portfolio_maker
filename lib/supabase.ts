import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ukcpgpbhfpiyaekvgran.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrY3BncGJoZnBpeWFla3ZncmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTQ0MDQsImV4cCI6MjA5MjUzMDQwNH0._zNQCsl9x1fITmHl5JGqO3MLaxVR46KFTfmzhARldzg"

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase credentials not configured. Database features will not work.",
  )
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
)