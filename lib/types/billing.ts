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
  billingCycle: "3 Installments" | "Annual Payment";

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
  status: "Pending" | "Paid" | "Partially Paid" | "Overdue";
  transactionId?: string;
  etrNumber?: string; // eTIMS number
  billingCycle: "3 Installments" | "Annual Payment";

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
