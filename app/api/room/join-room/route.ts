import { prismaclient } from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const linkSchema = z.object({
    roomId: z.string(),
})

export async function POST(req: NextRequest) {
    const data = linkSchema.parse(await req.json());
    const token = await getToken({ req });
    const userId = token?.userId;

    if (!userId) {
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 401
        })
    }

    try {
        // if already joined, then skip it
        const exists = await prismaclient.userToRoom.findUnique({
            where: {
                roomId_userId: {
                    roomId: data.roomId,
                    userId: userId,
                }
            }
        })
        if (!exists) {
            // join the room
            const res = await prismaclient.userToRoom.create({
                data: {
                    roomId: data.roomId,
                    userId: userId,
                }
            })
        }
        return NextResponse.json({
            message: "User joined successfully",
        })
    } catch (e) {
        console.log("Error creating a UserToRoom entry", e);
        return NextResponse.json("Error creating a UserToRoom entry")
    }
}