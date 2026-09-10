"use client";

import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchAllPages, downloadRowsAsExcel, downloadWorkbook } from "@/lib/export-excel";
import { apiClient } from "@/lib/api-client";

type Dataset = { key: string; label: string };

function queryDate(value: string) {
  return value ? encodeURIComponent(value) : "";
}

type ExportRow = Record<string, unknown>;

function flattenRow(record: ExportRow): ExportRow {
  return Object.fromEntries(Object.entries(record).map(([key, value]) => [
    key,
    value && typeof value === "object" ? JSON.stringify(value) : value,
  ]));
}

function addRelationships(rows: ExportRow[], farms: ExportRow[], users: ExportRow[]) {
  const farmById = new Map(farms.map((farm) => [String(farm.id), farm]));
  const userById = new Map(users.map((user) => [String(user.id), user]));
  return rows.map((row) => {
    const farmId = row.farmId ? String(row.farmId) : undefined;
    const farm = farmId ? farmById.get(farmId) : undefined;
    const ownerId = row.userId ? String(row.userId) : farm?.userId ? String(farm.userId) : undefined;
    const owner = ownerId ? userById.get(ownerId) : undefined;
    const enriched: ExportRow = { ...row };
    if (farm) {
      enriched["Farm name"] = farm.name ?? "";
      enriched["Farm county"] = farm.county ?? "";
    }
    if (owner) {
      enriched["Owner name"] = `${owner.firstName ?? ""} ${owner.lastName ?? ""}`.trim();
      enriched["Owner phone"] = owner.phoneNumber ?? "";
      enriched["Owner email"] = owner.email ?? "";
    }
    return enriched;
  });
}

export default function ExportsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [dataset, setDataset] = useState("users");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [format, setFormat] = useState<"xlsx" | "csv">("xlsx");
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient.get<Dataset[]>("/admin/exports/catalog")
      .then((catalog) => {
        setDatasets(catalog);
        if (catalog.length && !catalog.some((item) => item.key === dataset)) setDataset(catalog[0].key);
      })
      .catch((catalogError) => setError(catalogError instanceof Error ? catalogError.message : "Unable to load export datasets"));
  }, []);

  const runExport = async () => {
    if (from && to && from > to) {
      setError("The start date cannot be after the end date.");
      return;
    }
    setExporting(true);
    setError(null);
    setMessage(null);
    try {
      const dateQuery = [
        from && `from=${queryDate(from)}`,
        to && `to=${queryDate(to)}`,
      ].filter(Boolean).join("&");
      if (dataset === "__all__" && format === "csv") throw new Error("All datasets must be exported as an Excel workbook with separate worksheets.");
      const references = await Promise.all([
        fetchAllPages<ExportRow>(`/admin/exports/farms${dateQuery ? `?${dateQuery}` : ""}`),
        fetchAllPages<ExportRow>(`/admin/exports/users${dateQuery ? `?${dateQuery}` : ""}`),
      ]);
      const selected = dataset === "__all__" ? datasets : datasets.filter((item) => item.key === dataset);
      const sheets = await Promise.all(selected.map(async (item) => {
        const records = await fetchAllPages<ExportRow>(`/admin/exports/${item.key}${dateQuery ? `?${dateQuery}` : ""}`);
        return { name: item.label, rows: addRelationships(records.map(flattenRow), ...references) };
      }));
      if (dataset === "__all__") {
        downloadWorkbook(sheets, `xpert-farmer-all-data-${new Date().toISOString().slice(0, 10)}.xlsx`);
        setMessage(`Exported ${sheets.length} datasets into one workbook.`);
      } else {
        const sheet = sheets[0];
        const suffix = format === "csv" ? "csv" : "xlsx";
        downloadRowsAsExcel(sheet.rows, sheet.name, `xpert-farmer-${dataset}-${new Date().toISOString().slice(0, 10)}.${suffix}`, format);
        setMessage(`Exported ${sheet.rows.length.toLocaleString()} ${sheet.name.toLowerCase()}.`);
      }
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Data exports</h1>
        <p className="mt-2 text-muted-foreground">Download filtered operational data for reporting and reconciliation.</p>
      </div>
      <Card className="max-w-3xl p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm font-medium">
            Dataset
            <select className="h-10 w-full rounded-md border bg-background px-3" value={dataset} onChange={(event) => setDataset(event.target.value)}>
              <option value="__all__">All datasets (one Excel workbook)</option>
              {datasets.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium">
            Format
            <select className="h-10 w-full rounded-md border bg-background px-3" value={format} onChange={(event) => setFormat(event.target.value as "xlsx" | "csv")}>
              <option value="xlsx">Excel workbook (.xlsx)</option>
              <option value="csv" disabled={dataset === "__all__"}>CSV (.csv)</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium">
            Created from
            <input className="h-10 w-full rounded-md border bg-background px-3" type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
          </label>
          <label className="space-y-2 text-sm font-medium">
            Created to
            <input className="h-10 w-full rounded-md border bg-background px-3" type="date" value={to} onChange={(event) => setTo(event.target.value)} />
          </label>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button onClick={runExport} disabled={exporting}>
            {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {exporting ? "Preparing export..." : "Download export"}
          </Button>
          {message && <span className="text-sm text-green-600">{message}</span>}
          {error && <span className="text-sm text-destructive">{error}</span>}
        </div>
      </Card>
    </div>
  );
}
