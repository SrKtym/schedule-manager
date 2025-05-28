import { Button } from '@heroui/react';
import Link from "next/link";

export default function HomePage() {
    return (
        <main className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-400 to-pink-400">
            <div className="text-center text-white drop-shadow-xl space-y-8 mx-3" >
                <h1 className="text-6xl font-semibold">🔐認証チュートリアル</h1>
                <p>Nextjs(App Router), TypeScript, Supabaseを用いた認証機能の実装</p>
                <Link href='/sign-in'>
                    <Button color='primary' variant='flat'>はじめる</Button>
                </Link>
            </div>
        </main>
    );
}