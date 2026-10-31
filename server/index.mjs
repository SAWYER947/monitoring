import { createReadStream, existsSync } from "node:fs";
import { createServer } from "node:http";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadLocalEnvironment } from "./env.mjs";
import { handleApi } from "./api.mjs";
import { hashPassword } from "./security.mjs";
import { addAudit, getSessionKey, loadStore, saveStore } from "./store.mjs";

loadLocalEnvironment();
process.env.NODE_ENV ||= "development";

const projectDirectory = resolve(fileURLToPath(new URL("..", import.meta.url)));
const publicDirectory = resolve(projectDirectory, "public");
const store = loadStore();
const sessionKey = getSessionKey();

async function configureLocalAdministrator() {
  if (process.env.NODE_ENV === "production" || store.admins.length > 0) return;
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!username && !password) return;
  if (!username || !password || username.length < 3 || username.length > 48 || !/^[a-zA-Z0-9._-]+$/u.test(username) || password.length < 12 || password.length > 128) {
    console.warn("ADMIN_USERNAME/ADMIN_PASSWORD are incomplete or invalid; use the first-run setup screen instead.");
    return;
  }
  store.admins.push({ username, passwordHash: await hashPassword(password), createdAt: new Date().toISOString() });
  addAudit(store, { administrator: username, action: "Administrator account configured from local environment", device: null, network: null, simulated: false });
  saveStore(store);
  console.log("Local administrator configured from environment variables.");
}

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

function applySecurityHeaders(response) {
  response.setHeader("x-content-type-options", "nosniff");
  response.setHeader("x-frame-options", "DENY");
  response.setHeader("referrer-policy", "strict-origin-when-cross-origin");
  response.setHeader("permissions-policy", "camera=(), microphone=(), geolocation=()");
  response.setHeader("cross-origin-opener-policy", "same-origin");
  response.setHeader("content-security-policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");
  response.setHeader("cache-control", "no-store");
}

function serveStatic(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { "content-type": "text/plain; charset=utf-8", allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }
  const pathname = new URL(request.url, "http://localhost").pathname;
  const publicFiles = new Map([
    ["/", "index.html"],
    ["/index.html", "index.html"],
    ["/styles.css", "styles.css"],
    ["/app.js", "app.js"],
    ["/favicon.svg", "favicon.svg"],
  ]);
  const filename = publicFiles.get(pathname);
  if (!filename) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }
  const filePath = resolve(publicDirectory, filename);
  if (!existsSync(filePath)) {
    response.writeHead(503, { "content-type": "text/plain; charset=utf-8" });
    response.end("Application assets are not ready.");
    return;
  }
  response.writeHead(200, { "content-type": mimeTypes[extname(filePath)] || "application/octet-stream", "cache-control": "no-cache" });
  if (request.method === "HEAD") return response.end();
  createReadStream(filePath).pipe(response);
}

await configureLocalAdministrator();

const server = createServer((request, response) => {
  applySecurityHeaders(response);
  if (new URL(request.url, "http://localhost").pathname.startsWith("/api/")) {
    void handleApi(request, response, { store, sessionKey });
    return;
  }
  serveStatic(request, response);
});

const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "127.0.0.1";
server.listen(port, host, () => {
  console.log(`Bluehaven Network Console listening on http://${host}:${port}`);
  console.log(`Data store: ${resolve(process.env.DATA_DIR || ".data", "store.json")}`);
  console.log("Provider mode: demo by default; no real router is contacted.");
});

function shutdown() {
  server.close(() => process.exit(0));
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
