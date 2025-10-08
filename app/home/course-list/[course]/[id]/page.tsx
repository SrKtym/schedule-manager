import { Overall } from "@/components/home/course-list/course/id/overall";
import { AssignmentStatusProvider } from "@/contexts/assignment-status-context";
import { SubmissionProvider } from "@/contexts/submission-context";
import { fetchAssignmentStatus, fetchSubmissionMetaData, fetchComments } from "@/utils/getter";
import { CommentProvider } from "@/contexts/comment-context";

export default async function AssignmentDetailPage(
    props: {
        params: Promise<{
            id: string
        }>
    }
) {
    const paramsValue = await props.params;
    const assignmentId = paramsValue.id;
    const [assignmentStatus, submissionMetaData, comments] = await Promise.allSettled([
        fetchAssignmentStatus(assignmentId),
        fetchSubmissionMetaData(assignmentId),
        fetchComments(assignmentId)
    ]);
    const assignmentStatusValue = assignmentStatus.status === 'fulfilled' ? assignmentStatus.value : [];
    const submissionMetaDataValue = submissionMetaData.status === 'fulfilled' ? submissionMetaData.value : null;
    const commentsValue = comments.status === 'fulfilled' ? comments.value : [];

    return (
        <AssignmentStatusProvider assignmentStatus={assignmentStatusValue}>
            <SubmissionProvider submissionMetaData={submissionMetaDataValue}>
                <CommentProvider comment={commentsValue}>
                    <Overall />
                </CommentProvider>
            </SubmissionProvider>
        </AssignmentStatusProvider>
    );
}