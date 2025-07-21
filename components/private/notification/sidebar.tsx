import { 
    Button,
    Chip,
    Tooltip,
    cn
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { sidebarItems } from "@/lib/definitions";
import type { Message } from "@/lib/definitions";

export function Sidebar({
    isCollapsed, 
    messages
}: {
    isCollapsed: boolean,
    messages: Message[]
}) {
    return (
        <div className={cn("flex flex-col items-center py-4 pr-4 border-r border-divider transition-all duration-300 sm:p-4",
            isCollapsed ? "w-15 max-sm:-ml-15" : "w-80"
        )}>
            <Button
                isIconOnly={isCollapsed}
                className={cn("mb-2",
                    isCollapsed ? "" : "w-full justify-start"
                )}
                color="primary" 
                startContent={
                    <Icon 
                        width={18}
                        height={18}
                        icon="lucide:plus"
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
                    className={cn(isCollapsed ? "" : "hidden")}
                >
                    <Button
                        isIconOnly={isCollapsed}
                        key={item.label}
                        variant="light"
                        className={cn("mb-2",
                            isCollapsed ? "" : "w-full justify-start"
                        )}
                        aria-label={item.label}
                    >
                        <Icon 
                            width={18}
                            height={18}
                            icon={item.icon}
                            className={cn(isCollapsed ? "mr-0.5" : "mr-2")}
                        />
                        {!isCollapsed && item.label}
                        {item.label === "受信トレイ" 
                        && messages.some(message => !message.isRead)
                        ? <Chip 
                            size="sm"
                            color="primary"
                        >
                            {messages.filter(message => !message.isRead).length}
                        </Chip>
                        : null}
                    </Button>
                </Tooltip>
            ))}
        </div>
    );
}