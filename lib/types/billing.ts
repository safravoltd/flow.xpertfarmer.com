// Billing and Customer Types

export interface Customer {
  id: string;
  accountId: string; // XP001, XP002, etc.
  registrationDate: string;
  name: string;
  mobileNumber: string;
  additionalContact?: string;
  email: string;
  nationalId: string;
  gender: "Male" | "Female";
  dateOfBirth: string;
  businessNumber?: string;

  // Address
  residentialAddress: {
    county: string;
    constituency: string;
    ward: string;
  };

  // Farm Details
  farmBusinessName: string;
  farmLocation: {
    county: string;
    constituency: string;
    ward: string;
  };
  farmSize: number; // in acres
  ownership: "Freehold" | "Leasehold" | "Rental";
  typeOfFarming: string;
  numberOfLivestock: number;
  numberOfEmployees: number;
  numberOfFarms: number;
  yearsOfExperience: number;

  // Billing Status
  accountStatus: "Active" | "Overdue" | "Suspended";
  billingCycle: "Monthly Payment" | "3 Installments" | "Annual Payment";

  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // INV-001, INV-002, etc.
  clientName: string;
  accountId: string;
  customerId: string;
  invoiceDate: string;
  dueDate: string;
  paymentMethod: "M-Pesa" | "Bank Transfer" | "Cash" | "Cheque";
  invoiceAmount: number;
  amountPaid: number;
  outstandingBalance: number;
  status:
    "Open" | "Pending" | "Paid" | "Partially Paid" | "Overdue" | "Unpriced";
  transactionId?: string;
  etrNumber?: string; // eTIMS number
  billingCycle: "Monthly Payment" | "3 Installments" | "Annual Payment";

  createdAt: string;
  updatedAt: string;
}

export interface PaymentHistory {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  paymentDate: string;
  paymentMethod: "M-Pesa" | "Bank Transfer" | "Cash" | "Cheque";
  amountPaid: number;
  transactionId: string;
  status: "Success" | "Failed" | "Pending";

  createdAt: string;
  updatedAt: string;
}

export interface BillingStats {
  totalCustomers: number;
  activeCustomers: number;
  suspendedCustomers: number;
  overdueCustomers: number;
  totalInvoices: number;
  pendingInvoices: number;
  paidInvoices: number;
  totalRevenue: number;
  outstandingAmount: number;
  monthlyRevenue: number;
}

export interface BillingCustomerDetail {
  billingAccount: {
    id: string;
    accountNumber: string;
    status: string;
    createdAt: string;
  } | null;
  customer: {
    id: string;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    email?: string | null;
    phoneNumber: string;
    nationalId?: string | null;
    residenceCounty?: string | null;
    residenceLocation?: string | null;
    constituency?: string | null;
    yearsOfExperience?: number | null;
    farms: Array<{
      id: string;
      name: string;
      county: string;
      administrativeLocation: string;
      size: number;
      ownership: string;
      farmingTypes: string[];
    }>;
  };
  subscriptions: Array<{
    id: string;
    farmId: string;
    farmName: string;
    billingCycle: "MONTHLY" | "ANNUAL";
    status: string;
    startedAt: string;
    trialEndsAt: string;
    currentPeriodStartAt?: string | null;
    currentPeriodEndAt?: string | null;
    graceEndsAt?: string | null;
    suspendedAt?: string | null;
  }>;
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    subscriptionId: string;
    status: string;
    issuedAt: string;
    dueAt: string;
    totalAmount: number;
    amountPaid: number;
    balanceDue: number;
    billingCycle: "MONTHLY" | "ANNUAL";
    lines: Array<{
      description: string;
      amount: number;
      planName?: string | null;
    }>;
    payments: Array<{
      id: string;
      provider: string;
      status: string;
      amount: number;
      receiptNumber?: string | null;
      createdAt: string;
    }>;
  }>;
}

// API Response Types
export interface BillingApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedBillingResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  success: boolean;
}
