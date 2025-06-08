"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const session = useSession();
    const router = useRouter();

    const handleLogOut = () => {
        signOut();
        router.push('/');
    }

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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="flex items-center rounded-full px-3 py-2 bg-gray-800 hover:bg-gray-700 cursor-pointer"
                                >
                                    <User className="h-4 w-4 text-gray-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700">
                                <div className="flex flex-col space-y-4 p-4 border-b border-gray-700">
                                    <div className="flex items-center justify-between space-x-4">
                                        {session.status == 'authenticated' && <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none text-white">{session.data?.user?.name || ""}</p>
                                            <p className="text-xs leading-none text-gray-400">
                                                {session.data?.user?.email || ""}
                                            </p>
                                        </div>}
                                    </div>
                                </div>
                                <DropdownMenuItem onClick={handleLogOut} className="cursor-pointer bg-gray-800 hover:bg-gray-700">
                                    <LogOut className="mr-2 h-4 w-4 text-gray-400" />
                                    <span>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </nav>
    )
}