'use client';

import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/button";
import { Input } from '@heroui/input';
import { addToast } from '@heroui/toast';
import {  
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from '@heroui/modal';
import QRCode from 'react-qr-code';
import { useState, useActionState } from "react";
import { useRouter } from 'next/navigation';
import { ConfirmPassword } from "@/lib/action";
import Link from 'next/link';
import { Loader2 } from "lucide-react";


export function TwofactorValid({password}: {password?: string}) {
    const [open, setOpen] = useState<boolean>(false);
    const [isRequired, setIsRequired] = useState<boolean>(false);
    const [totpUri, setTotpUri] = useState<string>("");
    const [selected, setSelected] = useState<string>();
    const router = useRouter();

    function getTotpUri(totp: string) {
        setTotpUri(totp);
        return totpUri;
    }

    async function action(prevState: string[] | undefined, formData: FormData) {
        const response = await ConfirmPassword(formData);
        if (response.success) {
            if (selected === 'totp') {
                const {data} = await authClient.twoFactor.getTotpUri({
                    password: response.success
                });
                if (data) {
                    getTotpUri(data.totpURI);
                    setIsRequired(false);
                    setOpen(true);
                } else {
                    addToast({
                        title: 'パスワードが誤っています。',
                        color: 'danger',
                        description: 'お手数ですが再試行してください。'
                    });
                }
            } else if (selected === 'disable') {
                await authClient.twoFactor.disable({
                    password: response.success 
                }, {
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
            return response.error
        }
    }

    const [errorMessage, formAction, isPending] = useActionState(action, undefined);

    return (
        <div className='flex flex-col space-y-4'>
            <Button color='primary' value='totp' onPress={async (e) => {
                if (password) {
                    const {data} = await authClient.twoFactor.getTotpUri({
                        password: password
                    });
                    if (data) {
                        getTotpUri(data.totpURI);
                        setOpen(true);
                    }
                } else {
                    setSelected(e.target.getAttribute('value') as string);
                    setIsRequired(true);
                }
            }}>
                TOTPを使用する
            </Button>
            <Modal isOpen={open} onOpenChange={setOpen}>
                <ModalContent>
                    <ModalHeader className="justify-center">
                        TOTPアプリへの登録
                    </ModalHeader>
                    <ModalBody className='flex flex-col items-center justify-center space-y-5'>
                        <p>以下のQRコードをTOTPアプリで読み取り、表示されたセキュリティコードを入力してください。</p>
                        <QRCode value={totpUri}/>
                        <form className='space-y-5' onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const {data, error} = await authClient.twoFactor.verifyTotp({
                                code: formData.get('totp') as string
                            });
                            if (data?.token) {
                                setOpen(false);
                                router.push('/passkey');
                            } else {
                                addToast({
                                    title: 'TOTPアプリへの登録に失敗しました。',
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
                            <div className='flex items-center justify-between space-x-5'>
                                <Button className='max-w-[180px] w-full' color='primary' type='submit'>
                                    {isPending ?
                                    <div className="flex items-center space-x-3">
                                        <Loader2 className="animate-spin"/>
                                        <p>処理中...</p>
                                    </div> :
                                    <p>
                                        登録
                                    </p>
                                    }
                                </Button>
                                <Button className='max-w-[180px] w-full' onPress={() => {
                                    setOpen(false);
                                }}>
                                    キャンセル
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Button color='danger' value='disable' onPress={async (e) => {
                if (password) {
                    await authClient.twoFactor.disable({
                        password: password 
                    }, {
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
                } else {
                    setSelected(e.target.getAttribute('value') as string);
                    setIsRequired(true);
                }
            }}>
                2要素認証を無効にする
            </Button>
            <Modal isOpen={isRequired} onOpenChange={setIsRequired}>
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
                                    type="submit"
                                    color="primary">
                                    {isPending ?
                                    <div className="flex items-center space-x-3">
                                        <Loader2 className="animate-spin"/>
                                        <p>処理中...</p>
                                    </div> :
                                    <p>
                                        続行
                                    </p>}
                                </Button>
                                <Button className='max-w-[180px] w-full' onPress={() => {
                                    setIsRequired(false);
                                }}>
                                    キャンセル
                                </Button>
                            </div>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Link href='/passkey'>
                <Button className="w-full">
                    パスキーの設定へ
                </Button>
            </Link>
        </div>
    );
}