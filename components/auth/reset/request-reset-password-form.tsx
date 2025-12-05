'use client';

import { requestResetPassword } from "@/utils/actions/auth";
import { useActionState } from "react";
import { Button, Input } from "@heroui/react";


export function RequestResetPasswordForm() {
    const [state, formAction, isPending] = useActionState(requestResetPassword, undefined);

    return (
        <form 
            action={formAction} 
            className='space-y-8 bg-white rounded-3xl px-5 py-2.5 overflow-auto'
            aria-describedby='form-messages'
        >
            <h1 className="text-xl font-medium">
                パスワードを変更するためメールアドレスを入力してください
            </h1>
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
                {state?.errors && state.errors.map((error: string) => (
                    <p className='text-base text-red-500' key={error}>{error}</p>
                ))}
            </div>
            <div id='form-messages' aria-live='polite' aria-atomic='true'>
                <p className='text-base text-red-500' key={state?.messages?.errors}>
                    {state?.messages?.errors && state.messages.errors}
                </p>
                <p className='text-base text-green-500' key={state?.messages?.success}>
                    {state?.messages?.success && state.messages.success}
                </p>
            </div>
            <Button 
                type="submit" 
                color="primary" 
                className="w-full" 
                isLoading={isPending}
                aria-disabled={isPending}
            >
                {isPending ? '送信中...' : '送信'}
            </Button>
        </form>
    );
}