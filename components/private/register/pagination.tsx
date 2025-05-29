'use client';

import { Pagination } from "@heroui/pagination";

export function CustomPagination({totalPages}: {totalPages: number}) {

    return (
        <div className="flex justify-center items-center">
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                initialPage={1}
                total={totalPages}
            />
        </div>
    );
}