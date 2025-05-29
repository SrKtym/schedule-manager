'use client';

import { 
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    getKeyValue
} from "@heroui/table";
import { scheduleTableHeaders } from "@/lib/definitions";
import { registered } from "@/lib/db/schema/public";

export function Schedule({registeredCourse}: {registeredCourse: typeof registered.$inferSelect[]}) {
    return (
        <Table
            aria-label="schedule"
            isHeaderSticky
        >
            <TableHeader columns={scheduleTableHeaders.columns}>
                {(column) => (
                    <TableColumn key={column.key}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                emptyContent={'講義が未登録です'}
                items={registeredCourse}
            >
                {(registered) => (
                    <TableRow key={registered.email}>
                        {(registeredKey) => (
                            <TableCell>
                                {getKeyValue(registered.name, registeredKey)}
                            </TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}