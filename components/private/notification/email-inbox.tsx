'use client'

import { Icon } from "@iconify/react";
import { 
    Avatar,
    Button,
    Checkbox,
    Chip,
    Input,
    Spinner,
    Table, 
    TableHeader, 
    TableColumn, 
    TableBody, 
    TableRow, 
    TableCell,
    Tooltip,
    cn
} from "@heroui/react";
import { EmailLogo } from "@/components/logo/email-logo";
import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase/client'


type Message = {
  id: string,
  sender_email: string,
  receiver_email: string,
  subject: string,
  body: string,
  is_read: boolean,
  created_at: string
}

const sidebarItems = [
    { icon: "lucide:inbox", label: "受信トレイ" },
    { icon: "lucide:star", label: "スター付き" },
    { icon: "lucide:clock", label: "スヌーズ中"},
    { icon: "lucide:send", label: "送信済み" },
    { icon: "lucide:file", label: "下書き" },
    { icon: "lucide:trash", label: "ごみ箱" },
];

export function EmailInbox({email}: {email: string}) {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLooding, setIsLooding] = useState<boolean>(true);
    const fetchMessages = async () => {
        const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('receiver_email', email)
        .order('created_at', { ascending: false });

        if (data) {
            setMessages(data);
        }

        setIsLooding(false);
    }

    useEffect(() => {
        const channel = supabase
            .channel('inbox')
            .on(
                'postgres_changes',
                {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `receiver_email=eq.${email}`,
                },
                (payload) => {
                    const newMessage = payload.new as Message;
                    setMessages([...messages, newMessage]);
                }
            )
            .subscribe();

        fetchMessages();

        return () => {
            supabase.removeChannel(channel)
        }
    }, [supabase]);

    if (isLooding) {
        return (
            <div className="flex items-center justify-center">
                <Spinner
                    classNames={{label: "text-foreground mt-4"}}
                    label="読み込み中…"
                    variant="wave"
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col">

            {/* ナビバー */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => setIsCollapsed((prev) => !prev)}
                        aria-label="Open sidebar"
                    >
                        <Icon 
                            icon="lucide:menu" 
                            width={24} 
                            height={24} 
                        />
                    </Button>
                    <EmailLogo 
                        width={40} 
                        height={40}
                    />
                </div>
                <div className="flex-1 max-w-xl mx-4">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="メールを検索"
                            variant="bordered"
                            startContent={
                                <Icon 
                                    icon="lucide:search"
                                    width={18}
                                    height={18} 
                                    className="text-default-400" 
                                />
                            }
                        />
                    </div>
                </div>
                <Button 
                    isIconOnly 
                    variant="light"
                    aria-label="User settings"
                >
                    <Icon 
                        icon="lucide:settings" 
                        width={24} 
                        height={24} 
                    />
                </Button>
            </div>
            <div className="flex">

                {/* サイドバー */}
                <div className={cn(
                    "flex flex-col items-center p-4 border-r border-divider transition-all duration-300",
                        isCollapsed ? "w-15" : "w-80"
                    )}>
                    <Button
                        isIconOnly={isCollapsed}
                        className={cn("mb-2",
                            isCollapsed ? "" : "w-full justify-start"
                        )}
                        color="primary" 
                        startContent={
                            <Icon 
                                width={18}
                                height={18}
                                icon="lucide:plus" />}
                    >
                        {!isCollapsed && "作成"}
                    </Button>
                    {sidebarItems.map((item) => (
                        <Tooltip 
                            key={item.label}
                            color="foreground"
                            content={item.label}
                            placement="right"
                            className={cn(isCollapsed ? "" : "hidden")}
                        >
                            <Button
                                isIconOnly={isCollapsed}
                                key={item.label}
                                variant="light"
                                className={cn("mb-2",
                                    isCollapsed ? "" : "w-full justify-start"
                                )}
                            >
                                <Icon 
                                    width={18}
                                    height={18}
                                    icon={item.icon}
                                    className={cn(isCollapsed ? "mr-0.5" : "mr-2")}
                                />
                                {!isCollapsed && item.label}
                                {item.label === "受信トレイ" 
                                && messages.some((message) => !message.is_read)
                                ? <Chip 
                                    size="sm"
                                    color="primary"
                                >
                                    {messages.filter((message) => !message.is_read).length}
                                </Chip>
                                : null}
                            </Button>
                        </Tooltip>
                    ))}
                </div>

                {/* メール一覧 */}
                <div className="w-full h-full grid grid-col overflow-auto">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <Checkbox />
                            <Icon 
                                icon="lucide:refresh-ccw" 
                                className="text-default-500" 
                            />
                            <Icon 
                                icon="lucide:more-vertical" 
                                className="text-default-500" 
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Icon 
                                icon="lucide:chevron-left" 
                                className="text-default-500" 
                            />
                            <Icon 
                                icon="lucide:chevron-right" 
                                className="text-default-500" 
                            />
                        </div>
                    </div>
                    <Table
                        removeWrapper 
                        aria-label="Email inbox"
                        classNames={{
                            th: "bg-transparent",
                            td: "py-3",
                        }}
                    >
                        <TableHeader>
                            <TableColumn>
                                From
                            </TableColumn>
                            <TableColumn>
                                件名
                            </TableColumn>
                            <TableColumn>
                                日時
                            </TableColumn>
                        </TableHeader>
                        <TableBody>
                            {messages.map((message) => (
                                <TableRow 
                                    key={message.id} 
                                    className={message.is_read ? "bg-content1" : "bg-content2"}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Checkbox />
                                            <Icon 
                                                icon="lucide:star"
                                                width={18}
                                                height={18}
                                                className={message.is_read ? "text-warning" : "text-default-400"}
                                            />
                                            <Avatar 
                                                name={message.sender_email} 
                                                size="sm" 
                                            />
                                            <span>
                                                {message.sender_email}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span>
                                                {message.subject}
                                            </span>
                                            <span className="text-default-400">
                                                - {message.body}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-start gap-2">
                                            <Chip 
                                                size="sm" 
                                                variant="flat" 
                                                color={message.is_read ? "default" : "primary"}
                                            >
                                                {message.created_at}
                                            </Chip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};