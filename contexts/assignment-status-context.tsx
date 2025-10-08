'use client';

import { fetchAssignmentStatus } from '@/utils/getter';
import React, { createContext, useContext, useState, ReactNode } from 'react';

const AssignmentStatusContext = createContext<Awaited<ReturnType<typeof fetchAssignmentStatus>>>([]);

export const AssignmentStatusProvider = ({ 
    children,
    assignmentStatus
}: { 
    children: ReactNode,
    assignmentStatus: Awaited<ReturnType<typeof fetchAssignmentStatus>>
}) => {
    const [currentAssignmentStatus, setCurrentAssignmentStatus] = useState(assignmentStatus);
    return (
        <AssignmentStatusContext value={currentAssignmentStatus}>
            {children}
        </AssignmentStatusContext>
    );
};

export const useCurrentAssignmentStatus = () => {
    const context = useContext(AssignmentStatusContext);
    return context;
};