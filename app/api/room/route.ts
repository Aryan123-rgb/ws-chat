import { prismaclient } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 401
        })
    }

    try {
        // Get all public rooms created by that user
        const joinedRoomsTable = await prismaclient.userToRoom.findMany({
            where: {
                userId: userId
            },
            include: {
                room: true
            }
        });

        // Extract there ids
        const joinedRoomIds = new Set(joinedRoomsTable.map(r => r.room.id));

        // Get all the created public rooms
        const allRooms = await prismaclient.room.findMany({
            include: {
                _count: {
                    select: {
                        users: true
                    }
                }
            }
        });


        const unjoinedRooms = allRooms.filter(room => !joinedRoomIds.has(room.id));
        const joinedRooms = allRooms.filter(room => joinedRoomIds.has(room.id));

        const updatedJoinedRooms = joinedRooms.map(({ _count, ...r }) => ({
            ...r,
            membersCount: _count.users
        }))

        const updatedUnJoinedRooms = unjoinedRooms.map(({ _count, ...r }) => ({
            ...r,
            membersCount: _count.users
        }))

        return NextResponse.json({
            message: "Rooms fetched",
            joinedRooms: updatedJoinedRooms || [],
            unjoinedRooms: updatedUnJoinedRooms || []
        })
    } catch (e) {
        console.log("Error fetching rooms", e);
        return NextResponse.json("Error fetching rooms");
    }

}