"use client";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import Navbar from "@/components/Navbar";
import { UserInterface } from "@/types/message";
import { useSession } from "next-auth/react";
import { showToast } from "@/lib/toast";
import { useUser } from "@clerk/nextjs";



export default function Home() {
    const router = useRouter();
    const { isLoaded, isSignedIn, user } = useUser();
    const [loading, setLoading] = useState<boolean>(false);
    const [users, setUsers] = useState<UserInterface[]>([]);
    const userId = user?.id;

    const fetchUsers = async () => {
        const res = await axios.get('/api/user', {
            withCredentials: true,
        });
        const fetchedUsers: UserInterface[] = res.data;
        const filteredUsers = fetchedUsers.filter((user) => user.id != userId);
        setUsers(filteredUsers);
    }

    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn) {
            showToast("Unexpected error occurend", 'error');
            return;
        }
        fetchUsers();
    }, [isSignedIn, isLoaded]);

    const handleStartChat = async (id: string) => {
        if (!id || !userId) {
            showToast("Unexpected error occured", 'error');
            return;
        }
        try {
            setLoading(true);
            const res = await axios.post('/api/room/join-room-dm', {
                userId1: userId,
                userId2: id
            }, {
                withCredentials: true
            })
            const roomId = res.data?.room?.id;
            router.push(`/room/${roomId}`);
            setLoading(false);
        } catch (e) {
            console.log("error creating one to one room", e);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <Navbar />

            <main className="max-w-6xl mx-auto p-6 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search users..."
                            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus-visible:ring-blue-500"
                        />
                    </div>
                </div>

                {users.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="bg-gray-800 p-6 rounded-full mb-4">
                            <User className="h-12 w-12 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-200 mb-2">No users found</h3>
                        <p className="text-gray-400 max-w-md">
                            Start chatting with other users by searching above
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <Card
                                key={user.id}
                                className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors duration-200"
                            >
                                <CardHeader>
                                    <div className="flex items-center gap-4">
                                        <User className="h-8 w-8 text-gray-400" />
                                        <div>
                                            <CardTitle className="text-white">{user.name}</CardTitle>
                                            <CardDescription className="text-gray-400">
                                                {user.email}
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex justify-between items-center">
                                        <Button
                                            onClick={() => handleStartChat(user.id)}
                                            variant="outline"
                                            className="border-blue-500 text-blue-400 hover:bg-blue-900/50 hover:text-blue-300 cursor-pointer"
                                        >
                                            {loading ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <></>
                                            )}
                                            Start Chat
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
