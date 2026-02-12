/**
 * SUPABASE CLIENT
 * 
 * WHAT: This is the "Connection" to our database.
 * WHY: We use this single instance (called a Singleton) to talk to Supabase 
 * for everything: Login, Registration, and fetching Products.
 * 
 * JUNIOR TIP: 
 * We use the 'VITE_' prefix on environment variables so that the browser 
 * can see them. These are our "Keys" to open the database door.
 */

import { createClient } from "@supabase/supabase-js";

// Load our secret keys from the .env.local file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Create the client that we will export for the rest of the app to use
export const supabase = createClient(supabaseUrl, supabaseKey);