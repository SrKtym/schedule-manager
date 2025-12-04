'use client';

import * as m from "motion/react-m";
import { LazyMotion, domAnimation } from "motion/react";
import { Calendar } from "lucide-react";
import { fetchSchedule } from "@/utils/getters/main";
import { decimalHours, getDateFromTimeString, isProgressingOrUpcoming } from "@/utils/helpers/schedule";
import { daysOfWeek, timeRange } from "@/constants/definitions";
import { cn } from "@heroui/react";
import { useRegisteredCourseDataList } from "@/contexts/registered-course-context";


export function DailySchedule({
    todaySchedule
}: {
    todaySchedule: Awaited<ReturnType<typeof fetchSchedule>>
}) {
    const {courseDataList} = useRegisteredCourseDataList();
    const registeredCourse = courseDataList.map((data) => {
        return {
            day: data.course.week[0],
            start: getDateFromTimeString(timeRange[Number(data.course.period[0]) - 1].split("-")[0]),
            end: getDateFromTimeString(timeRange[Number(data.course.period[0]) - 1].split("-")[1]),
            title: data.course.name
        }
    });

    // 1日の講義を取得
    const courseOfDay = (d: string) => {
        const res = registeredCourse.filter(v => v.day === d);
        return res;
    }

    const todayCourse = courseOfDay(daysOfWeek[new Date().getDay()]);
    
    const heightOfSchedule = todaySchedule ? todaySchedule.length * 150 : 0;
    const heightOfCourse = todayCourse ? todayCourse.length * 150 : 0;
    const totalHeight = (heightOfSchedule + heightOfCourse) + 300;

    // タイムライン
    const TimelineSVG = () => 
        <m.svg
            width="40"
            height={totalHeight}
            viewBox={`0 0 40 ${totalHeight}`}
            preserveAspectRatio="xMinYMin meet"
            display="block"
            xmlns="http://www.w3.org/2000/svg"
            initial="hidden"
            animate="visible"
            className="overflow-visible"
        >
            <g id="timeline">
                <m.path
                    d="M 20,30 A 10,10 0 1 1 20,10 A 10,10 0 1 1 20,30"
                    fill="none"
                    stroke="#0099ff"
                    strokeWidth="3"
                    strokeLinecap="butt"
                    variants={{
                        hidden: { pathLength: 0 },
                        visible: { pathLength: 1, transition: { duration: 0.5, ease: 'easeInOut' } }
                    }}
                />
                <m.line 
                    x1="20" 
                    y1="30" 
                    x2="20" 
                    y2={totalHeight - 20} 
                    stroke="#0099ff" 
                    strokeWidth="3" 
                    strokeLinecap="butt" 
                    variants={{
                        hidden: { pathLength: 0 },
                        visible: { pathLength: 1, transition: { delay: 0.5, duration: 0.5, ease: 'easeInOut' } }
                    }}
                />
                <m.path 
                    d={`M 20,${totalHeight - 20} A 10,10 0 1 1 20,${totalHeight} A 10,10 0 1 1 20,${totalHeight - 20}`}
                    fill="none"
                    stroke="#0099ff"
                    strokeWidth="3"
                    strokeLinecap="butt"
                    variants={{
                        hidden: { pathLength: 0 },
                        visible: { pathLength: 1, transition: { delay: 1, duration: 0.5, ease: 'easeInOut' } }
                    }}
                />
            </g>
        </m.svg>

    // ブランチ
    const Branch = ({
        item,
        direction
    }: {
        item: Awaited<ReturnType<typeof fetchSchedule>>[number] |
        {
            title: string, 
            start: Date, 
            end: Date
        },
        direction: "left" | "right"
    }) => 
        [...Array(2)].map((_, binary) => (
            // ブランチ
            <div 
                key={`${item.title}-${binary}`}
                style={{ 
                    top: binary === 0 ? "-35%" : undefined,  
                    bottom: binary === 1 ? "-35%" : undefined,
                    opacity: isProgressingOrUpcoming(item.start, item.end) === "past" ? 0.5 : 1,
                }}
                className={cn("absolute w-full flex items-center", 
                    direction === "left" ? "left-6.5 flex-row-reverse" : "right-6.5")}
            >
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.3, ease: 'easeInOut' }}
                    className="rounded-full h-3 w-3 border-1 border-primary bg-white"
                />
                <m.div
                    initial={{ opacity: 0, width: "0%" }}
                    animate={{ opacity: 1, width: "20%" }}
                    transition={{ delay: 2, duration: 0.3, ease: 'easeInOut' }}
                    className="border-b border-1 border-primary"
                />
                <m.p
                    initial={{ opacity: 0}}
                    animate={{ opacity: 1}}
                    transition={{ delay: 1.5, duration: 0.3, ease: 'easeInOut' }}
                    className="text-xs ml-2"
                >
                    {binary === 0 ? item.start.toLocaleTimeString("default", { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                    }) : item.end.toLocaleTimeString("default", { 
                        hour: "2-digit", 
                        minute: "2-digit" 
                    })}
                </m.p>
            </div>
        ));

    return (
        <div className="flex flex-col row-span-full bg-gradient-to-b from-primary-50 to-primary-100 shadow-small rounded-large p-2">
            <div className="flex items-center gap-2">
                <Calendar 
                    width={24} 
                    height={24} 
                />
                <h1 className="text-xl font-medium m-2">
                    本日の予定 - {new Date().toLocaleDateString("default", { 
                        weekday: "long", 
                        year: "numeric", 
                        month: "long", 
                        day: "numeric" 
                    })}
                </h1>
            </div>
            {todayCourse.length === 0 && todaySchedule.length === 0 && (
                <p className="text-center p-5">
                    予定はありません
                </p>
            )}
            <LazyMotion features={domAnimation}>
                <div className="flex items-center justify-between p-3">
                    <ul className="relative w-full h-[calc(100%-150px)]">
                        {/* 本日の講義 */}
                        {todayCourse && todayCourse.map((course) => (
                            <m.li
                                key={course.title}
                                style={{ 
                                    top: `${decimalHours(course.start) / 24 * 100}%`,
                                    transform: `translateY(-50%)`
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ 
                                    opacity: isProgressingOrUpcoming(course.start, course.end) === "past" ? 0.5 : 1,
                                    animation: isProgressingOrUpcoming(course.start, course.end) === "progressing" ? "pulse 2s infinite" : undefined
                                }}
                                transition={{ delay: 2.5, duration: 0.3, ease: 'easeInOut' }}
                                className="absolute relative bg-background w-full rounded-large p-3"
                            >
                                <h2 className="text-lg font-medium">
                                    {course.title}
                                </h2>
                                <Branch 
                                    item={course} 
                                    direction="left" 
                                />
                            </m.li>
                        ))}
                    </ul>

                    {/* タイムライン */}
                    <TimelineSVG />

                    <ul className="relative w-full h-[calc(100%-150px)]">
                        {/* 本日のスケジュール（プライベート） */}
                        {todaySchedule && todaySchedule.map((schedule) => (
                            <m.li
                                key={schedule.title}
                                style={{ 
                                    top: `${decimalHours(schedule.start) / 24 * 100}%`,
                                    transform: `translateY(-50%)`
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ 
                                    opacity: isProgressingOrUpcoming(schedule.start, schedule.end) === "past" ? 0.5 : 1,
                                    animation: isProgressingOrUpcoming(schedule.start, schedule.end) === "progressing" ? "pulse 2s infinite" : undefined
                                }}
                                transition={{ delay: 2.5, duration: 0.3, ease: 'easeInOut' }}
                                className="absolute relative bg-background w-full rounded-large p-3"
                            >
                                <h2 className="text-lg font-medium">
                                    {schedule.title}
                                </h2>
                                {schedule.description && (
                                    <p className="text-sm text-muted-foreground">
                                        {schedule.description}
                                    </p>
                                )}
                                <Branch 
                                    item={schedule} 
                                    direction="right" 
                                />
                            </m.li>
                        ))}
                    </ul>
                </div>
            </LazyMotion>
        </div>
    );
}
