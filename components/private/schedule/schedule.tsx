import { Button } from "@heroui/react";
import { days, times } from "@/lib/definitions";


export function Schedule() {
    return (
        <div className="overflow-auto w-full p-4 mb-5 space-y-4 bg-white rounded-lg shadow lg:sticky top-18 dark:bg-gray-900">
            <h2 className="text-2xl text-center mb-4">時間割</h2>
            <table className="min-w-full table-fixed border border-gray-300">
                <thead className="bg-gray-100 dark:bg-gray-500">
                    <tr>
                        <th className="w-20 border border-gray-300 p-2">時間</th>
                        {days.map((day) => (
                            <th key={day} className="border border-gray-300 p-2 dark:text-white">
                                {day}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                {times.map((time, i) => (
                    <tr key={time}>
                        <td className="border border-gray-300 p-2 text-center">
                            <div className="flex flex-col items-center space-y-2">
                                <span>{`${i+1}限目`}</span>
                                <span className="text-sm">{time}</span>
                            </div>
                        </td>
                        {days.map((day) => (
                            <td
                                key={day}
                                className="border border-gray-300 p-2 text-center text-gray-700 dark:text-white"
                            >
                                {i === 2 && day === "月曜日" ? "test" : ""}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center gap-3">
                <div className="flex flex-col gap-2">
                    <p className="sm:text-xl dark:text-white">取得予定の単位数: 0</p>
                    <div className="flex justify-between items-center gap-2">
                        <p className="dark:text-white">上限: 50</p>
                        <p className="dark:text-white">下限: 40</p>
                    </div>
                </div>
                <Button color="primary">登録を完了する</Button>
            </div>
        </div>
    );
}