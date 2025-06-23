import { getSession } from "@/lib/fetch";
import { getThemeCookie } from "@/lib/fetch";
import { CustomNavbar } from "@/components/private/navbar";


export default async function HomeLayout({children}: {children: React.ReactNode}) {
    const session = await getSession();
    
    if (session) {
        const theme = await getThemeCookie();

        return (
            <div>
                <CustomNavbar
                    theme={theme}
                    name={session.user.name} 
                    image={session.user.image} 
                    email={session.user.email}
                />
                <main className="w-full p-3">
                    {children}
                </main>
                <footer className="flex justify-center w-full px-3 py-10">
                    フッター
                </footer>
            </div>
        );
    }
}
