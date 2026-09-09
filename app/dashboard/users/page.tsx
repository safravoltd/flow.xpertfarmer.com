"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Download, Loader2 } from "lucide-react";
import { UsersTable } from "@/components/users/users-table";
import { CreateUserDialog } from "@/components/users/create-user-dialog";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Loading from "./loading";
import { fetchAllPages, downloadRowsAsExcel, exportDate } from "@/lib/export-excel";
import type { User } from "@/lib/types/api";

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const exportUsers = async () => {
    setIsExporting(true);
    setExportError(null);
    try {
      const users = await fetchAllPages<User>("/users");
      downloadRowsAsExcel(
        users.map((user) => ({
          ID: user.id,
          "First name": user.firstName,
          "Middle name": user.middleName ?? "",
          "Last name": user.lastName,
          Email: user.email,
          Phone: user.phoneNumber,
          Gender: user.gender,
          "Date of birth": exportDate(user.dob),
          "National ID": user.nationalId,
          "Business number": user.businessNumber ?? "",
          County: user.residenceCounty,
          Location: user.residenceLocation,
          Constituency: user.constituency || user.residenceConstituency,
          "Years of experience": user.yearsOfExperience,
          Verified: user.isVerified ? "Yes" : "No",
          "Farm count": user.farms?.length ?? 0,
          "Farm names": user.farms?.map((farm) => farm.name).join(", ") ?? "",
          "Created at": exportDate(user.createdAt),
          "Updated at": exportDate(user.updatedAt),
        })),
        "Users",
        `xpert-farmer-users-${new Date().toISOString().slice(0, 10)}.xlsx`,
      );
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "Failed to export users");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground mt-2">
              Manage system users and their permissions
            </p>
          </div>
          <Button variant="outline" onClick={exportUsers} disabled={isExporting}>
            {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {isExporting ? "Exporting..." : "Export Excel"}
          </Button>
        </div>
        {exportError && <p className="text-sm text-destructive">{exportError}</p>}

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <UsersTable
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              roleFilter={roleFilter}
            />
          </div>
        </Card>

        <CreateUserDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    </Suspense>
  );
}
