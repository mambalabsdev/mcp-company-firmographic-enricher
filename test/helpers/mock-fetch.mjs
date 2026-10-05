// Test only. Loaded with `node --import` into the built server so the start
// and poll path runs against a fake Apify API. MOCK_RUN_STATUS sets the run's
// terminal status; every request is appended to MOCK_LOG as one JSON line.
import { appendFileSync } from "node:fs";

const status = process.env.MOCK_RUN_STATUS || "SUCCEEDED";
const log = process.env.MOCK_LOG;
let polls = 0;

const json = (body, code = 200) =>
  new Response(JSON.stringify(body), { status: code, headers: { "Content-Type": "application/json" } });

globalThis.fetch = async (url, init = {}) => {
  const u = String(url);
  const method = init.method || "GET";
  if (log) appendFileSync(log, JSON.stringify({ method, url: u, body: init.body ?? null }) + "\n");
  if (u.includes("run-sync")) return json({ error: { message: "run-sync must not be used" } }, 500);
  if (method === "POST" && /\/v2\/acts\/[^/]+\/runs/.test(u)) {
    return json({ data: { id: "run123", status: "READY", defaultDatasetId: "ds123" } }, 201);
  }
  if (/\/v2\/actor-runs\/run123/.test(u)) {
    polls += 1;
    return json({ data: { id: "run123", status: polls < 2 ? "RUNNING" : status, defaultDatasetId: "ds123" } });
  }
  if (/\/v2\/datasets\/ds123\/items/.test(u)) return json([{ row_status: "ok", mocked: true }]);
  return json({ error: { message: `unexpected ${method} ${u}` } }, 404);
};
