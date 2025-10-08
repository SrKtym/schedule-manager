'use client';

import { fetchMemberList } from '@/utils/getter';
import React, { createContext, useContext, useState, ReactNode } from 'react';

const MemberContext = createContext<Awaited<ReturnType<typeof fetchMemberList>>>([]);

export const MemberProvider = ({ 
    children,
    memberList
}: { 
    children: ReactNode,
    memberList: Awaited<ReturnType<typeof fetchMemberList>>
}) => {
    const [currentMemberList, setCurrentMemberList] = useState(memberList);
    return (
        <MemberContext value={currentMemberList}>
            {children}
        </MemberContext>
    );
};

export const useCurrentMemberList = () => {
    const context = useContext(MemberContext);
    return context;
};