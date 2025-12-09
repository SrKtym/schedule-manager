'use client';

import { clientEnv } from '@/env/client';
import { createAuthClient } from 'better-auth/react';
import { 
    adminClient, 
    passkeyClient, 
    twoFactorClient 
} from 'better-auth/client/plugins';
import { 
    ac, 
    admin, 
    professor, 
    student 
} from '@/permissions';

export const authClient = createAuthClient({
    baseURL: clientEnv.NEXT_PUBLIC_APP_URL,
    plugins: [
        adminClient({
            ac: ac,
            roles: {
                admin: admin,
                professor: professor,
                student: student,
            }
        }),
        passkeyClient(), 
        twoFactorClient()
    ]
});
