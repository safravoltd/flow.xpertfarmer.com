"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/hooks/use-api";
import { Card } from "@/components/ui/card";
import { Users, Tractor, TrendingUp, AlertCircle, Loader2 } from "lucide-react";
import type {
  User,
  Farm,
  Sale,
  Livestock,
  Inventory,
  ApiResponse,
  PaginatedResponse,
} from "@/lib/types/api";

export function DashboardOverview() {
  const [stats, setStats] = useState({
    totalFarms: 0,
    activeUsers: 0,
    totalRevenue: 0,
    alerts: 0,
  });
  const [loading, setLoading] = useState(true);
  const { get } = useApi();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch farms
        const farmsResponse = await get<ApiResponse<Farm[]>>("/farms");
        const totalFarms = farmsResponse?.data?.length || 0;

        // Fetch users
        const usersResponse = await get<ApiResponse<User[]>>("/users");
        const activeUsers =
          usersResponse?.data?.filter((user) => user.isVerified).length || 0;

        // Fetch sales for revenue calculation
        const salesResponse = await get<ApiResponse<Sale[]>>("/sales");
        const totalRevenue =
          salesResponse?.data?.reduce(
            (sum, sale) => sum + sale.price * sale.quantity,
            0,
          ) || 0;

        // Fetch inventory for low stock alerts
        const inventoryResponse =
          await get<PaginatedResponse<Inventory>>("/inventory");
        const lowStockItems =
          inventoryResponse?.data?.filter(
            (item) => item.quantity <= item.reorderLevel,
          ).length || 0;

        // Fetch livestock for health alerts
        const livestockResponse =
          await get<PaginatedResponse<Livestock>>("/livestock");
        const sickAnimals =
          livestockResponse?.data?.filter((item) => item.status === "sick")
            .length || 0;

        const alerts = lowStockItems + sickAnimals;

        setStats({
          totalFarms,
          activeUsers,
          totalRevenue,
          alerts,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [get]);

  const statItems = [
    {
      title: "Total Farms",
      value: stats.totalFarms.toString(),
      icon: Tractor,
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      title: "Active Users",
      value: stats.activeUsers.toString(),
      icon: Users,
      color: "bg-green-500/10 text-green-600",
    },
    {
      title: "Total Revenue",
      value: `KSh ${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      title: "Alerts",
      value: stats.alerts.toString(),
      icon: AlertCircle,
      color: "bg-orange-500/10 text-orange-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-8 w-16 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-12 w-12 bg-muted rounded-lg animate-pulse" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
