"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  DollarSign,
  FileText,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { BillingStats as BillingStatsType } from "@/lib/types/billing";

// Mock data - replace with actual API call
const mockStats: BillingStatsType = {
  totalCustomers: 156,
  activeCustomers: 142,
  suspendedCustomers: 8,
  overdueCustomers: 6,
  totalInvoices: 1247,
  pendingInvoices: 23,
  paidInvoices: 1198,
  totalRevenue: 4567890,
  outstandingAmount: 89500,
  monthlyRevenue: 387650,
};

export function BillingStats() {
  const [stats, setStats] = useState<BillingStatsType>(mockStats);
  const [loading, setLoading] = useState(false);

  // TODO: Replace with actual API call
  useEffect(() => {
    // const fetchStats = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await billingService.stats.getOverview();
    //     if (response?.data) {
    //       setStats(response.data);
    //     }
    //   } catch (error) {
    //     console.error("Failed to fetch billing stats:", error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Customers",
      value: stats.totalCustomers.toLocaleString(),
      subtitle: `${stats.activeCustomers} active`,
      icon: Users,
      color: "bg-blue-500/10 text-blue-600",
      trend: "+12% from last month",
    },
    {
      title: "Total Revenue",
      value: `KSh ${stats.totalRevenue.toLocaleString()}`,
      subtitle: `KSh ${stats.monthlyRevenue.toLocaleString()} this month`,
      icon: DollarSign,
      color: "bg-green-500/10 text-green-600",
      trend: "+8.2% from last month",
    },
    {
      title: "Total Invoices",
      value: stats.totalInvoices.toLocaleString(),
      subtitle: `${stats.paidInvoices} paid`,
      icon: FileText,
      color: "bg-purple-500/10 text-purple-600",
      trend: "+15 new this week",
    },
    {
      title: "Outstanding Amount",
      value: `KSh ${stats.outstandingAmount.toLocaleString()}`,
      subtitle: `${stats.pendingInvoices} pending invoices`,
      icon: AlertTriangle,
      color: "bg-orange-500/10 text-orange-600",
      trend:
        stats.overdueCustomers > 0
          ? `${stats.overdueCustomers} overdue`
          : "All current",
    },
  ];

  const quickStats = [
    {
      label: "Active Customers",
      value: stats.activeCustomers,
      total: stats.totalCustomers,
      color: "bg-green-500",
      icon: CheckCircle,
    },
    {
      label: "Overdue Customers",
      value: stats.overdueCustomers,
      total: stats.totalCustomers,
      color: "bg-red-500",
      icon: XCircle,
    },
    {
      label: "Suspended Customers",
      value: stats.suspendedCustomers,
      total: stats.totalCustomers,
      color: "bg-yellow-500",
      icon: Clock,
    },
    {
      label: "Pending Invoices",
      value: stats.pendingInvoices,
      total: stats.totalInvoices,
      color: "bg-blue-500",
      icon: FileText,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse">
              <div className="h-4 w-20 bg-muted rounded mb-2" />
              <div className="h-8 w-16 bg-muted rounded mb-2" />
              <div className="h-3 w-24 bg-muted rounded" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {stat.subtitle}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs text-green-600">{stat.trend}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat) => {
            const Icon = stat.icon;
            const percentage = Math.round((stat.value / stat.total) * 100);

            return (
              <div key={stat.label} className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`${stat.color} p-1 rounded`}>
                    <Icon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <Badge variant="secondary" className="text-xs">
                    {percentage}%
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`${stat.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
