import { SignUp } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <SignUp />
            </div>
        </div>
    )
}