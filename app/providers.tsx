'use client';

import { HeroUIProvider, ToastProvider } from "@heroui/react";

export function Providers({children}: {children: React.ReactNode}) {
    return (
        <HeroUIProvider locale="ja-JP">
            <ToastProvider placement="top-center"/>
            {children}
        </HeroUIProvider>
    )
}