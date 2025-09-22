'use client';

import { useContext, useState, useActionState } from "react";
import {
    getLocalTimeZone, 
    now, 
    today,
    toCalendarDateTime,
} from "@internationalized/date";
import { createSchedule } from "@/utils/action";  
import { 
    Button, 
    Calendar, 
    cn, 
    DateRangePicker,  
    Input, 
    Modal, 
    ModalBody, 
    ModalContent, 
    ModalHeader,
    Textarea,
    type DateValue,
    type RangeValue
} from "@heroui/react";
import { Palette } from "lucide-react";
import { SidebarContext } from "@/contexts/sidebar-context";
import { useSessionUserData } from "@/contexts/user-data-context";

export function Sidebar({
    setCurrentDate,
    setSelectedDate
}: {
    setCurrentDate: (date: Date) => void;
    setSelectedDate: (date: Date) => void;
}) {
    // コンテキストから取得
    const isCollapsed = useContext(SidebarContext);
    const email = useSessionUserData().email;

    // reactフック
    const [open, setOpen] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>({
        start: toCalendarDateTime(now(getLocalTimeZone())),
        end: toCalendarDateTime(now(getLocalTimeZone()))
    });
    const [state, formAction, isPending] = useActionState(createSchedule, undefined);
    
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
                <Modal 
                    backdrop="transparent"
                    isOpen={open} 
                    onOpenChange={setOpen}
                    shouldBlockScroll={false}
                >
                    <ModalContent>
                        <ModalHeader>
                            予定の追加
                        </ModalHeader>
                        <ModalBody>
                            <form
                                action={formAction}
                                className="space-y-5 pb-3"
                            >
                                <Input 
                                    label="タイトルを追加"
                                    name="title"
                                    variant="bordered"
                                />
                                <DateRangePicker
                                    aria-label="Date range"
                                    aria-describedby="dateRange-error"
                                    label="期間を追加"
                                    showMonthAndYearPickers={true}
                                    variant="bordered"
                                    defaultValue={dateRange}
                                    onChange={(value) => {
                                        setDateRange(value);
                                    }}
                                />
                                <input
                                    name="dateRangeStart"
                                    type="hidden"
                                    value={dateRange ? 
                                        dateRange.start.toDate(getLocalTimeZone()).toISOString() : ''
                                    }
                                />
                                <input
                                    name="dateRangeEnd"
                                    type="hidden"
                                    value={dateRange ? 
                                        dateRange.end.toDate(getLocalTimeZone()).toISOString() : ''
                                    }
                                />
                                <input
                                    name="email"
                                    type="hidden"
                                    value={email}
                                />
                                <div id='dateRange-error' aria-live='polite' aria-atomic='true'>
                                    {state?.errors?.start && state.errors?.start?.map((error: string) => (
                                        <p className='text-base text-red-500' key={error}>{error}</p>
                                    ))}  
                                </div>
                                <Textarea 
                                    label="説明を追加"
                                    name="description"
                                    variant="bordered"
                                />
                                <Input
                                    label="カラーを追加"
                                    labelPlacement="outside-left"
                                    name="color"
                                    defaultValue="#000000"
                                    startContent={<Palette height={35} width={35} />}
                                    type="color"
                                    variant="bordered"
                                />
                                <div className='flex items-center justify-end space-x-5'>
                                    <Button
                                        color="primary"
                                        type="submit"
                                    >
                                        {isPending ? "保存中..." : "保存"}
                                    </Button>
                                    <Button 
                                        onPress={() => setOpen(prev => !prev)}
                                    >
                                        キャンセル
                                    </Button>
                                </div>
                            </form>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            </div>
        </div>
    );
}   