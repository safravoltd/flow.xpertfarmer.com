"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Loader2, Package, AlertTriangle } from "lucide-react";
import type { Inventory, PaginatedResponse } from "@/lib/types/api";

interface FarmInventoryTableProps {
  farmId: string;
}

export function FarmInventoryTable({ farmId }: FarmInventoryTableProps) {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const { get, loading, error } = useApi();

  useEffect(() => {
    const fetchInventory = async () => {
      const response = await get<PaginatedResponse<Inventory>>(
        `/inventory?farmId=${farmId}`,
      );
      if (response?.data) {
        setInventory(response.data);
      }
    };
    fetchInventory();
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
        Failed to load inventory: {error.message}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold">Item Name</th>
            <th className="text-left py-3 px-4 font-semibold">Category</th>
            <th className="text-left py-3 px-4 font-semibold">Quantity</th>
            <th className="text-left py-3 px-4 font-semibold">Unit</th>
            <th className="text-left py-3 px-4 font-semibold">Reorder Level</th>
            <th className="text-left py-3 px-4 font-semibold">Status</th>
            <th className="text-right py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => {
            const isLowStock = item.quantity <= item.reorderLevel;

            return (
              <tr
                key={item.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-4 font-medium">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{item.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="outline" className="capitalize">
                    {item.category}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <span
                    className={`font-semibold ${isLowStock ? "text-red-600" : ""}`}
                  >
                    {item.quantity}
                  </span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{item.unit}</td>
                <td className="py-3 px-4 text-muted-foreground">
                  {item.reorderLevel}
                </td>
                <td className="py-3 px-4">
                  {isLowStock ? (
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-red-600" />
                      <Badge variant="destructive" className="text-xs">
                        Low Stock
                      </Badge>
                    </div>
                  ) : (
                    <Badge variant="default" className="text-xs">
                      In Stock
                    </Badge>
                  )}
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

      {inventory.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No inventory items found for this farm
        </div>
      )}
    </div>
  );
}
