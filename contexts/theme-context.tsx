'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

const ThemeContext = createContext<string>("light");

export const ThemeProvider = ({ 
    children,
    theme
}: { 
    children: ReactNode,
    theme: string
}) => {
    const [currentTheme, setCurrentEmail] = useState(theme);
    return (
        <ThemeContext value={currentTheme}>
            {children}
        </ThemeContext>
    );
};

export const useCurrentTheme = () => {
    const context = useContext(ThemeContext);
    return context;
};