'use client';

import { fetchSubmissionData } from '@/utils/getters/main';
import React, { createContext, useContext, useState, ReactNode } from 'react';

const SubmissionContext = createContext<Awaited<ReturnType<typeof fetchSubmissionData>> | null>(null);

export const SubmissionProvider = ({ 
    children,
    submissionMetaData
}: { 
    children: ReactNode,
    submissionMetaData: Awaited<ReturnType<typeof fetchSubmissionData>> | null
}) => {
    const [currentSubmissionMetaData, setCurrentSubmissionMetaData] = useState(submissionMetaData);
    return (
        <SubmissionContext value={currentSubmissionMetaData}>
            {children}
        </SubmissionContext>
    );
};

export const useSubmissionData = () => {
    const context = useContext(SubmissionContext);
    return context;
}