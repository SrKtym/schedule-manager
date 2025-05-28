'use client';

import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/react";
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
    theme: 'light' | 'dark',
    name: string,
    image?: string | null,
    email: string
}) {
    const [open, setOpen] = useState<boolean>(false);
    const [confirm, setConfirm] = useState<boolean>(false);
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
            <NavbarContent as='div' className='items-center' justify="end">
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
                            className="transition-transform"
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
                                setConfirm(true);
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
            <Modal isOpen={confirm} onOpenChange={setConfirm}>
                <ModalContent>
                    <ModalHeader className="justify-center">
                        本当にログアウトしますか？
                    </ModalHeader>
                    <ModalBody>
                        <div className='flex items-center justify-between space-x-5'>
                            <Button className='max-w-[180px] w-full' color='danger' onPress={async () => {
                                await authClient.signOut({
                                    fetchOptions: {
                                        onSuccess() {
                                            router.push('/');
                                        }
                                    }
                                });
                            }}>
                                はい
                            </Button>
                            <Button className='max-w-[180px] w-full' onPress={() => {
                                setConfirm(false);
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
                        <p>パスワードの変更</p>
                        <p>2要素認証の設定</p>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Navbar>
    );
}