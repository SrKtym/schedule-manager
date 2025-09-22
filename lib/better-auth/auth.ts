import { env } from '../../env';
import { betterAuth } from 'better-auth';
import { admin as adminPlugin, jwt, twoFactor } from 'better-auth/plugins';
import { ac, admin, student, professor } from '@/permissions';
import { passkey } from 'better-auth/plugins/passkey';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '../drizzle';
import * as schema from '@/lib/drizzle/schema/public';
import { nextCookies } from 'better-auth/next-js';
import { resend } from '@/lib/resend/resend';
import { ResetPasswordEmail } from '@/components/verify-email/reset-password-email';
import { ConfirmSignUpEmail } from '@/components/verify-email/confirm-sign-up-email';
import { OtpNotificationEmail } from '@/components/verify-email/otp-notification-email';
import { DeleteAccountEmail } from '@/components/verify-email/delete-account-email';

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: schema,
        usePlural: true,
    }),

    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: true,
        resetPasswordTokenExpiresIn: 3600,
        async sendResetPassword({user, url}) {
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: user.email,
                subject: 'パスワードの変更',
                react: ResetPasswordEmail({
                    email: user.email,
                    url
                }),
            });
        },
    },

    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: 3600,
        async sendVerificationEmail({user, url}) {
            const redirectUrl = new URL(url);
            redirectUrl.searchParams.set('callbackURL', '/two-factor');
            await resend.emails.send({
                from: 'onboarding@resend.dev',  
                to: user.email,
                subject: '新規ログインの確認',
                react: ConfirmSignUpEmail({
                    email: user.email,
                    url: redirectUrl.toString()
                }),
            });
        }
    },

    user: {
        deleteUser: {
            enabled: true,
            async sendDeleteAccountVerification({user, url}) {
                await resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: user.email,
                    subject: 'アカウント削除の確認',
                    react: DeleteAccountEmail({
                        email: user.email,
                        url
                    }),
                });
            },
        }
    },


    plugins: [
        adminPlugin({
            ac: ac,
            roles: {
                admin: admin,
                professor: professor,
                student: student,
            },
            defaultRole: "student",
            adminUserIds: [env.BETTER_AUTH_ADMIN_USER_ID]
        }),

        twoFactor({
            otpOptions: {
                async sendOTP({user, otp}) {
                    await resend.emails.send({
                        from: 'onboarding@resend.dev',
                        to: user.email,
                        subject: 'OTP認証',
                        react: OtpNotificationEmail({
                            email: user.email,
                            otpCode: otp
                        }),
                    });
                },
            },
            skipVerificationOnEnable: true
        }),

        passkey(),
        jwt(),
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

