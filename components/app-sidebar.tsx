"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Tractor,
  Briefcase,
  Settings,
  Sprout,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// XpertFarmer specific data
const xpertFarmerData = {
  company: {
    name: "XpertFarmer",
    logo: Sprout,
    plan: "Admin Portal",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Farms",
      url: "/dashboard/farms",
      icon: Tractor,
    },
    {
      title: "Billing",
      url: "/dashboard/billing",
      icon: Briefcase,
    },
    {
      title: "Analytics",
      url: "/dashboard/analytics",
      icon: BarChart3,
      items: [
        {
          title: "Farm Performance",
          url: "/dashboard/analytics/farms",
        },
        {
          title: "User Engagement",
          url: "/dashboard/analytics/users",
        },
        {
          title: "Revenue Reports",
          url: "/dashboard/analytics/revenue",
        },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      items: [
        {
          title: "General",
          url: "/dashboard/settings/general",
        },
        {
          title: "Notifications",
          url: "/dashboard/settings/notifications",
        },
        {
          title: "Security",
          url: "/dashboard/settings/security",
        },
        {
          title: "API Keys",
          url: "/dashboard/settings/api",
        },
      ],
    },
    {
      title: "Help & Support",
      url: "/dashboard/help",
      icon: HelpCircle,
      items: [
        {
          title: "Documentation",
          url: "/dashboard/help/docs",
        },
        {
          title: "Contact Support",
          url: "/dashboard/help/contact",
        },
        {
          title: "System Status",
          url: "/dashboard/help/status",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const userData = {
    name: session?.user?.name || "Admin User",
    email: session?.user?.email || "admin@xpertfarmer.com",
    avatar: session?.user?.image || "/placeholder-user.jpg",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher company={xpertFarmerData.company} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={xpertFarmerData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
