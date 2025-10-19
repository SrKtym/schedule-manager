import { Overall } from "@/components/home/course-list/course/overall";
import { 
    fetchAssignmentData, 
    fetchAnnouncement,
    fetchMemberList 
} from "@/utils/getter";
import { AssignmentDataProvider } from "@/contexts/assignment-data-context";
import { AnnouncementProvider } from "@/contexts/announcement-context";
import { MemberProvider } from "@/contexts/member-context";

export default async function CoursePage(props: {
    params: Promise<{
        course: string
    }>
}) {
    const paramsValue = await props.params;
    const courseName = paramsValue.course;
    const decodedCourseName = decodeURIComponent(courseName);
    const [assignment, announcement, memberList] = await Promise.allSettled([
        fetchAssignmentData([decodedCourseName]),
        fetchAnnouncement([decodedCourseName]),
        fetchMemberList(decodedCourseName)
    ]);
    const assignmentValue = assignment.status === 'fulfilled' ? assignment.value : null;
    const announcementValue = announcement.status === 'fulfilled' ? announcement.value : [];
    const memberListValue = memberList.status === 'fulfilled' ? memberList.value : [];

    return (
        <AssignmentDataProvider assignmentData={assignmentValue}>
            <AnnouncementProvider announcement={announcementValue}>
                <MemberProvider memberList={memberListValue}>
                    <Overall courseName={decodedCourseName} />
                </MemberProvider>
            </AnnouncementProvider>
        </AssignmentDataProvider>
    );
}