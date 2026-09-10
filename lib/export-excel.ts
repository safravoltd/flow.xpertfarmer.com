import * as XLSX from "xlsx";
import { apiClient } from "./api-client";

type PaginatedResponse<T> = {
  data?: T[];
  meta?: {
    total?: number;
    hasNextPage?: boolean;
    pages?: number;
  };
};

/** Fetches every page from the standard XP API paginated list endpoints. */
export async function fetchAllPages<T>(endpoint: string, pageSize = 100): Promise<T[]> {
  const records: T[] = [];
  let page = 1;

  while (true) {
    const separator = endpoint.includes("?") ? "&" : "?";
    const response = await apiClient.get<T[] | PaginatedResponse<T>>(
      `${endpoint}${separator}page=${page}&limit=${pageSize}`,
    );
    const batch = Array.isArray(response) ? response : response.data ?? [];
    records.push(...batch);

    if (Array.isArray(response)) break;
    const meta = response.meta;
    if (!meta?.hasNextPage && (!meta?.pages || page >= meta.pages)) break;
    if (batch.length === 0) break;
    page += 1;
  }

  return records;
}

export function downloadRowsAsExcel(
  rows: Record<string, unknown>[],
  sheetName: string,
  filename: string,
  format: "xlsx" | "csv" = "xlsx",
) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet["!cols"] = Object.keys(rows[0] ?? {}).map((key) => ({
    wch: Math.min(Math.max(key.length + 2, 12), 36),
  }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  XLSX.writeFile(workbook, filename, { bookType: format === "csv" ? "csv" : "xlsx" });
}

export function exportDate(value?: string | Date | null) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
}
