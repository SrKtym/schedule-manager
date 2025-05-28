import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
    server: {
        BETTER_AUTH_SECRET: z.string(),
        BETTER_AUTH_GITHUB_ID: z.string(),
        BETTER_AUTH_GITHUB_SECRET: z.string(),
        BETTER_AUTH_GOOGLE_ID: z.string(),
        BETTER_AUTH_GOOGLE_SECRET: z.string(),
        BETTER_AUTH_TWITTER_ID: z.string(),
        BETTER_AUTH_TWITTER_SECRET: z.string(),
        RESEND_API_KEY: z.string(),
        DATABASE_URL: z.string().url()
    },

    client: {
        NEXT_PUBLIC_APP_URL: z.string().url()
    },

    runtimeEnv: {
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_GITHUB_ID: process.env.BETTER_AUTH_GITHUB_ID,
        BETTER_AUTH_GITHUB_SECRET: process.env.BETTER_AUTH_GITHUB_SECRET,
        BETTER_AUTH_GOOGLE_ID: process.env.BETTER_AUTH_GOOGLE_ID,
        BETTER_AUTH_GOOGLE_SECRET: process.env.BETTER_AUTH_GOOGLE_SECRET,
        BETTER_AUTH_TWITTER_ID: process.env.BETTER_AUTH_TWITTER_ID,
        BETTER_AUTH_TWITTER_SECRET: process.env.BETTER_AUTH_TWITTER_SECRET,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        RESEND_API_KEY: process.env.RESEND_API_KEY,
        DATABASE_URL: process.env.DATABASE_URL
    }
});