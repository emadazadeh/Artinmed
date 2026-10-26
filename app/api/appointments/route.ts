import { and, eq, gte, count } from "drizzle-orm";
import { getDb } from "@/db";
import { appointments } from "@/db/schema";
import { hasTrustedOrigin, matchesBooking, validateBooking } from "@/lib/booking";
import { readJsonBody } from "@/lib/request-body";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex, nofollow" };
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers });
export async function POST(request: Request) {
  if (!hasTrustedOrigin(request)) return reply({ error: "درخواست از مبدأ مجاز ارسال نشده است." }, 403);
  const body = await readJsonBody(request, 4096); if (body.error) return reply({ error: body.error }, body.status);
  const validated = validateBooking(body.data); if (validated.error) return reply({ error: validated.error }, 400);
  const data = validated.data!;
  try {
    const db = getDb();
    const existing = await db.select().from(appointments).where(eq(appointments.requestId, data.requestId)).get();
    if (existing) {
      return matchesBooking(existing, data) ? reply({ reference: existing.reference, status: existing.status }) : reply({ error: "این درخواست قبلاً با اطلاعات دیگری ثبت شده است. پنجره را ببندید و درخواست جدیدی بسازید." }, 409);
    }
    const now = Date.now();
    const recent = await db.select({ total: count() }).from(appointments).where(and(eq(appointments.phone, data.phone), gte(appointments.createdAt, now - 86400000))).get();
    if ((recent?.total ?? 0) >= 3) return reply({ error: "برای این شماره امروز سه درخواست ثبت شده است. از بخش پیگیری، وضعیت را بررسی کنید." }, 429);
    const reference = "DRR-" + crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
    await db.insert(appointments).values({ id: crypto.randomUUID(), requestId: data.requestId, reference, name: data.name, phone: data.phone, city: data.city, service: data.service, preferredDate: data.date, preferredTime: data.time, status: "pending", createdAt: now, consentAt: now }).onConflictDoNothing({ target: appointments.requestId });
    const saved = await db.select().from(appointments).where(eq(appointments.requestId, data.requestId)).get();
    if (!saved || !matchesBooking(saved, data)) return reply({ error: "این درخواست با اطلاعات دیگری ثبت شده است. پنجره را ببندید و درخواست جدیدی بسازید." }, 409);
    return reply({ reference: saved.reference, status: saved.status }, 201);
  } catch { return reply({ error: "ثبت درخواست در حال حاضر ممکن نیست. اطلاعات فرم شما حفظ شده؛ کمی بعد دوباره تلاش کنید." }, 503); }
}
