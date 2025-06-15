import { ResetPassword } from "@/components/reset-password/reset-password-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'パスワードの変更'
}

export default function ResetPasswordPage() {
    return <ResetPassword />;
}