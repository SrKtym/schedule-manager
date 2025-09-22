'use client';

import { Pagination } from "@heroui/react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export function CustomPagination({totalPages}: {totalPages: number}) {
    const searchParams = useSearchParams();
    const param = new URLSearchParams(searchParams);
    const pathName = usePathname();
    const router = useRouter();

    return (
        <div className="flex justify-center items-center">
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                initialPage={1}
                total={totalPages}
                onChange={(page) => {
                    param.set('page', page.toString());
                    router.replace(`${pathName}?${param}`)
                }}
            />
        </div>
    );
}