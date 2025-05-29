'use client';

import type { StatePickEmail } from "@/lib/action";
import { ConfirmEmail } from "@/lib/action";
import { authClient } from "@/lib/auth-client";
import { useActionState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { Loader2 } from "lucide-react";


export default function SendEmail() {
    async function action(prevState: StatePickEmail | undefined, formData: FormData) {
        const response = await ConfirmEmail(formData);
            if (response.messages?.success) {
                const {data, error} = await authClient.forgetPassword({
                    email: response.messages.success,
                    redirectTo: '/reset/password'
                });
                if (data) {
                    addToast(
                        {
                            title: 'メールの送信に成功しました。',
                            color: 'success',
                            description: `${response.messages?.success} にメールを送信しました。添付されたリンクに進みパスワードを変更してください。`
                        }
                    );
                } else {
                    addToast(
                        {
                            title: 'メールの送信に失敗しました。',
                            color: 'danger',
                            description: `お手数ですが再試行してください。詳細: ${error.message}`
                        }
                    )
                }
            } else {
                return response;
            }
    }
    const [state, formAction, isPending] = useActionState(action, undefined);


    return (
        <form action={formAction} className='space-y-8 bg-white rounded-3xl px-5 py-2.5 overflow-visible'>
            <h1 className="text-xl font-medium">パスワードを変更するためメールアドレスを入力してください</h1>
            <Input
                id='email' 
                name='email' 
                type='email' 
                label='メールアドレス'
                placeholder='例: user@example.com'
                aria-describedby='email-error'
                variant='bordered'
                isRequired
            />
            <div id='email-error' aria-live='polite' aria-atomic='true'>
                {state?.errors?.email && state.errors.email.map((error: string) => (
                    <p className='text-base text-red-500' key={error}>{error}</p>
                ))}
            </div>
            <Button type="submit" color="primary" className="w-full" aria-disabled={isPending}>
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