import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to XpertFarmer Admin Dashboard
        </p>
      </div>

      <DashboardOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Manage farms, employees, and inventory from the sidebar
                navigation.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
