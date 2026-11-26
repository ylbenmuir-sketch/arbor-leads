import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import { site } from "@/content";
import { adminConfigured, isAdmin } from "@/lib/server/admin";
import { stepLabel } from "@/lib/server/followups";
import { supabase, type Lead } from "@/lib/server/leads";
import { logout } from "./actions";
import LocalDate from "./LocalDate";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: `Leads | ${site.name}`,
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "booked", label: "Booked" },
  { key: "not-booked", label: "Not booked" },
  { key: "partial", label: "Partial" },
] as const;
type Filter = (typeof FILTERS)[number]["key"];

/** Most rows shown at once. */
const LIMIT = 200;

type ReportRow = { id: string; lead_id: string; status: string; score: number | null; created_at: string };
type FollowupRow = { lead_id: string; step: number; status: string };
type Row = { lead: Lead; report: ReportRow | null; followups: FollowupRow[] };

/** Everything the page shows. Runs on the server only, with the service role key, which never reaches the browser. */
async function loadLeads(filter: Filter) {
  const db = supabase();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  let query = db.from("leads").select("*").order("created_at", { ascending: false }).limit(LIMIT);
  if (filter === "booked") query = query.eq("status", "booked");
  if (filter === "not-booked") query = query.eq("status", "new");
  if (filter === "partial") query = query.eq("status", "partial");

  const [leadsRes, weekRes, sentRes, bookedRes] = await Promise.all([
    query.overrideTypes<Lead[], { merge: false }>(),
    db.from("leads").select("id", { count: "exact", head: true }).gte("created_at", weekAgo).neq("status", "partial"),
    db.from("reports").select("id", { count: "exact", head: true }).eq("status", "sent"),
    db.from("leads").select("id", { count: "exact", head: true }).eq("status", "booked"),
  ]);
  if (leadsRes.error) throw new Error(`Loading leads: ${leadsRes.error.message}`);
  const leads = leadsRes.data ?? [];
  const ids = leads.map((l) => l.id);

  const [reportsRes, followupsRes] = ids.length
    ? await Promise.all([
        db
          .from("reports")
          .select("id, lead_id, status, created_at, score:raw_data->score->total")
          .in("lead_id", ids)
          .order("created_at", { ascending: false })
          .overrideTypes<ReportRow[], { merge: false }>(),
        db.from("lead_followups").select("lead_id, step, status").in("lead_id", ids).overrideTypes<FollowupRow[], { merge: false }>(),
      ])
    : [null, null];

  const latestReport = new Map<string, ReportRow>();
  for (const r of reportsRes?.data ?? []) if (!latestReport.has(r.lead_id)) latestReport.set(r.lead_id, r);
  const followups = new Map<string, FollowupRow[]>();
  for (const f of followupsRes?.data ?? []) followups.set(f.lead_id, [...(followups.get(f.lead_id) ?? []), f]);

  const rows: Row[] = leads.map((lead) => ({
    lead,
    report: latestReport.get(lead.id) ?? null,
    followups: (followups.get(lead.id) ?? []).sort((a, b) => a.step - b.step),
  }));

  return {
    rows,
    counts: { week: weekRes.count ?? 0, sent: sentRes.count ?? 0, booked: bookedRes.count ?? 0 },
    // The follow-ups table only exists once its migration has been run.
    followupsMissing: Boolean(followupsRes?.error),
  };
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    partial: "border-line text-muted",
    new: "border-forest bg-forest text-cream",
    booked: "border-sage bg-sage text-bg",
  };
  return (
    <span className={`inline-block rounded-sm border-2 px-2 py-0.5 text-xs font-bold uppercase tracking-[0.12em] ${styles[status] ?? "border-line text-cream"}`}>
      {status}
    </span>
  );
}

function ReportCell({ report }: { report: ReportRow | null }) {
  if (!report) return <span className="text-muted">–</span>;
  return (
    <span className="whitespace-nowrap">
      <span className={report.status === "failed" ? "font-bold text-cream" : "text-muted"}>{report.status}</span>
      {report.status !== "building" && (
        <>
          {" · "}
          <a href={`/admin/report/${report.id}`} target="_blank" rel="noopener noreferrer" className="font-bold text-cream underline underline-offset-2">
            View
          </a>
        </>
      )}
    </span>
  );
}

function followupText(list: FollowupRow[]) {
  if (!list.length) return "–";
  return list.map((f) => `${stepLabel(f.step)}${f.status === "sent" ? " ✓" : ` (${f.status})`}`).join(" · ");
}

const cityOf = (l: Lead) => [l.city, l.state].filter(Boolean).join(", ") || "–";

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const shell = (children: React.ReactNode, wide = false) => (
    <main id="main" className={`mx-auto min-h-screen px-4 py-8 sm:px-5 md:py-12 ${wide ? "max-w-7xl md:px-8" : "max-w-md"}`}>
      {children}
    </main>
  );

  if (!(await isAdmin())) {
    return shell(
      <>
        <Logo className="h-8 w-auto" />
        <h1 className="display-md mt-10">Leads</h1>
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mt-6 text-lg leading-relaxed text-cream">
            The dashboard is switched off until you add an <strong>ADMIN_PASSWORD</strong> environment variable in Vercel and redeploy.
          </p>
        )}
      </>,
    );
  }

  const q = await searchParams;
  const filter: Filter = FILTERS.find((f) => f.key === q.f)?.key ?? "all";

  let data: Awaited<ReturnType<typeof loadLeads>>;
  try {
    data = await loadLeads(filter);
  } catch (e) {
    console.error("[admin] Loading failed:", e);
    return shell(
      <>
        <h1 className="display-md">Leads</h1>
        <p role="alert" className="mt-6 rounded-md border-2 border-line bg-raised px-4 py-3 text-base text-cream">
          Couldn&apos;t load leads: {e instanceof Error ? e.message : String(e)}
        </p>
      </>,
    );
  }

  const { rows, counts, followupsMissing } = data;
  const tiles = [
    { label: "Leads this week", value: counts.week },
    { label: "Reports sent", value: counts.sent },
    { label: "Booked", value: counts.booked },
  ];

  return shell(
    <>
      <div className="flex items-center justify-between gap-4">
        <Link href="/" className="inline-block rounded-sm">
          <Logo className="h-7 w-auto md:h-8" />
        </Link>
        <form action={logout}>
          <button type="submit" className="btn btn-outline btn-sm">
            Log out
          </button>
        </form>
      </div>

      <h1 className="display-md mt-8 md:mt-10">Leads</h1>

      <dl className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-lg border-2 border-line bg-raised px-3 py-3 sm:px-5 sm:py-4">
            <dt className="text-[0.6875rem] font-bold uppercase leading-tight tracking-[0.12em] text-muted sm:text-xs">{t.label}</dt>
            <dd className="mt-1 text-3xl font-extrabold tracking-tight text-cream sm:text-4xl" style={{ fontVariantNumeric: "tabular-nums" }}>
              {t.value}
            </dd>
          </div>
        ))}
      </dl>

      <nav aria-label="Filter leads" className="no-scrollbar -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={f.key === "all" ? "/admin" : `/admin?f=${f.key}`}
            aria-current={f.key === filter ? "page" : undefined}
            className={`inline-flex min-h-11 shrink-0 items-center rounded-md border-2 px-4 text-sm font-bold ${
              f.key === filter ? "border-sage bg-sage text-bg" : "border-line text-cream hover:border-sage"
            }`}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      {followupsMissing && (
        <p className="mt-4 text-sm text-muted">Follow-up columns are empty until supabase/migrations/20261126040000_followups.sql is run.</p>
      )}

      {rows.length === 0 ? (
        <p className="mt-8 text-lg text-muted">No leads here yet.</p>
      ) : (
        <>
          {/* Phones: one card per lead. */}
          <ul className="mt-6 space-y-3 md:hidden">
            {rows.map(({ lead, report, followups }) => (
              <li key={lead.id} className="rounded-lg border-2 border-line bg-raised p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words text-lg font-extrabold leading-snug text-cream">{lead.business_name || "–"}</p>
                    <p className="text-sm text-muted">
                      {cityOf(lead)} · <LocalDate iso={lead.created_at} />
                    </p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
                <dl className="mt-3 grid grid-cols-[5.5rem_1fr] gap-x-3 gap-y-1.5 text-sm">
                  <dt className="text-muted">Name</dt>
                  <dd className="break-words text-cream">{lead.name || "–"}</dd>
                  <dt className="text-muted">Email</dt>
                  <dd className="break-all">
                    {lead.email ? (
                      <a href={`mailto:${lead.email}`} className="text-cream underline underline-offset-2">
                        {lead.email}
                      </a>
                    ) : (
                      "–"
                    )}
                  </dd>
                  <dt className="text-muted">Phone</dt>
                  <dd>
                    {lead.phone ? (
                      <a href={`tel:${lead.phone}`} className="text-cream underline underline-offset-2">
                        {lead.phone}
                      </a>
                    ) : (
                      "–"
                    )}
                  </dd>
                  <dt className="text-muted">Score</dt>
                  <dd className="font-bold text-cream">{report?.score ?? "–"}</dd>
                  <dt className="text-muted">Report</dt>
                  <dd>
                    <ReportCell report={report} />
                  </dd>
                  <dt className="text-muted">Follow-ups</dt>
                  <dd className="text-cream">{lead.unsubscribed_at ? `${followupText(followups)} (unsubscribed)` : followupText(followups)}</dd>
                </dl>
              </li>
            ))}
          </ul>

          {/* Tablets and desktop: a table. */}
          <div className="mt-6 overflow-x-auto rounded-lg border-2 border-line max-md:hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-deep text-xs uppercase tracking-[0.12em] text-muted">
                <tr>
                  {["Date", "Name", "Business", "City", "Email", "Phone", "Status", "Score", "Report", "Follow-ups"].map((h) => (
                    <th key={h} scope="col" className="whitespace-nowrap px-3 py-3 font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ lead, report, followups }) => (
                  <tr key={lead.id} className="border-t-2 border-line align-top">
                    <td className="px-3 py-3 text-muted">
                      <LocalDate iso={lead.created_at} />
                    </td>
                    <td className="px-3 py-3 text-cream">{lead.name || "–"}</td>
                    <td className="max-w-56 px-3 py-3 font-bold text-cream">{lead.business_name || "–"}</td>
                    <td className="px-3 py-3 text-cream">{cityOf(lead)}</td>
                    <td className="px-3 py-3">
                      {lead.email ? (
                        <a href={`mailto:${lead.email}`} className="text-cream underline underline-offset-2">
                          {lead.email}
                        </a>
                      ) : (
                        "–"
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-cream">{lead.phone || "–"}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-3 py-3 font-bold text-cream">{report?.score ?? "–"}</td>
                    <td className="px-3 py-3">
                      <ReportCell report={report} />
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-cream">
                      {followupText(followups)}
                      {lead.unsubscribed_at && <span className="block text-xs text-muted">unsubscribed</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length === LIMIT && <p className="mt-4 text-sm text-muted">Showing the newest {LIMIT}. Older leads are in Supabase.</p>}
        </>
      )}
    </>,
    true,
  );
}
