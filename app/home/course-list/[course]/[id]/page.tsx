import { Overall } from "@/components/home/course-list/course/id/overall";
import { AssignmentStatusProvider } from "@/contexts/assignment-status-context";
import { SubmissionProvider } from "@/contexts/submission-context";
import { fetchAssignmentStatus, fetchSubmissionMetaData, fetchComments } from "@/utils/fetch";
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
    const assignmentStatus = await fetchAssignmentStatus(assignmentId);
    const submissionMetaData = await fetchSubmissionMetaData(assignmentId);
    const comments = await fetchComments(assignmentId);

    return (
        <AssignmentStatusProvider assignmentStatus={assignmentStatus}>
            <SubmissionProvider submissionMetaData={submissionMetaData}>
                <CommentProvider comment={comments}>
                    <Overall />
                </CommentProvider>
            </SubmissionProvider>
        </AssignmentStatusProvider>
    );
}