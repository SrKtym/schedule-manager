'use client';

import { ResetPasswordAction } from "@/lib/action";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { 
    addToast,
    Button,
    Input
} from "@heroui/react";
import { Loader2 } from "lucide-react";
import Link from "next/link";


export function ResetPassword() {
    const searchParams = useSearchParams();
    const param = new URLSearchParams(searchParams);
    const token = param.get('token');

    async function action(prevState: string[] | undefined, formData: FormData) {
        if (token) {
            const response =  await ResetPasswordAction(formData, token);
            if (response?.messages.success) {
                addToast(
                    {
                        title: response.messages.success,
                        color: 'success'
                    }
                );
            } else {
                return response?.messages.errors
            }
        }
    }
    const [errorMessages, formAction, isPending] = useActionState(action, undefined);


    if (!token) {
        return (
            <div className="flex-col items-center justify-center space-y-6">
                <h1 className="text-2xl text-white drop-shadow-xl">
                    トークンが無効または存在しません。お手数ですが再度メールアドレスを入力してください。
                </h1>
                <div className="text-center">
                    <Link href='/reset/send-email'>
                        <Button color="primary">
                            再試行
                        </Button>
                    </Link>
                </div>
            </div>
        );
    } else {
        return (
            <form action={formAction} className='space-y-5 bg-white rounded-3xl px-5 py-2.5 overflow-visible'>
                <h1 className="text-xl font-medium">新しいパスワードを入力してください。</h1>
                <Input
                    id='password' 
                    name='password' 
                    type='password' 
                    label='パスワード'
                    placeholder='例: 12345678'
                    aria-describedby='password-error'
                    variant='bordered'
                    isRequired
                />
                <div id='password-error' aria-live='polite' aria-atomic='true'>
                    {errorMessages && errorMessages.map((error: string) => (
                        <p className='text-base text-red-500' key={error}>{error}</p>
                    ))}
                </div>
                <Button type="submit" className="w-full" aria-disabled={isPending}>
                    {isPending ? 
                    <div className="flex items-center space-x-3">
                        <Loader2 className="animate-spin"/>
                        <p>送信中...</p>
                    </div> 
                    : '送信'}
                </Button>
            </form>
        );
    }
}