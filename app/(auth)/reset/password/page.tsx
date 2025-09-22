import { ResetPasswordForm } from "@/components/auth/reset/reset-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'パスワードの変更'
}

export default function ResetPasswordPage() {
    return <ResetPasswordForm />;
}