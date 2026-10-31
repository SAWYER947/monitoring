import { randomUUID, randomBytes, timingSafeEqual } from "node:crypto";
import { addAudit, saveStore } from "./store.mjs";
import { clearSessionCookie, hashPassword, issueSession, readSession, revokeSession, verifyPassword } from "./security.mjs";
import { describeProvider, getProvider, listProviderChoices } from "./providers/index.mjs";

const authAttempts = new Map();
const AUTH_WINDOW_MS = 15 * 60_000;
const AUTH_LIMIT = 8;
let setupInProgress = false;
let nextLimiterCleanup = Date.now() + 10 * 60_000;
const DUMMY_PASSWORD_HASH = await hashPassword(randomBytes(32).toString("hex"));

class HttpError extends Error {
  constructor(status, message, code = "request_failed") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function json(response, status, body, headers = {}) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 24 * 1024) throw new HttpError(413, "Request body is too large.", "body_too_large");
    chunks.push(chunk);
  }
  if (size === 0) return {};
  try {
    const value = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Expected an object");
    return value;
  } catch {
    throw new HttpError(400, "Send a valid JSON object.", "invalid_json");
  }
}

function browserOrigin(request) {
  const origin = request.headers.origin;
  const host = request.headers.host;
  if (typeof origin !== "string" || typeof host !== "string") throw new HttpError(403, "This request must come from this application.", "origin_required");
  const forwardedProto = process.env.TRUST_PROXY === "1" ? String(request.headers["x-forwarded-proto"] || "").split(",")[0].trim() : "";
  const protocol = forwardedProto || (request.socket.encrypted ? "https" : "http");
  let actualOrigin;
  try {
    actualOrigin = new URL(origin).origin;
  } catch {
    throw new HttpError(403, "This request must come from this application.", "invalid_origin");
  }
  if (actualOrigin !== `${protocol}://${host}`) throw new HttpError(403, "This request must come from this application.", "origin_mismatch");
}

function sameSecret(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && timingSafeEqual(a, b);
}

function clientAddress(request) {
  if (process.env.TRUST_PROXY === "1") {
    const forwarded = String(request.headers["x-forwarded-for"] || "").split(",")[0].trim();
    if (forwarded) return forwarded.slice(0, 100);
  }
  return String(request.socket.remoteAddress || "unknown").slice(0, 100);
}

function checkAuthRateLimit(request) {
  const now = Date.now();
  if (now > nextLimiterCleanup) {
    for (const [address, record] of authAttempts) {
      if (record.resetAt < now && record.blockedUntil < now) authAttempts.delete(address);
    }
    nextLimiterCleanup = now + 10 * 60_000;
  }
  const key = clientAddress(request);
  const current = authAttempts.get(key);
  if (current?.blockedUntil > now) throw new HttpError(429, "Too many sign-in attempts. Try again in a few minutes.", "rate_limited");
  if (!current || current.resetAt < now) {
    authAttempts.set(key, { count: 0, resetAt: now + AUTH_WINDOW_MS, blockedUntil: 0 });
  }
  const record = authAttempts.get(key);
  record.count += 1;
  if (record.count > AUTH_LIMIT) {
    record.blockedUntil = now + AUTH_WINDOW_MS;
    throw new HttpError(429, "Too many sign-in attempts. Try again in a few minutes.", "rate_limited");
  }
}

function validateUsername(value) {
  if (typeof value !== "string") throw new HttpError(400, "Enter a username.", "invalid_username");
  const username = value.trim();
  if (username.length < 3 || username.length > 48 || !/^[a-zA-Z0-9._-]+$/u.test(username)) {
    throw new HttpError(400, "Use 3–48 letters, numbers, dots, dashes, or underscores for the username.", "invalid_username");
  }
  return username;
}

function validatePassword(value) {
  if (typeof value !== "string" || value.length < 12 || value.length > 128) {
    throw new HttpError(400, "Use a password between 12 and 128 characters.", "invalid_password");
  }
  return value;
}

function validateNetworkName(value) {
  if (typeof value !== "string") throw new HttpError(400, "Enter a friendly network name.", "invalid_network_name");
  const name = value.trim();
  if (name.length < 2 || name.length > 64 || /[\u0000-\u001F\u007F]/u.test(name)) {
    throw new HttpError(400, "Network names must be 2–64 characters.", "invalid_network_name");
  }
  return name;
}

function validateLabel(value) {
  if (typeof value !== "string") throw new HttpError(400, "Enter a device label.", "invalid_label");
  const label = value.trim();
  if (label.length > 48 || /[\u0000-\u001F\u007F]/u.test(label)) throw new HttpError(400, "Device labels must be 48 characters or fewer.", "invalid_label");
  return label;
}

function getAuthenticatedSession(request, store, key) {
  const session = readSession(request, key);
  if (!session || !store.admins.some((admin) => admin.username === session.username)) {
    throw new HttpError(401, "Your session has expired. Sign in again.", "authentication_required");
  }
  return session;
}

function requireCsrf(request, session) {
  const submitted = request.headers["x-csrf-token"];
  if (typeof submitted !== "string" || !sameSecret(submitted, session.csrfToken)) {
    throw new HttpError(403, "Refresh the page and try again.", "csrf_failed");
  }
}

function findNetwork(store, id) {
  const network = store.networks.find((item) => item.id === id);
  if (!network) throw new HttpError(404, "Network not found.", "network_not_found");
  return network;
}

function findDemoRequest(store, id) {
  const request = store.demoRequests.find((item) => item.id === id && !store.requestDecisions[item.id]);
  if (!request) throw new HttpError(404, "This access request is no longer pending.", "request_not_found");
  return request;
}

async function buildDashboard(store) {
  const networks = [];
  const devices = [];
  const requests = [];

  for (const record of store.networks) {
    const provider = getProvider(record.providerId);
    const description = describeProvider(record.providerId);
    const providerReady = Boolean(provider?.available);
    const providerDevices = providerReady && provider.supports?.devices ? await provider.listDevices(record, store) : [];
    const deviceState = store.deviceState[record.id] || {};
    const deviceList = providerDevices.map((device) => ({
      ...device,
      networkId: record.id,
      networkName: record.name,
      friendlyLabel: deviceState[device.id]?.label ?? device.friendlyLabel ?? "",
    }));
    const requestList = providerReady && provider.supports?.approvals ? await provider.listRequests(record, store) : [];
    const status = provider?.simulated ? "simulated" : providerReady ? "connected" : "unsupported";
    networks.push({ ...record, provider: description, status, deviceCount: deviceList.filter((device) => device.connectionStatus === "connected").length, pendingRequests: requestList.length });
    devices.push(...deviceList);
    requests.push(...requestList);
  }

  return {
    networks,
    devices,
    requests,
    audit: store.audit.slice(0, 40),
    providers: listProviderChoices(),
    stats: {
      networkCount: networks.length,
      connectedDevices: devices.filter((device) => device.connectionStatus === "connected").length,
      pendingRequests: requests.length,
      supportedNetworks: networks.filter((network) => network.provider.available && !network.provider.simulated).length,
    },
    notification: {
      mode: "in-app-polling",
      pollIntervalSeconds: 30,
      pushConfigured: false,
      message: "In-app queue checks every 30 seconds. Push notifications are not configured.",
    },
  };
}

export async function handleApi(request, response, context) {
  const { store, sessionKey } = context;
  const url = new URL(request.url, "http://localhost");
  const method = request.method || "GET";

  try {
    if (!url.pathname.startsWith("/api/")) throw new HttpError(404, "Not found.", "not_found");

    if (method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE") browserOrigin(request);

    if (method === "GET" && url.pathname === "/api/status") {
      const session = readSession(request, sessionKey);
      const validSession = session && store.admins.some((admin) => admin.username === session.username) ? session : null;
      return json(response, 200, {
        authenticated: Boolean(validSession),
        username: validSession?.username || null,
        csrfToken: validSession?.csrfToken || null,
        setupRequired: store.admins.length === 0,
        environmentBootstrapEnabled: process.env.NODE_ENV !== "production" && Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD),
        mode: "demo",
      });
    }

    if (method === "POST" && url.pathname === "/api/setup") {
      checkAuthRateLimit(request);
      if (setupInProgress) throw new HttpError(409, "Administrator setup is already in progress.", "setup_in_progress");
      if (store.admins.length > 0) throw new HttpError(409, "An administrator account already exists.", "setup_complete");
      setupInProgress = true;
      try {
        const body = await readJson(request);
        const username = validateUsername(body.username);
        const password = validatePassword(body.password);
        store.admins.push({ username, passwordHash: await hashPassword(password), createdAt: new Date().toISOString() });
        addAudit(store, { administrator: username, action: "Administrator account created", device: null, network: null, simulated: false });
        saveStore(store);
        const issued = issueSession(username, sessionKey);
        return json(response, 201, { authenticated: true, username, csrfToken: issued.session.csrfToken }, { "set-cookie": issued.cookie });
      } finally {
        setupInProgress = false;
      }
    }

    if (method === "POST" && url.pathname === "/api/login") {
      checkAuthRateLimit(request);
      if (store.admins.length === 0) throw new HttpError(409, "Create the first administrator account to continue.", "setup_required");
      const body = await readJson(request);
      const username = typeof body.username === "string" ? body.username.trim() : "";
      const password = typeof body.password === "string" ? body.password : "";
      if (password.length > 128) throw new HttpError(400, "Passwords must be 128 characters or fewer.", "invalid_password");
      const admin = store.admins.find((item) => item.username.toLowerCase() === username.toLowerCase());
      const valid = await verifyPassword(password.slice(0, 128), admin?.passwordHash || DUMMY_PASSWORD_HASH);
      if (!admin || !valid) throw new HttpError(401, "Those sign-in details did not match.", "invalid_credentials");
      const issued = issueSession(admin.username, sessionKey);
      return json(response, 200, { authenticated: true, username: admin.username, csrfToken: issued.session.csrfToken }, { "set-cookie": issued.cookie });
    }

    const session = getAuthenticatedSession(request, store, sessionKey);
    if (method !== "GET" && method !== "HEAD") requireCsrf(request, session);

    if (method === "POST" && url.pathname === "/api/logout") {
      revokeSession(request, sessionKey);
      return json(response, 200, { success: true }, { "set-cookie": clearSessionCookie() });
    }

    if (method === "GET" && url.pathname === "/api/dashboard") {
      return json(response, 200, await buildDashboard(store));
    }

    if (method === "GET" && url.pathname === "/api/notifications") {
      const dashboard = await buildDashboard(store);
      return json(response, 200, {
        pendingRequests: dashboard.stats.pendingRequests,
        checkedAt: new Date().toISOString(),
        simulated: dashboard.networks.some((network) => network.provider.simulated),
        pushConfigured: false,
        pollIntervalSeconds: 30,
      });
    }

    if (method === "GET" && url.pathname === "/api/networks") {
      const dashboard = await buildDashboard(store);
      return json(response, 200, { networks: dashboard.networks, providers: dashboard.providers });
    }

    if (method === "POST" && url.pathname === "/api/networks") {
      const body = await readJson(request);
      const name = validateNetworkName(body.name);
      const providerId = typeof body.providerId === "string" ? body.providerId : "";
      if (!["demo", "generic-controller"].includes(providerId)) throw new HttpError(400, "Choose a supported integration option.", "unsupported_provider");
      const provider = getProvider(providerId);
      const network = {
        id: randomUUID(),
        name,
        providerId,
        createdAt: new Date().toISOString(),
        status: provider?.available ? (provider.simulated ? "simulated" : "connected") : "unsupported",
        lastSync: provider?.available ? new Date().toISOString() : null,
      };
      store.networks.unshift(network);
      addAudit(store, { administrator: session.username, action: provider?.available ? "Network added · demo mode" : "Network added · adapter needed", device: null, network: name, simulated: Boolean(provider?.simulated) });
      saveStore(store);
      return json(response, 201, { network: { ...network, provider: describeProvider(providerId), deviceCount: 0, pendingRequests: 0 } });
    }

    const networkNameMatch = url.pathname.match(/^\/api\/networks\/([A-Za-z0-9_-]+)$/u);
    if (networkNameMatch && method === "PATCH") {
      const network = findNetwork(store, networkNameMatch[1]);
      const body = await readJson(request);
      network.name = validateNetworkName(body.name);
      let action = "Network name updated";
      if (body.providerId !== undefined) {
        if (typeof body.providerId !== "string" || !["demo", "generic-controller"].includes(body.providerId)) throw new HttpError(400, "Choose a supported integration option.", "unsupported_provider");
        if (body.providerId !== network.providerId) {
          network.providerId = body.providerId;
          const provider = getProvider(network.providerId);
          network.status = provider?.simulated ? "simulated" : provider?.available ? "connected" : "unsupported";
          network.lastSync = provider?.available ? new Date().toISOString() : null;
          action = provider?.available ? `Integration changed to ${provider.name}` : "Integration changed · adapter needed";
        }
      }
      addAudit(store, { administrator: session.username, action, device: null, network: network.name, simulated: network.providerId === "demo" });
      saveStore(store);
      return json(response, 200, { success: true, network });
    }

    const networkTestMatch = url.pathname.match(/^\/api\/networks\/([A-Za-z0-9_-]+)\/test$/u);
    if (networkTestMatch && method === "POST") {
      const network = findNetwork(store, networkTestMatch[1]);
      const provider = getProvider(network.providerId);
      const result = provider ? await provider.testConnection(network) : { success: false, message: "Unsupported integration." };
      if (result.success) {
        network.lastSync = new Date().toISOString();
        network.status = provider.simulated ? "simulated" : "connected";
      }
      addAudit(store, { administrator: session.username, action: result.success ? "Connection check succeeded" : "Connection check failed", device: null, network: network.name, simulated: Boolean(result.simulated) });
      saveStore(store);
      return json(response, result.success ? 200 : 422, { ...result, network });
    }

    if (networkNameMatch && method === "DELETE") {
      const network = findNetwork(store, networkNameMatch[1]);
      const name = network.name;
      store.networks = store.networks.filter((item) => item.id !== network.id);
      delete store.deviceState[network.id];
      store.demoRequests = store.demoRequests.filter((item) => item.networkId !== network.id);
      addAudit(store, { administrator: session.username, action: "Network removed", device: null, network: name, simulated: network.providerId === "demo" });
      saveStore(store);
      return json(response, 200, { success: true });
    }

    if (method === "GET" && url.pathname === "/api/devices") {
      const dashboard = await buildDashboard(store);
      const networkId = url.searchParams.get("networkId");
      return json(response, 200, { devices: networkId ? dashboard.devices.filter((device) => device.networkId === networkId) : dashboard.devices });
    }

    const deviceMatch = url.pathname.match(/^\/api\/devices\/([A-Za-z0-9_-]+)$/u);
    if (deviceMatch && method === "PATCH") {
      const body = await readJson(request);
      if (typeof body.networkId !== "string") throw new HttpError(400, "Choose a network for this device.", "network_required");
      const network = findNetwork(store, body.networkId);
      const provider = getProvider(network.providerId);
      if (!provider?.available || !provider.supports?.devices) throw new HttpError(422, "Device labels are unavailable until this integration is configured.", "integration_unavailable");
      const devices = await provider.listDevices(network, store);
      const device = devices.find((item) => item.id === deviceMatch[1]);
      if (!device) throw new HttpError(404, "Device not found.", "device_not_found");
      const label = validateLabel(body.label);
      store.deviceState[network.id] ||= {};
      store.deviceState[network.id][device.id] ||= {};
      store.deviceState[network.id][device.id].label = label;
      addAudit(store, { administrator: session.username, action: label ? "Device label updated" : "Device label cleared", device: label || device.deviceName, network: network.name, simulated: Boolean(provider.simulated) });
      saveStore(store);
      return json(response, 200, { success: true, simulated: Boolean(provider.simulated) });
    }

    const deviceActionMatch = url.pathname.match(/^\/api\/devices\/([A-Za-z0-9_-]+)\/action$/u);
    if (deviceActionMatch && method === "POST") {
      const body = await readJson(request);
      const action = body.action;
      if (!["authorize", "revoke", "block", "unblock"].includes(action)) throw new HttpError(400, "Choose a supported device action.", "invalid_action");
      if (typeof body.networkId !== "string") throw new HttpError(400, "Choose a network for this device.", "network_required");
      const network = findNetwork(store, body.networkId);
      const provider = getProvider(network.providerId);
      if (!provider?.available || !provider.supports?.[action]) throw new HttpError(422, "This integration does not support that access action.", "action_unsupported");
      const devices = await provider.listDevices(network, store);
      const device = devices.find((item) => item.id === deviceActionMatch[1]);
      if (!device) throw new HttpError(404, "Device not found.", "device_not_found");
      await provider.updateDevice(network, device.id, action, null, store);
      const actionName = { authorize: "Device authorized", revoke: "Device access revoked", block: "Device blocked", unblock: "Device unblocked" }[action];
      addAudit(store, { administrator: session.username, action: `${actionName}${provider.simulated ? " · simulated" : ""}`, device: device.friendlyLabel || device.deviceName, network: network.name, simulated: Boolean(provider.simulated) });
      saveStore(store);
      return json(response, 200, { success: true, simulated: Boolean(provider.simulated), message: provider.simulated ? "Simulated locally. No router was contacted." : "The provider completed the access action." });
    }

    if (method === "GET" && url.pathname === "/api/approvals") {
      const dashboard = await buildDashboard(store);
      return json(response, 200, { requests: dashboard.requests });
    }

    const approvalMatch = url.pathname.match(/^\/api\/approvals\/([A-Za-z0-9_-]+)$/u);
    if (approvalMatch && method === "POST") {
      const body = await readJson(request);
      const action = body.action;
      if (!["approve", "deny"].includes(action)) throw new HttpError(400, "Choose Approve or Deny.", "invalid_action");
      const approval = findDemoRequest(store, approvalMatch[1]);
      const network = findNetwork(store, approval.networkId);
      const provider = getProvider(network.providerId);
      if (!provider?.available || !provider.supports?.approvals) throw new HttpError(422, "This integration does not provide access requests.", "approvals_unsupported");
      const durationMinutes = body.durationMinutes === undefined || body.durationMinutes === null || body.durationMinutes === ""
        ? null
        : Number(body.durationMinutes);
      if (action === "approve" && durationMinutes !== null && !provider.supports.approvalDurations.includes(durationMinutes)) {
        throw new HttpError(400, "Choose an approval duration supported by this integration.", "invalid_duration");
      }
      await provider.decideRequest(approval, action, durationMinutes, store);
      addAudit(store, { administrator: session.username, action: `${action === "approve" ? "Access request approved" : "Access request denied"}${provider.simulated ? " · simulated" : ""}`, device: approval.deviceName, network: network.name, simulated: Boolean(provider.simulated) });
      saveStore(store);
      return json(response, 200, { success: true, simulated: Boolean(provider.simulated), message: provider.simulated ? "Recorded in this demo only. No access was changed on a router." : "The provider handled the request." });
    }

    if (method === "GET" && url.pathname === "/api/audit") {
      return json(response, 200, { entries: store.audit.slice(0, 250) });
    }

    throw new HttpError(404, "Not found.", "not_found");
  } catch (error) {
    if (error instanceof HttpError) return json(response, error.status, { error: error.message, code: error.code });
    console.error("API request failed:", error);
    return json(response, 500, { error: "The request could not be completed. Try again.", code: "internal_error" });
  }
}
