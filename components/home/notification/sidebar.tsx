import { 
    Button,
    Chip,
    Tooltip,
    cn
} from "@heroui/react";
import { Plus } from "lucide-react";
import { sidebarItems } from "@/constants/definitions";
import { useMessages } from "@/contexts/messages-context";

export function Sidebar({isCollapsed}: {isCollapsed: boolean}) {
    const messageList = useMessages();
    return (
        <div className={cn("flex flex-col items-center p-4 z-10 border-r border-divider transition-all duration-300",
            isCollapsed ? "w-15 max-sm:-ml-15" : "w-80 max-sm:-ml-80 max-sm:translate-x-80"
        )}>
            <Button
                isIconOnly={isCollapsed}
                className={cn("mb-2",
                    isCollapsed ? undefined : "w-full justify-start"
                )}
                color="primary" 
                startContent={
                    <Plus 
                        width={18}
                        height={18}
                    />
                }
                aria-label="作成"
            >
                {!isCollapsed && "作成"}
            </Button>
            {sidebarItems.map((item) => (
                <Tooltip 
                    key={item.label}
                    color="foreground"
                    content={item.label}
                    placement="right"
                    className={isCollapsed ? undefined : "hidden"}
                >
                    <Button
                        isIconOnly={isCollapsed}
                        key={item.label}
                        variant="light"
                        className={cn("mb-2",
                            isCollapsed ? undefined : "w-full justify-start"
                        )}
                        aria-label={item.label}
                    >
                        <item.icon 
                            width={18}
                            height={18}
                            className={isCollapsed ? "mr-0.5" : "mr-2"}
                        />
                        {!isCollapsed && item.label}
                        {item.label === "受信トレイ" 
                        && messageList.some(message => !message.isRead)
                        ? <Chip 
                            size="sm"
                            color="primary"
                        >
                            {messageList.filter(message => !message.isRead).length}
                        </Chip>
                        : null}
                    </Button>
                </Tooltip>
            ))}
        </div>
    );
}