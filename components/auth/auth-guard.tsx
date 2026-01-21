"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("[AuthGuard] Status:", status);
    console.log("[AuthGuard] Session:", !!session);
    console.log("[AuthGuard] Pathname:", pathname);

    // Define public routes that don't require authentication
    const publicRoutes = ["/auth/login", "/auth/register"];
    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route),
    );

    if (status === "loading") {
      console.log("[AuthGuard] Still loading...");
      return; // Still loading
    }

    if (!session && !isPublicRoute) {
      console.log("[AuthGuard] No session, redirecting to login");
      router.push("/auth/login");
      return;
    }

    if (session && isPublicRoute) {
      console.log("[AuthGuard] Has session, redirecting to dashboard");
      router.push("/dashboard");
      return;
    }

    if (session && pathname === "/") {
      console.log("[AuthGuard] Has session on root, redirecting to dashboard");
      router.push("/dashboard");
      return;
    }

    if (!session && pathname === "/") {
      console.log("[AuthGuard] No session on root, redirecting to login");
      router.push("/auth/login");
      return;
    }

    console.log("[AuthGuard] Allowing access");
  }, [session, status, pathname, router]);

  // Show loading while checking auth
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Define public routes that don't require authentication
  const publicRoutes = ["/auth/login", "/auth/register"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // If not authenticated and trying to access protected route, show loading
  if (!session && !isPublicRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If authenticated and trying to access auth pages, show loading
  if (session && isPublicRoute) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
