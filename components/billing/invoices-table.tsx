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
  DollarSign,
  Calendar,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Invoice } from "@/lib/types/billing";

interface InvoicesTableProps {
  searchTerm: string;
  statusFilter: string;
}

// Mock data - replace with actual API call
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-010",
    clientName: "Jane Achieng",
    accountId: "XP005",
    customerId: "5",
    invoiceDate: "2025-09-05",
    dueDate: "2025-10-05",
    paymentMethod: "M-Pesa",
    invoiceAmount: 4500,
    amountPaid: 0,
    outstandingBalance: 4500,
    status: "Pending",
    billingCycle: "3 Installments",
    createdAt: "2025-09-05T00:00:00Z",
    updatedAt: "2025-09-05T00:00:00Z",
  },
  {
    id: "2",
    invoiceNumber: "INV-009",
    clientName: "Peter Otieno",
    accountId: "XP004",
    customerId: "4",
    invoiceDate: "2025-09-02",
    dueDate: "2025-10-02",
    paymentMethod: "M-Pesa",
    invoiceAmount: 3800,
    amountPaid: 0,
    outstandingBalance: 3800,
    status: "Pending",
    billingCycle: "3 Installments",
    createdAt: "2025-09-02T00:00:00Z",
    updatedAt: "2025-09-02T00:00:00Z",
  },
  {
    id: "3",
    invoiceNumber: "INV-008",
    clientName: "Michael Oduor",
    accountId: "XP001",
    customerId: "1",
    invoiceDate: "2025-09-01",
    dueDate: "2025-10-01",
    paymentMethod: "M-Pesa",
    invoiceAmount: 3000,
    amountPaid: 0,
    outstandingBalance: 3000,
    status: "Pending",
    billingCycle: "3 Installments",
    createdAt: "2025-09-01T00:00:00Z",
    updatedAt: "2025-09-01T00:00:00Z",
  },
  {
    id: "4",
    invoiceNumber: "INV-007",
    clientName: "Grace Wanjiku",
    accountId: "XP003",
    customerId: "3",
    invoiceDate: "2025-08-28",
    dueDate: "2025-09-28",
    paymentMethod: "M-Pesa",
    invoiceAmount: 6000,
    amountPaid: 2000,
    outstandingBalance: 4000,
    status: "Partially Paid",
    transactionId: "MP789012",
    billingCycle: "3 Installments",
    createdAt: "2025-08-28T00:00:00Z",
    updatedAt: "2025-08-28T00:00:00Z",
  },
  {
    id: "5",
    invoiceNumber: "INV-006",
    clientName: "Samuel Kiptoo",
    accountId: "XP002",
    customerId: "2",
    invoiceDate: "2025-08-20",
    dueDate: "2025-09-20",
    paymentMethod: "M-Pesa",
    invoiceAmount: 5200,
    amountPaid: 5200,
    outstandingBalance: 0,
    status: "Paid",
    transactionId: "MP567890",
    billingCycle: "Annual Payment",
    createdAt: "2025-08-20T00:00:00Z",
    updatedAt: "2025-08-20T00:00:00Z",
  },
];

export function InvoicesTable({
  searchTerm,
  statusFilter,
}: InvoicesTableProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // TODO: Replace with actual API call
    setLoading(true);
    setTimeout(() => {
      // Sort by due date (upcoming first)
      const sortedInvoices = [...mockInvoices].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
      );
      setInvoices(sortedInvoices);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.accountId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      invoice.status.toLowerCase().replace(" ", "-") ===
        statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleViewInvoice = (invoiceNumber: string) => {
    router.push(`/dashboard/billing/invoices/${invoiceNumber}`);
  };

  const handleViewCustomer = (accountId: string) => {
    router.push(`/dashboard/billing/customers/${accountId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "default";
      case "pending":
        return "secondary";
      case "partially paid":
        return "outline";
      case "overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

  const isOverdue = (dueDate: string, status: string) => {
    return new Date(dueDate) < new Date() && status !== "Paid";
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
            <th className="text-left py-3 px-4 font-semibold">Invoice No.</th>
            <th className="text-left py-3 px-4 font-semibold">Client Name</th>
            <th className="text-left py-3 px-4 font-semibold">Account ID</th>
            <th className="text-left py-3 px-4 font-semibold">Invoice Date</th>
            <th className="text-left py-3 px-4 font-semibold">Due Date</th>
            <th className="text-left py-3 px-4 font-semibold">Amount (KES)</th>
            <th className="text-left py-3 px-4 font-semibold">
              Amount Paid (KES)
            </th>
            <th className="text-left py-3 px-4 font-semibold">
              Outstanding (KES)
            </th>
            <th className="text-left py-3 px-4 font-semibold">Status</th>
            <th className="text-right py-3 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((invoice) => {
            const overdue = isOverdue(invoice.dueDate, invoice.status);

            return (
              <tr
                key={invoice.id}
                className={`border-b border-border hover:bg-muted/50 transition-colors ${
                  overdue ? "bg-red-50/50" : ""
                }`}
              >
                <td className="py-3 px-4">
                  <Button
                    variant="link"
                    className="p-0 h-auto font-semibold text-primary"
                    onClick={() => handleViewInvoice(invoice.invoiceNumber)}
                  >
                    {invoice.invoiceNumber}
                  </Button>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3 text-muted-foreground" />
                    {invoice.clientName}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-sm text-muted-foreground hover:text-primary"
                    onClick={() => handleViewCustomer(invoice.accountId)}
                  >
                    {invoice.accountId}
                  </Button>
                </td>
                <td className="py-3 px-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(invoice.invoiceDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div
                    className={`flex items-center gap-1 ${overdue ? "text-red-600" : "text-muted-foreground"}`}
                  >
                    <Calendar className="h-3 w-3" />
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    {invoice.invoiceAmount.toLocaleString()}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-green-600" />
                    <span className="text-green-600">
                      {invoice.amountPaid.toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-orange-600" />
                    <span
                      className={
                        invoice.outstandingBalance > 0
                          ? "text-orange-600 font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {invoice.outstandingBalance.toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant={
                      overdue ? "destructive" : getStatusColor(invoice.status)
                    }
                  >
                    {overdue ? "Overdue" : invoice.status}
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
                        onClick={() => handleViewInvoice(invoice.invoiceNumber)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleViewCustomer(invoice.accountId)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        View Customer
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit Invoice
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {filteredInvoices.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No invoices found matching your criteria
        </div>
      )}
    </div>
  );
}
