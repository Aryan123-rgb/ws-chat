import { NextRequest } from "next/server";
import { z } from "zod";

const createDirectMessageSchema = z.object({
    userId1 : z.string(),
    userId2: z.string()
})

export async function POST(req:NextRequest){
    const data = createDirectMessageSchema.parse(await req.json());
    try {
        
    } catch (e) {
        console.log("Error creating chat", e);
    }
}