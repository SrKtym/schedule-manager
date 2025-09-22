import { getSession } from "@/utils/fetch";
import { getThemeCookie } from "@/utils/fetch";
import { CustomNavbar } from "@/components/home/navbar";
import { ThemeProvider } from "@/contexts/theme-context";
import { UserDataProvider, UserData } from "@/contexts/user-data-context";


export default async function HomeLayout({children}: {children: React.ReactNode}) {
    const session = await getSession();
    
    if (session) {
        const userData: UserData = session.user;
        const theme = await getThemeCookie();

        return (
            <UserDataProvider userData={userData}>
                <ThemeProvider theme={theme}>
                    <CustomNavbar
                        name={session.user.name} 
                        image={session.user.image} 
                    />
                </ThemeProvider>
                <main className="w-full">
                    {children}
                </main>
                <footer className="flex justify-center w-full px-3 py-5">
                    フッター
                </footer>
            </UserDataProvider>
        );
    }
}
