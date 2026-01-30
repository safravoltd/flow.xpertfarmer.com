import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { BreadcrumbNav } from "@/components/dashboard/breadcrumb-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-sidebar-border bg-sidebar/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <BreadcrumbNav />
          </div>
          <div className="flex items-center gap-2 px-4">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-0 pt-0">
          <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <main className="p-6 animate-fade-in">{children}</main>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
