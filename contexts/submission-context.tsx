'use client';

import { fetchSubmissionMetaData } from '@/utils/fetch';
import React, { createContext, useContext, useState, ReactNode } from 'react';

const SubmissionContext = createContext<Awaited<ReturnType<typeof fetchSubmissionMetaData>> | null>(null);

export const SubmissionProvider = ({ 
    children,
    submissionMetaData
}: { 
    children: ReactNode,
    submissionMetaData: Awaited<ReturnType<typeof fetchSubmissionMetaData>>
}) => {
    const [currentSubmissionMetaData, setCurrentSubmissionMetaData] = useState(submissionMetaData);
    return (
        <SubmissionContext value={currentSubmissionMetaData}>
            {children}
        </SubmissionContext>
    );
};

export const useCurrentSubmissionMetaData = () => {
    const context = useContext(SubmissionContext);
    return context;
}