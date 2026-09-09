"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  Phone,
  RefreshCw,
  Send,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { billingService } from "@/lib/services/billing.service";
import type { BillingCustomerDetail } from "@/lib/types/billing";

type BillingPlan = {
  id: string;
  code: string;
  name: string;
  metric: string;
  monthlyAmount: number | string;
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);

const date = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("en-KE") : "—";

function statusVariant(status: string) {
  if (["ACTIVE", "TRIAL", "PAID", "SUCCESS"].includes(status)) return "default";
  if (["SUSPENDED", "TERMINATED", "FAILED", "OVERDUE"].includes(status))
    return "destructive";
  return "secondary";
}

export default function UserDetailsPage() {
  const params = useParams<{ userId: string }>();
  const userId = params.userId;
  const [detail, setDetail] = useState<BillingCustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [overrideSubscriptionId, setOverrideSubscriptionId] = useState("");
  const [overridePlanId, setOverridePlanId] = useState("");
  const [overrideInvoiceId, setOverrideInvoiceId] = useState("");
  const [reconcileInvoiceId, setReconcileInvoiceId] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [reconcileAmount, setReconcileAmount] = useState("");

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [customer, activePlans] = await Promise.all([
        billingService.admin.getCustomerDetails(userId),
        billingService.plans.getAll(),
      ]);
      setDetail(customer);
      setPlans(activePlans);
      setPhoneNumber(customer.customer.phoneNumber || "");
      const payableInvoice = customer.invoices.find(
        (invoice) =>
          invoice.balanceDue > 0 &&
          !["PAID", "VOID", "UNPRICED"].includes(invoice.status),
      );
      setInvoiceId(payableInvoice?.id || "");
      setOverrideSubscriptionId(
        (current) => current || customer.subscriptions[0]?.id || "",
      );
      setOverridePlanId((current) => current || activePlans[0]?.id || "");
      setOverrideInvoiceId(
        (current) =>
          current ||
          customer.invoices.find((invoice) => invoice.status === "UNPRICED")
            ?.id ||
          "",
      );
      setReconcileInvoiceId((current) => current || payableInvoice?.id || "");
      setReconcileAmount(
        (current) => current || String(payableInvoice?.balanceDue || ""),
      );
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load the customer.",
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const provision = async () => {
    setAction("provision");
    try {
      const customer = await billingService.admin.provisionCustomer(userId);
      setDetail(customer);
      setPhoneNumber(customer.customer.phoneNumber || "");
      setMessage("Billing account, subscriptions, and first invoices created.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not create the billing account.",
      );
    } finally {
      setAction(null);
    }
  };

  const updateCycle = async (
    subscriptionId: string,
    billingCycle: "MONTHLY" | "ANNUAL",
  ) => {
    setAction(`cycle-${subscriptionId}`);
    try {
      await billingService.admin.updateSubscriptionCycle(
        subscriptionId,
        billingCycle,
      );
      setMessage(
        "Subscription cycle updated and its unpaid invoice recalculated.",
      );
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not update the subscription cycle.",
      );
    } finally {
      setAction(null);
    }
  };

  const sendStkPush = async () => {
    if (!invoiceId || !phoneNumber.trim()) {
      setMessage(
        "Select an unpaid invoice and enter the phone number to receive the prompt.",
      );
      return;
    }
    if (
      !window.confirm(`Send an M-Pesa payment prompt to ${phoneNumber.trim()}?`)
    )
      return;

    setAction("stk");
    try {
      const result = await billingService.admin.initiateStkPush(
        invoiceId,
        phoneNumber.trim(),
      );
      setMessage(
        result.customerMessage ||
          "STK Push sent. Payment will update after the M-Pesa callback is received.",
      );
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not send the STK Push.",
      );
    } finally {
      setAction(null);
    }
  };

  const createPlanInvoice = async () => {
    if (!overrideSubscriptionId || !overridePlanId) {
      setMessage("Select both a farm subscription and a billing plan.");
      return;
    }
    if (
      !window.confirm(
        "Replace unpaid invoices for this subscription with the selected current-period plan?",
      )
    )
      return;
    setAction("override");
    try {
      const invoice = await billingService.admin.createPlanInvoice(
        userId,
        overrideSubscriptionId,
        overridePlanId,
      );
      setInvoiceId(invoice.id);
      setReconcileInvoiceId(invoice.id);
      setMessage(
        `${invoice.invoiceNumber} created. You can now send the M-Pesa prompt or reconcile a completed payment.`,
      );
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not create the plan invoice.",
      );
    } finally {
      setAction(null);
    }
  };

  const makeInvoicePayable = async () => {
    if (!overrideInvoiceId || !overridePlanId) {
      setMessage("Select the generated invoice and a billing plan.");
      return;
    }
    if (
      !window.confirm(
        "Apply this plan to the selected invoice and make it payable?",
      )
    )
      return;
    setAction("invoice-override");
    try {
      const invoice = await billingService.admin.overrideInvoicePlan(
        overrideInvoiceId,
        overridePlanId,
      );
      setInvoiceId(invoice.id);
      setReconcileInvoiceId(invoice.id);
      setMessage(
        `${invoice.invoiceNumber} is now payable and ready for an STK Push.`,
      );
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not make the invoice payable.",
      );
    } finally {
      setAction(null);
    }
  };

  const reconcileMpesaPayment = async () => {
    const amount = Number(reconcileAmount);
    if (
      !reconcileInvoiceId ||
      !receiptNumber.trim() ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setMessage(
        "Select an invoice and enter the receipt code and amount paid.",
      );
      return;
    }
    if (
      !window.confirm(
        "Record this M-Pesa receipt? This will allocate the payment and activate the subscription once fully paid.",
      )
    )
      return;
    setAction("reconcile");
    try {
      await billingService.admin.recordMpesaPayment(reconcileInvoiceId, {
        amount,
        receiptNumber: receiptNumber.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
      });
      setReceiptNumber("");
      setMessage("M-Pesa receipt recorded and payment allocation completed.");
      await load();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not record the M-Pesa receipt.",
      );
    } finally {
      setAction(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="space-y-4">
        <p className="text-destructive">{message || "Customer not found."}</p>
        <Link href="/dashboard/users">
          <Button variant="outline">Back to users</Button>
        </Link>
      </div>
    );
  }

  const { customer, billingAccount, subscriptions, invoices } = detail;
  const name = [customer.firstName, customer.middleName, customer.lastName]
    .filter(Boolean)
    .join(" ");
  const payableInvoices = invoices.filter(
    (invoice) =>
      invoice.balanceDue > 0 &&
      !["PAID", "VOID", "UNPRICED"].includes(invoice.status),
  );
  const unpricedInvoices = invoices.filter(
    (invoice) => invoice.status === "UNPRICED",
  );
  const outstanding = invoices.reduce(
    (total, invoice) => total + invoice.balanceDue,
    0,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <Link href="/dashboard/users">
            <Button variant="outline" size="icon" aria-label="Back to users">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
            <p className="mt-1 text-muted-foreground">
              Customer and billing profile
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={load} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {message && (
        <p className="rounded-md bg-muted px-3 py-2 text-sm" role="status">
          {message}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <UserRound className="h-5 w-5" />
            <h2 className="font-semibold">Customer details</h2>
          </div>
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{customer.phoneNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{customer.email || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">National ID</p>
              <p className="font-medium">{customer.nationalId || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Location</p>
              <p className="font-medium">
                {[
                  customer.residenceCounty,
                  customer.constituency,
                  customer.residenceLocation,
                ]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </p>
            </div>
          </div>
          <div className="mt-5 border-t pt-4">
            <p className="mb-2 text-sm font-medium">Farms</p>
            <div className="flex flex-wrap gap-2">
              {customer.farms.map((farm) => (
                <Badge key={farm.id} variant="outline">
                  {farm.name} · {farm.size} acres
                </Badge>
              ))}
              {!customer.farms.length && (
                <span className="text-sm text-muted-foreground">
                  No farms recorded.
                </span>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            <h2 className="font-semibold">Billing account</h2>
          </div>
          {billingAccount ? (
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">PayBill account number</p>
                <p className="font-mono text-lg font-semibold">
                  {billingAccount.accountNumber}
                </p>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <Badge variant={statusVariant(billingAccount.status)}>
                  {billingAccount.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Outstanding</span>
                <span className="font-semibold text-orange-600">
                  {money(outstanding)}
                </span>
              </div>
              <p className="border-t pt-3 text-xs text-muted-foreground">
                For an offline PayBill payment, use this account number as the
                account reference.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                This existing farmer has no billing account yet.
              </p>
              <Button onClick={provision} disabled={action === "provision"}>
                {action === "provision"
                  ? "Creating…"
                  : "Create billing account"}
              </Button>
            </div>
          )}
        </Card>
      </div>

      {billingAccount && (
        <>
          <Card className="p-5">
            <div className="mb-4">
              <h2 className="font-semibold">Make generated invoice payable</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use this for a zero-value{" "}
                <span className="font-medium">UNPRICED</span> invoice. The
                selected plan updates that same invoice’s amount and balance, so
                it can be paid by STK Push immediately.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <Select
                value={overrideInvoiceId}
                onValueChange={setOverrideInvoiceId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select generated invoice" />
                </SelectTrigger>
                <SelectContent>
                  {unpricedInvoices.map((invoice) => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {invoice.invoiceNumber} · {date(invoice.dueAt)}
                    </SelectItem>
                  ))}
                  {!unpricedInvoices.length && (
                    <SelectItem value="none" disabled>
                      No unpriced invoices
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Select value={overridePlanId} onValueChange={setOverridePlanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select billing plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} · {money(Number(plan.monthlyAmount))}/month
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={makeInvoicePayable}
                disabled={
                  action === "invoice-override" ||
                  !unpricedInvoices.length ||
                  !plans.length
                }
              >
                {action === "invoice-override" ? "Updating…" : "Make payable"}
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4">
              <h2 className="font-semibold">Admin pricing override</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select a configured plan to create or replace an unpaid invoice
                for the current billing period. Paid or partially paid invoices
                are never changed.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <Select
                value={overrideSubscriptionId}
                onValueChange={setOverrideSubscriptionId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select farm subscription" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptions.map((subscription) => (
                    <SelectItem key={subscription.id} value={subscription.id}>
                      {subscription.farmName} ·{" "}
                      {subscription.billingCycle.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={overridePlanId} onValueChange={setOverridePlanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select billing plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} · {money(Number(plan.monthlyAmount))}/month
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={createPlanInvoice}
                disabled={
                  action === "override" ||
                  !subscriptions.length ||
                  !plans.length
                }
              >
                {action === "override" ? "Creating…" : "Price current period"}
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <Send className="h-5 w-5" />
              <div>
                <h2 className="font-semibold">Send M-Pesa STK Push</h2>
                <p className="text-sm text-muted-foreground">
                  A payment prompt is sent only for the selected unpaid invoice.
                </p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <Select value={invoiceId} onValueChange={setInvoiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unpaid invoice" />
                </SelectTrigger>
                <SelectContent>
                  {payableInvoices.map((invoice) => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {invoice.invoiceNumber} · {money(invoice.balanceDue)}
                    </SelectItem>
                  ))}
                  {!payableInvoices.length && (
                    <SelectItem value="none" disabled>
                      No payable invoices
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <Input
                aria-label="M-Pesa phone number"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="0712345678"
              />
              <Button
                onClick={sendStkPush}
                disabled={action === "stk" || !payableInvoices.length}
              >
                <Phone className="mr-2 h-4 w-4" />
                {action === "stk" ? "Sending…" : "Send prompt"}
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-4">
              <h2 className="font-semibold">
                Reconcile completed M-Pesa payment
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use this only when the customer has paid but the Daraja callback
                did not update the system. The receipt code is checked to
                prevent duplicate allocation.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <Select
                value={reconcileInvoiceId}
                onValueChange={(value) => {
                  setReconcileInvoiceId(value);
                  const invoice = invoices.find((item) => item.id === value);
                  setReconcileAmount(invoice ? String(invoice.balanceDue) : "");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select invoice" />
                </SelectTrigger>
                <SelectContent>
                  {payableInvoices.map((invoice) => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {invoice.invoiceNumber} · {money(invoice.balanceDue)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                aria-label="M-Pesa receipt code"
                value={receiptNumber}
                onChange={(event) => setReceiptNumber(event.target.value)}
                placeholder="M-Pesa receipt code"
              />
              <Input
                aria-label="Amount paid"
                type="number"
                min="1"
                value={reconcileAmount}
                onChange={(event) => setReconcileAmount(event.target.value)}
                placeholder="Amount paid"
              />
              <Button
                variant="outline"
                onClick={reconcileMpesaPayment}
                disabled={action === "reconcile" || !payableInvoices.length}
              >
                {action === "reconcile" ? "Recording…" : "Record payment"}
              </Button>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold">Subscriptions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Pricing tiers are calculated from farm data and the plans
              configured in Billing. You can change the billing cycle here; this
              safely regenerates only unpaid invoices.
            </p>
            <div className="mt-4 space-y-3">
              {subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="grid items-center gap-3 rounded-md border p-3 md:grid-cols-[1fr_auto_auto]"
                >
                  <div>
                    <p className="font-medium">{subscription.farmName}</p>
                    <p className="text-sm text-muted-foreground">
                      Trial ends {date(subscription.trialEndsAt)}
                    </p>
                  </div>
                  <Badge variant={statusVariant(subscription.status)}>
                    {subscription.status}
                  </Badge>
                  <Select
                    value={subscription.billingCycle}
                    onValueChange={(value: "MONTHLY" | "ANNUAL") =>
                      updateCycle(subscription.id, value)
                    }
                    disabled={action === `cycle-${subscription.id}`}
                  >
                    <SelectTrigger className="w-full md:w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="ANNUAL">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
              {!subscriptions.length && (
                <p className="text-sm text-muted-foreground">
                  No subscriptions yet.
                </p>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold">Invoices and payments</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="p-2">Invoice</th>
                    <th className="p-2">Due</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Balance</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Pricing details</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b">
                      <td className="p-2 font-medium">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="p-2">{date(invoice.dueAt)}</td>
                      <td className="p-2">{money(invoice.totalAmount)}</td>
                      <td className="p-2">{money(invoice.balanceDue)}</td>
                      <td className="p-2">
                        <Badge variant={statusVariant(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="p-2 text-muted-foreground">
                        {invoice.lines
                          .map(
                            (line) =>
                              `${line.description} (${money(line.amount)})`,
                          )
                          .join(", ") || "—"}
                        {invoice.payments.length
                          ? ` · ${invoice.payments.map((payment) => payment.receiptNumber || payment.status).join(", ")}`
                          : ""}
                      </td>
                    </tr>
                  ))}
                  {!invoices.length && (
                    <tr>
                      <td className="p-3 text-muted-foreground" colSpan={6}>
                        No invoices have been created.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
