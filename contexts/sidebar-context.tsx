'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

const SidebarContext = createContext<boolean>(false);

export const SidebarProvider = ({ 
    children,
    isCollapsed
}: { 
    children: ReactNode,
    isCollapsed: boolean
}) => {
    const [sidebarState, setSidebarState] = useState(isCollapsed);
    return (
        <SidebarContext value={sidebarState}>
            {children}
        </SidebarContext>
    );
};

export const useSidebarState = () => {
    const context = useContext(SidebarContext);
    return context;
};