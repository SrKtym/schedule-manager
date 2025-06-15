'use client';

import { course } from "@/lib/db/schema/public";
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



export function DataTable({items}: {items: typeof course.$inferSelect[]}) {
    return (
        <Table
            aria-label="table"
            isHeaderSticky
            selectionMode="multiple"
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
