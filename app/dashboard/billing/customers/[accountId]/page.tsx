"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  MapPin,
  User,
  Calendar,
  Phone,
  Mail,
  Building,
  Tractor,
  Users,
  FileText,
  DollarSign,
  Edit,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import type { Customer, Invoice } from "@/lib/types/billing";

// Mock data - replace with actual API calls
const mockCustomer: Customer = {
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
  typeOfFarming: "General Cattle",
  numberOfLivestock: 5,
  numberOfEmployees: 1,
  numberOfFarms: 1,
  yearsOfExperience: 4,
  accountStatus: "Active",
  billingCycle: "3 Installments",
  createdAt: "2023-01-16T00:00:00Z",
  updatedAt: "2023-01-16T00:00:00Z",
};

const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-004",
    clientName: "Odambo Michael Oduor",
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
    id: "2",
    invoiceNumber: "INV-003",
    clientName: "Odambo Michael Oduor",
    accountId: "XP001",
    customerId: "1",
    invoiceDate: "2025-08-01",
    dueDate: "2025-09-01",
    paymentMethod: "M-Pesa",
    invoiceAmount: 3000,
    amountPaid: 3000,
    outstandingBalance: 0,
    status: "Paid",
    transactionId: "MP345678",
    billingCycle: "3 Installments",
    createdAt: "2025-08-01T00:00:00Z",
    updatedAt: "2025-08-01T00:00:00Z",
  },
];

export default function CustomerDetailsPage() {
  const params = useParams();
  const accountId = params.accountId as string;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API calls
    setTimeout(() => {
      setCustomer(mockCustomer);
      setInvoices(mockInvoices);
      setLoading(false);
    }, 1000);
  }, [accountId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Customer not found</p>
        <Link href="/dashboard/billing">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Billing
          </Button>
        </Link>
      </div>
    );
  }

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/billing">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight">
            Customer Details - {customer.accountId}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">{customer.name}</p>
        </div>
        <Button className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Customer
        </Button>
      </div>

      {/* Customer Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Customer Information</h2>
            <Badge variant={getStatusColor(customer.accountStatus)}>
              {customer.accountStatus}
            </Badge>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal Details</TabsTrigger>
              <TabsTrigger value="farm">Farm Details</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Full Name</p>
                      <p className="text-muted-foreground">{customer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Mobile Number</p>
                      <p className="text-muted-foreground">
                        {customer.mobileNumber}
                      </p>
                      {customer.additionalContact && (
                        <p className="text-xs text-muted-foreground">
                          Additional: {customer.additionalContact}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Email Address</p>
                      <p className="text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Date of Birth</p>
                      <p className="text-muted-foreground">
                        {new Date(customer.dateOfBirth).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Gender: {customer.gender}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">National ID</p>
                      <p className="text-muted-foreground">
                        {customer.nationalId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Residential Address</p>
                      <p className="text-muted-foreground">
                        {customer.residentialAddress.county},{" "}
                        {customer.residentialAddress.constituency}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ward: {customer.residentialAddress.ward}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="farm" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Farm Business Name</p>
                      <p className="text-muted-foreground">
                        {customer.farmBusinessName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Farm Location</p>
                      <p className="text-muted-foreground">
                        {customer.farmLocation.county},{" "}
                        {customer.farmLocation.constituency}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Ward: {customer.farmLocation.ward}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Tractor className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Farm Size & Ownership</p>
                      <p className="text-muted-foreground">
                        {customer.farmSize} acres • {customer.ownership}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Type of Farming</p>
                      <Badge variant="outline">{customer.typeOfFarming}</Badge>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Farm Statistics</p>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>Livestock: {customer.numberOfLivestock}</p>
                        <p>Employees: {customer.numberOfEmployees}</p>
                        <p>Farms: {customer.numberOfFarms}</p>
                        <p>Experience: {customer.yearsOfExperience} years</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Billing Summary */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Billing Summary</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Account Status</span>
              <Badge variant={getStatusColor(customer.accountStatus)}>
                {customer.accountStatus}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Billing Cycle</span>
              <span className="text-sm font-medium">
                {customer.billingCycle}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Registration Date</span>
              <span className="text-sm font-medium">
                {new Date(customer.registrationDate).toLocaleDateString()}
              </span>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Invoices</span>
                <span className="font-semibold">{invoices.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Outstanding Balance</span>
                <span className="font-semibold text-orange-600">
                  KSh{" "}
                  {invoices
                    .reduce((sum, inv) => sum + inv.outstandingBalance, 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Billing History */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Billing History</h2>
          <Button className="gap-2">
            <FileText className="h-4 w-4" />
            Create Invoice
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-semibold">
                  Invoice No.
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  Invoice Date
                </th>
                <th className="text-left py-3 px-4 font-semibold">Due Date</th>
                <th className="text-left py-3 px-4 font-semibold">
                  Payment Method
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  Invoice Amount
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  Amount Paid
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  Outstanding Balance
                </th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">
                  Transaction ID
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-border hover:bg-muted/50"
                >
                  <td className="py-3 px-4">
                    <Link
                      href={`/dashboard/billing/invoices/${invoice.invoiceNumber}`}
                    >
                      <Button
                        variant="link"
                        className="p-0 h-auto font-semibold text-primary"
                      >
                        {invoice.invoiceNumber}
                      </Button>
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(invoice.invoiceDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">{invoice.paymentMethod}</td>
                  <td className="py-3 px-4">
                    KSh {invoice.invoiceAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-green-600">
                    KSh {invoice.amountPaid.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-orange-600">
                    KSh {invoice.outstandingBalance.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        invoice.status === "Paid" ? "default" : "secondary"
                      }
                    >
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {invoice.transactionId || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
