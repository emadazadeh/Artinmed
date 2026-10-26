import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const placeholderId = "00000000-0000-4000-8000-000000000000";
const uuid = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;

export function prepareCloudflareConfig(config, expectedDatabaseId, configDirectory, migrationsDirectory) {
  const expected = expectedDatabaseId?.trim();
  if (!expected || !uuid.test(expected) || expected === placeholderId) {
    throw new Error("Set CLOUDFLARE_D1_DATABASE_ID to your D1 Database ID, then run the build before deployment.");
  }
  const database = config.d1_databases?.find(binding => binding.binding === "DB");
  if (!database || database.database_id?.toLowerCase() !== expected.toLowerCase()) {
    throw new Error("The built DB binding does not match CLOUDFLARE_D1_DATABASE_ID. Run the build again with the correct Database ID.");
  }
  return {
    ...config,
    d1_databases: config.d1_databases.map(binding => binding.binding === "DB" ? {
      ...binding,
      migrations_dir: path.relative(configDirectory, migrationsDirectory).split(path.sep).join("/"),
    } : binding),
  };
}

export async function runCloudflareSteps(run, configPath, dryRun = false) {
  if (!dryRun) await run(["d1", "migrations", "apply", "DB", "--remote", "--config", configPath]);
  await run(["deploy", "--config", configPath, ...(dryRun ? ["--dry-run"] : [])]);
}

async function main() {
  const arguments_ = process.argv.slice(2);
  if (arguments_.some(argument => argument !== "--dry-run")) throw new Error("Usage: pnpm deploy:cloudflare [--dry-run]");
  const dryRun = arguments_.includes("--dry-run");
  const projectRoot = fileURLToPath(new URL("../", import.meta.url));
  const buildConfigPath = path.join(projectRoot, "dist/server/wrangler.json");
  const deploymentConfigPath = path.join(projectRoot, "dist/server/cloudflare-deploy.json");
  let config;
  try { config = JSON.parse(readFileSync(buildConfigPath, "utf8")); }
  catch { throw new Error("Build output was not found. Run pnpm build before deployment."); }
  const prepared = prepareCloudflareConfig(config, process.env.CLOUDFLARE_D1_DATABASE_ID, path.dirname(deploymentConfigPath), path.join(projectRoot, "drizzle"));
  writeFileSync(deploymentConfigPath, JSON.stringify(prepared, null, 2) + "\n");
  if (dryRun) console.log("Dry run: remote migrations are skipped; the Worker is not published.");
  const wrangler = path.join(projectRoot, "node_modules/wrangler/bin/wrangler.js");
  await runCloudflareSteps(args => {
    const result = spawnSync(process.execPath, [wrangler, ...args], { cwd: projectRoot, env: process.env, stdio: "inherit" });
    if (result.error) throw result.error;
    if (result.status !== 0) throw new Error(`Wrangler ${args[0]} failed. Deployment stopped.`);
  }, deploymentConfigPath, dryRun);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
