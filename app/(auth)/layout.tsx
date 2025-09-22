export default function AuthLayout({children}: {children: React.ReactNode}) {
    return (
        <main className='flex items-center justify-center min-h-screen bg-gradient-to-b from-purple-200 to-gray-200'>
            <div className="w-full max-w-[480px] p-4">
                {children}
            </div>
        </main>
    );
}