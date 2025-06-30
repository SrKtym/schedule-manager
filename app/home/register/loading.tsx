import { DataTableSkelton } from "@/components/skeltons";
import { Skeleton } from "@heroui/react";

export default function Loading() {
    return (
        <div className="flex flex-col space-y-5 lg:grid grid-cols-2 gap-x-5">
            <div className="space-y-5">
                <div className="grid grid-cols-3 gap-3">
                    <Skeleton className="w-full h-[56px] rounded-lg" />
                    <Skeleton className="w-full h-[56px] rounded-lg" />
                    <Skeleton className="w-full h-[56px] rounded-lg" />
                    <Skeleton className="w-full h-[56px] rounded-lg" />
                    <Skeleton className="w-full h-[56px] rounded-lg" />
                    <Skeleton className="w-full h-[56px] rounded-lg" />
                </div>
                <Skeleton className="w-full h-[40px] rounded-lg" />
                <div className="flex justify-between items-center space-x-2">
                    <Skeleton className="w-full max-w-[180px] h-[24px] rounded-lg "/>
                    <div className="flex space-x-3">
                        <Skeleton className="w-25 h-[56px] rounded-lg sm:w-[134px]"/>
                        <Skeleton className="w-25 h-[56px] rounded-lg sm:w-[134px]"/>
                    </div>
                </div>
                <DataTableSkelton />
            </div>
        </div>
    );
}