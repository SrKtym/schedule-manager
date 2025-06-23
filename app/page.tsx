import { Button } from '@heroui/react';
import Link from "next/link";

export default function StartPage() {
    return (
        <main className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-400 to-pink-400">
            <div className="text-center text-white drop-shadow-xl space-y-8 mx-3" >
                <h1 className="font-semibold text-3xl sm:text-6xl">🔐認証チュートリアル</h1>
                <p>Nextjs(App Router), TypeScript, Supabaseを用いた認証機能の実装</p>
                <Link href='/sign-in'>
                    <Button color='primary'>はじめる</Button>
                </Link>
            </div>
        </main>
    );
}