'use client';

import { 
    Input, 
    Modal, 
    ModalBody, 
    ModalContent, 
    ModalHeader 
} from "@heroui/react";
import { useActionState } from "react";
import { createSchedule } from "@/utils/actions/main";
import { getLocalTimeZone } from "@internationalized/date";
import { 
    Button, 
    DateRangePicker, 
    Textarea,
    type RangeValue,
    type DateValue
 } from "@heroui/react";
import { Palette } from "lucide-react";
import { ScheduleState } from "@/types/main/schedule";

export default function CreateScheduleModal({
    open,
    setOpen,
    dateRange,
    setDateRange
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    dateRange: RangeValue<DateValue> | null;
    setDateRange: (dateRange: RangeValue<DateValue> | null) => void;
}) {
    async function clientAction(prevState: ScheduleState | undefined, formData: FormData) {
        const res = await createSchedule(formData);
        if (res?.success) {
            setOpen(false);
        } else {
            return res
        }
    }
    const [state, formAction, isPending] = useActionState(clientAction, undefined);

    return (
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
                        <div id='dateRange-error' aria-live='polite' aria-atomic='true'>
                            {state?.errors?.start && state.errors?.start?.map((error: string) => (
                                <p className='text-base text-red-500' key={error}>{error}</p>
                            ))}  
                        </div>
                        <Textarea 
                            label="説明を追加"
                            name="description"
                            variant="bordered"
                            maxLength={1000}
                        />
                        <Input
                            label="カラーを追加"
                            labelPlacement="outside-left"
                            name="color"
                            defaultValue="#000000"
                            startContent={
                                <Palette 
                                    height={35} 
                                    width={35} 
                                />
                            }
                            type="color"
                            variant="bordered"
                        />
                        <div className='flex items-center justify-end space-x-5'>
                            <Button
                                color="primary"
                                type="submit"
                                aria-label="Save schedule"
                                aria-disabled={isPending}
                                isLoading={isPending}
                            >
                                {isPending ? "保存中..." : "保存"}
                            </Button>
                            <Button 
                                onPress={() => setOpen(false)}
                            >
                                キャンセル
                            </Button>
                        </div>
                    </form>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}