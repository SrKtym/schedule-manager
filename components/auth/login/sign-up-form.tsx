'use client';

import type { State } from '@/types/sign-up';
import { useActionState } from 'react';
import { signUp } from '@/utils/action';
import { 
    addToast,
    Button,
    Input
} from "@heroui/react";
import Link from 'next/link';
import { SocialLogin } from '@/components/auth/login/social-login';


export default function SignUpForm() {
    async function action(prevState: State | undefined, formData: FormData) {
        const response = await signUp(formData);
        if (response?.messages?.success) {
            addToast(
                {
                    title: 'サインアップに成功しました。',
                    color: 'success',
                    description: `${response.messages.success} にメールを送信しました。添付されたリンクに進みログインしてください。`
                }
            );
        } else {
            return response;
        }
    }
    const [state, formAction, isPending] = useActionState(action, undefined);

    return (
        <form 
            action={formAction} 
            className='space-y-5 bg-white rounded-3xl px-5 py-2.5 overflow-auto' 
            aria-describedby='form-error'
        >
            <h1 className="text-center text-xl font-medium">
                サインアップ
            </h1>
            <Input 
                id='name' 
                name='name' 
                type='name' 
                label='ユーザーネーム'
                placeholder='例: 山田太郎'
                aria-describedby='name-error'
                variant='bordered'   
                isRequired
            />
            <div id='name-error' aria-live='polite' aria-atomic='true'>
                {state?.errors?.name && state.errors.name.map((error: string) => (
                    <p className='text-base text-red-500' key={error}>{error}</p>
                ))}
            </div>
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
                {isPending ? '送信中...' : 'サインアップ'}
            </Button>
             <div className='grid grid-cols-3 items-center'>
                <div className='border-b-1 border-gray-500 max-w-[250px] w-auto' />
                <p className='text-center'>
                    または
                </p>
                <div className='border-b-1 border-gray-500 max-w-[250px] w-auto' />
            </div>
            <SocialLogin />
            <div className='flex-1 items-center justify-center text-center text-sm space-y-3'>
                <div>
                    <p className='mb-2'>アカウントをお持ちの方</p>
                    <Link 
                        href='/sign-in' 
                        prefetch
                        className='text-primary hover:underline'
                    >
                        サインイン
                    </Link>
                </div>
            </div> 
        </form>
    );
}