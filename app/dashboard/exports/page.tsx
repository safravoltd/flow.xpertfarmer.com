"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchAllPages, downloadRowsAsExcel, exportDate } from "@/lib/export-excel";
import type { Farm, User } from "@/lib/types/api";

type Dataset = "users" | "farms";

function queryDate(value: string) {
  return value ? encodeURIComponent(value) : "";
}

export default function ExportsPage() {
  const [dataset, setDataset] = useState<Dataset>("users");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [format, setFormat] = useState<"xlsx" | "csv">("xlsx");
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      const records = dataset === "users"
        ? await fetchAllPages<User>(`/users${dateQuery ? `?${dateQuery}` : ""}`)
        : await fetchAllPages<Farm>(`/farms${dateQuery ? `?${dateQuery}` : ""}`);
      const rows = dataset === "users"
        ? (records as User[]).map((user) => ({
            ID: user.id,
            "First name": user.firstName,
            "Middle name": user.middleName ?? "",
            "Last name": user.lastName,
            Email: user.email,
            Phone: user.phoneNumber,
            County: user.residenceCounty,
            Location: user.residenceLocation,
            Verified: user.isVerified ? "Yes" : "No",
            "Farm count": user.farms?.length ?? 0,
            "Farm names": user.farms?.map((farm) => farm.name).join(", ") ?? "",
            "Created at": exportDate(user.createdAt),
          }))
        : (records as Farm[]).map((farm) => ({
            ID: farm.id,
            "Farm name": farm.name,
            County: farm.county,
            Location: farm.administrativeLocation,
            "Size (acres)": farm.size,
            Ownership: farm.ownership,
            "Farming types": farm.farmingTypes?.join(", ") ?? "",
            "Owner name": farm.user ? `${farm.user.firstName} ${farm.user.lastName}`.trim() : "",
            "Owner phone": farm.user?.phoneNumber ?? "",
            "Owner email": farm.user?.email ?? "",
            "Created at": exportDate(farm.createdAt),
          }));
      const suffix = format === "csv" ? "csv" : "xlsx";
      downloadRowsAsExcel(rows, dataset === "users" ? "Users" : "Farms", `xpert-farmer-${dataset}-${new Date().toISOString().slice(0, 10)}.${suffix}`, format);
      setMessage(`Exported ${rows.length.toLocaleString()} ${dataset}.`);
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
            <select className="h-10 w-full rounded-md border bg-background px-3" value={dataset} onChange={(event) => setDataset(event.target.value as Dataset)}>
              <option value="users">Users</option>
              <option value="farms">Farms</option>
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
