"use clent";

import { fetchSchedule } from "@/utils/getter";
import * as m from "motion/react-m";

export function SingleItemModal({
    notification,
    registeredCourse,
    schedule,
    onClick
}: {
    notification?: { id: number, title: string, message: string, read: boolean };
    registeredCourse?: { day: string, start: Date, end: Date, name: string };
    schedule?: Awaited<ReturnType<typeof fetchSchedule>>[number];
    onClick: () => void;
}) {
    return (
        <div 
            className="absolute fixed inset-0 flex items-center justify-center z-30"
            onClick={onClick}
        >
            {/* 通知 */}
            {notification && 
                <m.div
                    layoutId={notification.id.toString()}
                    key="modal"
                    className="flex flex-col items-start gap-3 text-justify w-full h-full max-w-[500px] max-h-[300px] rounded-3xl bg-background p-6"
                >
                    <h2 className="text-lg font-medium">
                        {notification.title}
                    </h2>
                    <p className="text-sm">
                        {notification.message}
                    </p>
                </m.div>
            }
            {/* 講義 */}
            {registeredCourse && 
                <m.div
                    layoutId={registeredCourse.name.toString()}
                    key="modal"
                    className="flex flex-col items-start gap-3 text-justify w-full h-full max-w-[500px] max-h-[300px] rounded-3xl bg-primary p-6"
                >
                    <h2 className="text-lg font-medium">
                        {registeredCourse.name}
                    </h2>
                    <p className="text-sm">
                        {registeredCourse.start.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })} 
                        - {registeredCourse.end.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </m.div>
            }
            {/* スケジュール */}
            {schedule && 
                <m.div
                    layoutId={schedule.id.toString()}
                    key="modal"
                    style={{
                        backgroundColor: schedule.color
                    }}
                    className="flex flex-col items-start gap-3 text-justify w-full h-full max-w-[500px] max-h-[300px] rounded-3xl p-6"
                >
                    <h2 className="text-lg font-medium">
                        {schedule.title}
                    </h2>
                    <p className="text-sm">
                        {schedule.description}
                    </p>
                    <p className="text-sm">
                        {schedule.start.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })} 
                        - {schedule.end.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </m.div>
            }
        </div>
    )
}