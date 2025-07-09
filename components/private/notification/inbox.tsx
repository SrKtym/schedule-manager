'use client'

import { Icon } from "@iconify/react";
import { Button, Input, Tooltip } from "@heroui/react";
import { EmailLogo } from "@/components/logo/email-logo";
import { useState, useEffect, useRef } from "react";
import { supabase } from '@/lib/supabase/client'
import { InboxSkelton } from "../../skeltons";
import type { Message } from "@/lib/definitions";
import { Sidebar } from "./sidebar";
import { EmailTable } from "./email-table";


export function EmailInbox({email}: {email: string}) {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const ref = useRef<Message>(null);


    const fetchMessages = async () => {
        const { data } = await supabase
            .from('messages')
            .select('*')
            .eq('receiver_email', email)
            .order('created_at', { ascending: false });

        if (data) {
            setMessages(data);
        }

        setIsLoading(false);
    }

    useEffect(() => {
        // 初期データ取得
        fetchMessages();

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
                    setMessages(prevMessages => [...prevMessages, newMessage]);
                }
            )
            .subscribe();


        return () => {
            supabase.removeChannel(channel)
        }
    }, [setMessages]);

    if (isLoading) {
        return <InboxSkelton />;
    }

    return (
        <div className="flex flex-col">

            {/* ナビバー */}
            <div className="flex items-center justify-between py-4 pr-4 border-b border-gray-200 sm:p-4">
                <div className="flex items-center gap-4">
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => setIsCollapsed(prev => !prev)}
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
                <Tooltip
                    key="settings"
                    color="foreground"
                    content="設定"    
                >
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
                </Tooltip>
            </div>
            <div className="flex">
                {/* サイドバー */}
                <Sidebar isCollapsed={isCollapsed} messages={messages}/>

                {/* メール一覧と詳細 */}
                <EmailTable messages={messages} ref={ref}/>
            </div>
        </div>
    );
};