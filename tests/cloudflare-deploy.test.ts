import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { prepareCloudflareConfig, runCloudflareSteps } from "../scripts/deploy-cloudflare.mjs";

const databaseId = "12345678-1234-4234-8234-123456789abc";
const config = { name: "doctor-resoon", d1_databases: [{ binding: "DB", database_name: "doctor-resoon-db", database_id: databaseId }] };

test("standalone deployment rejects missing, placeholder and stale database targets", () => {
  for (const value of [undefined, "", "invalid", "00000000-0000-4000-8000-000000000000"]) {
    assert.throws(() => prepareCloudflareConfig(config, value, "/project/dist/server", "/project/drizzle"));
  }
  assert.throws(() => prepareCloudflareConfig({ ...config, d1_databases: [] }, databaseId, "/project/dist/server", "/project/drizzle"));
  assert.throws(() => prepareCloudflareConfig(config, "87654321-1234-4234-8234-123456789abc", "/project/dist/server", "/project/drizzle"));
});

test("migrations are resolved from the generated configuration without changing the built target", () => {
  const prepared = prepareCloudflareConfig(config, databaseId, "/project/dist/server", "/project/drizzle");
  assert.equal(prepared.d1_databases[0].database_id, databaseId);
  assert.equal(path.resolve("/project/dist/server", prepared.d1_databases[0].migrations_dir), "/project/drizzle");
  assert.equal("migrations_dir" in config.d1_databases[0], false);
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
