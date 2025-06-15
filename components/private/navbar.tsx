'use client';

import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/button";
import { ThemeButton } from "./theme-button";
import { 
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader } from "@heroui/modal";
import { 
    Navbar,
    NavbarContent,
    NavbarItem
} from "@heroui/navbar";
import { 
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger
} from "@heroui/dropdown";
import { User } from "@heroui/user";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";


export function CustomNavbar({
    theme,
    name,
    image,
    email
}: {
    theme: string,
    name: string,
    image?: string | null,
    email: string
}) {
    const [open, setOpen] = useState<boolean>(false);
    const [logOutConfirm, setLogOutConfirm] = useState<boolean>(false);
    const router = useRouter();


    return (
        <Navbar isBordered>
            <NavbarContent justify="start">
                <NavbarItem>
                    <Link href='/home'>ホーム</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href='/home/register'>履修登録</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href='/home/schedule'>時間割</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href='/home/notification'>通知</Link>
                </NavbarItem>
                <NavbarItem>
                    <Link href='/home/settings'>設定</Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent className='items-center' justify="end">
                <ThemeButton theme={theme}/>
                <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                        <User 
                            as='button'
                            avatarProps={{
                                color: 'primary',
                                isBordered: true,
                                src: image ?? undefined
                            }}
                            className="cursor-pointer transition-transform"
                            name={name}
                            description={email}
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="profile-actions" variant="flat" onAction={(key) => {
                        switch (key) {
                            case 'settings':
                                setOpen(true);
                                break;
                            case 'logOut':
                                setLogOutConfirm(true);
                                break;
                        }
                    }}>
                        <DropdownItem key='settings'>
                            設定
                        </DropdownItem> 
                        <DropdownItem key='logOut' color="danger">
                            ログアウト
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
            <Modal isOpen={logOutConfirm} onOpenChange={setLogOutConfirm}>
                <ModalContent>
                    <ModalHeader className="justify-center">
                        本当にログアウトしますか？
                    </ModalHeader>
                    <ModalBody>
                        <div className='flex items-center justify-between space-x-5'>
                            <Button 
                                className='max-w-[180px] w-full' 
                                color='danger' 
                                onPress={async () => {
                                    await authClient.signOut({
                                        fetchOptions: {
                                            onSuccess() {
                                                router.push('/');
                                            }
                                        }
                                    });
                                }}
                            >
                                はい
                            </Button>
                            <Button className='max-w-[180px] w-full' onPress={() => {
                                setLogOutConfirm(false);
                            }}>
                                いいえ
                            </Button>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <Modal isOpen={open} onOpenChange={setOpen}>
                <ModalContent>
                    <ModalHeader className="justify-center">
                        アカウントの設定
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col items-center space-y-3">
                            <p>パスワードの変更</p>
                            <p>2要素認証の設定</p>
                            <p>パスキーの設定</p>
                            <p className="text-red-500">アカウントの削除</p>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Navbar>
    );
}