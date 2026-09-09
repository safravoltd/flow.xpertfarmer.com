"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit2,
  MoreHorizontal,
  Loader2,
  MapPin,
  Phone,
  Building,
  Users,
  Tractor,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Customer } from "@/lib/types/billing";
import { billingService } from "@/lib/services/billing.service";

interface CustomersTableProps {
  searchTerm: string;
  statusFilter: string;
}

// Mock data - replace with actual API call
const mockCustomers: Customer[] = [
  {
    id: "1",
    accountId: "XP001",
    registrationDate: "2023-01-16",
    name: "Odambo Michael Oduor",
    mobileNumber: "0713605461",
    additionalContact: "0732720802",
    email: "odambomichael@gmail.com",
    nationalId: "36964092",
    gender: "Male",
    dateOfBirth: "1999-01-16",
    businessNumber: undefined,
    residentialAddress: {
      county: "Siaya",
      constituency: "Rarieda",
      ward: "West Uyoma",
    },
    farmBusinessName: "Wandeu Koulo",
    farmLocation: {
      county: "Siaya",
      constituency: "Rarieda",
      ward: "West Uyoma",
    },
    farmSize: 5,
    ownership: "Freehold",
    typeOfFarming: "Cattle",
    numberOfLivestock: 5,
    numberOfEmployees: 1,
    numberOfFarms: 1,
    yearsOfExperience: 4,
    accountStatus: "Active",
    billingCycle: "3 Installments",
    createdAt: "2023-01-16T00:00:00Z",
    updatedAt: "2023-01-16T00:00:00Z",
  },
  {
    id: "2",
    accountId: "XP002",
    registrationDate: "2025-08-12",
    name: "Jane Atieno Onyango",
    mobileNumber: "0722456789",
    email: "jane.atieno@email.com",
    nationalId: "12345678",
    gender: "Female",
    dateOfBirth: "1985-03-20",
    residentialAddress: {
      county: "Kisumu",
      constituency: "Kisumu Central",
      ward: "Central",
    },
    farmBusinessName: "Green Valley Farm",
    farmLocation: {
      county: "Kisumu",
      constituency: "Kisumu Central",
      ward: "Central",
    },
    farmSize: 200,
    ownership: "Freehold",
    typeOfFarming: "Chickens, Cattle",
    numberOfLivestock: 210,
    numberOfEmployees: 3,
    numberOfFarms: 2,
    yearsOfExperience: 8,
    accountStatus: "Active",
    billingCycle: "Annual Payment",
    createdAt: "2025-08-12T00:00:00Z",
    updatedAt: "2025-08-12T00:00:00Z",
  },
  {
    id: "3",
    accountId: "XP003",
    registrationDate: "2025-08-12",
    name: "Peter Mwangi Kamau",
    mobileNumber: "0701345678",
    email: "peter.kamau@email.com",
    nationalId: "87654321",
    gender: "Male",
    dateOfBirth: "1978-07-10",
    residentialAddress: {
      county: "Nyeri",
      constituency: "Mathira",
      ward: "Mathira East",
    },
    farmBusinessName: "Kamau Agro Estate",
    farmLocation: {
      county: "Nyeri",
      constituency: "Mathira",
      ward: "Mathira East",
    },
    farmSize: 15,
    ownership: "Freehold",
    typeOfFarming: "Dairy Cows",
    numberOfLivestock: 15,
    numberOfEmployees: 5,
    numberOfFarms: 1,
    yearsOfExperience: 12,
    accountStatus: "Overdue",
    billingCycle: "3 Installments",
    createdAt: "2025-08-12T00:00:00Z",
    updatedAt: "2025-08-12T00:00:00Z",
  },
];

export function CustomersTable({
  searchTerm,
  statusFilter,
}: CustomersTableProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      try { const response = await billingService.customers.getAll({ limit: 100 }); setCustomers(response.data); }
      catch (error) { console.error("Failed to load billing customers:", error); }
      finally { setLoading(false); }
    };
    loadCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.mobileNumber.includes(searchTerm) ||
      customer.farmBusinessName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      customer.accountStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleViewCustomer = (accountId: string) => {
    router.push(`/dashboard/billing/customers/${accountId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "overdue":
        return "destructive";
      case "suspended":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-4 font-semibold">Account ID</th>
            <th className="text-left py-3 px-4 font-semibold">
              Registration Date
            </th>
            <th className="text-left py-3 px-4 font-semibold">Name of User</th>
            <th className="text-left py-3 px-4 font-semibold">Mobile Number</th>
            <th className="text-left py-3 px-4 font-semibold">
              Farm Business Name
            </th>
            <th className="text-left py-3 px-4 font-semibold">Farm Location</th>
            <th className="text-left py-3 px-4 font-semibold">
              Type of Farming
            </th>
            <th className="text-left py-3 px-4 font-semibold">Employees</th>
            <th className="text-left py-3 px-4 font-semibold">Farms</th>
            <th className="text-left py-3 px-4 font-semibold">Status</th>
            <th className="text-right py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer) => (
            <tr
              key={customer.id}
              className="border-b border-border hover:bg-muted/50 transition-colors"
            >
              <td className="py-3 px-4">
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-primary"
                  onClick={() => handleViewCustomer(customer.accountId)}
                >
                  {customer.accountId}
                </Button>
              </td>
              <td className="py-3 px-4 text-muted-foreground">
                {new Date(customer.registrationDate).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 font-medium">{customer.name}</td>
              <td className="py-3 px-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {customer.mobileNumber}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-1">
                  <Building className="h-3 w-3 text-muted-foreground" />
                  {customer.farmBusinessName}
                </div>
              </td>
              <td className="py-3 px-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {customer.farmLocation.constituency}
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge variant="outline" className="text-xs">
                  {customer.typeOfFarming}
                </Badge>
              </td>
              <td className="py-3 px-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  {customer.numberOfEmployees}
                </div>
              </td>
              <td className="py-3 px-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Tractor className="h-3 w-3 text-muted-foreground" />
                  {customer.numberOfFarms}
                </div>
              </td>
              <td className="py-3 px-4">
                <Badge variant={getStatusColor(customer.accountStatus)}>
                  {customer.accountStatus}
                </Badge>
              </td>
              <td className="py-3 px-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleViewCustomer(customer.accountId)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Customer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No customers found matching your criteria
        </div>
      )}
    </div>
  );
}
