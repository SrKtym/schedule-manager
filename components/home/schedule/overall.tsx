'use client';

import { Button } from "@heroui/react";
import { Menu } from "lucide-react";
import { useState } from "react";
import { WeeklySchedule } from "./weekly-schedule";
import { SidebarContext } from "@/contexts/sidebar-context";

export function Overall() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex flex-col p-3">

            {/* ナビバー */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
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
                    <h1>スケジュール</h1>
                </div>
            </div>
            {/* ウィークリーカレンダー */}
            <SidebarContext value={isCollapsed}>
                <WeeklySchedule />
            </SidebarContext>
        </div>
    );
}