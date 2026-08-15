import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFile as execFileCallback } from "node:child_process";
import { promisify } from "node:util";

const execFile = promisify(execFileCallback);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const BLOCKING_SEVERITIES = new Set(["high", "critical"]);
const PATCHED = { postcss: "8.5.26", sharp: "0.35.3" };

function fail(message) {
  throw new Error(`[security] ${message}`);
}

function parseAuditOutput(output) {
  const start = output.indexOf("{");
  if (start < 0) fail("npm audit returned no JSON report");
  const json = output.slice(start).trim();
  try {
    return assertAuditReport(JSON.parse(json));
  } catch {
    const end = json.lastIndexOf("}");
    if (end > 0) {
      try {
        return assertAuditReport(JSON.parse(json.slice(0, end + 1)));
      } catch {
        // Fall through to the useful error below.
      }
    }
    fail("npm audit returned malformed JSON");
  }
}

function assertAuditReport(report) {
  if (!report || typeof report !== "object" || !report.metadata?.vulnerabilities) {
    fail("npm audit did not return a vulnerability report");
  }
  return report;
}

async function audit(args) {
  try {
    const result = await execFile(npmCommand, ["audit", "--json", ...args], {
      cwd: root,
      maxBuffer: 16 * 1024 * 1024,
    });
    return parseAuditOutput(result.stdout);
  } catch (error) {
    // npm writes the machine-readable report to stdout even when its exit code
    // is 1 because findings exist. Ignore human-readable stderr in that case.
    const output = error.stdout?.includes("{") ? error.stdout : [error.stdout, error.stderr].filter(Boolean).join("\n");
    return parseAuditOutput(output);
  }
}

function counts(report) {
  return report.metadata?.vulnerabilities ?? { info: 0, low: 0, moderate: 0, high: 0, critical: 0, total: 0 };
}

function blockingFindings(report) {
  return Object.values(report.vulnerabilities ?? {}).filter((finding) => BLOCKING_SEVERITIES.has(finding.severity));
}

function printFindings(label, report) {
  for (const finding of blockingFindings(report)) {
    const advisories = (finding.via ?? [])
      .filter((item) => typeof item === "object")
      .map((item) => `${item.url} (${item.range})`)
      .join(", ");
    console.error(
      `[security] ${label} blocking finding: ${finding.name} ${finding.severity}; ` +
      `direct=${finding.isDirect}; range=${finding.range}; nodes=${finding.nodes?.join(",") ?? "unknown"}; ` +
      `advisories=${advisories || "aggregated dependency finding"}`,
    );
  }
}

async function assertPatchedTree() {
  const manifest = JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8"));
  if (manifest.overrides?.postcss !== PATCHED.postcss || manifest.overrides?.sharp !== PATCHED.sharp) {
    fail("package.json security overrides do not match the reviewed patched versions");
  }

  const lock = JSON.parse(await fs.readFile(path.join(root, "package-lock.json"), "utf8"));
  const postcss = lock.packages?.["node_modules/postcss"]?.version;
  const sharp = lock.packages?.["node_modules/sharp"]?.version;
  const nestedPostcss = lock.packages?.["node_modules/next/node_modules/postcss"];
  if (postcss !== PATCHED.postcss || sharp !== PATCHED.sharp || nestedPostcss) {
    fail(`lockfile does not resolve the reviewed patched tree (postcss=${postcss ?? "missing"}, sharp=${sharp ?? "missing"})`);
  }
}

try {
  await assertPatchedTree();
  const full = await audit([]);
  const runtime = await audit(["--omit=dev"]);
  const fullCounts = counts(full);
  const runtimeCounts = counts(runtime);
  console.log(`[security] full audit: ${JSON.stringify(fullCounts)}`);
  console.log(`[security] production audit: ${JSON.stringify(runtimeCounts)}`);
  printFindings("full", full);
  printFindings("production", runtime);

  const runtimeBlocking = blockingFindings(runtime);
  if (runtimeBlocking.length > 0) {
    fail(`${runtimeBlocking.length} unresolved production HIGH/CRITICAL finding(s)`);
  }
  console.log("[security] launch security gate: PASS (0 production HIGH/CRITICAL findings)");
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
