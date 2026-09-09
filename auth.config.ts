import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { formatKenyanPhoneNumber } from "@/lib/utils/phone-formatter";

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:8000"
).replace(/\/+$/, "");

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
        const isAdminLogin =
          (credentials as Record<string, unknown> | undefined)?.adminLogin ===
          "true";
        const validatedCredentials = isAdminLogin
          ? {
              success: true as const,
              data: {
                phoneNumber: String(credentials?.phoneNumber ?? ""),
                pin: String(credentials?.pin ?? ""),
              },
            }
          : loginSchema.safeParse(credentials);

        if (!validatedCredentials.success) {
          return null;
        }

        try {
          // Format the phone number to standard Kenyan format
          const formattedPhoneNumber = isAdminLogin
            ? validatedCredentials.data.phoneNumber.trim()
            : formatKenyanPhoneNumber(validatedCredentials.data.phoneNumber);

          if (!formattedPhoneNumber) {
            return null;
          }

          const response = await fetch(
            `${apiBaseUrl}${isAdminLogin ? "/auth/admin/login" : "/auth/login"}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
              },
              body: JSON.stringify(
                isAdminLogin
                  ? {
                      identifier: formattedPhoneNumber,
                      password: validatedCredentials.data.pin,
                    }
                  : {
                      phoneNumber: formattedPhoneNumber,
                      pin: validatedCredentials.data.pin,
                    },
              ),
            },
          );

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

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
            return authUser;
          }

          return null;
        } catch {
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
} satisfies NextAuthConfig;
