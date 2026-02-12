import { createClient } from "@supabase/supabase-js";

   // These come from .env.local — the VITE_ prefix makes them available in the browser
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

   // This is safe: the Publishable key respects Row Level Security policies
   export const supabase = createClient(supabaseUrl, supabaseKey);