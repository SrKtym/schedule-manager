'use client';

import { 
    addToast, 
    Button,
    Listbox,
    ListboxItem,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Tooltip 
} from "@heroui/react";
import { days, times } from "@/lib/definitions";
import { getRegisteredCourse, getSession } from "@/lib/fetch";
import { Edit, Plus, Trash } from "lucide-react";
import { type InferResponseType, hc } from "hono/client";
import { env } from "@/env";
import { AppType } from "@/app/api/[[...route]]/route";
import { course } from "@/lib/drizzle/schema/public";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";



export function Schedule({
    dataList,
    session
}: {
    dataList: Awaited<ReturnType<typeof getRegisteredCourse>>,
    session: Awaited<ReturnType<typeof getSession>>
}) {
    const client = hc<AppType>(env.NEXT_PUBLIC_APP_URL);
    const ref = useRef<InferResponseType<typeof client.api.course.$get>>(undefined);
    const [open, setOpen] = useState<boolean>(false);
    const router = useRouter();
    const filteredCourse = (period: string, week: string) => {
        const data = dataList.filter(
            v => v.course.period === period && v.course.week === week
        );
        const name = data.at(-1)?.course.name;
        if (name) {
            return (
                <Tooltip
                    size="sm"
                    content={
                        <div className="flex justify-center items-center gap-2">
                            <Button 
                                aria-label="edit"
                                isIconOnly
                                size="sm"
                                title="編集"
                                variant="light"
                                onPress={async () => {
                                    const res = await client.api.course.$get({
                                        query: {
                                            period: period as typeof course.$inferSelect.period,
                                            week: week as typeof course.$inferSelect.week
                                        }
                                    });
                                    const dataList = await res.json();
                                    ref.current = dataList;
                                    setOpen(prev => !prev);
                                }}
                            >
                                <Edit />
                            </Button>
                            <Button 
                                aria-label="delete"
                                isIconOnly
                                size="sm"
                                title="削除"
                                variant="light"
                                onPress={async () => {
                                    const res = await client.api.course.$delete({
                                        json: name
                                    });
                                    if (res.ok) {
                                        router.refresh();
                                    } else {
                                        addToast({
                                            color: 'danger',
                                            description: '登録解除に失敗しました。'
                                        })
                                    }
                                }}
                            >
                                <Trash />
                            </Button>
                        </div>
                    }
                    placement="bottom"
                >
                    <p className="hover:underline cursor-pointer">
                        {name}
                    </p>
                </Tooltip>
            )
        } else {
            return (
                <Button 
                    aria-label="register"
                    isIconOnly
                    title="登録"
                    variant="light"
                    onPress={async () => {
                        const res = await client.api.course.$get({
                            query: {
                                period: period as typeof course.$inferSelect.period,
                                week: week as typeof course.$inferSelect.week
                            }
                        });
                        const dataList = await res.json();
                        ref.current = dataList;
                        setOpen(prev => !prev);
                    }}
                >
                    <Plus />
                </Button>
            )
        }
    }

    const sumCredit = () => {
        const creditList = dataList.map((data) => {return Number(data.course.credit)});
        const sum = creditList.reduce((prev, curr) => prev + curr, 0);
        return sum;
    }


    return (
        <div className="overflow-auto w-full p-4 mb-5 space-y-4 bg-white rounded-lg shadow lg:sticky top-20 dark:bg-gray-900">
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
                                {filteredCourse(`${i+1}限目`, day)} 
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="flex justify-between items-center gap-3">
                <div className="flex flex-col gap-2">
                    <p className="sm:text-xl dark:text-white">取得予定の単位数: {sumCredit()}</p>
                    <div className="flex justify-between items-center gap-2">
                        <p className="dark:text-white">上限: 50</p>
                        <p className="dark:text-white">下限: 40</p>
                    </div>
                </div>
                <Button 
                    color="primary"
                    isDisabled={sumCredit() < 40 || sumCredit() >= 50}
                >
                    登録を完了する
                </Button>
            </div>
            <Modal
                isOpen={open}
                onOpenChange={setOpen}    
            >
                <ModalContent>
                    <ModalHeader className="justify-center">
                        登録する講義を選択してください
                    </ModalHeader>
                    <ModalBody>
                        <Listbox 
                            aria-label="listbox"
                            items={ref.current}
                        >
                            {(item) => (
                                <ListboxItem 
                                    key={item.name}
                                    onPress={async (e) => {
                                        const res = await client.api.course.single.$post({
                                            json: {
                                                email: session?.user.email as string,
                                                name: e.target.getAttribute('data-key') as string
                                            }
                                        });
                                        if (res.ok) {
                                            router.refresh();
                                            setOpen(prev => !prev)
                                        } else {
                                            addToast({
                                                color: 'danger',
                                                description: "履修登録に失敗しました。"
                                            });
                                        }
                                    }}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <p>{item.name}({item.week}, {item.period})</p>
                                        <p>単位数: {item.credit}</p>
                                    </div>
                                </ListboxItem>
                            )}
                        </Listbox>
                    </ModalBody>
                    <ModalFooter className="justify-center">
                        <Button
                            aria-label="close"
                            onPress={() => setOpen(prev => !prev)}
                        >
                            キャンセル
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}