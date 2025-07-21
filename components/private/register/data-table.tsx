'use client';

import { course } from "@/lib/drizzle/schema/public";
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
import { dataTableColumns } from "@/lib/definitions";
import { useState } from "react";
import { CustomPagination } from "./pagination";
import { hc } from "hono/client";
import { AppType } from "@/app/api/[[...route]]/route";
import { env } from "@/env";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/fetch";



export function DataTable({
    items, 
    totalPages,
    session
}: {
    items: typeof course.$inferSelect[], 
    totalPages: number,
    session: Awaited<ReturnType<typeof getSession>>
}) {
    const client = hc<AppType>(env.NEXT_PUBLIC_APP_URL);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const router = useRouter();

    return (
        <div>
            <Table
                aria-label="table"
                isHeaderSticky
                selectionMode="multiple"
                onSelectionChange={setSelectedKeys}
                bottomContent={<CustomPagination totalPages={totalPages}/>}
            >
                <TableHeader columns={dataTableColumns}>
                    {(column) => (
                        <TableColumn 
                            key={column.key} 
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={'講義がありません'} 
                    items={items}                   
                >
                    {(item) => (
                        <TableRow 
                            key={item.name}
                        >
                            {(itemKey) => (
                                <TableCell>
                                    {getKeyValue(item, itemKey)}
                                </TableCell>)}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {selectedKeys === 'all'
                ? <div className="flex justify-center w-full bg-gray-100 text-lg fixed bottom-0 left-0 right-0 p-3 dark:bg-gray-800 dark:text-white">
                    <div className="flex items-center justify-between w-full max-w-[800px]">
                        <p className="flex items-center h-[40px]">すべての講義を選択中</p>
                    </div>
                  </div>
                : selectedKeys.size !== 0
                ? <div className="flex justify-center w-full bg-gray-100 text-lg fixed bottom-0 left-0 right-0 p-3 dark:bg-gray-800 dark:text-white">
                    <div className="flex items-center justify-between w-full max-w-[800px] gap-2">
                        <p>{selectedKeys.size}個の講義を選択中</p>
                        <div className="flex gap-5">
                            <Button 
                                color="primary"
                                onPress={async () => {
                                    const res = await client.api.course.multiple.$post({
                                        json: {
                                            email: session?.user.email as string,
                                            name: selectedKeys.values().toArray() as string[]
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
                            <Button color="danger" onPress={() => {
                               selectedKeys.clear();
                               setSelectedKeys(new Set([]));
                            }}>
                                選択を解除
                            </Button>
                        </div>
                    </div>
                 </div>
                : null
            }
        </div>
    );
}
