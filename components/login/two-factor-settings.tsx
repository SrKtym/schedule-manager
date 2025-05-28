'use client';

import { authClient } from '@/lib/auth-client';
import { addToast } from '@heroui/toast';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import {  
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from '@heroui/modal';
import { RadioGroup } from '@heroui/radio';
import { CustomRadio } from '../custom-radio';
import { useState, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { TwofactorValid } from './two-factor-valid';
import { ConfirmPassword } from '@/lib/action';
import { Loader2 } from 'lucide-react';


export function TwoFactorSettings({twoFactorIsEnabled}: {twoFactorIsEnabled?: boolean | null}) {
    const [selected, setSelected] = useState<string>();
    const [open, setOpen] = useState<boolean>(false);
    const [password, setPassword] = useState<string>();
    const router = useRouter();

    async function action(prevState: string[] | undefined, formData: FormData) {
        const response = await ConfirmPassword(formData);
        if (response.success) {
            if (selected === 'valid') {
                await authClient.twoFactor.enable({
                    password: response.success
                }, {
                    onSuccess() {
                        setPassword(response.success);
                        setOpen(false);
                        router.refresh();
                    },
                    onError(context) {
                        addToast({
                            title: '2要素認証を有効にできませんでした。',
                            color: 'danger',
                            description: `お手数ですが再試行してください。詳細: ${context.error.message}`
                        });
                    },
                });
            } else {
                await authClient.twoFactor.disable({
                    password: response.success
                },{
                    onSuccess() {
                        router.push('/passkey');
                    },
                    onError(context) {
                        addToast({
                            title: '2要素認証を無効にできませんでした。',
                            color: 'danger',
                            description: `お手数ですが再試行してください。詳細: ${context.error.message}`
                        });
                    },
                });
            }
        } else {
            return response.error;
        }
    }

    const [errorMessage, formAction, isPending] = useActionState(action, undefined);

    return twoFactorIsEnabled ? <TwofactorValid password={password} /> 
        : (
        <div className='space-y-5'>
            <RadioGroup label='追加の認証方法' value={selected} onValueChange={setSelected}>
                <CustomRadio 
                    description={
                    <div className='justify-center space-y-3'>
                        <p className='text-justify'>
                            TOTP: 一定時間ごとに更新されるコードを生成し、ログイン時にそのコードを入力することで認証を行います。
                            TOTPアプリが必要です。
                        </p>
                        <p className='text-justify'>
                            OTP: メールアドレスにコードを送信し、ログイン時にそのコードを入力することで認証を行います。
                        </p>
                    </div>
                    } 
                    value='valid'>
                        TOTPまたはOTPによる認証を有効にする
                </CustomRadio>
                <CustomRadio 
                    description='メールアドレスとパスワードのみでサインインします。'    
                    value='invalid'>
                        2要素認証を無効にする
                </CustomRadio>
            </RadioGroup>
            <Button
                className='w-full'
                color='primary'
                isDisabled={!selected}
                onPress={() => setOpen(true)}
                >
                続行
            </Button>
            <Modal isOpen={open} onOpenChange={setOpen}>
                <ModalContent>
                    <ModalHeader>
                        確認のためパスワードを入力してください。
                    </ModalHeader>
                    <ModalBody>
                        <form 
                            action={formAction} 
                            className='space-y-5' 
                            aria-describedby='form-error'
                           >
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
                            <div id='form-error' aria-live='polite' aria-atomic='true'>
                               {errorMessage && errorMessage.map((error: string) => (
                                    <p className='text-base text-red-500' key={error}>
                                        {error}
                                    </p>
                                ))}
                            </div>
                            <div className='flex items-center justify-between space-x-5'>
                                <Button
                                    className='max-w-[180px] w-full'
                                    type='submit'
                                    color='primary' 
                                    value={selected} 
                                    aria-disabled={isPending}
                                >
                                    {isPending ?
                                    <div className="flex items-center space-x-3">
                                        <Loader2 className="animate-spin"/>
                                        <p>送信中...</p>
                                    </div> :
                                    <p>
                                        続行
                                    </p>
                                    }
                                </Button>
                                <Button className='max-w-[180px] w-full' onPress={() => setOpen(false)}>
                                    キャンセル
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
        ); 
}