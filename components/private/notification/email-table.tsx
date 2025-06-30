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
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Message } from "@/lib/definitions";

export function EmailTable({
    messages,
    ref
}: {
    messages: Message[],
    ref: React.RefObject<Message | null>
}) {
    const [open, setOpen] = useState<boolean>(false);
    const router = useRouter();
    const getMessagesById = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
        const filtered = messages.filter(message => 
            message.id === e.currentTarget.getAttribute("data-key")
        );
        ref.current = filtered[0];
        setOpen(true);
    } 

    return (
        // メール一覧
        <div className="w-full h-full grid grid-col overflow-auto">
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
                            <Icon 
                                icon="lucide:refresh-cw"
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
                            onPress={() => {}}
                        >
                            <Icon 
                                icon="lucide:mail-open"
                                width={18}
                                height={18}
                                className="text-default-500" 
                            />
                        </Button>
                    </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                    <Icon 
                        icon="lucide:chevron-left" 
                        className="text-default-500" 
                    />
                    <Icon 
                        icon="lucide:chevron-right" 
                        className="text-default-500" 
                    />
                </div>
            </div>
            <Table
                removeWrapper 
                aria-label="Email inbox"
                classNames={{
                    th: "bg-transparent",
                    td: "py-3",
                }}
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
                    {messages.map((message) => (
                        <TableRow 
                            key={message.id}
                            onClick={getMessagesById}
                            className={cn("hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer",
                                message.is_read ? "bg-content1" : "bg-content2")}
                        >
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Checkbox aria-label="checkbox"/>
                                    <Icon 
                                        icon="lucide:star"
                                        width={18}
                                        height={18}
                                        className={message.is_read ? "text-warning" : "text-default-400"}
                                    />
                                    <Avatar 
                                        name={message.sender_email} 
                                        size="sm" 
                                    />
                                    <span>
                                        {message.sender_email}
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
                                        color={message.is_read ? "default" : "primary"}
                                    >
                                        {message.created_at}
                                    </Chip>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* メールモーダル */}
                <Modal
                    isOpen={open}
                    onOpenChange={setOpen}    
                >
                    <ModalContent>
                        <ModalHeader className="flex flex-col space-y-2">
                            <h1 className="text-2xl">{ref.current?.subject}</h1>
                            <p className="text-sm">From: {ref.current?.sender_email}</p>
                        </ModalHeader>
                        <ModalBody>
                            {ref.current?.body}
                        </ModalBody>
                        <ModalFooter>
                            {ref.current?.created_at}
                        </ModalFooter>
                    </ModalContent>
                </Modal>     
        </div>
    );
}