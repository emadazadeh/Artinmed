import { services, timeSlots } from "./clinic-data.ts";
export function createRequestId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64; bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, value => value.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
export function normalizeDigits(value: string) { return value.replace(/[۰-۹]/g, d => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, d => String("٠١٢٣٤٥٦٧٨٩".indexOf(d))); }
export function normalizePhone(value: string) { return normalizeDigits(value).replace(/[\s()-]/g, "").replace(/^(\+98|0098)/, "0"); }
export function tehranToday(now = new Date()) { return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tehran", year: "numeric", month: "2-digit", day: "2-digit" }).format(now); }
export function availableDates(now = new Date()) {
  const base = new Date(`${tehranToday(now)}T12:00:00Z`);
  return Array.from({ length: 12 }, (_, i) => { const date = new Date(base); date.setUTCDate(base.getUTCDate() + i + 1); return date.toISOString().slice(0, 10); });
}
export type BookingInput = { name: string; phone: string; city: string; service: string; date: string; time: string; consent: boolean; website?: string; requestId: string };
export function validateBooking(input: unknown, now = new Date()): { data: BookingInput; error?: never } | { error: string; data?: never } {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { error: "اطلاعات فرم معتبر نیست." };
  const raw = input as Record<string, unknown>;
  const name = typeof raw.name === "string" ? raw.name.trim().replace(/\s+/g, " ") : "";
  const phone = typeof raw.phone === "string" ? normalizePhone(raw.phone) : "";
  const city = typeof raw.city === "string" ? raw.city.trim().replace(/\s+/g, " ") : "";
  if (name.length < 3 || name.length > 80 || /[<>\x00-\x1f]/.test(name)) return { error: "نام و نام خانوادگی را کامل وارد کنید." };
  if (!/^09\d{9}$/.test(phone)) return { error: "شمارهٔ همراه معتبر وارد کنید؛ مثل ۰۹۱۲۱۲۳۴۵۶۷." };
  if (city.length < 2 || city.length > 80 || /[<>\x00-\x1f]/.test(city)) return { error: "نام شهر یا محدودهٔ خود را وارد کنید." };
  if (typeof raw.service !== "string" || !services.some(s => s.id === raw.service)) return { error: "خدمت موردنظر را انتخاب کنید." };
  if (typeof raw.date !== "string" || !availableDates(now).includes(raw.date)) return { error: "روز معتبر را از فهرست تاریخ‌ها انتخاب کنید." };
  if (typeof raw.time !== "string" || !timeSlots.some(t => t === raw.time)) return { error: "ساعت ترجیحی را انتخاب کنید." };
  if (raw.consent !== true) return { error: "برای ثبت درخواست، موافقت با استفاده از اطلاعات تماس لازم است." };
  if (typeof raw.website === "string" && raw.website.length > 0) return { error: "ثبت درخواست انجام نشد." };
  if (typeof raw.requestId !== "string" || !/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(raw.requestId)) return { error: "فرم را دوباره باز کنید و تلاش کنید." };
  return { data: { name, phone, city, service: raw.service, date: raw.date, time: raw.time, consent: true, requestId: raw.requestId } };
}

export function matchesBooking(saved: { phone: string; name: string; city: string | null; service: string; preferredDate: string; preferredTime: string }, input: BookingInput) {
  return saved.phone === input.phone && saved.name === input.name && saved.city === input.city && saved.service === input.service && saved.preferredDate === input.date && saved.preferredTime === input.time;
}
export function hasTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin"); if (!origin) return false;
  try { return new URL(origin).origin === new URL(request.url).origin; } catch { return false; }
}
