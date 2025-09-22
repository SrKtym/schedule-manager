'use client'

import { Button, Input, Tooltip } from "@heroui/react";
import { Menu, Search, Settings } from "lucide-react";
import { EmailLogo } from "@/public/logo/email-logo";
import { useState } from "react";
import { Sidebar } from "./sidebar";
import { EmailTable } from "./email-table";


export function Inbox() {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

    return (
        <div className="flex flex-col">

            {/* ナビバー */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => setIsCollapsed(prev => !prev)}
                        aria-label="Open sidebar"
                    >
                        <Menu 
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
                                <Search 
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
                        <Settings 
                            width={24} 
                            height={24}
                        />
                    </Button>
                </Tooltip>
            </div>
            <div className="flex border-b border-gray-200">
                {/* サイドバー */}
                <Sidebar isCollapsed={isCollapsed} />

                {/* メール一覧と詳細 */}
                <EmailTable isCollapsed={isCollapsed} />
            </div>
        </div>
    );
};