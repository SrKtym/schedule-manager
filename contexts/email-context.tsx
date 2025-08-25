'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

const EmailContext = createContext<string>("");

export const EmailProvider = ({ 
    children,
    email
}: { 
    children: ReactNode,
    email: string
}) => {
    const [sessionEmail, setSessionEmail] = useState(email);
    return (
        <EmailContext value={sessionEmail}>
            {children}
        </EmailContext>
    );
};

export const useSessionEmail = () => {
    const context = useContext(EmailContext);
    return context;
};
