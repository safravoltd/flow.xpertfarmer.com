"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { FarmsTable } from "@/components/farms/farms-table";
import { CreateFarmDialog } from "@/components/farms/create-farm-dialog";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function FarmsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const searchParams = useSearchParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Farms</h1>
          <p className="text-muted-foreground mt-2">
            Manage all farm properties and operations
          </p>
        </div>
      </div>

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
