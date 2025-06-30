'use client';

import { 
    addToast,
    Button,
    Input,
    Tab,
    Tabs
} from '@heroui/react';
import { authClient } from "@/lib/auth-client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setThemeCookie } from '@/lib/action';
import { Loader2 } from 'lucide-react';


export function OtpVerifyForm() {
    const router = useRouter();
    const [selected, setSelected] = useState<React.Key>('totp');

    return (
        <div className='flex flex-col items-center justify-center space-y-5 p-5 rounded-3xl bg-white'>
            <Tabs
                fullWidth
                aria-label='Tabs form'
                size='md'
                selectedKey={selected as string}
                onSelectionChange={setSelected}
            >
                <Tab key='totp' title='TOTP'>
                    <div className='space-y-3'>
                        <p>TOTPアプリケーション上で表示されているコードをフォームに入力してください。</p>
                        <form className='space-y-5' onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const {data, error} = await authClient.twoFactor.verifyTotp({
                                code: formData.get('totp') as string
                            });
                            if (data?.token) {
                                await setThemeCookie();
                                router.push('/home');
                            } else {
                                addToast({
                                    title: 'サインインに失敗しました。',
                                    color: 'danger',
                                    description: `お手数ですが再試行してください。詳細: ${error?.message}`
                                });
                            }
                        }}>
                            <Input
                                id='totp'
                                name='totp'
                                type='text'
                                label='TOTPコード'
                                inputMode='numeric'
                                variant='bordered'
                                isRequired
                                />
                            <Button 
                                className='w-full' 
                                color='primary' 
                                type='submit'
                                spinner={<Loader2 className="animate-spin"/>}
                            >
                                確認
                            </Button>
                        </form>
                    </div>
                </Tab>
                <Tab key='otp' title='OTP'>
                    <div className='space-y-3'>
                        <p>メールを送信し、表示されているOTPコードをフォームに入力してください。</p>
                        <form className='space-y-5' onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const {data, error} = await authClient.twoFactor.verifyOtp({
                                code: formData.get('otp') as string
                            });
                            if (data?.token) {
                                router.push('/home');
                            } else {
                                addToast({
                                    title: 'サインインに失敗しました。',
                                    color: 'danger',
                                    description: `お手数ですが再試行してください。詳細: ${error?.message}`
                                });
                            }
                        }}>
                            <Input
                                id='otp'
                                name='otp'
                                type='text'
                                label='OTPコード'
                                inputMode='numeric'
                                variant='bordered'
                                isRequired
                            />
                            <div className='flex items-center justify-between space-x-5'>
                                <Button className='max-w-[180px] w-full' color='primary' type='submit'>
                                    確認
                                </Button>
                                <Button className='max-w-[180px] w-full' onPress={async () => {
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
                                }}>
                                    メールの送信
                                </Button> 
                            </div>
                        </form>
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
}