'use client';

import { authClient } from "@/lib/auth-client";
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
    User
} from "@heroui/react";
import { Loader2 } from "lucide-react";
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
    const menuItems = [
        { key: "", label: "ホーム" },
        { key: "register", label: "履修登録" },
        { key: "schedule", label: "時間割" },
        { key: "notification", label: "通知" },
        { key: "settings", label: "設定"}
    ];
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const [logOutConfirm, setLogOutConfirm] = useState<boolean>(false);
    const router = useRouter();


    return (
        <Navbar 
            isBordered
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
                <ThemeButton theme={theme} email={email} />
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
                            description={email}
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
                                spinner={<Loader2 className="animate-spin"/>}
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
            <Modal isOpen={open} onOpenChange={setOpen}>
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

                                }}
                                >
                                アカウントの削除
                            </ListboxItem>
                        </Listbox>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Navbar>
    );
}