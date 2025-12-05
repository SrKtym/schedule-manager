'use client';

import { fetchAssignmentData } from '@/utils/getters/main';
import React, { createContext, useContext, useState, ReactNode } from 'react';

const AssignmentDataContext = createContext<Awaited<ReturnType<typeof fetchAssignmentData>> | null>(null);

export const AssignmentDataProvider = ({ 
    children,
    assignmentData
}: { 
    children: ReactNode,
    assignmentData: Awaited<ReturnType<typeof fetchAssignmentData>> | null
}) => {
    const [currentAssignmentData, setCurrentAssignmentData] = useState(assignmentData);
    return (
        <AssignmentDataContext value={currentAssignmentData}>
            {children}
        </AssignmentDataContext>
    );
};

export const useAssignmentData = () => {
    const assignmentDataList = useContext(AssignmentDataContext);
    return assignmentDataList;
};

export const useCurrentAssignmentData = (assignmentId: string) => {
    const assignmentDataList = useContext(AssignmentDataContext);
    const currentAssignment = assignmentDataList?.find(
        ({assignmentAttachmentMetaDataIds}) => assignmentAttachmentMetaDataIds.some(
            ({assignmentId: id}) => id === assignmentId
        )
    );
    return currentAssignment;
}