import { env } from '../env';
import { betterAuth } from 'better-auth';
import { twoFactor } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './db';
import * as schema from '@/lib/db/schema/public';
import { sendEmailToConfirm, sendEmailToReset, sendTwoFactorTokenEmail } from './send-email';
import { nextCookies } from 'better-auth/next-js';


export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: schema,
        usePlural: true,
    }),

    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        resetPasswordTokenExpiresIn: 3600,
        sendResetPassword: async ({user, url}) => {
            await sendEmailToReset(user.email, url);
        },
    },

    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: 3600,
        sendVerificationEmail: async ({user, url, token}) => {
            await sendEmailToConfirm(user.email, url);
        },
    },

    plugins: [
        twoFactor({
            otpOptions: {
                async sendOTP({user, otp}) {
                    await sendTwoFactorTokenEmail(user.email, otp);
                },
            },
            skipVerificationOnEnable: true
        }),
        passkey(),
        nextCookies()

    ],

    socialProviders: {
        github: {
            clientId: env.BETTER_AUTH_GITHUB_ID,
            clientSecret: env.BETTER_AUTH_GITHUB_SECRET
        },

        google: {
            clientId: env.BETTER_AUTH_GOOGLE_ID,
            clientSecret: env.BETTER_AUTH_GOOGLE_SECRET
        },
        
        twitter: {
            clientId: env.BETTER_AUTH_TWITTER_ID,
            clientSecret: env.BETTER_AUTH_TWITTER_SECRET
        }
    }
});

export type AuthType = {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
}
