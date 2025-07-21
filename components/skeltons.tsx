import { Card, Skeleton } from "@heroui/react";


function DataTableRowsSkelton() {
    return (
        <div className="flex justify-between items-center gap-2 p-3">
            <Skeleton className="w-[20px] h-[20px] rounded-lg" />
            <Skeleton className="w-[100px] h-[20px] rounded-lg" />
            <Skeleton className="w-[100px] h-[20px] rounded-lg" />
            <Skeleton className="w-[100px] h-[20px] rounded-lg" />
            <Skeleton className="w-[100px] h-[20px] rounded-lg" />
            <Skeleton className="w-[100px] h-[20px] rounded-lg" />
            <Skeleton className="w-[100px] h-[20px] rounded-lg" />
        </div>
    );
}

export function InboxSkelton() {
    return (
        <div className="flex flex-col">

            {/* ナビバー */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-[40px] h-[40px] rounded-lg" />
                    <Skeleton className="w-[40px] h-[40px] rounded-lg" />
                </div>
                <Skeleton className="w-full max-w-[576px] h-[40px] rounded-xl mx-4" />
                <Skeleton className="w-full max-w-[40px] h-[40px] rounded-lg" />
            </div>
            <div className="flex">

                {/* サイドバー */}
                <div className="flex flex-col items-center w-15 gap-2 p-4 border-r border-divider max-sm:hidden">
                    <Skeleton className="w-[40px] h-[40px] rounded-lg" />
                    <Skeleton className="w-[40px] h-[40px] rounded-lg" />
                    <Skeleton className="w-[40px] h-[40px] rounded-lg" />
                    <Skeleton className="w-[40px] h-[40px] rounded-lg" />
                    <Skeleton className="w-[40px] h-[40px] rounded-lg" />
                    <Skeleton className="w-[40px] h-[40px] rounded-lg" />
                </div>

                {/* メール一覧 */}
                <div className="w-full h-full grid grid-col">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <div className="flex items-center gap-5">
                            <Skeleton className="w-[20px] h-[20px] rounded-lg" />
                            <Skeleton className="w-[18px] h-[18px] rounded-lg" />
                            <Skeleton className="w-[18px] h-[18px] rounded-lg" />
                        </div>
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-[16px] h-[16px] rounded-lg" />
                            <Skeleton className="w-[16px] h-[16px] rounded-lg" />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 items-center p-4 w-full gap-2">
                        {/* テーブルヘッダー */}
                        <Skeleton className="w-[50px] h-[20px] rounded-lg"/>
                        <Skeleton className="w-[50px] h-[20px] rounded-lg"/>
                        <Skeleton className="w-[50px] h-[20px] rounded-lg"/>
                        {/* テーブルボディ */}
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-[20px] h-[20px] rounded-lg" />
                            <Skeleton className="w-[18px] h-[18px] rounded-lg" />
                            <Skeleton className="w-[32px] h-[32px] rounded-full" />
                            <Skeleton className="w-[100px] h-[20px] rounded-lg"/>
                        </div>
                        <Skeleton className="w-full max-w-[200px] h-[20px] rounded-lg" />
                        <Skeleton className="w-full max-w-[131px] h-[20px] rounded-lg" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-[20px] h-[20px] rounded-lg" />
                            <Skeleton className="w-[18px] h-[18px] rounded-lg" />
                            <Skeleton className="w-[32px] h-[32px] rounded-full" />
                            <Skeleton className="w-[100px] h-[20px] rounded-lg"/>
                        </div>
                        <Skeleton className="w-full max-w-[200px] h-[20px] rounded-lg" />
                        <Skeleton className="w-full max-w-[131px] h-[20px] rounded-lg" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-[20px] h-[20px] rounded-lg" />
                            <Skeleton className="w-[18px] h-[18px] rounded-lg" />
                            <Skeleton className="w-[32px] h-[32px] rounded-full" />
                            <Skeleton className="w-[100px] h-[20px] rounded-lg"/>
                        </div>
                        <Skeleton className="w-full max-w-[200px] h-[20px] rounded-lg" />
                        <Skeleton className="w-full max-w-[131px] h-[20px] rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function DataTableSkelton() {
    return (
        <Card className="flex flex-col w-full h-[704px] rouded-lg">
            <DataTableRowsSkelton />
            <DataTableRowsSkelton />
            <DataTableRowsSkelton />
            <DataTableRowsSkelton />
            <DataTableRowsSkelton />
        </Card>
    );
}

export function ScheduleSkelton() {
    return (
        <Card className="flex flex-col p-4 gap-4 w-full h-[660px] rouded-lg">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="w-[95px] h-[32px]" />
                <Skeleton className="w-full h-[500px]" />
            </div>
            <div className="flex justify-between items-center gap-3">
                <div className="flex flex-col gap-2">
                    <Skeleton className="w-[154px] h-[30px] sm:w-[192px]"/>
                    <div className="flex justify-between items-center gap-2">
                        <Skeleton className="w-[58px] h-[24px]"/>
                        <Skeleton className="w-[58px] h-[24px]"/>
                    </div>
                </div>
                <Skeleton className="w-[130px] h-[40px] rounded-md" />
            </div>
        </Card>
    );
}