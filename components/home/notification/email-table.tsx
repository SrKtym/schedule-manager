'use client'

import { 
    Avatar,
    Button,
    Checkbox,
    Chip,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Tooltip,
    cn
} from "@heroui/react";
import { 
    ChevronLeft, 
    ChevronRight,  
    MailOpen, 
    RefreshCw, 
    Star 
} from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { dateOptionforEmailTable } from "@/constants/definitions";
import { client } from "@/lib/hono/client";
import { useMessages } from "@/contexts/messages-context";
import { messages } from "@/lib/drizzle/schemas/main";
import { CustomPagination } from "../register/pagination";

export function EmailTable({isCollapsed}: {isCollapsed: boolean}) {
    const [open, setOpen] = useState<boolean>(false);
    const ref = useRef<typeof messages.$inferSelect | null>(null);
    const router = useRouter();
    const messageList = useMessages();
    const getMessagesById = async (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
        const found = messageList.find(message => 
            message.id === e.currentTarget.getAttribute("data-key")
        );
        if (found) {
            ref.current = found;
            
            // 既読に変更
            await client.api.messages.$patch({
                json: ref.current.id
            });
            setOpen(true);
        }
    } 

    return (
        // メール一覧
        <div className={cn("flex flex-col w-full border-r border-divider",
            isCollapsed ? "" : "max-sm:blur-lg"
        )}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div className="flex items-center gap-1">
                    <Checkbox aria-label="all-checkbox"/>
                    <Tooltip
                        key="refresh"
                        color="foreground"
                        content="更新"
                    >
                        <Button 
                            aria-label="refresh"
                            isIconOnly
                            key="refresh"
                            variant="light"
                            onPress={() => router.refresh()}
                        >
                            <RefreshCw 
                                width={18}
                                height={18}
                                className="text-default-500"
                            />
                        </Button>
                    </Tooltip>
                    <Tooltip
                        key="isread"
                        color="foreground"
                        content="既読にする"
                    >
                        <Button
                            aria-label="isread"
                            isIconOnly
                            key="isread"
                            variant="light"
                            onPress={async () => {

                            }}
                        >
                            <MailOpen 
                                width={18}
                                height={18}
                                className="text-default-500" 
                            />
                        </Button>
                    </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                    <ChevronLeft className="text-default-500"/>
                    <ChevronRight className="text-default-500"/>
                </div>
            </div>
            <div className="pb-4 z-0 flex flex-col relative h-full justify-between gap-4 bg-content1 overflow-auto w-full rounded-none">
                <Table
                    aria-label="Email inbox"
                    removeWrapper
                    classNames={{
                        th: "bg-transparent",
                        td: "py-3"
                    }}
                    bottomContent={
                        <CustomPagination totalPages={1} />
                    }
                >
                    <TableHeader>
                        <TableColumn>
                            From
                        </TableColumn>
                        <TableColumn>
                            件名
                        </TableColumn>
                        <TableColumn>
                            日時
                        </TableColumn>
                    </TableHeader>
                    <TableBody emptyContent="メールがありません">
                        {messageList.map((message) => (
                            <TableRow 
                                key={message.id}
                                onClick={getMessagesById}
                                className={cn("hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer",
                                    message.isRead ? "bg-content1" : "bg-content2")}
                            >
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Checkbox aria-label="checkbox"/>
                                        <Star 
                                            width={18}
                                            height={18}
                                            className={message.isRead ? "text-warning" : "text-default-400"}
                                        />
                                        <Avatar 
                                            name={message.sender} 
                                            size="sm" 
                                        />
                                        <span>
                                            {message.sender}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <span>
                                            {message.subject}
                                        </span>
                                        <span className="text-default-400">
                                            - {message.body}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-start gap-2">
                                        <Chip 
                                            size="sm" 
                                            variant="flat" 
                                            color={message.isRead ? "default" : "primary"}
                                        >
                                            {message.createdAt.toLocaleDateString('default', dateOptionforEmailTable)}
                                        </Chip>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* メール詳細 */}
            <Modal
                isOpen={open}
                onOpenChange={setOpen} 
                shouldBlockScroll={false}   
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col space-y-2">
                        <h1 className="text-2xl">
                            {ref.current?.subject}
                        </h1>
                        <p className="text-sm">
                            From: {ref.current?.sender}
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        {ref.current?.body}
                    </ModalBody>
                    <ModalFooter>
                        {ref.current?.createdAt.toLocaleDateString('default', dateOptionforEmailTable)}
                    </ModalFooter>
                </ModalContent>
            </Modal>     
        </div>
    );
}