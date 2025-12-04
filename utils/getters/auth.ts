// データ取得系(GET method only)
import "server-only";

import { auth } from "@/lib/better-auth/auth";
import { cookies, headers } from "next/headers";
import { cache } from "react";


export const fetchSession = cache(async () => {
    const settionData = await auth.api.getSession({
        headers: await headers()
    });
    return settionData;
});

export async function fetch2faCookie() {
    const cookieStore = await cookies();
    const cookieName = process.env.NODE_ENV === 'development' ?
        'better-auth.two_factor' : 
        '__Secure-better-auth.two_factor';
    return cookieStore.get(cookieName)?.value;
}


