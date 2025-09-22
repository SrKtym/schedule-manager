'use client';

import { Input, Button } from "@heroui/react";
import { useActionState } from "react";
import { verifyTotp } from "@/utils/action";

export function TotpVerifyForm() {
    const [state, formAction, isPending] = useActionState(verifyTotp, undefined);

    return (
        <div className='space-y-3'>
            <p>
                TOTPアプリケーション上で表示されているコードをフォームに入力してください。
            </p>
            <form 
                action={formAction}
                className='space-y-5'
                aria-describedby='form-error'
                
            >
                <Input
                    id='totp'
                    name='totp'
                    type='text'
                    label='TOTPコード'
                    inputMode='numeric'
                    variant='bordered'
                    isRequired
                    aria-describedby='totp-error'
                />
                <div id='totp-error' aria-live='polite' aria-atomic='true'>
                    {state?.errors && state.errors.map((error: string) => (
                        <p className='text-base text-red-500' key={error}>
                            {error}
                        </p>
                    ))}
                </div>
                <div id='form-error' aria-live='polite' aria-atomic='true'>
                    <p className='text-base text-red-500' key={state?.messages?.errors}>
                        {state?.messages?.errors && state.messages.errors}
                    </p>
                </div>
                <Button 
                    className='w-full' 
                    color='primary' 
                    type='submit'
                    isLoading={isPending}
                    aria-disabled={isPending}
                >
                    {isPending ? '送信中...' : '確認'}
                </Button>
            </form>
        </div>
    );
}