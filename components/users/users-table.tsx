"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import type { User, ApiResponse } from "@/lib/types/api";

interface UsersTableProps {
  searchTerm: string;
  statusFilter: string;
  roleFilter: string;
}

export function UsersTable({
  searchTerm,
  statusFilter,
  roleFilter,
}: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const { get, loading, error } = useApi();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await get<ApiResponse<User[]>>("/users?limit=100");
      if (response?.data) {
        setUsers(response.data);
      }
    };
    fetchUsers();
  }, [get]);

  const filteredUsers =
    users?.filter((user) => {
      const name =
        `${user.firstName || ""} ${user.middleName || ""} ${user.lastName || ""}`.trim();
      const email = user.email || "";

      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (user.isVerified ? "active" : "inactive") === statusFilter;
      const matchesRole = roleFilter === "all" || "farmer" === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    }) || [];

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
        Failed to load users: {error.message}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold">Name</th>
            <th className="text-left py-3 px-4 font-semibold">Email</th>
            <th className="text-left py-3 px-4 font-semibold">Phone</th>
            <th className="text-left py-3 px-4 font-semibold">County</th>
            <th className="text-left py-3 px-4 font-semibold">Status</th>
            <th className="text-left py-3 px-4 font-semibold">Farms</th>
            <th className="text-right py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => {
            const name =
              `${user.firstName || ""} ${user.middleName || ""} ${user.lastName || ""}`.trim();
            const status = user.isVerified ? "active" : "inactive";
            return (
              <tr
                key={user.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-4 font-medium">{name || "N/A"}</td>
                <td className="py-3 px-4 text-muted-foreground">
                  {user.email || "N/A"}
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {user.phoneNumber || "N/A"}
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {user.residenceCounty || "N/A"}
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={status === "active" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {status}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  {user.farms?.length || 0} farms
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

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No users found
        </div>
      )}
    </div>
  );
}
