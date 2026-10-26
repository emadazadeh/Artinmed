import test from "node:test";
import assert from "node:assert/strict";
import { availableDates, hasTrustedOrigin, matchesBooking, normalizePhone, tehranToday, validateBooking } from "../lib/booking.ts";
import { serviceName } from "../lib/clinic-data.ts";
const now = new Date("2026-10-24T12:00:00Z");
const valid = { name: "مراجع آزمایشی", phone: "۰۹۱۲۱۲۳۴۵۶۷", city: "شهر آزمایشی", service: "medical-care", date: availableDates(now)[0], time: "10:00", consent: true, requestId: "12345678-1234-1234-1234-123456789abc" };
test("Persian, Arabic and international mobile numbers normalize consistently", () => {
  for (const phone of ["۰۹۱۲۱۲۳۴۵۶۷", "٠٩١٢١٢٣٤٥٦٧", "+98 912 123 4567", "0098-912-123-4567"]) assert.equal(normalizePhone(phone), "09121234567");
});
test("calendar follows Tehran midnight and accepts preferences on every weekday", () => {
  assert.equal(tehranToday(new Date("2026-10-24T21:00:00Z")), "2026-10-25");
  const dates = availableDates(now); assert.equal(dates.length, 12);
  for (const date of dates) assert.ok(date > "2026-10-24");
  assert.ok(dates.some(date => new Date(`${date}T12:00:00Z`).getUTCDay() === 5));
});
test("valid booking preserves consent and normalizes the phone", () => { const result = validateBooking(valid, now); assert.equal(result.error, undefined); assert.equal(result.data?.phone, "09121234567"); });
test("invalid service, date, time, consent and malformed payloads are rejected", () => {
  for (const mutation of [{ service: "unknown" }, { service: "filler" }, { date: "2026-10-23" }, { date: "2026-12-30" }, { time: "03:00" }, { consent: false }, { phone: "123" }, { city: "" }, { city: "<script>" }, { name: "<script>" }, { website: "spam.example" }, { requestId: "" }]) assert.ok(validateBooking({ ...valid, ...mutation }, now).error, JSON.stringify(mutation));
  for (const input of [null, [], "payload", 1]) assert.ok(validateBooking(input, now).error);
});
test("all three home care paths accept a request for physician assessment", () => {
  for (const service of ["medical-care", "vaccination", "home-botox"]) {
    const result = validateBooking({ ...valid, service }, now);
    assert.equal(result.error, undefined); assert.equal(result.data?.service, service); assert.equal(result.data?.city, "شهر آزمایشی");
  }
});
test("older requests retain their original service names for tracking", () => {
  assert.equal(serviceName("consultation"), "مشاورهٔ زیبایی");
  assert.equal(serviceName("home-botox"), "بوتاکس در منزل با پزشک");
  assert.equal(serviceName("future-service"), "درخواست ثبت‌شده");
});
test("cross-site and missing origins are rejected", () => {
  assert.equal(hasTrustedOrigin(new Request("https://clinic.example/api/appointments", { headers: { origin: "https://clinic.example" } })), true);
  assert.equal(hasTrustedOrigin(new Request("https://clinic.example/api/appointments", { headers: { origin: "https://other.example" } })), false);
  assert.equal(hasTrustedOrigin(new Request("https://clinic.example/api/appointments")), false);
});

test("idempotent retries must match every saved booking field, including after a concurrent insert", () => {
  const result = validateBooking(valid, now);
  assert.ok(result.data);
  const data = result.data;
  const saved = { ...data, preferredDate: data.date, preferredTime: data.time };
  assert.equal(matchesBooking(saved, data), true);
  for (const mutation of [{ name: "نام دیگر" }, { city: null }, { service: "vaccination" }, { preferredTime: "18:00" }, { preferredDate: "2026-11-01" }, { phone: "09129999999" }]) {
    assert.equal(matchesBooking({ ...saved, ...mutation }, data), false);
  }
  for (const requestId of ["-".repeat(36), "a".repeat(36)]) assert.ok(validateBooking({ ...valid, requestId }, now).error);
});
