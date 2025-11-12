import NextAuth, { type NextAuthConfig } from "next-auth";
import { db } from "./db";
import { users } from "../drizzle/schema";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
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
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
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
          const email = String(credentials.email);
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
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
            const ok = await bcrypt.compare(String(credentials.password), storedHash);
            if (!ok) {
              return null;
            }
          }

          return {
            id: user[0].id,
            email: user[0].email,
            role: user[0].role,
            imageUrl: user[0].imageUrl || null,
            firstName: (user[0] as any).firstName || null,
            lastName: (user[0] as any).lastName || null,
            phone: (user[0] as any).phone || null,
            bio: (user[0] as any).bio || null,
            country: (user[0] as any).country || null,
            cityState: (user[0] as any).cityState || null,
            postalCode: (user[0] as any).postalCode || null,
            taxId: (user[0] as any).taxId || null,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle OAuth providers (Google, Facebook)
      if (account?.provider === "google" || account?.provider === "facebook") {
        if (!db || !user.email) {
          return false;
        }

        try {
          // Check if user exists
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email))
            .limit(1);

          if (existingUser.length === 0) {
            // Create new user from OAuth data
            const id = crypto.randomUUID();
            const nameParts = user.name?.split(" ") || [];
            const firstName = nameParts[0] || "";
            const lastName = nameParts.slice(1).join(" ") || "";

            await db.insert(users).values({
              id,
              email: user.email,
              firstName,
              lastName,
              role: "user",
              imageUrl: user.image || null,
            });
          } else {
            // Update image if available and not set
            if (user.image && !existingUser[0].imageUrl) {
              await db
                .update(users)
                .set({ imageUrl: user.image })
                .where(eq(users.email, user.email));
            }
          }
        } catch (error) {
          console.error("OAuth sign in error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger }) {
      // Initial sign in - fetch user data from database
      if (user && db) {
        try {
          const userData = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email || ""))
            .limit(1);

          if (userData.length > 0) {
            token.sub = userData[0].id;
            token.role = userData[0].role;
            token.imageUrl = userData[0].imageUrl || null;
            token.firstName = (userData[0] as any).firstName || null;
            token.lastName = (userData[0] as any).lastName || null;
            token.phone = (userData[0] as any).phone || null;
            token.bio = (userData[0] as any).bio || null;
            token.country = (userData[0] as any).country || null;
            token.cityState = (userData[0] as any).cityState || null;
            token.postalCode = (userData[0] as any).postalCode || null;
            token.taxId = (userData[0] as any).taxId || null;
          } else if (user.email) {
            // Fallback for OAuth users that were just created
            token.email = user.email;
            token.role = "user";
            token.imageUrl = user.image || null;
            const nameParts = user.name?.split(" ") || [];
            token.firstName = nameParts[0] || null;
            token.lastName = nameParts.slice(1).join(" ") || null;
          }
        } catch (error) {
          console.error("Error fetching user data in JWT:", error);
        }
      }
      // Refresh user data from database on session update
      if (trigger === "update" && token.sub && db) {
        try {
          const userData = await db
            .select()
            .from(users)
            .where(eq(users.id, token.sub))
            .limit(1);
          if (userData.length > 0) {
            token.role = userData[0].role;
            token.imageUrl = userData[0].imageUrl || null;
            token.firstName = (userData[0] as any).firstName || null;
            token.lastName = (userData[0] as any).lastName || null;
            token.phone = (userData[0] as any).phone || null;
            token.bio = (userData[0] as any).bio || null;
            token.country = (userData[0] as any).country || null;
            token.cityState = (userData[0] as any).cityState || null;
            token.postalCode = (userData[0] as any).postalCode || null;
            token.taxId = (userData[0] as any).taxId || null;
          }
        } catch (error) {
          console.error("Error refreshing user data:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.sub;
        (session.user as any).imageUrl = token.imageUrl || null;
        (session.user as any).firstName = token.firstName || null;
        (session.user as any).lastName = token.lastName || null;
        (session.user as any).phone = token.phone || null;
        (session.user as any).bio = token.bio || null;
        (session.user as any).country = token.country || null;
        (session.user as any).cityState = token.cityState || null;
        (session.user as any).postalCode = token.postalCode || null;
        (session.user as any).taxId = token.taxId || null;
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

