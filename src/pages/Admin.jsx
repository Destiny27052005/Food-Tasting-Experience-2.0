import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { formatNaira } from "@/lib/tickets";

export default function AdminPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(true);

  useEffect(() => {
    document.title = "Organiser dashboard — CookWithTife Tasting Experience";

    async function loadAdminData() {
      // 1. Verify active Supabase session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }

      // 2. Fetch orders directly using authenticated client
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load orders:", error);
        // If RLS denies access, flag as unauthorized
        if (error.code === "42501" || error.message.includes("permission")) {
          setHasAccess(false);
        } else {
          toast.error("Could not load orders. Please try again.");
        }
      } else {
        setOrders(data || []);
      }

      setLoading(false);
    }

    loadAdminData();
  }, [navigate]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate("/auth");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-10 text-muted-foreground">
        Loading dashboard…
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center p-10 text-center">
        <h1 className="font-serif text-2xl">No admin access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This account does not have permission to view attendee orders.
        </p>
        <Button className="mt-6" variant="secondary" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    );
  }

  const paid = orders.filter((o) => o.status === "paid");
  const revenue = paid.reduce((sum, o) => sum + (o.amount_kobo ?? 0), 0);
  const prefCounts = paid.reduce((acc, o) => {
    const key = o.food_preference ?? "Unspecified";
    acc[key] = (acc[key] ?? 0) + (o.quantity ?? 1);
    return acc;
  }, {});

  function exportCsv() {
    const header = [
      "reference",
      "ticket_code",
      "name",
      "email",
      "phone",
      "company",
      "ticket_type",
      "quantity",
      "amount",
      "food_preference",
      "dietary_notes",
      "status",
      "created_at",
    ];

    const rows = orders.map((o) =>
      [
        o.reference,
        o.ticket_code,
        o.full_name,
        o.email,
        o.phone,
        o.company ?? "",
        o.ticket_type,
        o.quantity,
        (o.amount_kobo ?? 0) / 100,
        o.food_preference,
        (o.dietary_notes ?? "").replace(/\n/g, " "),
        o.status,
        o.created_at,
      ]
        .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );

    const blob = new Blob([[header.join(","), ...rows].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cookwithtife-orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="font-serif text-lg font-semibold">
          CookWithTife
        </Link>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={exportCsv}>
            Export CSV
          </Button>
          <Button variant="ghost" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-20">
        <h1 className="font-serif text-3xl">Orders</h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Paid orders" value={String(paid.length)} />
          <Stat
            label="Tickets sold"
            value={String(paid.reduce((s, o) => s + (o.quantity ?? 0), 0))}
          />
          <Stat label="Revenue" value={formatNaira(revenue)} />
        </div>

        <h2 className="mt-10 font-serif text-xl">Food preferences (paid)</h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {Object.entries(prefCounts).length === 0 && (
            <p className="text-sm text-muted-foreground">No paid orders yet.</p>
          )}
          {Object.entries(prefCounts).map(([pref, count]) => (
            <span
              key={pref}
              className="rounded-full border bg-card px-4 py-1.5 text-sm"
            >
              {pref}: <strong>{count}</strong>
            </span>
          ))}
        </div>

        <div className="mt-10 overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-3">Reference</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Ticket</th>
                <th className="p-3">Qty</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Food</th>
                <th className="p-3">Notes</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="p-3 font-mono text-xs">{o.reference}</td>
                  <td className="p-3">{o.full_name}</td>
                  <td className="p-3">{o.email}</td>
                  <td className="p-3">{o.phone}</td>
                  <td className="p-3">{o.ticket_type}</td>
                  <td className="p-3">{o.quantity}</td>
                  <td className="p-3">{formatNaira(o.amount_kobo ?? 0)}</td>
                  <td className="p-3">{o.food_preference}</td>
                  <td className="p-3 max-w-[16rem] truncate">
                    {o.dietary_notes || "—"}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        o.status === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={10}
                    className="p-6 text-center text-muted-foreground"
                  >
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-serif text-2xl">{value}</p>
    </div>
  );
}