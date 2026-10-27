import test from "node:test";
import assert from "node:assert/strict";
import { validateBooking } from "../lib/booking.ts";
import { services } from "../lib/clinic-data.ts";
import { appointmentWhatsAppMessage, appointmentWhatsAppUrl } from "../lib/whatsapp.ts";

const input = {
  name: "  مراجع آزمایشی & همراه + #۱  ", phone: "۰۹۱۲۱۲۳۴۵۶۷", city: "  شهر   آزمایشی  ",
  service: "medical-care", date: "2026-10-27", time: "11:30", consent: true,
  requestId: "12345678-1234-1234-1234-123456789abc", website: "",
};
const validated = validateBooking(input, new Date("2026-10-26T10:00:00Z"));
assert.ok(validated.data);
const saved = { ...validated.data, reference: "DRR-123456789A" };

test("each active service opens the owner's WhatsApp with one fully encoded Persian message", () => {
  for (const service of services) {
    const booking = { ...saved, service: service.id };
    const url = new URL(appointmentWhatsAppUrl(booking));
    assert.equal(url.origin, "https://wa.me");
    assert.equal(url.pathname, "/989350631134");
    assert.equal(url.hash, "");
    assert.deepEqual([...url.searchParams.keys()], ["text"]);
    const message = url.searchParams.get("text");
    assert.equal(message, appointmentWhatsAppMessage(booking));
    assert.ok(message?.includes(`موضوع درخواست: ${service.name}`));
    assert.ok(message?.includes("نام و نام خانوادگی: مراجع آزمایشی & همراه + #۱"));
  }
});

test("message contains the saved coordination details, full Persian date and reference", () => {
  const message = appointmentWhatsAppMessage(saved);
  assert.ok(message.includes("شمارهٔ تماس: 09121234567"));
  assert.ok(message.includes("شهر / محدوده: شهر آزمایشی"));
  assert.ok(message.includes("۱۴۰۵"));
  assert.ok(message.includes("ساعت ترجیحی: ۱۱:۳۰ (به وقت تهران)"));
  assert.ok(message.includes("کد پیگیری: DRR-123456789A"));
  assert.ok(message.includes("در انتظار بررسی"));
});

test("message only shares coordination fields even when passed the entire saved input", () => {
  const message = appointmentWhatsAppMessage({ ...saved, ...{ website: "PRIVATE-HONEYPOT", clinicalNotes: "PRIVATE-NOTES" } });
  for (const hidden of [saved.requestId, "PRIVATE-HONEYPOT", "PRIVATE-NOTES", "consent", "requestId"]) {
    assert.ok(!message.includes(hidden));
  }
});
