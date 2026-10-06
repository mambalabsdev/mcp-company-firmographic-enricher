import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..");
const pkg = JSON.parse(readFileSync(join(repo, "package.json"), "utf8"));

const TOOL_NAME = "enrich_company_firmographics";
const ACTOR_ID = "YlUtLWjfPpqykmB8g";
// Every input the live actor exposes to a buyer must be exposed by the tool.
// Excluded by rule: source_tag (internal or test only fields).
const ACTOR_INPUTS = ["batchSize","company_name","domain","domains","failOnMostlyEmpty","skipCache"];
// The tool's full input list, so a dropped or renamed parameter fails here.
const TOOL_INPUTS = ["batchSize","company_name","domain","domains","failOnMostlyEmpty","skipCache"];
const TOOL_REQUIRED = [];
const SAMPLE_ARGS = {"domain":"stripe.com"};
const RUN_QUERY = "?timeout=1800";

// Speak MCP over stdio to the built server. extraEnv and preload let a test
// swap in the fake Apify API from helpers/mock-fetch.mjs.
function rpc(messages, { env = {}, preload = false } = {}) {
  return new Promise((resolve, reject) => {
    const childEnv = { ...process.env, ...env };
    if (!("APIFY_TOKEN" in env)) delete childEnv.APIFY_TOKEN;
    const args = preload
      ? ["--import", pathToFileURL(join(here, "helpers", "mock-fetch.mjs")).href, join(repo, "build", "index.js")]
      : [join(repo, "build", "index.js")];
    const child = spawn(process.execPath, args, { stdio: ["pipe", "pipe", "pipe"], env: childEnv });
    const lastId = messages[messages.length - 1].id;
    let out = "";
    let err = "";
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error(`timed out. stderr: ${err}`));
    }, 30000);
    child.stdout.on("data", (chunk) => {
      out += chunk.toString();
      for (const line of out.split("\n")) {
        if (!line.trim()) continue;
        let msg;
        try {
          msg = JSON.parse(line);
        } catch {
          continue;
        }
        if (msg.id === lastId) {
          clearTimeout(timer);
          child.kill();
          resolve(msg);
        }
      }
    });
    child.stderr.on("data", (chunk) => {
      err += chunk.toString();
    });
    child.on("error", reject);
    const init = [
      { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "wrapper-test", version: "0.0.0" } } },
      { jsonrpc: "2.0", method: "notifications/initialized" },
    ];
    for (const m of [...init, ...messages]) child.stdin.write(JSON.stringify(m) + "\n");
  });
}

const listTools = async () => (await rpc([{ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} }])).result;

test("serves tools/list with no APIFY_TOKEN set", async () => {
  const result = await listTools();
  assert.equal(result.tools.length, 1);
  assert.equal(result.tools[0].name, TOOL_NAME);
  assert.ok(result.tools[0].description.length > 0);
});

test("tool schema exposes the expected inputs and every live actor input", async () => {
  const result = await listTools();
  const props = Object.keys(result.tools[0].inputSchema.properties).sort();
  assert.deepEqual(props, [...TOOL_INPUTS].sort());
  for (const input of ACTOR_INPUTS) assert.ok(props.includes(input), `actor input ${input} is not exposed`);
});

test("tool schema requires exactly the expected inputs", async () => {
  const result = await listTools();
  const required = (result.tools[0].inputSchema.required ?? []).slice().sort();
  assert.deepEqual(required, [...TOOL_REQUIRED].sort());
});

test("source pins the immutable actor id and never uses run-sync", () => {
  const src = readFileSync(join(repo, "src", "index.ts"), "utf8");
  assert.ok(src.includes(`"${ACTOR_ID}"`), "actor id missing from source");
  assert.ok(!src.includes("run-sync"), "run-sync endpoint still referenced");
});

test("package name and mcpName follow the naming convention", () => {
  const short = pkg.name.split("/")[1];
  assert.equal(pkg.name, `@mambalabsdev/${short}`);
  assert.equal(pkg.mcpName, `com.mambabuilt/${short}`);
});

test("a call starts the run, polls it, and returns the dataset", async () => {
  const log = join(mkdtempSync(join(tmpdir(), "mcp-test-")), "requests.jsonl");
  const res = await rpc(
    [{ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: TOOL_NAME, arguments: SAMPLE_ARGS } }],
    { env: { APIFY_TOKEN: "test-token", MOCK_LOG: log, MOCK_RUN_STATUS: "SUCCEEDED", MAMBA_POLL_INTERVAL_MS: "10" }, preload: true },
  );
  assert.notEqual(res.result.isError, true, res.result.content?.[0]?.text);
  const items = JSON.parse(res.result.content[0].text);
  assert.deepEqual(items, [{ row_status: "ok", mocked: true }]);
  const calls = readFileSync(log, "utf8").trim().split("\n").map((l) => JSON.parse(l));
  assert.equal(calls[0].method, "POST");
  assert.equal(calls[0].url, `https://api.apify.com/v2/acts/${ACTOR_ID}/runs${RUN_QUERY}`);
  assert.ok(calls.some((c) => c.url.includes("/v2/actor-runs/run123")), "run was never polled");
  assert.ok(calls.some((c) => c.url.includes("/v2/datasets/ds123/items")), "dataset was never read");
  assert.ok(calls.every((c) => !c.url.includes("run-sync")));
});

test("a run that does not succeed is an error with its run id", async () => {
  const res = await rpc(
    [{ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: TOOL_NAME, arguments: SAMPLE_ARGS } }],
    { env: { APIFY_TOKEN: "test-token", MOCK_RUN_STATUS: "FAILED", MAMBA_POLL_INTERVAL_MS: "10" }, preload: true },
  );
  assert.equal(res.result.isError, true);
  assert.match(res.result.content[0].text, /run123/);
  assert.match(res.result.content[0].text, /FAILED/);
});
