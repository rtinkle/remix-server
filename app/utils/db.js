import { createClient } from '@supabase/supabase-js'
  // Provide a custom `fetch` implementation as required for Cloudfare Pages
export const createSupabaseClient = (context) => createClient(context.SUPABASE_URL, context.SUPABASE_ANON_KEY, {
  fetch: (...args) => fetch(...args),
})
