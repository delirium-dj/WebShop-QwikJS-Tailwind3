import type { RequestEventLoader, RequestEventAction } from '@builder.io/qwik-city';
import { createClient } from '@supabase/supabase-js';

export const getSupabaseServer = (requestEv: RequestEventLoader | RequestEventAction) => {

  const cookieHeader = requestEv.request.headers.get('cookie') || '';
  const cookies = Object.fromEntries(cookieHeader.split('; ').map(c => c.split('=')));
  
  // 1. Try our explicit cookie first (simplest)
  let accessToken = cookies['sb-access-token'];

  // 2. If not found, try the specific Supabase auth-helpers format
  // (format: sb-<project-ref>-auth-token)
  if (!accessToken) {
    const sbCookieKey = Object.keys(cookies).find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
    const sbCookieValue = sbCookieKey ? cookies[sbCookieKey] : null;
    
    if (sbCookieValue) {
      try {
        const decodedValue = decodeURIComponent(sbCookieValue);
        const parsed = JSON.parse(decodedValue);
        if (Array.isArray(parsed) && parsed.length > 0) {
          accessToken = parsed[0];
        } else if (parsed && typeof parsed === 'object' && 'access_token' in parsed) {
           accessToken = (parsed as any).access_token;
        }
      } catch (e) {
        // console.error('Error parsing Supabase cookie:', e);
      }
    }
  }

  return createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: false,
      },
      global: {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      },
    }
  );
};
