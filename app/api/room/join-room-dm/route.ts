import { prismaclient } from "@/lib/db";
import { generateDirectKey } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createOneToOneMessageSchema = z.object({
    userId1: z.string(),
    userId2: z.string()
})

export async function POST(req: NextRequest) {
    const data = createOneToOneMessageSchema.parse(await req.json());
    try {
        const uniqueKey = generateDirectKey(data.userId1, data.userId2);
        let room = await prismaclient.room.findUnique({
            where: {
                directKey: uniqueKey
            }
        })
        if (!room) {
            room = await prismaclient.room.create({
                data: {
                    name: "One to one messaging",
                    description: "Random description",
                    type: 'Direct',
                    directKey: uniqueKey,
                    users: {
                        create: [
                            {
                                user: {
                                    connect: {
                                        id: data.userId1,
                                    }
                                }
                            },
                            {
                                user: {
                                    connect: {
                                        id: data.userId2
                                    }
                                }
                            }
                        ]
                    }
                }
            })
        }
        return NextResponse.json({
            message: "Rooms created successfully",
            room,
        });
    } catch (e) {
        console.log("Error starting one to one message", e);
        return NextResponse.json("Error starting one to one message")
    }
}