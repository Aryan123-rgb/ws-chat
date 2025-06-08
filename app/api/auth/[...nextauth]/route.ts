import { prismaclient } from "@/lib/db";
import { getUserIdFromEmail } from "@/lib/utils";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  secret: process.env.NEXTAUTH_SECRET ?? "secret",
  callbacks: {
    async signIn(params) {
      if (!params.user.email || !params.user.name) {
        return false;
      }
      try {
        await prismaclient.user.create({
          data: {
            email: params.user.email,
            name: params.user.name,
          }
        })

      } catch (e) {
      }
      return true
    },
    async jwt({ token, user }) {
      if (user?.email && !token.userId) {
        const userId = await getUserIdFromEmail(user.email);
        token.userId = userId ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.userId) {
        session.userId = token.userId;
      }
      return session;
    }
  }
})

export { handler as GET, handler as POST }