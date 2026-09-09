"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Download, Loader2 } from "lucide-react";
import { FarmsTable } from "@/components/farms/farms-table";
import { CreateFarmDialog } from "@/components/farms/create-farm-dialog";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { fetchAllPages, downloadRowsAsExcel, exportDate } from "@/lib/export-excel";
import type { Farm } from "@/lib/types/api";

export default function FarmsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const exportFarms = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      const farms = await fetchAllPages<Farm>("/farms");
      downloadRowsAsExcel(
        farms.map((farm) => ({
          ID: farm.id,
          "Farm name": farm.name,
          County: farm.county,
          Location: farm.administrativeLocation,
          "Size (acres)": farm.size,
          Ownership: farm.ownership,
          "Farming types": farm.farmingTypes?.join(", ") ?? "",
          "Owner ID": farm.user?.id ?? farm.userId,
          "Owner name": farm.user ? `${farm.user.firstName} ${farm.user.lastName}`.trim() : "",
          "Owner phone": farm.user?.phoneNumber ?? "",
          "Owner email": farm.user?.email ?? "",
          "Created at": exportDate(farm.createdAt),
          "Updated at": exportDate(farm.updatedAt),
        })),
        "Farms",
        `xpert-farmer-farms-${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Failed to export farms");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farms</h1>
          <p className="text-muted-foreground mt-2">
            Manage all farm properties and operations
          </p>
        </div>
        <Button variant="outline" onClick={exportFarms} disabled={isExporting}>
          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {isExporting ? "Exporting..." : "Export Excel"}
        </Button>
      </div>
      {exportError && <p className="text-sm text-destructive">{exportError}</p>}

      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search farms by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Suspense fallback={null}>
            <FarmsTable searchTerm={searchTerm} />
          </Suspense>
        </div>
      </Card>

      <CreateFarmDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
