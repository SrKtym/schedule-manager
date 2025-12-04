import { fetchSession } from "@/utils/getters/auth";
import { fetchThemeCookie } from "@/utils/getters/main";
import { CustomNavbar } from "@/components/home/navbar";
import { ThemeProvider } from "@/contexts/theme-context";
import { UserDataProvider, UserData } from "@/contexts/user-data-context";

export default async function HomeLayout({children}: {children: React.ReactNode}) {
    const session = await fetchSession();
    
    if (session) {
        const userData: UserData = session.user;
        const theme = await fetchThemeCookie();

        return (
            <UserDataProvider userData={userData}>
                <ThemeProvider theme={theme}>
                    <CustomNavbar
                        name={session.user.name} 
                        image={session.user.image} 
                        email={session.user.email}
                    />
                </ThemeProvider>
                <main className="w-full min-h-screen">
                    {children}
                </main>
            </UserDataProvider>
        );
    }
}
