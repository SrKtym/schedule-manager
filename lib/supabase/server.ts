import "server-only";

import { createServerClient } from "@supabase/ssr";
import { env } from "@/env";
import { cookies } from "next/headers";

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SECRET_KEY;

export async function serverClient() {
    return createServerClient(
        supabaseUrl, 
        supabaseKey,
        {
            cookies: await cookies()
        }
    );
}