'use client';

import { useContext, useState } from "react";
import {
    getLocalTimeZone, 
    now, 
    today,
    toCalendarDateTime,
} from "@internationalized/date";
import { 
    Button, 
    Calendar, 
    cn, 
    type DateValue,
    type RangeValue
} from "@heroui/react";
import { SidebarContext } from "@/contexts/sidebar-context";
import dynamic from 'next/dynamic';

const CreateScheduleModal = dynamic(() => import('./create-schedule-modal'), { ssr: false });

export function Sidebar({
    setCurrentDate,
    setSelectedDate
}: {
    setCurrentDate: (date: Date) => void;
    setSelectedDate: (date: Date) => void;
}) {
    // コンテキストから取得
    const isCollapsed = useContext(SidebarContext);

    // reactフック
    const [open, setOpen] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>({
        start: toCalendarDateTime(now(getLocalTimeZone())),
        end: toCalendarDateTime(now(getLocalTimeZone()))
    });
    
    return (
        <div className={cn("pt-4 pr-4 z-20 transition-all duration-300",
            isCollapsed ? "-ml-68" : "max-sm:-ml-68 max-sm:translate-x-68"
        )}>
            <div className="flex flex-col sticky top-20 space-y-5">
                <Button
                    aria-label="Open modal"
                    color="primary"
                    onPress={() => setOpen(prev => !prev)}
                >
                    予定の作成
                </Button>
                <Calendar
                    aria-label="Date"
                    defaultValue={today(getLocalTimeZone())}
                    showMonthAndYearPickers
                    onChange={(value) => {
                        setCurrentDate(value.toDate(getLocalTimeZone()));
                        setSelectedDate(value.toDate(getLocalTimeZone()));
                    }}
                />
                <CreateScheduleModal
                    open={open}
                    setOpen={setOpen}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />
            </div>
        </div>
    );
}   