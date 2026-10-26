import test from "node:test";
import assert from "node:assert/strict";
import { readJsonBody } from "../lib/request-body.ts";

function request(body: string | ReadableStream<Uint8Array>, contentType = "application/json; charset=utf-8") {
  return new Request("https://clinic.example/api/appointments", { method: "POST", headers: { "Content-Type": contentType }, body, duplex: "half" } as RequestInit);
}

test("JSON media type is checked exactly and malformed input gets a controlled error", async () => {
  assert.equal((await readJsonBody(request("{}", "application/json-extra"), 100)).status, 415);
  assert.equal((await readJsonBody(request("{"), 100)).status, 400);
  assert.deepEqual((await readJsonBody(request('{"name":"نام"}'), 100)).data, { name: "نام" });
});

test("the limit applies to UTF-8 bytes, even without a content-length header", async () => {
  const body = JSON.stringify({ name: "نام".repeat(30) });
  assert.ok(body.length < 150);
  assert.equal((await readJsonBody(request(body), 150)).status, 413);
});

test("oversized streamed input is drained without cancelling the underlying HTTP connection", async () => {
  let cancelled = false;
  let chunks = 0;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (chunks === 3) controller.close();
      else { chunks++; controller.enqueue(new Uint8Array(65)); }
    },
    cancel() { cancelled = true; },
  });
  assert.equal((await readJsonBody(request(stream), 64)).status, 413);
  assert.equal(cancelled, false);
  assert.equal(chunks, 3);
});

test("UTF-8 characters split between chunks decode correctly", async () => {
  const bytes = new TextEncoder().encode('{"name":"نام"}');
  const stream = new ReadableStream<Uint8Array>({ start(controller) {
    for (const byte of bytes) controller.enqueue(new Uint8Array([byte]));
    controller.close();
  } });
  assert.deepEqual((await readJsonBody(request(stream), 100)).data, { name: "نام" });
});
