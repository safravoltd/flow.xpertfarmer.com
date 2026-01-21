// Auth Types
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: "admin" | "manager" | "user";
  token: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

// User Types
export interface User {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  dob: string;
  residenceCounty: string;
  residenceLocation: string;
  constituency: string;
  residenceConstituency: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
  businessNumber?: string;
  yearsOfExperience: number;
  otp?: string;
  otpExpiry?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  farms?: Farm[];
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
  role: string;
}

export interface UpdateUserInput {
  email?: string;
  name?: string;
  role?: string;
  status?: "active" | "inactive";
}

// Farm Types
export interface Farm {
  id: string;
  name: string;
  county: string;
  administrativeLocation: string;
  size: number;
  ownership: string;
  farmingTypes: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  };
}

export interface CreateFarmInput {
  name: string;
  county: string;
  administrativeLocation: string;
  size: number;
  ownership: string;
  farmingTypes: string[];
}

export interface UpdateFarmInput {
  name?: string;
  county?: string;
  administrativeLocation?: string;
  size?: number;
  ownership?: string;
  farmingTypes?: string[];
}

// Employee Types
export interface Employee {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  emergencyContact?: string;
  idNumber: string;
  idPhoto?: string;
  employeeType: "permanent" | "contract" | "casual";
  dateOfEmployment: string;
  endDate?: string;
  role: string;
  customRole?: string;
  paymentSchedule: "daily" | "weekly" | "monthly";
  salary: number;
  typeOfEngagement?: string;
  workSchedule?: string;
  pin?: string;
  otp?: string;
  otpExpiry?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  farms?: {
    id: string;
    employeeId: string;
    farmId: string;
    createdAt: string;
    updatedAt: string;
    farm: {
      id: string;
      name: string;
      county: string;
      administrativeLocation: string;
    };
  }[];
  benefits?: {
    id: string;
    employeeId: string;
    name: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface CreateEmployeeInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  emergencyContact?: string;
  idNumber: string;
  employeeType: "permanent" | "contract" | "casual";
  dateOfEmployment: string;
  role: string;
  paymentSchedule: "daily" | "weekly" | "monthly";
  salary: number;
  farmId: string;
}

export interface UpdateEmployeeInput {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  emergencyContact?: string;
  employeeType?: "permanent" | "contract" | "casual";
  role?: string;
  paymentSchedule?: "daily" | "weekly" | "monthly";
  salary?: number;
}

// Livestock Types
export interface Livestock {
  id: string;
  type: string;
  breed: string;
  farmId: string;
  count: number;
  status: "healthy" | "sick" | "recovered";
  lastCheckupDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLivestockInput {
  type: string;
  breed: string;
  farmId: string;
  count: number;
  lastCheckupDate: string;
}

export interface UpdateLivestockInput {
  type?: string;
  breed?: string;
  count?: number;
  status?: "healthy" | "sick" | "recovered";
}

// Inventory Types
export interface Inventory {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  farmId: string;
  reorderLevel: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryInput {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  farmId: string;
  reorderLevel: number;
}

export interface UpdateInventoryInput {
  name?: string;
  category?: string;
  quantity?: number;
  unit?: string;
  reorderLevel?: number;
}

// Sales Types (Based on actual API response)
export interface Sale {
  id: string;
  farmId: string;
  name: string;
  category: string;
  breed?: string;
  age?: string;
  weight?: number;
  price: number;
  status: "available" | "sold" | "pending";
  health?: string;
  lastCheckup?: string;
  animalId?: string;
  livestockId?: string;
  purpose?: string;
  feedingProgram?: string;
  milkProduction?: number;
  pregnancyStatus?: string;
  beefQuality?: string;
  milkQuality?: string;
  milkYield?: number;
  milkingDate?: string;
  homeUseQuantity?: number;
  saleQuantity?: number;
  quantity: number;
  pricePerBird?: number;
  eggProductionRate?: number;
  woolYield?: number;
  milkProductionRate?: number;
  notes?: string;
  images: string[];
  saleDate?: string;
  buyerName?: string;
  buyerContact?: string;
  buyerType?: string;
  saleAmount?: number;
  marketPrice?: number;
  salePrice?: number;
  paymentMethod?: string;
  receiptNumber?: string;
  saleNotes?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  farm?: {
    id: string;
    name: string;
    county: string;
    administrativeLocation: string;
  };
}

export interface CreateSaleInput {
  farmId: string;
  name: string;
  category: string;
  breed?: string;
  age?: string;
  weight?: number;
  price: number;
  quantity: number;
  purpose?: string;
  notes?: string;
}

export interface UpdateSaleInput {
  name?: string;
  category?: string;
  breed?: string;
  age?: string;
  weight?: number;
  price?: number;
  quantity?: number;
  status?: "available" | "sold" | "pending";
  notes?: string;
}

// Paginated Response
export interface PaginatedResponse<T> {
  data: T[];
  meta?: {
    total: number;
    page: number;
    pages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
}

// API Error
export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}
