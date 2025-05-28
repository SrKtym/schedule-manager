'use client';

import { env } from '../env';
import { createAuthClient } from 'better-auth/react';
import { passkeyClient } from 'better-auth/client/plugins';
import { twoFactorClient } from 'better-auth/plugins';

export const authClient = createAuthClient({
    baseURL: env.NEXT_PUBLIC_APP_URL,
    plugins: [
        passkeyClient(), 
        twoFactorClient()]
});