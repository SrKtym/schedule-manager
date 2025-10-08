'use client';

import { Button } from "@heroui/react";
import { timeRange, week } from "@/constants/definitions";
import { RenderCourse } from "./render-course";
import { sumCredit } from "@/hooks/sum-credit";


export function Timetable() {
    return (
        <div className="overflow-auto w-full p-4 mb-5 space-y-4 bg-white rounded-large shadow-small lg:sticky top-20 dark:bg-content1">
            <h2 className="text-2xl text-center mb-4">
                時間割
            </h2>
            <table className="min-w-full table-fixed border border-gray-300">
                <thead className="bg-gray-100 dark:bg-gray-600">
                    <tr>
                        <th className="w-20 border border-gray-300 p-2">
                            時間
                        </th>
                        {week.map((day) => (
                            <th 
                                key={day} 
                                className="border border-gray-300 p-2"
                            >
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {timeRange.map((time, i) => (
                        <tr key={time}>
                            <td className="border border-gray-300 p-2 text-center">
                                <div className="flex flex-col items-center space-y-2">
                                    <span>
                                        {`${i + 1}限目`}
                                    </span>
                                    <span className="text-sm">
                                        {time}
                                    </span>
                                </div>
                            </td>
                            {week.map((day) => (
                                <td
                                    key={day}
                                    className="border border-gray-300 p-2 text-center text-gray-700 dark:text-white"
                                >
                                    <RenderCourse
                                        period={`${i + 1}限目`}
                                        week={day}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center gap-3">
                <div className="flex flex-col gap-2">
                    <p className="sm:text-xl dark:text-white">
                        取得予定の単位数: {sumCredit()}
                    </p>
                    <div className="flex justify-between items-center gap-2">
                        <p className="dark:text-white">
                            上限: 50
                        </p>
                        <p className="dark:text-white">
                            下限: 40
                        </p>
                    </div>
                </div>
                <Button 
                    color="primary"
                    isDisabled={sumCredit() < 40 || sumCredit() >= 50}
                >
                    登録を完了する
                </Button>
            </div>
        </div>
    );
}