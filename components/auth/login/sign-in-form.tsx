'use client';

import { useActionState } from 'react';
import { authClient } from '@/lib/auth-client';
import { setThemeCookie, signIn } from '@/lib/action';
import type { StateOmitName } from '@/lib/definitions';
import { 
    addToast,
    Button,
    Input
} from '@heroui/react';
import { Loader2, KeyRound } from "lucide-react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SocialLogin } from './social-login';

const provider = ['github', 'google', 'twitter'];

export default function SignInForm() {
    const router = useRouter();
    async function action(prevState: StateOmitName | undefined, formData: FormData) {
        const response = await signIn(formData);
        if (response?.messages?.success) {
            if (provider.includes(response?.messages?.success)) {
                addToast({
                    color: 'warning',
                    description: `入力されたメールアドレスはすでに登録されています。前回のログイン: ${response.messages.success}`
                });
            } else if (response.messages.success === 'signin') {
                await setThemeCookie();
                router.push('/home');
            } else {
                router.push('/two-factor');
            } 
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
                className='w-full' 
                aria-disabled={isPending}
            >
                    {isPending ?
                    <div className="flex items-center space-x-3">
                        <Loader2 className="animate-spin"/>
                        <p>送信中...</p>
                    </div> :
                    <p>
                        サインイン
                    </p>}
            </Button>
            <div className='grid grid-cols-3 items-center'>
                <div className='border-b-1 border-gray-500 max-w-[250px] w-auto'></div>
                <p className='text-center'>または</p>
                <div className='border-b-1 border-gray-500 max-w-[250px] w-auto'></div>
            </div>
            <div className='flex flex-col space-y-3'>
                <SocialLogin />
                <Button color='primary' variant='ghost' onPress={async () => {
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
                }}>
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
                    <p className='mb-2'>アカウントをお持ちでない方</p>
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