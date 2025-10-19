"use clent";

import { fetchSchedule } from "@/utils/getter";
import * as m from "motion/react-m";
import { X } from "lucide-react";
import { addToast, Button } from "@heroui/react";
import { dateOptionforSchedule } from "@/constants/definitions";
import { isSpanningDays } from "@/utils/related-to-schedule";
import { hc } from "hono/client";
import { env } from "@/env";
import { AppType } from "@/app/api/[[...route]]/route";
import { useRouter } from "next/navigation";

const CloseButton = ({ onClose }: { onClose: () => void }) => {
    return (
        <Button
            aria-label="close modal"
            isIconOnly
            variant="light"
            radius="full"
            className="absolute top-0 right-2"
            onPress={onClose}
        >
            <X 
                width={24} 
                height={24}
            />
        </Button>
    )
}

// 通知、講義、スケジュールのモーダル
export function SingleItemModal({
    notification,
    registeredCourse,
    schedule,
    onClose,
}: {
    notification?: { id: number, title: string, message: string, read: boolean };
    registeredCourse?: { day: string, start: Date, end: Date, name: string };
    schedule?: Awaited<ReturnType<typeof fetchSchedule>>[number];
    onClose: () => void;
}) {
    const client = hc<AppType>(env.NEXT_PUBLIC_APP_URL);
    const router = useRouter();

    return (
        <div className="absolute fixed inset-0 flex items-center justify-center z-30">
            {/* 通知 */}
            {notification && 
                <m.div
                    layoutId={notification.id.toString()}
                    key="modal"
                    className="relative flex flex-col items-start gap-3 text-justify w-full h-full max-w-[500px] max-h-[300px] rounded-3xl bg-background p-6"
                >
                    <h2 className="text-lg font-medium">
                        {notification.title}
                    </h2>
                    <p className="text-sm">
                        {notification.message}
                    </p>
                    <CloseButton onClose={onClose} />
                </m.div>
            }
            {/* 講義 */}
            {registeredCourse && 
                <m.div
                    layoutId={registeredCourse.name.toString()}
                    key="modal"
                    className="relative flex flex-col items-start gap-3 text-justify w-full h-full max-w-[500px] max-h-[300px] rounded-3xl bg-primary p-6"
                >
                    <h2 className="text-lg font-medium">
                        {registeredCourse.name}
                    </h2>
                    <p className="text-sm">
                        {registeredCourse.start.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })} 
                        - {registeredCourse.end.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <CloseButton onClose={onClose} />
                </m.div>
            }
            {/* スケジュール */}
            {schedule && 
                <m.div
                    layout
                    layoutId={schedule.id.toString()}
                    key="modal"
                    style={{
                        backgroundColor: schedule.color
                    }}
                    className="relative flex flex-col items-start gap-3 text-justify w-full h-full max-w-[500px] max-h-[300px] rounded-3xl p-6"
                >
                    <h2 className="text-lg font-medium">
                        {schedule.title}
                    </h2>
                    <p className="text-sm">
                        {isSpanningDays(schedule.start, schedule.end) ? 
                            `${schedule.start.toLocaleDateString('default', dateOptionforSchedule)} - ${schedule.end.toLocaleDateString('default', dateOptionforSchedule)}` : 
                            `${schedule.start.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })} - ${schedule.end.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                    <p>
                        {schedule.description}
                    </p>
                    <CloseButton onClose={onClose} />
                    <Button
                        color="danger"
                        onPress={async () => {
                            const res = await client.api.schedule.$delete({
                                json: {
                                    id: schedule.id
                                }
                            });
                            if (res.ok) {
                                router.refresh();
                                onClose();
                            } else {
                                addToast({
                                    color: 'danger',
                                    description: '予定の削除に失敗しました。'
                                });
                            }
                        }}
                    >
                        この予定を削除する
                    </Button>
                </m.div>
            }
        </div>
    )
}