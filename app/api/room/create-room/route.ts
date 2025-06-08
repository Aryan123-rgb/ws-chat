import { prismaclient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createRoomSchema = z.object({
    name: z.string(),
    description: z.string(),
    type: z.enum(["Public", "Private", "Direct"])
})

export async function POST(req: NextRequest) {
    const data = createRoomSchema.parse(await req.json());
    try {
        const room = await prismaclient.room.create({
            data: {
                name: data.name,
                description: data.description,
                type: data.type,
            }
        })
        return NextResponse.json({
            message: "Room created successfully",
            room: room,
        })
    } catch (e) {
        console.log("Error creating room", e);
        return NextResponse.json("Error creating Room");
    }
}