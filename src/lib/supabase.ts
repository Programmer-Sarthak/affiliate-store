import { createBrowserClient } from '@supabase/ssr'

// This creates a singleton client for the browser that matches the Proxy's logic
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)