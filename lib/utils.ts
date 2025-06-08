import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { prismaclient } from "./db";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export async function getUserIdFromEmail(email: string) {
  if (!email) return null;

  const user = await prismaclient.user.findFirst({
    where: {
      email: email,
    }
  })

  return user?.id;
}

export function generateDirectKey(userA: string, userB: string): string {
  return [userA, userB].sort().join(":");
}