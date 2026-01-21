"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Edit2,
  Trash2,
  Loader2,
  DollarSign,
  Calendar,
  Package,
} from "lucide-react";
import type { Sale, ApiResponse } from "@/lib/types/api";

interface FarmSalesTableProps {
  farmId: string;
}

export function FarmSalesTable({ farmId }: FarmSalesTableProps) {
  const [sales, setSales] = useState<Sale[]>([]);
  const { get, loading, error } = useApi();

  useEffect(() => {
    const fetchSales = async () => {
      const response = await get<ApiResponse<Sale[]>>(
        `/sales?farmId=${farmId}`,
      );
      if (response?.data) {
        setSales(response.data);
      }
    };
    fetchSales();
  }, [farmId, get]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load sales: {error.message}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold">Product</th>
            <th className="text-left py-3 px-4 font-semibold">Category</th>
            <th className="text-left py-3 px-4 font-semibold">Quantity</th>
            <th className="text-left py-3 px-4 font-semibold">Price</th>
            <th className="text-left py-3 px-4 font-semibold">Total Value</th>
            <th className="text-left py-3 px-4 font-semibold">Status</th>
            <th className="text-left py-3 px-4 font-semibold">Date</th>
            <th className="text-right py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => {
            const totalValue = sale.price * sale.quantity;
            const saleDate = sale.saleDate
              ? new Date(sale.saleDate).toLocaleDateString()
              : new Date(sale.createdAt).toLocaleDateString();

            return (
              <tr
                key={sale.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-4 font-medium">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span>{sale.name}</span>
                      {sale.breed && (
                        <div className="text-xs text-muted-foreground">
                          {sale.breed}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="outline" className="capitalize">
                    {sale.category}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <span className="font-semibold">{sale.quantity}</span>
                  {sale.age && (
                    <div className="text-xs text-muted-foreground">
                      Age: {sale.age}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span>KSh {sale.price.toLocaleString()}</span>
                  </div>
                  {sale.pricePerBird && (
                    <div className="text-xs text-muted-foreground">
                      Per unit: KSh {sale.pricePerBird}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 font-semibold">
                  KSh {totalValue.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={
                      sale.status === "sold"
                        ? "default"
                        : sale.status === "available"
                          ? "secondary"
                          : "outline"
                    }
                    className="capitalize"
                  >
                    {sale.status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{saleDate}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {sales.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No sales records found for this farm
        </div>
      )}
    </div>
  );
}
