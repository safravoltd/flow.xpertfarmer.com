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

export function downloadWorkbook(
  sheets: { name: string; rows: Record<string, unknown>[] }[],
  filename: string,
) {
  const workbook = XLSX.utils.book_new();
  const usedNames = new Set<string>();
  for (const sheet of sheets) {
    const base = sheet.name.replace(/[\\/?*\[\]:]/g, " ").trim().slice(0, 31) || "Sheet";
    let name = base;
    let suffix = 2;
    while (usedNames.has(name)) name = `${base.slice(0, 28)} (${suffix++})`;
    usedNames.add(name);
    const worksheet = XLSX.utils.json_to_sheet(sheet.rows);
    worksheet["!cols"] = Object.keys(sheet.rows[0] ?? {}).map((key) => ({
      wch: Math.min(Math.max(key.length + 2, 12), 36),
    }));
    XLSX.utils.book_append_sheet(workbook, worksheet, name);
  }
  XLSX.writeFile(workbook, filename, { bookType: "xlsx" });
}

export function exportDate(value?: string | Date | null) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
}
