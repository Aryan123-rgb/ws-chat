import { prismaclient } from "@/lib/db";
import { ChatMessage } from "@/types/message";
import { auth } from "@clerk/nextjs/server";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createMessageSchema = z.object({
    roomId: z.string(),
    content: z.string(),
})

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');
    const { userId } = await auth();

    if (!roomId) {
        return NextResponse.json("Invalid Room id passed");
    }

    if (!userId) {
        return NextResponse.json({
            message: "Unauthenticated",
        }, {
            status: 401
        })
    }

    try {
        const room = await prismaclient.room.findUnique({
            where: {
                id: roomId,
            },
            include: {
                messages: {
                    include: {
                        user: true,
                    }
                }
            }
        });

        const msg = room?.messages;

        const messages: ChatMessage[] = (msg ?? []).map((message) => ({
            id: message.id,
            content: message.content,
            userName: message.user.name,
            isCurrentUser: message.userId === userId,
        }));


        return NextResponse.json({
            room: room,
            messages: messages
        });
    } catch (e) {
        console.log("Error fetching room details", e);
        return NextResponse.json({
            message: "Error fetching room details"
        })
    }
}

export async function POST(req: NextRequest) {
    const data = createMessageSchema.parse(await req.json());
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({
            message: "Unauthenticated",
        }, {
            status: 401
        })
    }

    try {
        const msg = await prismaclient.messages.create({
            data: {
                content: data.content,
                roomId: data.roomId,
                userId: userId
            }
        })
        return NextResponse.json({
            message: "Msg saved",
            msg: msg,
        })
    } catch (e) {
        console.log("error creating message schema", e);
        return NextResponse.json("Error creating message schema");
    }
}