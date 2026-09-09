import { apiClient } from "@/lib/api-client";
import type {
  Customer,
  Invoice,
  PaymentHistory,
  BillingStats,
  BillingCustomerDetail,
  BillingApiResponse,
  PaginatedBillingResponse,
} from "@/lib/types/billing";

/**
 * API Service for Billing and Customers
 */
export const billingService = {
  plans: {
    getAll: () =>
      apiClient.get<
        Array<{
          id: string;
          code: string;
          name: string;
          metric: string;
          minValue?: number | null;
          maxValue?: number | null;
          monthlyAmount: number | string;
          isActive: boolean;
        }>
      >("/billing/plans"),
  },
  // Customer Management
  customers: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.limit) searchParams.append("limit", params.limit.toString());
      if (params?.search) searchParams.append("search", params.search);
      if (params?.status) searchParams.append("status", params.status);

      return apiClient.get<PaginatedBillingResponse<Customer>>(
        `/billing/customers?${searchParams.toString()}`,
      );
    },

    getById: (id: string) =>
      apiClient.get<BillingApiResponse<Customer>>(`/billing/customers/${id}`),

    getByAccountId: (accountId: string) =>
      apiClient.get<BillingApiResponse<Customer>>(
        `/billing/customers/account/${accountId}`,
      ),

    create: (data: Partial<Customer>) =>
      apiClient.post<BillingApiResponse<Customer>>("/billing/customers", data),

    update: (id: string, data: Partial<Customer>) =>
      apiClient.put<BillingApiResponse<Customer>>(
        `/billing/customers/${id}`,
        data,
      ),

    updateStatus: (id: string, status: "Active" | "Suspended" | "Overdue") =>
      apiClient.patch<BillingApiResponse<Customer>>(
        `/billing/customers/${id}/status`,
        { status },
      ),

    delete: (id: string) => apiClient.delete<void>(`/billing/customers/${id}`),
  },

  // Invoice Management
  invoices: {
    getAll: (params?: {
      page?: number;
      limit?: number;
      status?: string;
      customerId?: string;
      sortBy?: "dueDate" | "invoiceDate" | "amount";
      sortOrder?: "asc" | "desc";
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.limit) searchParams.append("limit", params.limit.toString());
      if (params?.status) searchParams.append("status", params.status);
      if (params?.customerId)
        searchParams.append("customerId", params.customerId);
      if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) searchParams.append("sortOrder", params.sortOrder);

      return apiClient.get<PaginatedBillingResponse<Invoice>>(
        `/billing/invoices?${searchParams.toString()}`,
      );
    },

    getById: (id: string) =>
      apiClient.get<BillingApiResponse<Invoice>>(`/billing/invoices/${id}`),

    getByInvoiceNumber: (invoiceNumber: string) =>
      apiClient.get<BillingApiResponse<Invoice>>(
        `/billing/invoices/number/${invoiceNumber}`,
      ),

    getByCustomer: (customerId: string) =>
      apiClient.get<BillingApiResponse<Invoice[]>>(
        `/billing/invoices/customer/${customerId}`,
      ),

    create: (data: Partial<Invoice>) =>
      apiClient.post<BillingApiResponse<Invoice>>("/billing/invoices", data),

    update: (id: string, data: Partial<Invoice>) =>
      apiClient.put<BillingApiResponse<Invoice>>(
        `/billing/invoices/${id}`,
        data,
      ),

    updateStatus: (id: string, status: Invoice["status"]) =>
      apiClient.patch<BillingApiResponse<Invoice>>(
        `/billing/invoices/${id}/status`,
        { status },
      ),

    recordPayment: (
      id: string,
      data: {
        amountPaid: number;
        paymentMethod: string;
        transactionId: string;
      },
    ) =>
      apiClient.post<BillingApiResponse<Invoice>>(
        `/billing/invoices/${id}/payment`,
        data,
      ),

    delete: (id: string) => apiClient.delete<void>(`/billing/invoices/${id}`),
  },

  // Payment History
  payments: {
    getByInvoice: (invoiceId: string) =>
      apiClient.get<BillingApiResponse<PaymentHistory[]>>(
        `/billing/payments/invoice/${invoiceId}`,
      ),

    getByCustomer: (customerId: string) =>
      apiClient.get<BillingApiResponse<PaymentHistory[]>>(
        `/billing/payments/customer/${customerId}`,
      ),

    create: (data: Partial<PaymentHistory>) =>
      apiClient.post<BillingApiResponse<PaymentHistory>>(
        "/billing/payments",
        data,
      ),
  },

  // Statistics and Analytics
  stats: {
    getOverview: () =>
      apiClient.get<BillingApiResponse<BillingStats>>(
        "/billing/stats/overview",
      ),

    getMonthlyRevenue: (year?: number) =>
      apiClient.get<BillingApiResponse<{ month: string; revenue: number }[]>>(
        `/billing/stats/monthly-revenue${year ? `?year=${year}` : ""}`,
      ),

    getCustomerStats: () =>
      apiClient.get<
        BillingApiResponse<{
          totalCustomers: number;
          newThisMonth: number;
          activeCustomers: number;
          suspendedCustomers: number;
        }>
      >("/billing/stats/customers"),
  },

  // Billing Calculator
  calculator: {
    calculateBill: (data: {
      customerId: string;
      billingCycle: "3 Installments" | "Annual Payment";
      farmSize: number;
      numberOfEmployees: number;
      typeOfFarming: string;
    }) =>
      apiClient.post<
        BillingApiResponse<{
          baseAmount: number;
          discounts: number;
          totalAmount: number;
          installmentAmount?: number;
        }>
      >("/billing/calculator", data),
  },

  admin: {
    getSettings: () =>
      apiClient.get<{ key: string; value: string; description?: string }[]>(
        "/billing/admin/settings",
      ),
    updateSetting: (key: string, value: string) =>
      apiClient.patch(`/billing/admin/settings/${key}`, { value }),
    savePlan: (data: {
      code: string;
      name: string;
      metric: string;
      minValue?: number;
      maxValue?: number;
      monthlyAmount: number;
      isActive?: boolean;
    }) => apiClient.post("/billing/admin/plans", data),
    backfillAccounts: () =>
      apiClient.post<{ scannedUsers: number; createdAccounts: number }>(
        "/billing/admin/accounts/backfill",
      ),
    registerC2bUrls: () =>
      apiClient.post("/billing/admin/payments/mpesa/c2b/register-urls"),
    getCustomerDetails: (userId: string) =>
      apiClient.get<BillingCustomerDetail>(
        `/billing/admin/customers/${userId}`,
      ),
    provisionCustomer: (userId: string) =>
      apiClient.post<BillingCustomerDetail>(
        `/billing/admin/customers/${userId}/provision`,
      ),
    updateSubscriptionCycle: (
      subscriptionId: string,
      billingCycle: "MONTHLY" | "ANNUAL",
    ) =>
      apiClient.patch(`/billing/admin/subscriptions/${subscriptionId}`, {
        billingCycle,
      }),
    initiateStkPush: (invoiceId: string, phoneNumber: string) =>
      apiClient.post<{
        paymentId: string;
        checkoutRequestId: string;
        customerMessage?: string;
      }>(`/billing/admin/invoices/${invoiceId}/payments/mpesa/stk-push`, {
        phoneNumber,
      }),
    createPlanInvoice: (
      userId: string,
      subscriptionId: string,
      planId: string,
    ) =>
      apiClient.post<{ id: string; invoiceNumber: string }>(
        `/billing/admin/customers/${userId}/invoices`,
        { subscriptionId, planId },
      ),
    recordMpesaPayment: (
      invoiceId: string,
      data: { amount: number; receiptNumber: string; phoneNumber?: string },
    ) =>
      apiClient.post(
        `/billing/admin/invoices/${invoiceId}/payments/mpesa/manual`,
        data,
      ),
    overrideInvoicePlan: (invoiceId: string, planId: string) =>
      apiClient.patch<{ id: string; invoiceNumber: string }>(
        `/billing/admin/invoices/${invoiceId}/plan`,
        { planId },
      ),
  },
};
