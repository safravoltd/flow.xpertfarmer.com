"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Tractor,
  Briefcase,
  Package,
  Warehouse,
  TrendingUp,
  Settings,
  LogOut,
  Download,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    label: "Farms",
    href: "/dashboard/farms",
    icon: Tractor,
  },
  {
    label: "Billing",
    href: "/dashboard/billing",
    icon: Briefcase,
  },
  {
    label: "Data exports",
    href: "/dashboard/exports",
    icon: Download,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen">
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-primary">XpertFarmer</h1>
        <p className="text-xs text-muted-foreground mt-1">Admin Dashboard</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <button
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-2">
        <Link href="/dashboard/settings">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors">
            <Settings className="h-5 w-5" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </Link>
        <Button
          onClick={async () => {
            console.log("[SignOut] Attempting to sign out...");
            try {
              // Clear any local storage or session storage
              if (typeof window !== "undefined") {
                localStorage.clear();
                sessionStorage.clear();
              }

              // Sign out with NextAuth
              await signOut({
                redirect: false, // Don't auto-redirect, we'll handle it
              });

              console.log("[SignOut] Sign out successful, redirecting...");

              // Force redirect to login
              window.location.href = "/auth/login";
            } catch (error) {
              console.error("[SignOut] Sign out failed:", error);
              // Force redirect even if signOut fails
              window.location.href = "/auth/login";
            }
          }}
          variant="ghost"
          className="w-full justify-start gap-3"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}
