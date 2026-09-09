"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (session) {
      // User is authenticated, redirect to dashboard
      router.push("/dashboard");
    } else {
      // User is not authenticated, redirect to login
      router.push("/auth/admin/login");
    }
  }, [session, status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">XpertFarmer Admin</h1>
        <p className="text-muted-foreground">
          {status === "loading" ? "Loading..." : "Redirecting..."}
        </p>
      </div>
    </div>
  );
}
