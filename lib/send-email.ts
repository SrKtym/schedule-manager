import { env } from '@/env';
import { Resend } from 'resend';
import { OtpNotificationEmail } from '@/components/email/otp-notification-email';
import { ResetPasswordEmail } from '@/components/email/reset-password-email';
import { ConfirmEmail } from '@/components/email/confirm-email';



const resend = new Resend(env.RESEND_API_KEY);



export async function sendEmailToReset(email: string, url: string) {
    await resend.emails.send({
        from: 'schedule-manager-livid.vercel.app',
        to: email,
        subject: 'パスワードの変更',
        react: ResetPasswordEmail(email, url)
    });
}


export async function sendEmailToConfirm(email: string, url: string) {
    await resend.emails.send({
        from: 'schedule-manager-livid.vercel.app',
        to: email,
        subject: 'メールアドレスの確認',
        react: ConfirmEmail(email, url)
    });
}


export async function sendTwoFactorTokenEmail(email: string, token: string) {
    await resend.emails.send({
        from: 'schedule-manager-livid.vercel.app',
        to: email,
        subject: '2段階認証',
        react: OtpNotificationEmail(email, token)
    });
}