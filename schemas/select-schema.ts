import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod/v4';
import { 
    assignmentStatus, 
    attachmentMetaData, 
    registered, 
    submissionMetaData 
} from '@/lib/drizzle/schema/public';

export const selectRegisteredSchema = createSelectSchema(registered, {
    // registeredテーブルのemailフィールドの型を上書き
    email: z.email()
});

export const selectAssignmentStatusSchema = createSelectSchema(assignmentStatus);
export const selectAttachmentMetaDataSchema = createSelectSchema(attachmentMetaData);
export const selectSubmissionMetaDataSchema = createSelectSchema(submissionMetaData);


