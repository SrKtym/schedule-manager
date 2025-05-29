import { createEnv } from '@t3-oss/env-nextjs';
import { config } from 'dotenv';
import { z } from 'zod';

config();

export const env = createEnv({
    server: {
        BETTER_AUTH_SECRET: z.string(),
        GITHUB_CLIENT_ID: z.string(),
        GITHUB_CLIENT_SECRET: z.string(),
        GOOGLE_CLIENT_ID: z.string(),
        GOOGLE_CLIENT_SECRET: z.string(),
        TWITTER_CLIENT_ID: z.string(),
        TWITTER_CLENNT_SECRET: z.string(),
        RESEND_API_KEY: z.string(),
        DATABASE_URL: z.string().url()
    },

    client: {
        NEXT_PUBLIC_APP_URL: z.string().url()
    },

    runtimeEnv: {
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET!,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID!,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET!,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
        TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID!,
        TWITTER_CLENNT_SECRET: process.env.TWITTER_CLENNT_SECRET!,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
        RESEND_API_KEY: process.env.RESEND_API_KEY!,
        DATABASE_URL: process.env.DATABASE_URL!
    }
});