import { RequestResetPasswordForm } from "@/components/auth/reset/request-reset-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'メールアドレスの確認'
}

export default function RequestResetPasswordPage() {
    return <RequestResetPasswordForm />;
}