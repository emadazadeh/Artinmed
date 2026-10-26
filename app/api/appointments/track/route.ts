import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { appointments } from "@/db/schema";
import { hasTrustedOrigin, normalizeDigits, normalizePhone } from "@/lib/booking";
import { readJsonBody } from "@/lib/request-body";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex, nofollow" };
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers });
export async function POST(request: Request) {
  if (!hasTrustedOrigin(request)) return reply({ error: "مبدأ درخواست معتبر نیست." }, 403);
  const body = await readJsonBody(request, 1024); if (body.error) return reply({ error: body.error }, body.status);
  if (!body.data || typeof body.data !== "object" || Array.isArray(body.data)) return reply({ error: "اطلاعات معتبر وارد کنید." }, 400);
  const raw = body.data as Record<string, unknown>;
  const phone = typeof raw.phone === "string" ? normalizePhone(raw.phone) : "";
  const reference = typeof raw.reference === "string" ? normalizeDigits(raw.reference).trim().toUpperCase() : "";
  if (!/^09\d{9}$/.test(phone) || !/^(?:ART|DRR)-[A-F0-9]{10}$/.test(reference)) return reply({ error: "کد پیگیری و شمارهٔ همراه را بررسی کنید." }, 400);
  try {
    const found = await getDb().select({ reference: appointments.reference, service: appointments.service, date: appointments.preferredDate, time: appointments.preferredTime, status: appointments.status }).from(appointments).where(and(eq(appointments.reference, reference), eq(appointments.phone, phone))).get();
    if (!found) return reply({ error: "درخواستی با این کد و شماره پیدا نشد." }, 404);
    return reply(found);
  } catch { return reply({ error: "پیگیری در حال حاضر در دسترس نیست؛ کمی بعد دوباره تلاش کنید." }, 503); }
}
