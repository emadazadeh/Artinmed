import test from "node:test";
import assert from "node:assert/strict";
import { availableDates, hasTrustedOrigin, normalizePhone, tehranToday, validateBooking } from "../lib/booking.ts";
const now = new Date("2026-10-24T12:00:00Z");
const valid = { name: "مراجع آزمایشی", phone: "۰۹۱۲۱۲۳۴۵۶۷", service: "consultation", date: availableDates(now)[0], time: "10:00", consent: true, requestId: "12345678-1234-1234-1234-123456789abc" };
test("Persian, Arabic and international mobile numbers normalize consistently", () => {
  for (const phone of ["۰۹۱۲۱۲۳۴۵۶۷", "٠٩١٢١٢٣٤٥٦٧", "+98 912 123 4567", "0098-912-123-4567"]) assert.equal(normalizePhone(phone), "09121234567");
});
test("calendar follows Tehran midnight and excludes past dates and Fridays", () => {
  assert.equal(tehranToday(new Date("2026-10-24T21:00:00Z")), "2026-10-25");
  const dates = availableDates(now); assert.equal(dates.length, 12);
  for (const date of dates) { assert.ok(date > "2026-10-24"); assert.notEqual(new Date(`${date}T12:00:00Z`).getUTCDay(), 5); }
});
test("valid booking preserves consent and normalizes the phone", () => { const result = validateBooking(valid, now); assert.equal(result.error, undefined); assert.equal(result.data?.phone, "09121234567"); });
test("invalid service, date, time, consent and malformed payloads are rejected", () => {
  for (const mutation of [{ service: "unknown" }, { date: "2026-10-23" }, { date: "2026-10-30" }, { time: "03:00" }, { consent: false }, { phone: "123" }, { name: "<script>" }, { website: "spam.example" }, { requestId: "" }]) assert.ok(validateBooking({ ...valid, ...mutation }, now).error, JSON.stringify(mutation));
  for (const input of [null, [], "payload", 1]) assert.ok(validateBooking(input, now).error);
});
test("cross-site and missing origins are rejected", () => {
  assert.equal(hasTrustedOrigin(new Request("https://clinic.example/api/appointments", { headers: { origin: "https://clinic.example" } })), true);
  assert.equal(hasTrustedOrigin(new Request("https://clinic.example/api/appointments", { headers: { origin: "https://other.example" } })), false);
  assert.equal(hasTrustedOrigin(new Request("https://clinic.example/api/appointments")), false);
});
