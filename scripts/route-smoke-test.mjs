// Requests every scoped route against a running local server (e.g. `astro preview`)
// and asserts HTTP 200 + zero console errors, per .claude/rules/testing.md. The two
// blank legal routes are additionally asserted to render a genuinely empty <body>.
import { chromium } from "playwright";
import { allRoutes } from "./routes.mjs";

const LOCAL_BASE = process.env.LOCAL_BASE_URL || "http://localhost:4321/it/";

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const results = [];

  page.on("pageerror", (err) => {
    const current = results[results.length - 1];
    if (current) current.consoleErrors.push(`pageerror: ${err.message}`);
  });
  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const current = results[results.length - 1];
    if (current) current.consoleErrors.push(msg.text());
  });

  for (const route of allRoutes()) {
    const url = `${LOCAL_BASE}${route.path}`;
    const record = { path: route.path, kind: route.kind, url, consoleErrors: [] };
    results.push(record);
    const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    record.status = response?.status();
    if (route.kind === "blank") {
      record.bodyEmpty = await page.evaluate(() => document.body.innerHTML.trim() === "");
      record.hasHeader = await page.evaluate(() => !!document.querySelector("#site-header"));
      record.hasFooter = await page.evaluate(() => !!document.querySelector("#site-footer"));
    }
  }

  await browser.close();

  let failed = 0;
  for (const r of results) {
    const problems = [];
    if (r.status !== 200) problems.push(`status=${r.status}`);
    if (r.consoleErrors.length) problems.push(`console errors: ${r.consoleErrors.join(" | ")}`);
    if (r.kind === "blank") {
      if (!r.bodyEmpty) problems.push("body not empty");
      if (r.hasHeader) problems.push("header present (should be blank)");
      if (r.hasFooter) problems.push("footer present (should be blank)");
    }
    if (problems.length) {
      failed++;
      console.log(`FAIL ${r.path || "(home)"}: ${problems.join("; ")}`);
    } else {
      console.log(`OK   ${r.path || "(home)"}`);
    }
  }

  console.log(`\n${results.length - failed}/${results.length} routes passed.`);
  process.exitCode = failed ? 1 : 0;
}

main();
