'use client';

import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from '@heroui/react';
import QRCode from 'react-qr-code';
import { useState, useActionState } from "react";
import Link from 'next/link';
import { getTotpUri, verifyTotp } from "@/utils/actions/auth";


export function TwoFactorValid() {
    const [isRequired, setIsRequired] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    async function clientAction(
        prevState: {errors?: string[], success?: string} | undefined, 
        formData: FormData
    ) {
        const state = await getTotpUri(formData);
        if (state?.success) {
            setIsRequired(false);
            setOpen(true);
            return {
                success: state.success
            }
        }
        return state;
    }
    const [selected, setSelected] = useState<"totp" | "disable">();
    const [state, formAction, isPending] = useActionState(clientAction, undefined);
    const [actionState, verifyAction, isVerifying] = useActionState(verifyTotp, undefined);

    return (
        // 2要素認証が有効の場合

        <div className='flex flex-col space-y-4'>
            <Button 
                color='primary' 
                value='totp' 
                onPress={(e) => {
                    setSelected(e.target.getAttribute('value') as 'totp');
                    setIsRequired(true);
                }}>
                TOTPを使用する
            </Button>
            <Modal 
                isOpen={open} 
                onOpenChange={setOpen}
            >
                <ModalContent>
                    <ModalHeader className="justify-center">
                        TOTPアプリへの登録
                    </ModalHeader>
                    <ModalBody className='flex flex-col items-center justify-center space-y-5'>
                        <p>
                            以下のQRコードをTOTPアプリで読み取り、表示されたセキュリティコードを入力してください。
                        </p>
                        {state?.success && <QRCode value={state?.success}/>}
                        <form 
                            action={verifyAction}
                            className='space-y-5'
                            aria-describedby='verify-totp-error'
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
                                {actionState?.errors && actionState.errors.map((error: string) => (
                                    <p className='text-base text-red-500' key={error}>
                                        {error}
                                    </p>
                                ))}
                            </div>
                            <div id='verify-totp-error' aria-live='polite' aria-atomic='true'>
                                <p className='text-base text-red-500' key={actionState?.messages?.errors}>
                                    {actionState?.messages?.errors && actionState.messages.errors}
                                </p>
                            </div>
                            <div className='flex items-center justify-between space-x-5'>
                                <Button 
                                    className='max-w-[180px] w-full' 
                                    color='primary' 
                                    type='submit'
                                    isLoading={isVerifying}
                                >
                                    {isVerifying ? '処理中...' : '登録'}
                                </Button>
                                <Button 
                                    className='max-w-[180px] w-full' 
                                    onPress={() => {
                                        setOpen(false);
                                    }}
                                >
                                    キャンセル
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Button 
                color='danger' 
                value='disable' 
                onPress={(e) => {
                    setSelected(e.target.getAttribute('value') as "disable");
                    setIsRequired(true);
                }}
            >
                2要素認証を無効にする
            </Button>
            <Modal 
                isOpen={isRequired} 
                onOpenChange={setIsRequired}
            >
                <ModalContent>
                    <ModalHeader>
                        確認のためパスワードを入力してください。
                    </ModalHeader>
                    <ModalBody>
                        <form 
                            action={formAction} 
                            className='space-y-5'
                            aria-describedby='get-totp-error'
                        >
                            <Input 
                                id='password'
                                name='password'
                                type='password'
                                label='パスワード'
                                placeholder='例: 12345678'
                                variant='bordered'
                                minLength={8}
                                aria-describedby='password-error'
                                isRequired
                            />
                            <input 
                                type="hidden" 
                                name="selected" 
                                value={selected}
                            />
                            <div id='password-error' aria-live='polite' aria-atomic='true'>
                               {state?.errors && state.errors.map((error: string) => (
                                    <p className='text-base text-red-500' key={error}>
                                        {error}
                                    </p>
                                ))}
                            </div>
                            <div id='get-totp-error' aria-live='polite' aria-atomic='true'>
                                <p className='text-base text-red-500' key={state?.messages?.errors}>
                                    {state?.messages?.errors && state.messages.errors}
                                </p>
                            </div>
                            <div className='flex items-center justify-center space-x-5'>
                                <Button 
                                    className='max-w-[180px] w-full' 
                                    type="submit"
                                    color="primary"
                                    isLoading={isPending}
                                >
                                    {isPending ? '処理中...' : '続行'}
                                </Button>
                                <Button 
                                    className='max-w-[180px] w-full' 
                                    onPress={() => {
                                        setIsRequired(false);
                                    }}
                                >
                                    キャンセル
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Button 
                as={Link}
                href='/passkey'
                className="w-full"
                color="secondary"
            >
                パスキーの設定へ
            </Button>
            <Button 
                as={Link}
                href='/home'
                className="w-full"
            >
                ホームページへ
            </Button>
        </div>
    );
}