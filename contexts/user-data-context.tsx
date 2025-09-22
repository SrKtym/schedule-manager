'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserData = {
    email: string;
    image?: string | null;
    name: string;
    role?: string | null;
    twoFactorEnabled?: boolean | null;
}

const UserDataContext = createContext<UserData>({
    email: "",
    name: ""
});

export const UserDataProvider = ({ 
    children,
    userData
}: { 
    children: ReactNode,
    userData: UserData
}) => {
    const [user, setUser] = useState<UserData>(userData);

    return (
        <UserDataContext value={user}>
            {children}
        </UserDataContext>
    );
};

export const useSessionUserData = () => {
    const context = useContext(UserDataContext);
    return context;
};
