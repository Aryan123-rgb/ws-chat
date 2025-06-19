"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import RoomList from "@/components/RoomList";
import Navbar from "@/components/Navbar";
import NoRoomMsg from "@/components/NoRoomMsg";
import { showToast } from "@/lib/toast";

type Room = {
    id: string;
    name: string;
    description: string;
    membersCount: number;
};

export default function Home() {
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [roomName, setRoomName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [joinedRooms, setJoinedRooms] = useState<Room[]>([]);
    const [unjoinedRooms, setUnJoinedRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isfetching, setIsFetching] = useState(false);

    const fetchRooms = async () => {
        // get all the rooms created by the current user
        setIsFetching(true);
        const res = await axios.get("/api/room", {
            withCredentials: true,
        });

        const jRooms = res.data?.joinedRooms || [];
        const ujRooms = res.data?.unjoinedRooms || [];

        setJoinedRooms(jRooms);
        setUnJoinedRooms(ujRooms);
        setIsFetching(false);
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleCreateRoom = async () => {
        if (!roomName.trim() || !description.trim()) {
            showToast("Please enter room name and description", "info");
            return;
        }
        setLoading(true);
        try {
            // create the room
            const res = await axios.post("/api/room/create-room", {
                name: roomName,
                description: description,
                type: "Public",
            });
            const roomId = res.data?.room?.id;
            if (roomId) {
                // join the room
                await axios.post(
                    "/api/room/join-room",
                    {
                        roomId,
                    },
                    {
                        withCredentials: true,
                    }
                );
                router.push(`/room/${roomId}`);
            }
        } catch (e) {
            console.log("Error while creating the room", e);
        }
        setLoading(false);
        setIsDialogOpen(false);
        setRoomName("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <Navbar />

            <main className="max-w-6xl mx-auto p-6 md:p-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search rooms..."
                            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus-visible:ring-blue-500"
                        />
                    </div>
                    <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Room
                    </Button>
                </div>

                {isfetching ? (
                    <>
                        <div className="flex h-full justify-center items-center p-4">
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                        </div>
                    </>
                ) : joinedRooms.length == 0 && unjoinedRooms.length === 0 ? (
                    <NoRoomMsg />
                ) : (
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-200 mb-4">
                                Your Rooms
                            </h2>
                            <div className="space-y-4">
                                <RoomList rooms={joinedRooms} />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-200 mb-4">
                                Discover Rooms
                            </h2>
                            <div className="space-y-4">
                                <RoomList rooms={unjoinedRooms} />
                            </div>
                        </div>
                    </div>
                )}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px] bg-gray-800 border-gray-700">
                        <DialogHeader>
                            <DialogTitle className="text-white">Create Chat Room</DialogTitle>
                            <DialogDescription className="text-gray-400">
                                Please enter name for the room
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="username" className="text-right text-white">
                                    Name
                                </label>
                                <Input
                                    id="username"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    className="col-span-3 bg-gray-700 border-gray-600 text-white"
                                    placeholder="Enter..."
                                    autoComplete="off"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="username" className="text-right text-white">
                                    Description
                                </label>
                                <Input
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="col-span-3 bg-gray-700 border-gray-600 text-white"
                                    placeholder="Enter..."
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="text-black cursor-pointer border-gray-600 hover:bg-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCreateRoom}
                                disabled={!roomName.trim() || loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Plus className="mr-2 h-4 w-4" />
                                )}
                                Create Room
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
