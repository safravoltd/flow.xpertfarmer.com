"use client";

import { useEffect, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchAllPages, downloadRowsAsExcel } from "@/lib/export-excel";
import { apiClient } from "@/lib/api-client";

type Dataset = { key: string; label: string };

function queryDate(value: string) {
  return value ? encodeURIComponent(value) : "";
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
        from && `createdFrom=${queryDate(from)}`,
        to && `createdTo=${queryDate(to)}`,
      ].filter(Boolean).join("&");
      const records = await fetchAllPages<Record<string, unknown>>(`/admin/exports/${dataset}${dateQuery ? `?${dateQuery}` : ""}`);
      const rows = records.map((record) => Object.fromEntries(
        Object.entries(record).map(([key, value]) => [
          key,
          value && typeof value === "object" ? JSON.stringify(value) : value,
        ]),
      ));
      const suffix = format === "csv" ? "csv" : "xlsx";
      const label = datasets.find((item) => item.key === dataset)?.label ?? dataset;
      downloadRowsAsExcel(rows, label, `xpert-farmer-${dataset}-${new Date().toISOString().slice(0, 10)}.${suffix}`, format);
      setMessage(`Exported ${rows.length.toLocaleString()} ${label.toLowerCase()}.`);
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
              {datasets.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
            </select>
          </label>
          <label className="space-y-2 text-sm font-medium">
            Format
            <select className="h-10 w-full rounded-md border bg-background px-3" value={format} onChange={(event) => setFormat(event.target.value as "xlsx" | "csv")}>
              <option value="xlsx">Excel workbook (.xlsx)</option>
              <option value="csv">CSV (.csv)</option>
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
