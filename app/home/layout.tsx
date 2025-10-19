import { 
    fetchRegisteredCourseData, 
    fetchAssignmentData, 
    fetchAnnouncement, 
    fetchSession, 
    fetchThemeCookie 
} from "@/utils/getter";
import { CustomNavbar } from "@/components/home/navbar";
import { ThemeProvider } from "@/contexts/theme-context";
import { UserDataProvider, UserData } from "@/contexts/user-data-context";
import { RegisteredCourseProvider } from "@/contexts/registered-course-context";
import { AssignmentDataProvider } from "@/contexts/assignment-data-context";
import { AnnouncementProvider } from "@/contexts/announcement-context";
import { BackToTopButton } from "@/components/home/back-to-top-button";

export default async function HomeLayout({children}: {children: React.ReactNode}) {
    const session = await fetchSession();
    
    if (session) {
        const userData: UserData = session.user;
        const courseDataList = await fetchRegisteredCourseData(session);
        const courseNameList = courseDataList.map(({course}) => course.name);
        const [theme, assignmentData, announcementData] = await Promise.allSettled([
            fetchThemeCookie(),
            fetchAssignmentData(courseNameList),
            fetchAnnouncement(courseNameList)
        ]);
        const themeValue = theme.status === 'fulfilled' ? theme.value : 'light';
        const assignmentDataValue = assignmentData.status === 'fulfilled' ? assignmentData.value : null;
        const announcementDataValue = announcementData.status === 'fulfilled' ? announcementData.value : [];

        return (
            <UserDataProvider userData={userData}>
                <ThemeProvider theme={themeValue}>
                    <CustomNavbar
                        name={session.user.name} 
                        image={session.user.image} 
                    />
                </ThemeProvider>
                <RegisteredCourseProvider courseDataList={courseDataList}>
                    <AssignmentDataProvider assignmentData={assignmentDataValue}>
                        <AnnouncementProvider announcement={announcementDataValue}>
                            <main className="w-full min-h-screen">
                                {children}
                            </main>
                        </AnnouncementProvider>
                    </AssignmentDataProvider>
                </RegisteredCourseProvider>
                <footer className="flex flex-col items-center justify-center pt-5">
                    <BackToTopButton />
                    <p className="w-full text-center text-tiny text-white bg-gray-700 px-3 py-5">
                        Copyright © 2025 Schedule Manager All rights reserved.
                    </p>
                </footer>
            </UserDataProvider>
        );
    }
}
