import { PasskeyCard } from "@/components/login/passkey-card";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'パスキーの設定'
}

export default function PasskeyPage() {
    return (
        <div className="flex flex-col items-center justify-center space-y-3 p-5 rounded-3xl bg-white">
            <PasskeyCard />
        </div>
    );
}