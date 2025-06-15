import { PasskeyCard } from "@/components/login/passkey-card";
import Link from "next/link";
import { Button } from "@heroui/button";
import { getSession } from "@/lib/fetch";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'パスキーの設定'
}

export default async function PasskeyPage() {
    const session = await getSession();

    return (
        <div className="flex flex-col items-center justify-center space-y-3 p-5 rounded-3xl bg-white">
            <PasskeyCard />
            {session ?  
            <Link href='/home'>
                <Button color="primary">
                    ホームページへ
                </Button>
            </Link> : null}
        </div>
    );
}