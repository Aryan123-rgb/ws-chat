import { prismaclient } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const users = await prismaclient.user.findMany();
        return NextResponse.json(users);
    } catch (e) {
        console.log("Error fetching users", e);
        return NextResponse.json("Error fetching users");
    }
}