import NextAuth, { type NextAuthConfig } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import { users } from "@/drizzle/schema";
import CredentialsProvider from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";

const authOptions: NextAuthConfig = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);

        if (user.length === 0) {
          return null;
        }

        // TODO: Add proper password verification
        // For now, return user if email exists
        return {
          id: user[0].id,
          email: user[0].email,
          name: user[0].name,
          role: user[0].role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/api/auth/signin",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

// Export auth function for use in server components (compatibility alias)
export const getServerSession = auth;

// Helper for API routes to get session from request
export async function getSessionFromRequest(request: Request) {
  return await auth();
}

