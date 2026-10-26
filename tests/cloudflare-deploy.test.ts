import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { prepareCloudflareConfig, resolveCloudflareDatabase, runCloudflareSteps } from "../scripts/deploy-cloudflare.mjs";

const databaseId = "12345678-1234-4234-8234-123456789abc";
const config = { name: "doctor-resoon", d1_databases: [{ binding: "DB", database_name: "doctor-resoon-db", database_id: databaseId }] };

test("standalone deployment rejects missing, placeholder and stale database targets", () => {
  for (const value of [undefined, "", "invalid", "00000000-0000-4000-8000-000000000000"]) {
    assert.throws(() => prepareCloudflareConfig(config, value, "/project/dist/server", "/project/drizzle", undefined));
  }
  assert.throws(() => prepareCloudflareConfig({ ...config, d1_databases: [] }, databaseId, "/project/dist/server", "/project/drizzle", undefined));
  assert.throws(() => prepareCloudflareConfig(config, "87654321-1234-4234-8234-123456789abc", "/project/dist/server", "/project/drizzle", undefined));
});

test("migrations are resolved from the generated configuration without changing the built target", () => {
  const prepared = prepareCloudflareConfig(config, databaseId, "/project/dist/server", "/project/drizzle", undefined);
  assert.equal(prepared.d1_databases[0].database_id, databaseId);
  assert.equal(path.resolve("/project/dist/server", prepared.d1_databases[0].migrations_dir), "/project/drizzle");
  assert.equal("migrations_dir" in config.d1_databases[0], false);
});

test("the recorded database target is used when build variables are absent, with explicit overrides taking precedence", () => {
  const standalone = { database_id: databaseId, database_name: "doctor-resoon-db" };
  assert.deepEqual(resolveCloudflareDatabase(standalone, {}), standalone);
  const overrideId = "87654321-1234-4234-8234-123456789abc";
  assert.deepEqual(resolveCloudflareDatabase(standalone, { CLOUDFLARE_D1_DATABASE_ID: ` ${overrideId} `, CLOUDFLARE_D1_DATABASE_NAME: "other-db" }), { database_id: overrideId, database_name: "other-db" });
});

test("only the managed placeholder is replaced by the explicit standalone database target", () => {
  const managed = { d1_databases: [{ binding: "DB", database_name: "site-creator-d1", database_id: "00000000-0000-4000-8000-000000000000" }] };
  const prepared = prepareCloudflareConfig(managed, databaseId, "/project/dist/server", "/project/drizzle", "doctor-resoon-db");
  assert.equal(prepared.d1_databases[0].database_id, databaseId);
  assert.equal(prepared.d1_databases[0].database_name, "doctor-resoon-db");
  assert.equal(managed.d1_databases[0].database_id, "00000000-0000-4000-8000-000000000000");
  assert.throws(() => prepareCloudflareConfig({ d1_databases: [{ binding: "DB", database_name: "missing-id" }] }, databaseId, "/project/dist/server", "/project/drizzle", undefined));
});

test("a migration failure prevents the production deployment command", async () => {
  const calls: string[][] = [];
  await assert.rejects(runCloudflareSteps(async (args: string[]) => {
    calls.push(args);
    throw new Error("Migration failed");
  }, "/project/dist/server/cloudflare-deploy.json"));
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].slice(0, 6), ["d1", "migrations", "apply", "DB", "--remote", "--config"]);
});

test("deployment follows successful migrations, while dry runs perform no remote migration", async () => {
  const productionCalls: string[][] = [];
  await runCloudflareSteps(async (args: string[]) => { productionCalls.push(args); }, "/project/dist/server/cloudflare-deploy.json");
  assert.equal(productionCalls.length, 2);
  assert.equal(productionCalls[1][0], "deploy");
  const dryRunCalls: string[][] = [];
  await runCloudflareSteps(async (args: string[]) => { dryRunCalls.push(args); }, "/project/dist/server/cloudflare-deploy.json", true);
  assert.deepEqual(dryRunCalls, [["deploy", "--config", "/project/dist/server/cloudflare-deploy.json", "--dry-run"]]);
});
