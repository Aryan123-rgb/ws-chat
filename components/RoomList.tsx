import { useState } from "react";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import axios from "axios";
import NoRoomMsg from "./NoRoomMsg";

interface Room {
    id: string;
    name: string;
    description: string;
    membersCount: number;
}

export default function RoomList({ rooms }: { rooms: Room[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);

    const handleJoinRoom = async (id: string) => {
        setLoading(true);
        try {
            await axios.post('/api/room/join-room', {
                roomId: id,
            }, {
                withCredentials: true,
            })
            router.push(`/room/${id}`);
        } catch (e) {
            console.log("Error joining room", e);
        }
        setLoading(false);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms && rooms.length === 0 ? (
                <NoRoomMsg />
            ) : (
                rooms.map((room) => (
                    <Card
                        key={room.id}
                        className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-colors duration-200"
                    >
                        <CardHeader>
                            <CardTitle className="text-white">{room.name}</CardTitle>
                            <CardDescription className="text-gray-400">
                                {room.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-400">
                                    {room.membersCount} members
                                </span>
                                <Button
                                    onClick={() => handleJoinRoom(room.id)}
                                    variant="outline"
                                    className="border-blue-500 text-blue-400 hover:bg-blue-900/50 hover:text-blue-300 cursor-pointer"
                                >
                                    {loading ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <></>
                                    )}
                                    Join
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))
            )}
        </div>
    );
}
