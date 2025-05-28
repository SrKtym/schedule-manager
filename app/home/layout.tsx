import { getSession } from "@/lib/fetch";
import { getTheme } from "@/lib/fetch";
import { CustomNavbar } from "@/components/private/navbar";


export default async function HomeLayout({children}: {children: React.ReactNode}) {
    const session = await getSession();
    
    if (session) {
        const user = session.user;
        const name = user.name;
        const image = user.image;
        const email = user.email;
        const theme = await getTheme();

        return (
            <div>
                <CustomNavbar 
                    theme={theme} 
                    name={name} 
                    image={image} 
                    email={email}
                />
                <main className='w-full p-3'>
                    {children}
                </main>
            </div>
        );
    }
}
