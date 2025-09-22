import { Button } from "@heroui/react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'パスワードを変更しますか？'
}

export default function Reset() {
    return (
        <div className="space-y-6 bg-white rounded-3xl px-5 py-2.5 overflow-auto">
            <h1 className="text-xl drop-shadow-xl">
                パスワードを変更しますか？
            </h1>
            <p>
                パスワードを忘れてしまった場合、メールアドレスを使用してパスワードの変更をすることができます。
            </p>
            <div className="flex justify-between items-center gap-3">
                <Button 
                    as={Link}
                    href='/reset/request'
                    color="primary"
                >
                    パスワードを変更する
                </Button>
                <Button 
                    as={Link}
                    href='/sign-in'
                >
                    サインインページに戻る
                </Button>
            </div>
        </div>
    );
}