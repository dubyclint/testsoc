import { createClient } from '@supabase/supabase-js';

const config = useRuntimeConfig();

if (!config.public.supabaseUrl || !config.public.supabaseKey) {
  throw new Error('Missing Supabase configuration. Please check your environment variables.');
}

export const supabase = createClient(
  config.public.supabaseUrl,
  config.public.supabaseKey
);
