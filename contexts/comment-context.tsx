'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { fetchComments } from '@/utils/getters/main';

const CommentContext = createContext<Awaited<ReturnType<typeof fetchComments>>>([]);

export const CommentProvider = ({ 
    children,
    comment
}: { 
    children: ReactNode,
    comment: Awaited<ReturnType<typeof fetchComments>>
}) => {
    const [currentComment, setCurrentComment] = useState(comment);
    
    return (
        <CommentContext value={currentComment}>
            {children}
        </CommentContext>
    );
};

export const useCurrentComment = () => {
    const context = useContext(CommentContext);
    return context;
};