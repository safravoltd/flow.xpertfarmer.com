import NextAuth from "next-auth";
import authConfig from "./auth.config";

const nextAuthUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
const nextAuthSecret =
  process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production";

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  basePath: "/api/auth",
  secret: nextAuthSecret,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("[Auth JWT] Called with:", {
        hasUser: !!user,
        hasToken: !!token,
      });

      if (user) {
        console.log("[Auth JWT] Setting user data in token");
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = (user as any).role;
        token.token = (user as any).token;
        token.phoneNumber = (user as any).phoneNumber;

        // Store token expiry time
        const tokenPayload = (user as any).token
          ? JSON.parse(atob((user as any).token.split(".")[1]))
          : null;
        if (tokenPayload) {
          token.tokenExpires = tokenPayload.exp * 1000; // Convert to milliseconds
        }
      }

      console.log("[Auth JWT] Returning token with ID:", token.id);
      return token;
    },
    async session({ session, token }) {
      console.log("[Auth Session] Called with:", {
        hasSession: !!session,
        hasToken: !!token,
      });

      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        (session.user as any).role = token.role;
        (session.user as any).token = token.token;
        (session.user as any).phoneNumber = token.phoneNumber;
        (session.user as any).tokenExpires = token.tokenExpires;
      }

      console.log(
        "[Auth Session] Returning session for user:",
        session.user?.id,
      );
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log("[Auth SignIn] Called with:", {
        hasUser: !!user,
        hasAccount: !!account,
      });
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("[Auth Redirect] Called with:", { url, baseUrl });
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
});
