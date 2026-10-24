import { and, eq, gte, count } from "drizzle-orm";
import { getDb } from "@/db";
import { appointments } from "@/db/schema";
import { hasTrustedOrigin, validateBooking } from "@/lib/booking";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers });
export async function POST(request: Request) {
  if (!hasTrustedOrigin(request)) return reply({ error: "درخواست از مبدأ مجاز ارسال نشده است." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return reply({ error: "نوع داده معتبر نیست." }, 415);
  const text = await request.text(); if (text.length > 4096) return reply({ error: "حجم اطلاعات بیش از حد مجاز است." }, 413);
  let input: unknown; try { input = JSON.parse(text); } catch { return reply({ error: "اطلاعات فرم قابل خواندن نیست." }, 400); }
  const validated = validateBooking(input); if (validated.error) return reply({ error: validated.error }, 400);
  const data = validated.data!;
  try {
    const db = getDb();
    const existing = await db.select().from(appointments).where(eq(appointments.requestId, data.requestId)).get();
    if (existing) {
      const matches = existing.phone === data.phone && existing.name === data.name && existing.city === data.city && existing.service === data.service && existing.preferredDate === data.date && existing.preferredTime === data.time;
      return matches ? reply({ reference: existing.reference, status: existing.status }) : reply({ error: "این درخواست قبلاً با اطلاعات دیگری ثبت شده است. پنجره را ببندید و درخواست جدیدی بسازید." }, 409);
    }
    const now = Date.now();
    const recent = await db.select({ total: count() }).from(appointments).where(and(eq(appointments.phone, data.phone), gte(appointments.createdAt, now - 86400000))).get();
    if ((recent?.total ?? 0) >= 3) return reply({ error: "برای این شماره امروز سه درخواست ثبت شده است. از بخش پیگیری، وضعیت را بررسی کنید." }, 429);
    const reference = "ART-" + crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
    await db.insert(appointments).values({ id: crypto.randomUUID(), requestId: data.requestId, reference, name: data.name, phone: data.phone, city: data.city, service: data.service, preferredDate: data.date, preferredTime: data.time, status: "pending", createdAt: now, consentAt: now }).onConflictDoNothing({ target: appointments.requestId });
    const saved = await db.select({ reference: appointments.reference }).from(appointments).where(and(eq(appointments.requestId, data.requestId), eq(appointments.phone, data.phone))).get();
    if (!saved) return reply({ error: "ثبت درخواست انجام نشد. دوباره تلاش کنید." }, 409);
    return reply({ reference: saved.reference, status: "pending" }, 201);
  } catch { return reply({ error: "ثبت درخواست در حال حاضر ممکن نیست. اطلاعات فرم شما حفظ شده؛ کمی بعد دوباره تلاش کنید." }, 503); }
}
