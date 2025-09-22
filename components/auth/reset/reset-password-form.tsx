'use client';

import { resetPasswordAction } from "@/utils/action";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { 
    addToast,
    Button,
    Input
} from "@heroui/react";
import Link from "next/link";
import { StateOmitName } from "@/types/sign-in";


export function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const param = new URLSearchParams(searchParams);
    const token = param.get('token');

    async function action(prevState: StateOmitName | undefined, formData: FormData) {
        if (token) {
            const response =  await resetPasswordAction(formData, token);
            if (response?.messages?.success) {
                addToast(
                    {
                        title: response.messages.success,
                        color: 'success'
                    }
                );
            } else {
                return response
            }
        }
    }
    const [state, formAction, isPending] = useActionState(action, undefined);


    if (!token) {
        return (
            <div className="flex-col items-center justify-center bg-white rounded-3xl px-5 py-2.5 overflow-auto space-y-6">
                <h1 className="text-xl drop-shadow-xl">
                    トークンが無効または存在しません。お手数ですが再度メールアドレスを入力してください。
                </h1>
                <div className="flex justify-between items-center gap-3">
                    <Button 
                        as={Link}
                        href='/reset/request'
                        color="primary"
                    >
                        再試行
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
    } else {
        return (
            <form 
                action={formAction} 
                className='space-y-8 bg-white rounded-3xl px-5 py-2.5 overflow-auto'
                aria-describedby='form-error'
            >
                <h1 className="text-xl font-medium">
                    新しいパスワードを入力してください。
                </h1>
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
                    {state?.errors && state.errors.map((error: string) => (
                        <p className='text-base text-red-500' key={error}>{error}</p>
                    ))}
                </div>
                <div id='form-error' aria-live='polite' aria-atomic='true'>
                    <p className='text-base text-red-500' key={state?.messages?.errors}>
                        {state?.messages?.errors && state.messages.errors}
                    </p>
                </div>
                <div className="flex items-center justify-between gap-4">
                    <Button 
                        color="primary"
                        type="submit" 
                        className="w-full max-w-[180px]"
                        isLoading={isPending}
                        aria-disabled={isPending}
                    >
                        {isPending ? '送信中...' : '送信'}
                    </Button>
                    <Button
                        as={Link}
                        href='/sign-in'
                    >
                        サインインページに戻る
                    </Button>
                </div>
            </form>
        );
    }
}