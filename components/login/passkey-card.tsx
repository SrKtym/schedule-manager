'use client';

import { Button } from "@heroui/button";
import { addToast } from '@heroui/toast';
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { CircleArrowRight } from "lucide-react";


export function PasskeyCard() {
    return (
        <div className="space-y-5">
            <h1 className="text-center text-xl font-medium">パスキーの登録</h1>
            <div className="flex flex-col items-center justify-center space-y-8">
                <Button 
                    className="w-full max-w-[200px]"
                    color="primary" 
                    variant="ghost" 
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
                <p className="text-justify">
                    パスキーを登録するには、事前にアカウントが登録されている必要があります。
                </p>
                <div className="flex flex-col text-sm space-y-3">
                    <div className="flex flex-row space-x-3">
                        <p>アカウントが未登録の方</p>
                        <CircleArrowRight height='20' width='20'/>
                        <Link href='/sign-up' className="underline text-blue-500 transition-colors hover:bg-gray-200">サインアップ</Link>
                    </div>
                    <div className="flex flex-row space-x-3">
                        <p>パスキーが登録済みの方</p>
                        <CircleArrowRight height='20' width='20'/>
                        <Link href='/sign-in' className="underline text-blue-500 transition-colors hover:bg-gray-200">サインイン</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}