import { contact } from "./brand.ts";
import { faNumber, serviceName } from "./clinic-data.ts";
import type { BookingInput } from "./booking.ts";

export type WhatsAppBooking = Pick<BookingInput, "name" | "phone" | "city" | "service" | "date" | "time"> & { reference: string };

export function appointmentWhatsAppMessage(booking: WhatsAppBooking) {
  const date = new Intl.DateTimeFormat("fa-IR", {
    timeZone: "Asia/Tehran", weekday: "long", year: "numeric", month: "long", day: "numeric",
  }).format(new Date(`${booking.date}T12:00:00+03:30`));

  return [
    "سلام، برای هماهنگی درخواست ثبت‌شده در دکتر رسون پیام می‌دهم.",
    "",
    `نام و نام خانوادگی: ${booking.name}`,
    `شمارهٔ تماس: ${booking.phone}`,
    `موضوع درخواست: ${serviceName(booking.service)}`,
    `شهر / محدوده: ${booking.city}`,
    `روز ترجیحی: ${date}`,
    `ساعت ترجیحی: ${faNumber(booking.time)} (به وقت تهران)`,
    `کد پیگیری: ${booking.reference}`,
    "",
    "درخواست من در انتظار بررسی است؛ زمان و خدمت پس از ارزیابی پزشک و هماهنگی تأیید می‌شود.",
  ].join("\n");
}

export function appointmentWhatsAppUrl(booking: WhatsAppBooking) {
  return `https://wa.me/${contact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(appointmentWhatsAppMessage(booking))}`;
}
