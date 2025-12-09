import "server-only";

import { createServerClient } from "@supabase/ssr";
import { clientEnv } from "@/env/client";
import { serverEnv } from "@/env/server";
import { cookies } from "next/headers";

const supabaseUrl = clientEnv.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = serverEnv.SUPABASE_SECRET_KEY;

export async function serverClient() {
    return createServerClient(
        supabaseUrl, 
        supabaseKey,
        {
            cookies: await cookies()
        }
    );
}