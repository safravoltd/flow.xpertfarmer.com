"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  DollarSign,
  FileText,
  AlertTriangle,
  Search,
  Plus,
  Filter,
  Download,
} from "lucide-react";
import { CustomersTable } from "@/components/billing/customers-table";
import { InvoicesTable } from "@/components/billing/invoices-table";
import { BillingStats } from "@/components/billing/billing-stats";
import { BillingConfiguration } from "@/components/billing/billing-configuration";

export default function BillingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("customers");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Billing Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage customers, invoices, and payment tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <BillingStats />

      {/* Main Content */}
      <Card className="p-6">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-xl grid-cols-3">
              <TabsTrigger
                value="customers"
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Customers
              </TabsTrigger>
              <TabsTrigger value="invoices" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Invoices
              </TabsTrigger>
              <TabsTrigger value="configuration" className="flex items-center gap-2">Configuration</TabsTrigger>
            </TabsList>

            {/* Search and Filters */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  {activeTab === "invoices" && (
                    <>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partially-paid">
                        Partially Paid
                      </SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="customers" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Customer Management</h2>
                <p className="text-muted-foreground">
                  Manage customer accounts and billing information
                </p>
              </div>
            </div>
            <CustomersTable
              searchTerm={searchTerm}
              statusFilter={statusFilter}
            />
          </TabsContent>

          <TabsContent value="invoices" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Invoice Management</h2>
                <p className="text-muted-foreground">
                  Track invoices, payments, and outstanding balances
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Invoice
              </Button>
            </div>
            <InvoicesTable
              searchTerm={searchTerm}
              statusFilter={statusFilter}
            />
          </TabsContent>
          <TabsContent value="configuration" className="space-y-4">
            <div><h2 className="text-2xl font-semibold">Pricing and billing policy</h2><p className="text-muted-foreground">Configure trial, reminders, mixed-farming calculations, and migrate existing farmers.</p></div>
            <BillingConfiguration />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
