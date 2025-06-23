import { env } from '../env';
import { betterAuth } from 'better-auth';
import { twoFactor } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from './drizzle';
import * as schema from '@/lib/drizzle/schema/public';
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
        sendVerificationEmail: async ({user, url}) => {
            await sendEmailToConfirm(user.email, url);
        },
    },

    user: {
        deleteUser: {
            enabled: true
        }
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
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET
        },

        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET
        },
        
        twitter: {
            clientId: env.TWITTER_CLIENT_ID,
            clientSecret: env.TWITTER_CLIENT_SECRET
        }
    }
});

