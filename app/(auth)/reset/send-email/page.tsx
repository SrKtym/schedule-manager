import SendEmail from "@/components/reset-password/send-email-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'メールアドレスの確認'
}

export default function Page() {
    return <SendEmail />;
}