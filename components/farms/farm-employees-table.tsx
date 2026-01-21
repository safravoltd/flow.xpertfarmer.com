"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/lib/hooks/use-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Edit2,
  Trash2,
  Loader2,
  Phone,
  Calendar,
  DollarSign,
} from "lucide-react";
import type { Employee, PaginatedResponse } from "@/lib/types/api";

interface FarmEmployeesTableProps {
  farmId: string;
}

export function FarmEmployeesTable({ farmId }: FarmEmployeesTableProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { get, loading, error } = useApi();

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await get<PaginatedResponse<Employee>>(
        `/employees?farmId=${farmId}`,
      );
      if (response?.data) {
        setEmployees(response.data);
      }
    };
    fetchEmployees();
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
        Failed to load employees: {error.message}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold">Name</th>
            <th className="text-left py-3 px-4 font-semibold">Role</th>
            <th className="text-left py-3 px-4 font-semibold">Contact</th>
            <th className="text-left py-3 px-4 font-semibold">Employment</th>
            <th className="text-left py-3 px-4 font-semibold">Salary</th>
            <th className="text-left py-3 px-4 font-semibold">Status</th>
            <th className="text-right py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => {
            const name =
              `${employee.firstName} ${employee.middleName || ""} ${employee.lastName}`.trim();
            const employmentDate = new Date(
              employee.dateOfEmployment,
            ).toLocaleDateString();

            return (
              <tr
                key={employee.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-4 font-medium">{name}</td>
                <td className="py-3 px-4">
                  <Badge variant="outline" className="capitalize">
                    {employee.role}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{employee.phone}</span>
                  </div>
                  {employee.emergencyContact && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Emergency: {employee.emergencyContact}
                    </div>
                  )}
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{employmentDate}</span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="text-xs mt-1 capitalize"
                  >
                    {employee.employeeType}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span>KSh {employee.salary.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {employee.paymentSchedule}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={employee.isVerified ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {employee.isVerified ? "verified" : "pending"}
                  </Badge>
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

      {employees.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No employees found for this farm
        </div>
      )}
    </div>
  );
}
