import { apiClient } from "@/lib/api-client";
import type {
  User,
  Farm,
  Employee,
  Livestock,
  Inventory,
  Sale,
  CreateUserInput,
  CreateFarmInput,
  CreateEmployeeInput,
  CreateLivestockInput,
  CreateInventoryInput,
  CreateSaleInput,
  UpdateUserInput,
  UpdateFarmInput,
  UpdateEmployeeInput,
  UpdateLivestockInput,
  UpdateInventoryInput,
  UpdateSaleInput,
  PaginatedResponse,
  ApiResponse,
} from "@/lib/types/api";

/**
 * API Service for Users
 */
export const userService = {
  getAll: () => apiClient.get<ApiResponse<User[]>>("/users"),
  getById: (id: string) => apiClient.get<ApiResponse<User>>(`/users/${id}`),
  create: (data: CreateUserInput) =>
    apiClient.post<ApiResponse<User>>("/users", data),
  update: (id: string, data: UpdateUserInput) =>
    apiClient.put<ApiResponse<User>>(`/users/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/users/${id}`),
};

/**
 * API Service for Farms
 */
export const farmService = {
  getAll: () => apiClient.get<ApiResponse<Farm[]>>("/farms"),
  getById: (id: string) => apiClient.get<ApiResponse<Farm>>(`/farms/${id}`),
  create: (data: CreateFarmInput) =>
    apiClient.post<ApiResponse<Farm>>("/farms", data),
  update: (id: string, data: UpdateFarmInput) =>
    apiClient.put<ApiResponse<Farm>>(`/farms/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/farms/${id}`),
};

/**
 * API Service for Employees
 */
export const employeeService = {
  getAll: (farmId?: string) => {
    const url = farmId ? `/employees?farmId=${farmId}` : "/employees";
    return apiClient.get<PaginatedResponse<Employee>>(url);
  },
  getById: (id: string) =>
    apiClient.get<ApiResponse<Employee>>(`/employees/${id}`),
  create: (data: CreateEmployeeInput) =>
    apiClient.post<ApiResponse<Employee>>("/employees", data),
  update: (id: string, data: UpdateEmployeeInput) =>
    apiClient.put<ApiResponse<Employee>>(`/employees/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/employees/${id}`),
};

/**
 * API Service for Livestock
 */
export const livestockService = {
  getAll: (farmId?: string) => {
    const url = farmId ? `/livestock?farmId=${farmId}` : "/livestock";
    return apiClient.get<PaginatedResponse<Livestock>>(url);
  },
  getById: (id: string) =>
    apiClient.get<ApiResponse<Livestock>>(`/livestock/${id}`),
  create: (data: CreateLivestockInput) =>
    apiClient.post<ApiResponse<Livestock>>("/livestock", data),
  update: (id: string, data: UpdateLivestockInput) =>
    apiClient.put<ApiResponse<Livestock>>(`/livestock/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/livestock/${id}`),
};

/**
 * API Service for Inventory
 */
export const inventoryService = {
  getAll: (farmId?: string) => {
    const url = farmId ? `/inventory?farmId=${farmId}` : "/inventory";
    return apiClient.get<PaginatedResponse<Inventory>>(url);
  },
  getById: (id: string) =>
    apiClient.get<ApiResponse<Inventory>>(`/inventory/${id}`),
  create: (data: CreateInventoryInput) =>
    apiClient.post<ApiResponse<Inventory>>("/inventory", data),
  update: (id: string, data: UpdateInventoryInput) =>
    apiClient.put<ApiResponse<Inventory>>(`/inventory/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/inventory/${id}`),
};

/**
 * API Service for Sales
 */
export const saleService = {
  getAll: (farmId?: string) => {
    const url = farmId ? `/sales?farmId=${farmId}` : "/sales";
    return apiClient.get<ApiResponse<Sale[]>>(url);
  },
  getById: (id: string) => apiClient.get<ApiResponse<Sale>>(`/sales/${id}`),
  create: (data: CreateSaleInput) =>
    apiClient.post<ApiResponse<Sale>>("/sales", data),
  update: (id: string, data: UpdateSaleInput) =>
    apiClient.put<ApiResponse<Sale>>(`/sales/${id}`, data),
  delete: (id: string) => apiClient.delete<void>(`/sales/${id}`),

  /**
   * Get sales statistics
   */
  getStats: (farmId?: string) => {
    const url = farmId ? `/sales/stats?farmId=${farmId}` : "/sales/stats";
    return apiClient.get<{
      totalSales: number;
      totalRevenue: number;
      averageOrderValue: number;
    }>(url);
  },
};
