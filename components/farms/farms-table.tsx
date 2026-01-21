"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "@/lib/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit2, Trash2, Loader2, MapPin, User } from "lucide-react";
import type { Farm, ApiResponse } from "@/lib/types/api";

interface FarmsTableProps {
  searchTerm: string;
}

export function FarmsTable({ searchTerm }: FarmsTableProps) {
  const [farms, setFarms] = useState<Farm[]>([]);
  const { get, loading, error } = useApi();
  const router = useRouter();

  useEffect(() => {
    const fetchFarms = async () => {
      const response = await get<ApiResponse<Farm[]>>("/farms?limit=100");
      if (response?.data) {
        setFarms(response.data);
      }
    };
    fetchFarms();
  }, [get]);

  const filteredFarms =
    farms?.filter((farm) => {
      const name = farm.name || "";
      const county = farm.county || "";
      const location = farm.administrativeLocation || "";
      const owner = farm.user
        ? `${farm.user.firstName} ${farm.user.lastName}`
        : "";

      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        county.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }) || [];

  const handleViewFarm = (farmId: string) => {
    router.push(`/dashboard/farms/${farmId}`);
  };

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
        Failed to load farms: {error.message}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold">Farm Name</th>
            <th className="text-left py-3 px-4 font-semibold">Location</th>
            <th className="text-left py-3 px-4 font-semibold">Size</th>
            <th className="text-left py-3 px-4 font-semibold">Owner</th>
            <th className="text-left py-3 px-4 font-semibold">Farming Types</th>
            <th className="text-left py-3 px-4 font-semibold">Ownership</th>
            <th className="text-right py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFarms.map((farm) => (
            <tr
              key={farm.id}
              className="border-b border-border hover:bg-muted/50 transition-colors"
            >
              <td className="py-3 px-4 font-medium">{farm.name}</td>
              <td className="py-3 px-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {farm.county}, {farm.administrativeLocation}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-muted-foreground">
                {farm.size} acres
              </td>
              <td className="py-3 px-4 text-muted-foreground">
                {farm.user ? (
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>
                      {farm.user.firstName} {farm.user.lastName}
                    </span>
                  </div>
                ) : (
                  "N/A"
                )}
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1">
                  {farm.farmingTypes.slice(0, 2).map((type, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                  {farm.farmingTypes.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{farm.farmingTypes.length - 2} more
                    </Badge>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge variant="outline" className="capitalize">
                  {farm.ownership}
                </Badge>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewFarm(farm.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
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
          ))}
        </tbody>
      </table>

      {filteredFarms.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No farms found
        </div>
      )}
    </div>
  );
}
