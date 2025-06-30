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
    getKeyValue,
    type Selection,
    type SortDescriptor,
} from "@heroui/react";
import { dataTableColumns } from "@/lib/definitions";
import { useState } from "react";
import { CustomPagination } from "./pagination";



export function DataTable({items, totalPages}: {items: typeof course.$inferSelect[], totalPages: number}) {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "講義名",
        direction: "descending"
    });

    return (
        <div>
            <Table
                aria-label="table"
                isHeaderSticky
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
                onSelectionChange={setSelectedKeys}
                bottomContent={<CustomPagination totalPages={totalPages}/>}
            >
                <TableHeader columns={dataTableColumns}>
                    {(column) => (
                        <TableColumn 
                            key={column.key} 
                            allowsSorting={column.sortable}
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
                ? <div className="flex justify-center w-full bg-gray-100 text-lg fixed bottom-0 right-0 left-0 py-4 pl-3 dark:bg-gray-800 dark:text-white">
                    <div className="flex items-center justify-between w-full max-w-[800px]">
                        <p className="flex items-center h-[40px]">すべての講義を選択中</p>
                    </div>
                  </div>
                : selectedKeys.size !== 0
                ? <div className="flex justify-center w-full bg-gray-100 text-lg fixed bottom-0 right-0 left-0 py-4 pl-3 dark:bg-gray-800 dark:text-white">
                    <div className="flex items-center justify-between w-full max-w-[800px]">
                        <p>{selectedKeys.size}個の講義を選択中</p>
                        <div className="flex gap-5">
                            <Button color="primary">
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
