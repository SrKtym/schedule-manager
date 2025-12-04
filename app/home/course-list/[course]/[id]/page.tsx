import { Overall } from "@/components/home/course-list/course/id/overall";
import { SubmissionProvider } from "@/contexts/submission-context";
import { fetchSubmissionData, fetchComments, fetchAssignmentData } from "@/utils/getters/main";
import { CommentProvider } from "@/contexts/comment-context";
import { fetchSession } from "@/utils/getters/auth";
import { AssignmentDataProvider } from "@/contexts/assignment-data-context";

export default async function AssignmentDetailPage(
    props: {
        params: Promise<{
            course: string;
            id: string
        }>
    }
) {
    const session = await fetchSession();
    const {course, id} = await props.params;
    const [assignmentData, submissionData, comments] = await Promise.allSettled([
        fetchAssignmentData(session, [course]),
        fetchSubmissionData(session, id),
        fetchComments(id)
    ]);
    const assignmentDataValue = assignmentData.status === 'fulfilled' ? assignmentData.value : null;
    const submissionDataValue = submissionData.status === 'fulfilled' ? submissionData.value : null;
    const commentsValue = comments.status === 'fulfilled' ? comments.value : [];

    return (
        <AssignmentDataProvider assignmentData={assignmentDataValue}>
            <SubmissionProvider submissionMetaData={submissionDataValue}>
                <CommentProvider comment={commentsValue}>
                    <Overall />
                </CommentProvider>
            </SubmissionProvider>
        </AssignmentDataProvider>
    );
}