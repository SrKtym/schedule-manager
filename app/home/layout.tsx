import { getSession } from "@/utils/getter";
import { getThemeCookie } from "@/utils/getter";
import { CustomNavbar } from "@/components/home/navbar";
import { ThemeProvider } from "@/contexts/theme-context";
import { UserDataProvider, UserData } from "@/contexts/user-data-context";
import { RegisteredCourseProvider } from "@/contexts/registered-course-context";
import { fetchRegisteredCourseData } from "@/utils/getter";


export default async function HomeLayout({children}: {children: React.ReactNode}) {
    const session = await getSession();
    
    if (session) {
        const userData: UserData = session.user;
        const theme = await getThemeCookie();
        const registeredCourseData = await fetchRegisteredCourseData(session);

        return (
            <UserDataProvider userData={userData}>
                <ThemeProvider theme={theme}>
                    <CustomNavbar
                        name={session.user.name} 
                        image={session.user.image} 
                    />
                </ThemeProvider>
                <RegisteredCourseProvider courseDataList={registeredCourseData}>
                    <main className="w-full">
                        {children}
                    </main>
                </RegisteredCourseProvider>
                <footer className="flex justify-center w-full px-3 py-5">
                    フッター
                </footer>
            </UserDataProvider>
        );
    }
}
