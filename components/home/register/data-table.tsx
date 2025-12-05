'use client';

import { course } from "@/lib/drizzle/schemas/main";
import { 
    Button,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    addToast,
    getKeyValue,
    type Selection,
} from "@heroui/react";
import { dataTableColumns } from "@/constants/definitions";
import { useState } from "react";
import { CustomPagination } from "./pagination";
import { client } from "@/lib/hono/client";
import { useRouter } from "next/navigation";
import { useRegisteredCourseDataList } from "@/contexts/registered-course-context";


export function DataTable({
    items, 
    totalPages
}: {
    items: typeof course.$inferSelect[], 
    totalPages: number
}) {
    const {courseDataList} = useRegisteredCourseDataList();
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const router = useRouter();
    
    return (
        <>
            <Table
                aria-label="table"
                isHeaderSticky
                selectionMode="multiple"
                disabledKeys={courseDataList.map(v => v.course.name)}
                disabledBehavior="selection"
                onSelectionChange={setSelectedKeys}
                bottomContent={<CustomPagination totalPages={totalPages}/>}
            >
                <TableHeader columns={dataTableColumns}>
                    {(column) => (
                        <TableColumn key={column.key}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={'講義がありません'} 
                    items={items}                   
                >
                    {(item) => (
                        <TableRow key={item.name}>
                            {(itemKey) => (
                                <TableCell>
                                    {getKeyValue(item, itemKey)}
                                </TableCell>)}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {selectedKeys === 'all'
                ? <div className="flex justify-center w-full bg-gray-100 text-lg fixed bottom-0 left-0 right-0 p-3 z-10 dark:bg-gray-800 dark:text-white">
                    <div className="flex items-center justify-between w-full max-w-[800px]">
                        <p className="flex items-center h-[40px]">
                            すべての講義を選択中
                        </p>
                    </div>
                  </div>
                : selectedKeys.size !== 0
                ? <div className="flex justify-center w-full bg-gray-100 text-lg fixed bottom-0 left-0 right-0 p-3 z-10 dark:bg-gray-800 dark:text-white">
                    <div className="flex items-center justify-between w-full max-w-[800px] gap-2">
                        <p>
                            {selectedKeys.size}個の講義を選択中
                        </p>
                        <div className="flex gap-5">
                            <Button 
                                color="primary"
                                onPress={async () => {
                                    const res = await client.api.course.multiple.$post({
                                        json: {
                                            name: [...selectedKeys].map(String)
                                        }
                                    });
                                    if (res.ok) {
                                        router.refresh();
                                    } else {
                                        addToast({
                                            color: 'danger',
                                            description: "履修登録に失敗しました。"
                                        });
                                    }
                                }}
                            >
                                すべて登録
                            </Button>
                            <Button 
                                color="danger" 
                                onPress={() => {
                                   selectedKeys.clear();
                                   setSelectedKeys(new Set([]));
                                }}
                            >
                                選択を解除
                            </Button>
                        </div>
                    </div>
                 </div>
                : null
            }
        </>
    );
}
