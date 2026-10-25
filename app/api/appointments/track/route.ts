import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { appointments } from "@/db/schema";
import { hasTrustedOrigin, normalizePhone } from "@/lib/booking";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers });
export async function POST(request: Request) {
  if (!hasTrustedOrigin(request)) return reply({ error: "مبدأ درخواست معتبر نیست." }, 403);
  const text = await request.text(); if (text.length > 1024) return reply({ error: "اطلاعات بیش از حد مجاز است." }, 413);
  let raw: Record<string, unknown>;
  try { raw = JSON.parse(text); if (!raw || typeof raw !== "object") throw new Error(); } catch { return reply({ error: "اطلاعات معتبر وارد کنید." }, 400); }
  const phone = typeof raw.phone === "string" ? normalizePhone(raw.phone) : "";
  const reference = typeof raw.reference === "string" ? raw.reference.trim().toUpperCase() : "";
  if (!/^09\d{9}$/.test(phone) || !/^(?:ART|DRR)-[A-F0-9]{10}$/.test(reference)) return reply({ error: "کد پیگیری و شمارهٔ همراه را بررسی کنید." }, 400);
  try {
    const found = await getDb().select({ reference: appointments.reference, service: appointments.service, date: appointments.preferredDate, time: appointments.preferredTime, status: appointments.status }).from(appointments).where(and(eq(appointments.reference, reference), eq(appointments.phone, phone))).get();
    if (!found) return reply({ error: "درخواستی با این کد و شماره پیدا نشد." }, 404);
    return reply(found);
  } catch { return reply({ error: "پیگیری در حال حاضر در دسترس نیست؛ کمی بعد دوباره تلاش کنید." }, 503); }
}
