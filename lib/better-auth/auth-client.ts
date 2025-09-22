import { env } from '../../env';
import { createAuthClient } from 'better-auth/react';
import { adminClient, passkeyClient } from 'better-auth/client/plugins';
import { twoFactorClient } from 'better-auth/plugins';
import { ac, admin, professor, student } from '@/permissions';

export const authClient = createAuthClient({
    baseURL: env.NEXT_PUBLIC_APP_URL,
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