"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useApi } from "@/lib/hooks/use-api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  MapPin,
  User,
  Calendar,
  Users,
  Package,
  Warehouse,
  TrendingUp,
  Loader2,
  Plus,
  Phone,
  Mail,
  Building,
  Banknote,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import type {
  Farm,
  Employee,
  Sale,
  Livestock,
  Inventory,
  ApiResponse,
  PaginatedResponse,
} from "@/lib/types/api";
import { FarmEmployeesTable } from "@/components/farms/farm-employees-table";
import { FarmLivestockTable } from "@/components/farms/farm-livestock-table";
import { FarmInventoryTable } from "@/components/farms/farm-inventory-table";
import { FarmSalesTable } from "@/components/farms/farm-sales-table";

export default function FarmDetailsPage() {
  const params = useParams();
  const farmId = params.id as string;
  const [farm, setFarm] = useState<Farm | null>(null);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalLivestock: 0,
    totalInventoryItems: 0,
    totalSales: 0,
    totalRevenue: 0,
    lowStockItems: 0,
    sickAnimals: 0,
  });
  const { get, loading, error } = useApi();
  const { data: session } = useSession();

  console.log("[Farm Details] Error:", error);
  console.log("[Farm Details] Loading:", loading);
  console.log("[Farm Details] Farm:", farm);
  console.log("[Farm Details] Farm ID:", farmId);
  console.log("[Farm Details] Session:", !!session);
  console.log("[Farm Details] Token:", !!(session?.user as any)?.token);
  useEffect(() => {
    const fetchFarmData = async () => {
      if (!farmId) {
        console.log("[Farm Details] No farmId provided");
        return;
      }

      console.log("[Farm Details] Starting fetch for farmId:", farmId);
      console.log("[Farm Details] API URL:", process.env.NEXT_PUBLIC_API_URL);

      try {
        // Test a simple API call first
        console.log("[Farm Details] Testing basic API connectivity...");
        const testResponse = await get<any>("/farms");
        console.log("[Farm Details] Test response (all farms):", testResponse);

        // Fetch farm details
        console.log("[Farm Details] Fetching farm details...");
        const farmResponse = await get<Farm>(`/farms/${farmId}`);
        console.log("[Farm Details] Farm response:", farmResponse);

        if (farmResponse) {
          console.log("[Farm Details] Setting farm data:", farmResponse);
          setFarm(farmResponse);
        } else {
          console.log("[Farm Details] No farm data in response");
        }

        // Fetch employees for this farm
        console.log("[Farm Details] Fetching employees...");
        const employeesResponse = await get<Employee[]>(
          `/employees?farmId=${farmId}`,
        );
        console.log("[Farm Details] Employees response:", employeesResponse);
        const employees = employeesResponse || [];

        // Fetch livestock for this farm
        console.log("[Farm Details] Fetching livestock...");
        const livestockResponse = await get<Livestock[]>(
          `/livestock?farmId=${farmId}`,
        );
        console.log("[Farm Details] Livestock response:", livestockResponse);
        const livestock = livestockResponse || [];

        // Fetch inventory for this farm
        console.log("[Farm Details] Fetching inventory...");
        const inventoryResponse = await get<Inventory[]>(
          `/inventory?farmId=${farmId}`,
        );
        console.log("[Farm Details] Inventory response:", inventoryResponse);
        const inventory = inventoryResponse || [];

        // Fetch sales for this farm
        console.log("[Farm Details] Fetching sales...");
        const salesResponse = await get<Sale[]>(`/sales?farmId=${farmId}`);
        console.log("[Farm Details] Sales response:", salesResponse);
        const sales = salesResponse || [];

        // Calculate statistics
        const totalEmployees = employees.length;
        const totalLivestock = livestock.reduce(
          (sum, item) => sum + item.count,
          0,
        );
        const totalInventoryItems = inventory.length;
        const totalSales = sales.length;
        const totalRevenue = sales.reduce(
          (sum, sale) => sum + sale.price * sale.quantity,
          0,
        );
        const lowStockItems = inventory.filter(
          (item) => item.quantity <= item.reorderLevel,
        ).length;
        const sickAnimals = livestock.filter(
          (item) => item.status === "sick",
        ).length;

        console.log("[Farm Details] Calculated stats:", {
          totalEmployees,
          totalLivestock,
          totalInventoryItems,
          totalSales,
          totalRevenue,
          lowStockItems,
          sickAnimals,
        });

        setStats({
          totalEmployees,
          totalLivestock,
          totalInventoryItems,
          totalSales,
          totalRevenue,
          lowStockItems,
          sickAnimals,
        });
      } catch (error) {
        console.error("[Farm Details] Failed to fetch farm data:", error);
      }
    };

    fetchFarmData();
  }, [farmId, get]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !farm) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load farm details</p>
        <Link href="/dashboard/farms">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Farms
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/farms">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight">{farm.name}</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Comprehensive Farm Management
          </p>
        </div>
      </div>

      {/* Farm Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Farm Information */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Farm Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-muted-foreground">
                    {farm.county}, {farm.administrativeLocation}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Size & Ownership</p>
                  <p className="text-muted-foreground">
                    {farm.size} acres • {farm.ownership}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {farm.user && (
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Owner</p>
                    <p className="text-muted-foreground">
                      {farm.user.firstName} {farm.user.lastName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-3 w-3" />
                      <span className="text-xs text-muted-foreground">
                        {farm.user.phoneNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      <span className="text-xs text-muted-foreground">
                        {farm.user.email}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Established</p>
                  <p className="text-muted-foreground">
                    {new Date(farm.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="font-medium mb-3">Farming Activities</p>
            <div className="flex flex-wrap gap-2">
              {farm.farmingTypes.map((type, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Employees</span>
              </div>
              <span className="font-semibold">{stats.totalEmployees}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-green-600" />
                <span className="text-sm">Livestock</span>
              </div>
              <span className="font-semibold">{stats.totalLivestock}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Warehouse className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Inventory Items</span>
              </div>
              <span className="font-semibold">{stats.totalInventoryItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Sales Records</span>
              </div>
              <span className="font-semibold">{stats.totalSales}</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Total Revenue</span>
                </div>
                <span className="font-bold text-green-600">
                  KSh {stats.totalRevenue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Alert Cards */}
      {(stats.lowStockItems > 0 || stats.sickAnimals > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.lowStockItems > 0 && (
            <Card className="p-4 border-orange-200 bg-orange-50">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-800">Low Stock Alert</p>
                  <p className="text-sm text-orange-600">
                    {stats.lowStockItems} items need restocking
                  </p>
                </div>
              </div>
            </Card>
          )}
          {stats.sickAnimals > 0 && (
            <Card className="p-4 border-red-200 bg-red-50">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-800">Health Alert</p>
                  <p className="text-sm text-red-600">
                    {stats.sickAnimals} animals need attention
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Main Content Tabs */}
      <Card className="p-6">
        <Tabs defaultValue="employees" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger
                value="employees"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Employees</span>
              </TabsTrigger>
              <TabsTrigger
                value="livestock"
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Livestock</span>
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="flex items-center gap-2"
              >
                <Warehouse className="h-4 w-4" />
                <span className="hidden sm:inline">Inventory</span>
              </TabsTrigger>
              <TabsTrigger value="sales" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Sales</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="employees" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Farm Employees</h2>
                <p className="text-muted-foreground">
                  Manage your farm workforce
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Employee
              </Button>
            </div>
            <FarmEmployeesTable farmId={farmId} />
          </TabsContent>

          <TabsContent value="livestock" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Livestock Management</h2>
                <p className="text-muted-foreground">
                  Track animal health and inventory
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Livestock
              </Button>
            </div>
            <FarmLivestockTable farmId={farmId} />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Inventory Management</h2>
                <p className="text-muted-foreground">
                  Track supplies and equipment
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
            <FarmInventoryTable farmId={farmId} />
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Sales Records</h2>
                <p className="text-muted-foreground">
                  Track revenue and transactions
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Record Sale
              </Button>
            </div>
            <FarmSalesTable farmId={farmId} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
