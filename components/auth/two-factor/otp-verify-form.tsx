'use client';

import { addToast, Button, Input } from '@heroui/react';
import { authClient } from "@/lib/better-auth/auth-client";
import { useTransition, useActionState } from 'react';
import { verifyOtp } from '@/utils/actions/auth';


export function OtpVerifyForm() {
    const [state, formAction, isPending] = useActionState(verifyOtp, undefined);
    const [isPendingSendOtp, startTransitionSendOtp] = useTransition();

    return (
        <div className='space-y-3'>
            <p>
                メールを送信し、表示されているOTPコードをフォームに入力してください。
            </p>
            <form 
                action={formAction}
                className='space-y-5' 
                aria-describedby='form-messages'
            >
                <Input
                    id='otp'
                    name='otp'
                    type='text'
                    label='OTPコード'
                    inputMode='numeric'
                    variant='bordered'
                    isRequired
                    aria-describedby='otp-error'
                />
                <div id='otp-error' aria-live='polite' aria-atomic='true'>
                    {state?.errors && state.errors.map((error: string) => (
                        <p className='text-base text-red-500' key={error}>
                            {error}
                        </p>
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
                <div className='flex items-center justify-between space-x-5'>
                    <Button 
                        className='max-w-[180px] w-full' 
                        color='primary' 
                        type='submit'
                        isLoading={isPending}
                        aria-disabled={isPending}
                    >
                        確認
                    </Button>
                    <Button 
                        color='secondary'
                        type='submit'
                        isLoading={isPendingSendOtp}
                        className='max-w-[180px] w-full' 
                        onPress={() => {
                            startTransitionSendOtp(async () => {
                                const {data, error} = await authClient.twoFactor.sendOtp();
                                if (data) {
                                    addToast({
                                        title: 'メールの送信に成功しました。',
                                        color: 'success',
                                        description: 'メールに表示されているOTPコードをフォームに入力してください。'
                                    });
                                } else {
                                    addToast({
                                        title: 'メールの送信に失敗しました。',
                                        color: 'danger',
                                        description: `お手数ですが再試行してください。詳細: ${error?.message}`
                                    });
                                }
                            });
                        }}
                    >
                        {isPendingSendOtp ? '送信中...' : 'メールの送信'}
                    </Button> 
                </div>
            </form>
        </div>
    );
}