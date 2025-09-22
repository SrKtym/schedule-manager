'use client';

import { authClient } from "@/lib/better-auth/auth-client";
import { ThemeButton } from "./theme-button";
import { 
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Listbox,
    ListboxItem,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    Navbar,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle,
    NavbarMenu,
    NavbarMenuItem,
    User,
    ModalFooter,
    addToast
} from "@heroui/react";
import { menuItems } from "@/constants/definitions";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSessionUserData } from "@/contexts/user-data-context";


export function CustomNavbar({
    name,
    image
}: {
    name: string,
    image?: string | null
}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const [logOutConfirm, setLogOutConfirm] = useState<boolean>(false);
    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
    const [isPendingLogOut, startTransitionLogOut] = useTransition();
    const [isPendingDelete, startTransitionDelete] = useTransition();
    const email = useSessionUserData().email;
    const router = useRouter();


    return (
        <Navbar 
            isBordered
            isBlurred={false}
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}    
        >
            <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="sm:hidden"
            />
            <NavbarContent 
                className="max-sm:hidden"
                justify="start"
            >
                {menuItems.map((item) => (
                    <NavbarItem key={item.key}>
                        <Link href={`/home/${item.key}`}>
                            {item.label}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarContent 
                className="items-center" 
                justify="end"
            >
                <ThemeButton />
                <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                        <User 
                            as='button'
                            aria-label="user button"
                            avatarProps={{
                                color: 'primary',
                                isBordered: true,
                                src: image ?? undefined
                            }}
                            className="cursor-pointer transition-transform"
                            name={name}
                            description={
                                <p className="text-foreground-500">
                                    {email}
                                </p>
                            }
                        />
                    </DropdownTrigger>
                    <DropdownMenu 
                        aria-label="profile-actions" 
                        variant="flat" 
                        onAction={(key) => {
                            switch (key) {
                                case 'settings':
                                    setOpen(true);
                                    break;
                                case 'logOut':
                                    setLogOutConfirm(true);
                                    break;
                            }
                        }}
                    >
                        <DropdownItem key='settings'>
                            設定
                        </DropdownItem> 
                        <DropdownItem key='logOut' color="danger">
                            ログアウト
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item) => (
                    <NavbarMenuItem key={item.key}>
                        <Link href={`/home/${item.key}`}>
                            {item.label}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>

            {/* ログアウトモーダル */}
            <Modal 
                isOpen={logOutConfirm} 
                onOpenChange={setLogOutConfirm}
            >
                <ModalContent>
                    <ModalHeader className="justify-center">
                        本当にログアウトしますか？
                    </ModalHeader>
                    <ModalBody>
                        <div className='flex items-center justify-between space-x-5'>
                            <Button 
                                color='danger'
                                className='max-w-[180px] w-full'
                                aria-disabled={isPendingLogOut}
                                isLoading={isPendingLogOut}
                                onPress={() => {
                                    startTransitionLogOut(async () => {
                                        const { error } = await authClient.signOut({
                                            fetchOptions: {
                                                onSuccess() {
                                                    router.push('/');
                                                }
                                            }
                                        });
                                        if (error) {
                                            addToast({
                                                title: 'ログアウトに失敗しました。',
                                                color: 'danger',
                                                description: `お手数ですが再試行してください。詳細: ${error.message}`
                                            });
                                            return;
                                        }
                                        router.refresh();
                                    });
                                }}
                            >
                            {isPendingLogOut ? '処理中...' : 'はい'}
                        </Button>
                        <Button 
                            className='max-w-[180px] w-full'
                            onPress={() => {
                                setLogOutConfirm(false);
                            }}
                        >
                            いいえ
                        </Button>
                    </div>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* 設定モーダル */}
            <Modal 
                isOpen={open} 
                onOpenChange={setOpen}
            >
                <ModalContent>
                    <ModalHeader className="justify-center">
                        アカウントの設定
                    </ModalHeader>
                    <ModalBody>
                        <Listbox aria-label="listbox">
                            <ListboxItem 
                                key="reset-password" 
                                description="パスワードを変更します。"
                                href="/reset/send-email"
                            >
                                パスワードの変更
                            </ListboxItem>
                            <ListboxItem 
                                key="2fa-settings" 
                                description={
                                    <p className="text-justify">
                                        2要素認証を有効または無効にします。
                                        有効の場合、TOTPアプリにアカウントを登録できます。
                                    </p>
                                }
                                href="/two-factor"    
                            >
                                2要素認証の設定
                            </ListboxItem>
                            <ListboxItem
                                key="passkey-settings"
                                description={
                                    <p className="text-justify">
                                        パスキーの登録をします。
                                        登録済みのパスキーはサインイン時に使用できます。
                                    </p>
                                }
                                href="/passkey"
                            >
                                パスキーの設定
                            </ListboxItem>
                            <ListboxItem
                                key="delete-accounts"
                                description="アカウントを削除します。"
                                className="text-danger"
                                color="danger"
                                onPress={() => {
                                    setOpen(false);
                                    setDeleteConfirm(true);
                                }}
                                >
                                アカウントの削除
                            </ListboxItem>
                        </Listbox>
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* アカウント削除モーダル */}
            <Modal 
                isOpen={deleteConfirm} 
                onOpenChange={setDeleteConfirm}
            >
                <ModalContent>
                    <ModalHeader className="justify-center">
                        本当にアカウントを削除しますか？
                    </ModalHeader>
                    <ModalBody>
                        <p className="text-justify">
                            一度削除すると、アカウントを復元することはできません。
                            続行した場合、本人確認のため確認メールが送信されます。
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button 
                            color="danger"
                            aria-disabled={isPendingDelete}
                            isLoading={isPendingDelete}
                            onPress={() => {
                                startTransitionDelete(async () => {
                                    await authClient.deleteUser({
                                       callbackURL: '/'
                                    });
                                });
                            }}
                        >
                            {isPendingDelete ? '処理中...' : '削除する'}
                        </Button>
                        <Button 
                            onPress={() => {
                                setDeleteConfirm(false);
                            }}
                        >
                            キャンセル
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Navbar>
    );
}