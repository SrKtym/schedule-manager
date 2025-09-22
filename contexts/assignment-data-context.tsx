'use client';

import { fetchAssignment } from '@/utils/fetch';
import React, { createContext, useContext, useState, ReactNode } from 'react';

const AssignmentDataContext = createContext<Awaited<ReturnType<typeof fetchAssignment>> | null>(null);

export const AssignmentDataProvider = ({ 
    children,
    assignmentData
}: { 
    children: ReactNode,
    assignmentData: Awaited<ReturnType<typeof fetchAssignment>> | null
}) => {
    const [currentAssignmentData, setCurrentAssignmentData] = useState(assignmentData);
    return (
        <AssignmentDataContext value={currentAssignmentData}>
            {children}
        </AssignmentDataContext>
    );
};

export const useCurrentAssignmentData = (assignmentId?: string) => {
    const {assignmentData, attachmentMetaData} = useContext(AssignmentDataContext) ?? {};

    if (!assignmentId) {
        return {assignmentData, attachmentMetaData};
    } else {
        const currentAssignment = assignmentData?.find(
            assignment => assignment.id === assignmentId
        );
        const currentAttachmentMetaData = attachmentMetaData?.filter(
            metaData => currentAssignment?.attachmentsMetaDataIds?.includes(metaData.id)
        );
        return {currentAssignment, currentAttachmentMetaData};
    }
};