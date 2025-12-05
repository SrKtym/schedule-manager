'use client';

import { useActionState, useTransition } from 'react';
import { authClient } from '@/lib/better-auth/auth-client';
import { signIn } from '@/utils/actions/auth';
import { setThemeCookie } from '@/utils/actions/main';
import { addToast, Button, Input } from '@heroui/react';
import { KeyRound } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SocialLogin } from './social-login';


export function SignInForm() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(signIn, undefined);
    const [isPendingPasskey, startTransitionPasskey] = useTransition();

    return (
        <form 
            action={formAction} 
            className='space-y-5 bg-white rounded-3xl px-5 py-2.5 overflow-auto' 
            aria-describedby='form-error'
        >
            <h1 className="text-center text-xl font-medium">
                サインイン
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
                {state?.errors?.email && state.errors.email.map((error: string) => (
                    <p className='text-base text-red-500' key={error}>{error}</p>
                ))}
            </div>
            <Input 
                id='password' 
                name='password' 
                type='password' 
                label='パスワード'
                placeholder='例: 12345678'
                minLength={8}
                aria-describedby='password-error'
                variant='bordered'
                isRequired
            />
            <div id='password-error' aria-live='polite' aria-atomic='true'>
                {state?.errors?.password && state.errors.password.map((error: string) => (
                    <p className='text-base text-red-500' key={error}>{error}</p>
                ))}
            </div>
            <div id='form-error' aria-live='polite' aria-atomic='true'>
                <p className='text-base text-red-500' key={state?.messages?.errors}>
                    {state?.messages?.errors && state.messages.errors}
                </p>
            </div>
            <Button 
                type='submit' 
                color='primary' 
                isLoading={isPending}
                className='w-full' 
                aria-disabled={isPending}
            >
                {isPending ? '送信中...' : 'サインイン'}
            </Button>
            <div className='grid grid-cols-3 items-center'>
                <div className='border-b-1 border-gray-500 max-w-[250px] w-auto' />
                <p className='text-center'>
                    または
                </p>
                <div className='border-b-1 border-gray-500 max-w-[250px] w-auto' />
            </div>
            <div className='flex flex-col space-y-3'>
                <SocialLogin />
                <Button 
                    color='primary' 
                    variant='ghost' 
                    aria-disabled={isPendingPasskey}
                    isLoading={isPendingPasskey}
                    onPress={() => {
                        startTransitionPasskey(async () => {
                            await authClient.signIn.passkey({
                                fetchOptions: {
                                    async onSuccess() {
                                        await setThemeCookie();
                                        router.push('/home');
                                    },
                                    onError(context) {
                                        addToast({
                                            title: 'サインインに失敗しました。',
                                            color: 'danger',
                                            description: `お手数ですが再試行してください。詳細: ${context.error.message}`
                                        });
                                    },
                                }
                            });
                        });
                    }}
                >
                    <KeyRound color='gray' />
                    パスキーで続行
                </Button>
            </div>
            <div className='flex-1 items-center justify-center text-center text-sm space-y-3'>
                <div>
                    <Link 
                        href='/reset' 
                        className='mb-2 text-primary hover:underline'
                    >
                        パスワードをお忘れの方
                    </Link>
                </div>
                <div>
                    <p className='mb-2'>
                        アカウントをお持ちでない方
                    </p>
                    <Link 
                        href='/sign-up' 
                        className='text-primary hover:underline'
                    >
                        サインアップ
                    </Link>
                </div>
            </div> 
        </form>
    );
}