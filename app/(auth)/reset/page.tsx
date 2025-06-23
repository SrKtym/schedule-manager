import { Button } from "@heroui/react";
import Link from "next/link";

export default function Reset() {
    return (
        <div className="flex-col items-center justify-center space-y-6">
            <h1 className="text-2xl text-white drop-shadow-xl">パスワードを忘れてしまった場合、メールアドレスを使用してパスワードの変更をすることができます。</h1>
            <div className="text-center">
                <Link href='/reset/send-email'>
                    <Button color="primary">
                        パスワードを変更する
                    </Button>
                </Link>
            </div>
        </div>
    );
}