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
    Popover, 
    PopoverContent, 
    PopoverTrigger, 
    Tooltip 
} from "@heroui/react";
import { hc } from "hono/client";
import { env } from "@/env";
import { course } from "@/lib/drizzle/schema/public";
import { AppType } from "@/app/api/[[...route]]/route";
import { useRegisteredCourseData } from "@/contexts/registered-course-context";
import { useEffect, useRef, useState } from "react";
import { InferResponseType } from "hono/client";
import { Edit, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSessionUserData } from "@/contexts/user-data-context";


export function RenderCourse({
    period,
    week
}: {
    period: string;
    week: string;
}) {
    const client = hc<AppType>(env.NEXT_PUBLIC_APP_URL);
    const ref = useRef<InferResponseType<typeof client.api.course.$get>>(undefined);
    const [open, setOpen] = useState<boolean>(false);
    const [hasHover, setHasHover] = useState<boolean>(false);
    const router = useRouter();
    const email = useSessionUserData().email;

    // メディアクエリで hover の可否を判定
    useEffect(() => {
        const mql = window.matchMedia('(hover: hover)');
        setHasHover(mql.matches);
    }, []);

    const dataList = useRegisteredCourseData();
    const data = dataList.courseDataList.find(
        v => v.course.period === period && v.course.week === week
    );
    const name = data?.course.name;

    // ツールチップ or ポップオーバー
    const Components = ({courseName}: {courseName: string}) => {
        if (hasHover) {
            // PCの場合
            return (
                <Tooltip
                    size="sm"
                    content={<Contents courseName={courseName} />}
                    placement="bottom"
                >
                    <p className="hover:underline cursor-pointer">
                        {courseName}
                    </p>
                </Tooltip>
            )
        } else {
            // タッチデバイス（スマホ・タブレット）の場合
            return (
                <Popover placement="bottom">
                    <PopoverTrigger>
                        <p>
                            {courseName}
                        </p>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Contents courseName={courseName}/>
                    </PopoverContent>
                </Popover>
            );
        }
    }

    // ツールチップ（ポップオーバー）コンテンツ
    const Contents = ({courseName}: {courseName: string}) => 
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
                    setOpen(true);
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
                        json: {
                            name: courseName
                        }
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

    return (
        <>
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
                                    textValue={item.name}
                                    onPress={async (e) => {
                                        const res = await client.api.course.single.$post({
                                            json: {
                                                email: email,
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
                                        <p>
                                            {item.name}({item.week}, {item.period})
                                        </p>
                                        <p>
                                            単位数: {item.credit}
                                        </p>
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
            {name ? 
                <Components courseName={name}/> : 
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
                        setOpen(true);
                    }}
                >
                    <Plus />
                </Button>
            }
        </>
    )
}
