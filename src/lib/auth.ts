import NextAuth, { type NextAuthConfig } from "next-auth";
import { db } from "./db";
import { users } from "../drizzle/schema";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

const authOptions: NextAuthConfig = {
  // Note: When using JWT strategy, adapter is optional
  // We'll manage users directly in the authorize function
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !db) {
          return null;
        }

        try {
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email))
            .limit(1);

          if (user.length === 0) {
            return null;
          }

          // Verify password if provided and user has a stored hash
          const storedHash = (user[0] as any).passwordHash as string | null | undefined;
          if (credentials.password) {
            if (!storedHash) {
              return null;
            }
            const ok = await bcrypt.compare(credentials.password, storedHash);
            if (!ok) {
              return null;
            }
          }

          return {
            id: user[0].id,
            email: user[0].email,
            name: user[0].name,
            role: user[0].role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
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
    signIn: "/signin",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

// Export auth function for use in server components (compatibility alias)
export const getServerSession = auth;

// Helper for API routes to get session from request
export async function getSessionFromRequest(request: Request) {
  return await auth();
}

