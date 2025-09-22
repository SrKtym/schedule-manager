'use client';

import { fetchAnnouncement } from '@/utils/fetch';
import React, { createContext, useContext, useState, ReactNode } from 'react';

const AnnouncementContext = createContext<Awaited<ReturnType<typeof fetchAnnouncement>>>([]);

export const AnnouncementProvider = ({ 
    children,
    announcement
}: { 
    children: ReactNode,
    announcement: Awaited<ReturnType<typeof fetchAnnouncement>>
}) => {
    const [currentAnnouncement, setCurrentAnnouncement] = useState(announcement);
    return (
        <AnnouncementContext value={currentAnnouncement}>
            {children}
        </AnnouncementContext>
    );
};

export const useCurrentAnnouncement = () => {
    const context = useContext(AnnouncementContext);
    return context;
};