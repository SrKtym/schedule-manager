import { Overall } from "@/components/home/course-list/course/overall";
import { RegisteredCourseProvider } from "@/contexts/registered-course-context";
import { 
    getSession, 
    fetchRegisteredCourseData, 
    fetchAssignment, 
    fetchAnnouncement,
    fetchMemberList 
} from "@/utils/fetch";
import { AssignmentDataProvider } from "@/contexts/assignment-data-context";
import { AnnouncementProvider } from "@/contexts/announcement-context";
import { MemberProvider } from "@/contexts/member-context";

export default async function CoursePage(props: {
    params: Promise<{
        course: string
    }>
}) {
    const session = await getSession();
    const paramsValue = await props.params;
    const courseName = paramsValue.course;
    const decodedCourseName = decodeURIComponent(courseName);
    const [courseDataList, assignment, announcement, memberList] = await Promise.allSettled([
        fetchRegisteredCourseData(session),
        fetchAssignment(decodedCourseName),
        fetchAnnouncement(decodedCourseName),
        fetchMemberList(decodedCourseName)
    ]);
    const courseDataListValue = courseDataList.status === 'fulfilled' ? courseDataList.value : [];
    const assignmentValue = assignment.status === 'fulfilled' ? assignment.value : null;
    const announcementValue = announcement.status === 'fulfilled' ? announcement.value : [];
    const memberListValue = memberList.status === 'fulfilled' ? memberList.value : [];

    return (
        <RegisteredCourseProvider
            courseDataList={courseDataListValue} 
            courseName={decodedCourseName}
        >
            <AssignmentDataProvider assignmentData={assignmentValue}>
                <AnnouncementProvider announcement={announcementValue}>
                    <MemberProvider memberList={memberListValue}>
                        <Overall />
                    </MemberProvider>
                </AnnouncementProvider>
            </AssignmentDataProvider>
        </RegisteredCourseProvider>
    );
}