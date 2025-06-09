'use client';
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { showToast } from "@/lib/toast";

type Message = {
    id: string,
    content: string;
    userName: string;
    isCurrentUser: boolean;
};

interface Room {
    name: string,
    description: string,
    memberCount?: string,
}

export default function ChatRoom() {
    const router = useRouter();
    const params = useParams();
    const roomId = params?.id as string;
    const { isLoaded, isSignedIn, user } = useUser();
    const [currentMessage, setCurrentMessage] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [room, setRoom] = useState<Room>();
    const ws = useRef<null | WebSocket>(null);
    const userId = user?.id;

    const fetchRoomDetails = async () => {
        try {
            const res = await axios.get(`/api/messages/?roomId=${roomId}`, {
                withCredentials: true,
            });
            console.log("Room Details", res.data);
            setRoom(res.data.room);
            setMessages(res.data?.messages || []);
        } catch (e) {
            console.log("error fetching room details", e);
        }
    }

    const refreshMessage = async (data: any) => {
        const newMessage: Message = {
            id: uuidv4(),
            content: data.msg,
            userName: data.user.name,
            isCurrentUser: data.userId == userId
        }
        console.log("newMessage", newMessage);
        setMessages((prev) => [...prev, newMessage]);
    };

    const addMessage = async () => {
        try {
            await axios.post('/api/messages', {
                roomId: roomId,
                content: currentMessage,
            }, {
                withCredentials: true,
            });
        } catch (e) {
            console.log("Error sending message", e);
        }
    }

    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn) {
            showToast("Unexpected error occured", 'error');
            return;
        }
        fetchRoomDetails();
        try {
            const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/?roomId=${roomId}`);
            ws.current = socket;

            socket.onopen = () => {
                console.log("WebSocket connected");
            };

            socket.onerror = (error) => {
                console.error("WebSocket error", error);
            };

            socket.onclose = () => {
                console.warn("WebSocket connection closed");
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("Websocket data", data);
                refreshMessage(data);
            };

        } catch (err) {
            console.error("WebSocket connection failed:", err);
        }

        return () => {
            ws.current?.close();
        };
    }, [isLoaded, isSignedIn]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentMessage.trim()) return;

        const data = {
            roomId: roomId,
            msg: currentMessage,
            userId: userId,
            user: user
        };

        /*
        if we perform the db action before emitting the ws event then it will not be a real-time interaction
        */

        setCurrentMessage("");
        if (ws.current?.readyState == WebSocket.OPEN) {
            ws.current.send(JSON.stringify(data));
        }

        /* and doing it here can cause inconsistency since the data might fail to save in db but we still showed it to the user */
        addMessage();

    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 border-b border-gray-700 p-4 flex-shrink-0">
                <div className="flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="mr-4 text-gray-400 hover:bg-gray-700 hover:text-white"
                        onClick={() => router.push('/dashboard/public-chat')}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold">{room?.name}</h1>
                        <p className="text-sm text-gray-400">{room?.description}</p>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent hover:scrollbar-thumb-gray-500 scrollbar-thumb-rounded">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No messages yet. Say hello!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${msg.isCurrentUser
                                    ? 'bg-blue-600 rounded-tr-none'
                                    : 'bg-gray-700 rounded-tl-none'
                                    }`}
                            >
                                {!msg.isCurrentUser && (
                                    <div className="font-medium text-xs text-blue-300 mb-1">
                                        {msg.userName}
                                    </div>
                                )}
                                <p className="text-sm">{msg.content}</p>
                                <div className="text-xs text-gray-300 text-right mt-1">
                                    Just Now
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="border-t border-gray-700 p-4 bg-gray-800 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus-visible:ring-blue-500"
                    />
                    <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={!currentMessage.trim()}
                    >
                        <Send className="h-4 w-4 mr-2" />
                        Send
                    </Button>
                </form>
            </div>
        </div>
    );
}