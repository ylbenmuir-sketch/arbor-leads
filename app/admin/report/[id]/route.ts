import { isAdmin } from "@/lib/server/admin";
import { escape, supabase } from "@/lib/server/leads";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const headers = {
  "Content-Type": "text/html; charset=utf-8",
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
  // The report is an email: show it, but let nothing in it run scripts or reach this site.
  "Content-Security-Policy": "sandbox allow-popups allow-popups-to-escape-sandbox; default-src 'none'; img-src https: data:; style-src 'unsafe-inline'",
};

const page = (title: string, body: string, status = 200) =>
  new Response(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escape(title)}</title><body style="font-family:system-ui,sans-serif;padding:24px;max-width:640px;margin:auto;line-height:1.5">${body}</body>`,
    { status, headers },
  );

/** The exact report email a lead was sent, for the /admin dashboard. Logged-in admins only. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return page("Log in", `<p>Please <a href="/admin">log in</a> first.</p>`, 401);

  const { id } = await params;
  if (!UUID.test(id)) return page("Not found", "<p>No report with that ID.</p>", 404);

  const { data, error } = await supabase().from("reports").select("status, report_html, error:raw_data->>error").eq("id", id).maybeSingle();
  if (error) return page("Error", `<p>Couldn't load the report: ${escape(error.message)}</p>`, 500);
  if (!data) return page("Not found", "<p>No report with that ID.</p>", 404);
  if (!data.report_html) {
    return page(
      "No report",
      `<p>This report is <strong>${escape(String(data.status))}</strong>, so there's no email to show.</p>${
        data.error ? `<p>Error: ${escape(String(data.error))}</p>` : ""
      }`,
    );
  }
  return new Response(data.report_html as string, { headers });
}
