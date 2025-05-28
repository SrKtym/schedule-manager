export default function AuthLayout({children}: {children: React.ReactNode}) {
    return (
        <main className='flex items-center justify-center h-screen bg-gradient-to-r from-purple-400 to-pink-400'>
            <div className="w-full max-w-[480px] m-auto p-4">
                {children}
            </div>
        </main>
    );
}