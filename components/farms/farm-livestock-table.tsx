"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Loader2, Heart, Calendar } from "lucide-react";
import type { Livestock, PaginatedResponse } from "@/lib/types/api";

interface FarmLivestockTableProps {
  farmId: string;
}

export function FarmLivestockTable({ farmId }: FarmLivestockTableProps) {
  const [livestock, setLivestock] = useState<Livestock[]>([]);
  const { get, loading, error } = useApi();

  useEffect(() => {
    const fetchLivestock = async () => {
      const response = await get<PaginatedResponse<Livestock>>(
        `/livestock?farmId=${farmId}`,
      );
      if (response?.data) {
        setLivestock(response.data);
      }
    };
    fetchLivestock();
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
        Failed to load livestock: {error.message}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold">Type & Breed</th>
            <th className="text-left py-3 px-4 font-semibold">Count</th>
            <th className="text-left py-3 px-4 font-semibold">Health Status</th>
            <th className="text-left py-3 px-4 font-semibold">Last Checkup</th>
            <th className="text-left py-3 px-4 font-semibold">Purpose</th>
            <th className="text-right py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {livestock.map((animal) => {
            const lastCheckup = animal.lastCheckupDate
              ? new Date(animal.lastCheckupDate).toLocaleDateString()
              : "N/A";

            return (
              <tr
                key={animal.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-4 font-medium">
                  <div>
                    <span className="capitalize">{animal.type}</span>
                    {animal.breed && (
                      <div className="text-xs text-muted-foreground">
                        {animal.breed}
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <span className="font-semibold">{animal.count}</span> animals
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    <Badge
                      variant={
                        animal.status === "healthy"
                          ? "default"
                          : animal.status === "sick"
                            ? "destructive"
                            : "secondary"
                      }
                      className="capitalize"
                    >
                      {animal.status}
                    </Badge>
                  </div>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{lastCheckup}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  General farming
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

      {livestock.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No livestock records found for this farm
        </div>
      )}
    </div>
  );
}
