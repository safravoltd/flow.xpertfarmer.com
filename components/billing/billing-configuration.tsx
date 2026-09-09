"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { billingService } from "@/lib/services/billing.service";

type Setting = { key: string; value: string; description?: string };
type Plan = { id: string; code: string; name: string; metric: string; minValue?: number | null; maxValue?: number | null; monthlyAmount: number | string; isActive: boolean };

export function BillingConfiguration() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [draft, setDraft] = useState({ code: "", name: "", metric: "LIVESTOCK_COUNT", minValue: "", maxValue: "", monthlyAmount: "" });

  const load = async () => {
    try {
      const [configuredSettings, configuredPlans] = await Promise.all([billingService.admin.getSettings(), billingService.plans.getAll()]);
      setSettings(configuredSettings);
      setPlans(configuredPlans);
    } catch { setMessage("Unable to load billing configuration."); }
  };
  useEffect(() => { load(); }, []);

  const saveSetting = async (setting: Setting) => {
    setSaving(setting.key);
    try { await billingService.admin.updateSetting(setting.key, setting.value); setMessage(`${setting.key} saved.`); }
    catch { setMessage(`Could not save ${setting.key}.`); }
    finally { setSaving(null); }
  };

  const backfill = async () => {
    setSaving("backfill");
    try { const result = await billingService.admin.backfillAccounts(); setMessage(`Backfill complete: ${result.createdAccounts} payment accounts created.`); await load(); }
    catch { setMessage("Backfill failed. Confirm that you are signed in as an administrator."); }
    finally { setSaving(null); }
  };

  const registerC2bUrls = async () => {
    setSaving("c2b");
    try { await billingService.admin.registerC2bUrls(); setMessage("M-Pesa C2B validation and confirmation URLs registered."); }
    catch { setMessage("Could not register C2B URLs. Confirm the public HTTPS callback URL and Daraja credentials."); }
    finally { setSaving(null); }
  };

  const savePlan = async () => {
    if (!draft.code || !draft.name || !draft.monthlyAmount) { setMessage("Code, name, and monthly amount are required."); return; }
    setSaving("plan");
    try {
      await billingService.admin.savePlan({ code: draft.code.trim().toUpperCase(), name: draft.name.trim(), metric: draft.metric, minValue: draft.minValue ? Number(draft.minValue) : undefined, maxValue: draft.maxValue ? Number(draft.maxValue) : undefined, monthlyAmount: Number(draft.monthlyAmount) });
      setMessage("Pricing plan saved."); setDraft({ code: "", name: "", metric: "LIVESTOCK_COUNT", minValue: "", maxValue: "", monthlyAmount: "" }); await load();
    } catch { setMessage("Could not save the pricing plan."); }
    finally { setSaving(null); }
  };

  return (
    <div className="space-y-6">
      {message && <p className="rounded-md bg-muted px-3 py-2 text-sm">{message}</p>}
      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><h3 className="font-semibold">Existing farmer migration</h3><p className="text-sm text-muted-foreground mt-1">Creates billing accounts and first invoices for existing farmers without changing accounts that already exist.</p></div>
          <Button onClick={backfill} disabled={saving === "backfill"}>{saving === "backfill" ? "Creating…" : "Create payment accounts"}</Button>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><h3 className="font-semibold">M-Pesa PayBill callbacks</h3><p className="text-sm text-muted-foreground mt-1">Register the configured public HTTPS validation and confirmation URLs once per Daraja environment. Do this only after filling the M-Pesa variables in the server environment.</p></div>
          <Button variant="outline" onClick={registerC2bUrls} disabled={saving === "c2b"}>{saving === "c2b" ? "Registering…" : "Register C2B URLs"}</Button>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold">Billing policies</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">These are live configuration values. In particular, pricing combination controls mixed crop and livestock farms.</p>
        <div className="grid gap-4 md:grid-cols-2">
          {settings.map((setting) => <div key={setting.key} className="rounded-lg border p-3">
            <label className="text-sm font-medium">{setting.key}</label>
            <p className="text-xs text-muted-foreground mt-1 min-h-8">{setting.description}</p>
            <div className="mt-2 flex gap-2"><Input value={setting.value} onChange={(event) => setSettings((current) => current.map((item) => item.key === setting.key ? { ...item, value: event.target.value } : item))} /><Button size="sm" onClick={() => saveSetting(setting)} disabled={saving === setting.key}>{saving === setting.key ? "Saving…" : "Save"}</Button></div>
          </div>)}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold">Seeded pricing plans</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">Initial plans are seeded only once. These values are now read from the database; future edits do not get overwritten at startup.</p>
        <div className="mb-5 grid gap-2 rounded-lg border bg-muted/30 p-3 md:grid-cols-6">
          <Input placeholder="Code" value={draft.code} onChange={(event) => setDraft({ ...draft, code: event.target.value })} />
          <Input placeholder="Plan name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
          <Input placeholder="Metric" value={draft.metric} onChange={(event) => setDraft({ ...draft, metric: event.target.value })} />
          <Input type="number" placeholder="Minimum" value={draft.minValue} onChange={(event) => setDraft({ ...draft, minValue: event.target.value })} />
          <Input type="number" placeholder="Maximum" value={draft.maxValue} onChange={(event) => setDraft({ ...draft, maxValue: event.target.value })} />
          <div className="flex gap-2"><Input type="number" placeholder="KES/month" value={draft.monthlyAmount} onChange={(event) => setDraft({ ...draft, monthlyAmount: event.target.value })} /><Button onClick={savePlan} disabled={saving === "plan"}>{saving === "plan" ? "Saving…" : "Save"}</Button></div>
          <p className="text-xs text-muted-foreground md:col-span-6">Metrics: LIVESTOCK_COUNT, CROPS_ACRES, or POULTRY_FLAT. Select a listed plan below to load it into this editor.</p>
        </div>
        <div className="space-y-2">{plans.map((plan) => <div key={plan.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"><div><span className="font-medium">{plan.name}</span><span className="ml-2 text-muted-foreground">{plan.metric} · {plan.minValue ?? "all"}{plan.maxValue ? `–${plan.maxValue}` : "+"}</span></div><div className="flex items-center gap-3"><Badge variant={plan.isActive ? "default" : "secondary"}>{plan.isActive ? "Active" : "Inactive"}</Badge><span className="font-semibold">KES {Number(plan.monthlyAmount).toLocaleString()}/month</span><Button size="sm" variant="outline" onClick={() => setDraft({ code: plan.code, name: plan.name, metric: plan.metric, minValue: plan.minValue?.toString() || "", maxValue: plan.maxValue?.toString() || "", monthlyAmount: String(plan.monthlyAmount) })}>Edit</Button></div></div>)}</div>
      </Card>
    </div>
  );
}
