'use client';

import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    RadioGroup
} from '@heroui/react';
import { CustomRadio } from './custom-radio';
import { useState, useActionState } from 'react';
import { TwoFactorValid } from '@/components/auth/two-factor/two-factor-valid';
import { enableTwoFactor } from '@/utils/action';


export function TwoFactorSettings({twoFactorEnabled}: {twoFactorEnabled: boolean | null | undefined}) {
    const [selected, setSelected] = useState<string>();
    const [open, setOpen] = useState<boolean>(false);
    const [state, formAction, isPending] = useActionState(enableTwoFactor, undefined);

    return twoFactorEnabled ? 
        // 2要素認証が有効の場合

        <TwoFactorValid /> 
        : (
            
        // 2要素認証が無効の場合
        <div className='space-y-5'>
            <RadioGroup 
                label='追加の認証方法' 
                value={selected} 
                onValueChange={setSelected}
            >
                <CustomRadio 
                    description={
                        <div className='text-justify justify-center space-y-3'>
                            <p>
                                TOTP: 一定時間ごとに更新されるコードを生成し、ログイン時にそのコードを入力することで認証を行います。
                                TOTPアプリが必要です。
                            </p>
                            <p>
                                OTP: メールアドレスにコードを送信し、ログイン時にそのコードを入力することで認証を行います。
                            </p>
                        </div>
                    } 
                    value='valid'
                >
                    TOTPまたはOTPによる認証を有効にする
                </CustomRadio>
                <CustomRadio 
                    description='メールアドレスとパスワードのみでサインインします。'    
                    value='invalid'
                >
                    2要素認証を無効にする
                </CustomRadio>
            </RadioGroup>
            <Button
                className='w-full'
                color='primary'
                isDisabled={!selected}
                onPress={() => {setOpen(true)}}
                >
                続行
            </Button>
            <Modal 
                isOpen={open} 
                onOpenChange={setOpen}
            >
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
                            <input 
                                type="hidden" 
                                name="selected" 
                                value={selected} 
                            />
                            <div id='password-error' aria-live='polite' aria-atomic='true'>
                               {state?.errors?.map((error: string) => (
                                    <p className='text-base text-red-500' key={error}>
                                        {error}
                                    </p>
                                ))}
                            </div>
                            <div id='form-error' aria-live='polite' aria-atomic='true'>
                                <p className='text-base text-red-500' key={state?.message?.error}>
                                    {state?.message?.error && state.message.error}
                                </p>
                            </div>
                            <div className='flex items-center justify-between space-x-5'>
                                <Button
                                    className='max-w-[180px] w-full'
                                    type='submit'
                                    color='primary' 
                                    value={selected} 
                                    aria-disabled={isPending}
                                    isLoading={isPending}
                                >
                                    {isPending ? '送信中...' : '続行'}
                                </Button>
                                <Button 
                                    className='max-w-[180px] w-full' 
                                    onPress={() => setOpen(false)}
                                >
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