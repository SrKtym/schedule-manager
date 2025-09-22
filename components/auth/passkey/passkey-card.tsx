'use client';

import { 
    addToast,
    Button 
} from "@heroui/react";
import { authClient } from "@/lib/better-auth/auth-client";
import Link from "next/link";


export function PasskeyCard() {
    return (
        <div className="space-y-5">
            <h1 className="text-center text-xl font-medium">
                パスキーの登録
            </h1>
            <div className="flex items-center justify-center space-x-5">
                <Button 
                    className="max-w-[200px] w-full"
                    color="primary"  
                    onPress={async () => {
                        const data = await authClient.passkey.addPasskey();
                        if (data?.error) {
                            addToast({
                                title: 'パスキーの登録に失敗しました。',
                                color: 'danger',
                                description: 'お手数ですが再試行してください。'
                            });
                        } else {
                            addToast({
                                title: 'パスキーの登録に成功しました。',
                                color: 'success'
                            })
                        }
                    }}
                >
                    登録
                </Button>
                <Link href='/home'>
                    <Button
                        className="max-w-[200px] w-full"
                    >
                        ホームページへ
                    </Button>
                </Link>
            </div>
        </div>
    );
}