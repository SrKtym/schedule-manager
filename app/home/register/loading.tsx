import { DataTableSkelton, FilterSkelton, TimeTableSkelton } from "@/components/skeltons";

export default function Loading() {
    return (
        <div className="flex flex-col space-y-5 p-3 lg:grid grid-cols-2 gap-x-5">
            <div className="space-y-5">
                {/* フィルター */}
                <FilterSkelton />
                {/* データテーブル */}
                <DataTableSkelton />
            </div>
            {/* 時間割 */}
            <TimeTableSkelton />
        </div>
    );
}