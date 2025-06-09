"use client"
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
    return (
        <nav className="bg-gray-800 border-b border-gray-700">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-white">
                            TechTalk
                        </h1>
                    </div>
                    <div className="flex items-center space-x-8">
                        <Link href="/dashboard/public-chat" className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                            Public Rooms
                        </Link>
                        <Link href="/dashboard/private-chat" className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                            Private Rooms
                        </Link>
                        <Link href="/dashboard/one-to-one-chat" className="text-gray-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                            DMs
                        </Link>
                        <UserButton />
                    </div>
                </div>
            </div>
        </nav>
    )
}