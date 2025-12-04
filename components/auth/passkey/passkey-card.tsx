'use client';

import { addToast, Button } from "@heroui/react";
import { authClient } from "@/lib/better-auth/auth-client";
import Link from "next/link";


export function PasskeyCard() {
    return (
        <div className="space-y-8">
            <h1 className="text-center text-xl font-medium">
                パスキーの登録
            </h1>
            <div className="text-justify space-y-5">
                <p>
                    ・パスワードの代わりにパスキーを使ってログインできます。
                </p>
                <p>
                    ・パスキーとは、人間の顔や指紋といった生体情報、あるいはPINコードのようなデバイスのロック解除情報を使って本人確認を行う、より安全な認証方式です。
                </p>
                <p>
                    ・一度登録すれば、次回以降はパスワードを入力する必要がなく、簡単にログインできます。
                </p>
            </div>
            <div className="flex items-center justify-between gap-x-5">
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
                    登録する
                </Button>
                <Button
                    as={Link}
                    href='/home'
                    className="max-w-[200px] w-full"
                >
                    ホームページへ
                </Button>
            </div>
        </div>
    );
}