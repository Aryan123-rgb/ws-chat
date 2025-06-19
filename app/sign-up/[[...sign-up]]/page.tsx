import { SignUp } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Page() {
    const { userId } = await auth();
    if (userId) {
        redirect('/dashboard/public-chat');
    }
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <SignUp />
            </div>
        </div>
    )
}