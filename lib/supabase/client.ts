import { createBrowserClient } from '@supabase/ssr'
import { env } from '@/env'

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// この接続はstored procedureの呼び出しのみに制限する
export const supabaseAnon = createBrowserClient(
    supabaseUrl,
    supabaseKey
);