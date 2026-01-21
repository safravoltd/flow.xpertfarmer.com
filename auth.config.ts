import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { formatKenyanPhoneNumber } from "@/lib/utils/phone-formatter";

const loginSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required"),
  pin: z.string().min(4, "PIN must be at least 4 digits"),
});

export default {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        phoneNumber: { label: "Phone Number", type: "text" },
        pin: { label: "PIN", type: "password" },
      },
      async authorize(credentials) {
        const validatedCredentials = loginSchema.safeParse(credentials);

        if (!validatedCredentials.success) {
          console.error(
            "[v0] Validation error:",
            validatedCredentials.error.errors,
          );
          return null;
        }

        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;

          if (!apiUrl) {
            console.error("[v0] NEXT_PUBLIC_API_URL is not configured");
            return null;
          }

          // Format the phone number to standard Kenyan format
          const formattedPhoneNumber = formatKenyanPhoneNumber(
            validatedCredentials.data.phoneNumber,
          );

          if (!formattedPhoneNumber) {
            console.error(
              "[v0] Invalid phone number format:",
              validatedCredentials.data.phoneNumber,
            );
            return null;
          }

          console.log(
            "[v0] Attempting login with phone:",
            formattedPhoneNumber,
          );
          console.log("[v0] API URL:", apiUrl);

          const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "*/*",
            },
            body: JSON.stringify({
              phoneNumber: formattedPhoneNumber,
              pin: validatedCredentials.data.pin,
            }),
          });

          console.log("[v0] Response status:", response.status);
          console.log(
            "[v0] Response headers:",
            Object.fromEntries(response.headers.entries()),
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error("[v0] Login failed:", response.status, errorText);
            return null;
          }

          const data = await response.json();
          console.log("[v0] Login response:", data);

          const user = data.user || data;

          if (user && user.id) {
            const authUser = {
              id: user.id,
              email: user.email,
              name:
                user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.name,
              image: user.image,
              role: user.role || "user",
              token: data.token,
              phoneNumber: user.phoneNumber,
            };
            console.log("[v0] Returning user:", authUser);
            return authUser;
          }

          console.log("[v0] No valid user data in response");
          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
} satisfies NextAuthConfig;
