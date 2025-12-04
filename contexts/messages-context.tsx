'use client';

import { messages } from '@/lib/drizzle/schemas/main';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

const MessagesContext = createContext<typeof messages.$inferSelect[]>([]);

export const MessagesProvider = ({ 
    children,
    messageList,
    email
}: { 
    children: ReactNode,
    messageList: typeof messages.$inferSelect[]
    email: string
}) => {
    const [msgList, setMsgList] = useState(messageList);

    // useEffect(() => {
    //     const channel = supabase
    //         .channel('inbox')
    //         .on(
    //             'postgres_changes',
    //             {
    //                 event: 'INSERT',
    //                 schema: 'public',
    //                 table: 'messages',
    //                 filter: `receiver_email=eq.${email}`,
    //             },
    //             (payload) => {
    //                 const newMessage = payload.new as typeof messages.$inferSelect;
    //                 setMsgList(prevMessages => [...prevMessages, newMessage]);
    //             }
    //         )
    //         .subscribe();


    //     return () => {
    //         supabase.removeChannel(channel)
    //     }
    // }, [messageList]);

    return (
        <MessagesContext value={msgList}>
            {children}
        </MessagesContext>
    );
};

export const useMessages = () => {
    const context = useContext(MessagesContext);
    return context;
};