import { createBrowserClient } from '@supabase/ssr'
import { clientEnv } from '@/env/client';

const supabaseUrl = clientEnv.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = clientEnv.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// この接続はstored procedureの呼び出しのみに制限する
export const supabaseAnon = createBrowserClient(
    supabaseUrl,
    supabaseKey
);