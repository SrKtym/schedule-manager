import { Radio, cn } from "@heroui/react";
import { type ReactNode } from "react";


export function CustomRadio({
    children,
    description, 
    value
}: {
    children: ReactNode,
    description: ReactNode,
    value: 'valid' | 'invalid'
}) {
    return (
        <Radio className={
            cn( "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-default",
                "data-[selected=true]:border-primary")
            }
            value={value}
            description={description}
        >
            {children}
        </Radio>
    );
}