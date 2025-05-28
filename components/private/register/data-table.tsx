'use client';

import { course } from "@/lib/db/schema/public";
import { CustomPagination } from "./pagination";
import { SearchField } from "./search";
import { 
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    getKeyValue
} from "@heroui/table";
import { dataTableColumns } from "@/lib/definitions";
import { Spinner } from "@heroui/react";
import { useState } from "react";


export function DataTable({items}: {items: typeof course.$inferSelect[]}) {
    const [rowsPerPage, setRowsPerPage] = useState<number>(30);
    const filteredItems = items.length;
    const totalPages = Math.ceil(filteredItems / rowsPerPage) || 1;

    return (
        <Table
            aria-label="table"
            isHeaderSticky
            bottomContent={<CustomPagination totalPages={totalPages}/>}
            bottomContentPlacement="outside"
            selectionMode="multiple"
            topContent={<SearchField />}
            topContentPlacement="outside"
            >
            <TableHeader columns={dataTableColumns}>
                {(column) => (
                    <TableColumn key={column.key} allowsSorting={column.sortable}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody 
                emptyContent={'アイテムがありません'} 
                items={items} 
                loadingContent={<Spinner classNames={{label: "text-foreground mt-4"}} label="読み込み中…" variant="wave"/>}
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
    );
}
