const app = document.querySelector("#app");
const toastRegion = document.querySelector("#toast-region");

const paths = {
  overview: '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="5" rx="1.5"/><rect x="13" y="10" width="8" height="11" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/>',
  network: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M7 9h10M7 13h6M7 16h2M17 16h.01"/>',
  device: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10 18.5h4"/>',
  inbox: '<path d="M4 4h16v16H4z"/><path d="M4 13h4l2 3h4l2-3h4"/>',
  audit: '<path d="M4 5h16M4 12h16M4 19h16"/><circle cx="7" cy="5" r="1"/><circle cx="7" cy="12" r="1"/><circle cx="7" cy="19" r="1"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.2 1-1.2 2.1-1.5-.6a7.8 7.8 0 0 1-1.7 1l-.3 1.6h-2.4l-.3-1.6a7.8 7.8 0 0 1-1.7-1l-1.5.6-1.2-2.1 1.2-1a7.2 7.2 0 0 1 0-2l-1.2-1 1.2-2.1 1.5.6a7.8 7.8 0 0 1 1.7-1l.3-1.6h2.4l.3 1.6a7.8 7.8 0 0 1 1.7 1l1.5-.6 1.2 2.1-1.2 1a7.2 7.2 0 0 1 0 2Z" transform="translate(-1 -1)"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  wifi: '<path d="M5 9a11 11 0 0 1 14 0M8 12a6.5 6.5 0 0 1 8 0M11 15a2 2 0 0 1 2 0M12 19h.01"/>',
  shield: '<path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/>',
  shieldOff: '<path d="m3 3 18 18M12 22s8-4 8-11V5l-8-3-4 1.5M4 5v6c0 3.8 2.4 6.8 4.8 8.8"/>',
  block: '<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
  unlock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 7.6-1.7"/>',
  laptop: '<rect x="4" y="4" width="16" height="13" rx="2"/><path d="M2 20h20l-2-3H4l-2 3Z"/>',
  phone: '<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18.5h2"/>',
  tablet: '<rect x="4" y="3" width="16" height="18" rx="2.5"/><path d="M11 17.5h2"/>',
  display: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  game: '<path d="M6 9h12a4 4 0 0 1 3.8 5.2l-.8 2.5a2 2 0 0 1-3.2.9L15 15H9l-2.8 2.6a2 2 0 0 1-3.2-.9l-.8-2.5A4 4 0 0 1 6 9Z"/><path d="M7 11v4M5 13h4M16 12h.01M18 14h.01"/>',
  unknown: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9a2.5 2.5 0 1 1 4.6 1.3c-.9 1.2-2.2 1.4-2.2 3M12 17h.01"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v5M14 11v5"/>',
  refresh: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.7 9A7 7 0 0 1 18 6.5L20 12M4 12l2 5.5A7 7 0 0 0 18.3 15"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/>',
  logout: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"/>',
  spark: '<path d="m12 3 1.6 6.4L20 11l-6.4 1.6L12 19l-1.6-6.4L4 11l6.4-1.6L12 3Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"/>',
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  user: '<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  server: '<rect x="3" y="3" width="18" height="8" rx="2"/><rect x="3" y="13" width="18" height="8" rx="2"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/>',
};

const pageMeta = {
  overview: { title: "Network overview", crumb: "Overview", description: "A calm, current view of the networks you manage." },
  networks: { title: "Your networks", crumb: "Networks", description: "Manage authorized networks and their provider connections." },
  devices: { title: "Device monitor", crumb: "Devices", description: "Review device metadata reported by your connected provider." },
  approvals: { title: "Access requests", crumb: "Approvals", description: "Review pending requests from configured access providers." },
  audit: { title: "Audit history", crumb: "Audit log", description: "A record of administrator actions in this console." },
  settings: { title: "Settings & security", crumb: "Settings", description: "Administrator security, provider status, and notification behavior." },
};

const state = {
  status: null,
  session: null,
  data: null,
  page: "overview",
  loading: false,
  loadError: "",
  search: "",
  networkFilter: "all",
  deviceFilter: "all",
  mobileMenuOpen: false,
  sidebarCollapsed: false,
  notificationsOpen: false,
  modal: null,
  authError: "",
  previousPending: null,
};

function icon(name, className = "") {
  const body = paths[name] || paths.spark;
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/gu, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function safeDate(value, options = { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) {
  if (!value) return "Not synced yet";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "Unknown";
  return new Intl.DateTimeFormat(undefined, options).format(date);
}

function ago(value) {
  if (!value) return "—";
  const delta = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(delta / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function until(value) {
  if (!value) return "No expiration";
  const delta = new Date(value).getTime() - Date.now();
  if (Number.isNaN(delta)) return "Unknown expiry";
  if (delta <= 0) return "Expired";
  const minutes = Math.max(1, Math.ceil(delta / 60_000));
  if (minutes < 60) return `in ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes ? `in ${hours}h ${remainingMinutes}m` : `in ${hours}h`;
}

function initials(value) {
  const parts = String(value || "A").split(/[\s._-]+/u).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0]?.slice(0, 2) || "A").toUpperCase();
}

function statusPill(status, label) {
  const labels = { connected: "Connected", offline: "Offline", allowed: "Authorized", pending: "Needs approval", blocked: "Blocked", simulated: "Demo simulation", unsupported: "Adapter needed", denied: "Denied" };
  return `<span class="status-pill ${escapeHtml(status)}">${escapeHtml(label || labels[status] || status)}</span>`;
}

function providerLabel(provider) {
  if (!provider) return "Unknown provider";
  if (provider.simulated) return "Demo simulation";
  if (!provider.available) return "Controller adapter needed";
  return provider.name || "Connected provider";
}

function deviceIcon(type) {
  const value = String(type || "").toLowerCase();
  if (value.includes("laptop") || value.includes("macbook") || value.includes("thinkpad")) return "laptop";
  if (value.includes("tablet") || value.includes("ipad")) return "tablet";
  if (value.includes("phone") || value.includes("android") || value.includes("pixel")) return "phone";
  if (value.includes("display") || value.includes("tv")) return "display";
  if (value.includes("gaming") || value.includes("console")) return "game";
  return "unknown";
}

function deviceName(device) {
  return device.friendlyLabel || device.deviceName || "Unnamed device";
}

async function api(path, options = {}) {
  const method = options.method || "GET";
  const headers = { accept: "application/json", ...(options.headers || {}) };
  if (options.body !== undefined) headers["content-type"] = "application/json";
  if (!["GET", "HEAD"].includes(method) && state.session?.csrfToken) headers["x-csrf-token"] = state.session.csrfToken;
  const response = await fetch(path, {
    method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    credentials: "same-origin",
  });
  const payload = await response.json().catch(() => ({}));
  if (response.status === 401 && state.session) {
    state.session = null;
    state.data = null;
    state.status = { ...(state.status || {}), authenticated: false, setupRequired: false };
    render();
  }
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status}).`);
  return payload;
}

function showToast(message, tone = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${tone === "error" ? "error" : tone === "warning" ? "warning" : ""}`;
  toast.textContent = message;
  toastRegion.append(toast);
  window.setTimeout(() => toast.remove(), 4200);
}

function demoRibbon() {
  return `<div class="demo-ribbon">${icon("info")}<div><strong>Demo environment.</strong> <span>Sample devices and requests are simulated locally. No router is being scanned or controlled.</span></div><span class="ribbon-tag">SIMULATED</span></div>`;
}

function renderAuth() {
  const setup = Boolean(state.status?.setupRequired);
  const heading = setup ? "Create your admin account" : "Welcome back";
  const description = setup
    ? "Set up the first administrator. Your password is hashed on this server and never sent to a network provider."
    : "Sign in to review the networks and access activity you administer.";
  const form = setup
    ? `<form data-form="setup" novalidate>
        <div class="form-field"><label for="auth-username">Administrator username</label><input id="auth-username" name="username" autocomplete="username" required minlength="3" maxlength="48" placeholder="e.g. network-admin" /></div>
        <div class="form-field"><label for="auth-password">Password</label><input id="auth-password" name="password" type="password" autocomplete="new-password" required minlength="12" maxlength="128" placeholder="At least 12 characters" /></div>
        <div class="form-field"><label for="auth-confirm">Confirm password</label><input id="auth-confirm" name="confirm" type="password" autocomplete="new-password" required minlength="12" maxlength="128" placeholder="Enter it once more" /></div>
        <p class="form-error" role="alert">${escapeHtml(state.authError)}</p>
        <button class="btn" type="submit">Create secure account ${icon("arrow")}</button>
        <p class="auth-setup-note">Use a unique password. Store a recovery copy in your password manager.</p>
      </form>`
    : `<form data-form="login" novalidate>
        <div class="form-field"><label for="auth-username">Username</label><input id="auth-username" name="username" autocomplete="username" required maxlength="48" placeholder="Your administrator username" /></div>
        <div class="form-field"><label for="auth-password">Password</label><input id="auth-password" name="password" type="password" autocomplete="current-password" required maxlength="128" placeholder="Your password" /></div>
        <p class="form-error" role="alert">${escapeHtml(state.authError)}</p>
        <button class="btn" type="submit">Sign in securely ${icon("arrow")}</button>
        <p class="auth-setup-note">Forgot your password? Restore access through the server administrator.</p>
      </form>`;

  app.innerHTML = `<main class="auth-screen">
    <section class="auth-brand-side" aria-label="Bluehaven Network Console">
      <div class="brand"><span class="brand-mark">${icon("wifi")}</span><span class="brand-copy"><span class="brand-name">Bluehaven</span><span class="brand-caption">Network Console</span></span></div>
      <div class="auth-promo"><div class="eyebrow">Clear visibility. Thoughtful access.</div><h1>Welcome to a calmer way to manage your network.</h1><p>Keep the access points you administer organized, review provider reported devices, and make access decisions with a clear audit trail.</p><div class="auth-features"><div class="auth-feature">${icon("shield")} Administrator only, with protected sessions</div><div class="auth-feature">${icon("server")} Provider sourced device and request details</div><div class="auth-feature">${icon("activity")} Action history in one clear place</div></div></div>
      <div class="auth-footer">Built for networks you own or are authorized to administer.</div>
    </section>
    <section class="auth-form-side"><div class="auth-card"><div class="eyebrow">${setup ? "First-time setup" : "Administrator access"}</div><h2>${heading}</h2><p>${description}</p>${form}<div class="auth-secure">${icon("lock")} Passwords are hashed · Sessions are encrypted · Sign-in is rate limited</div><div class="auth-mode-note">Demo data is clearly marked and stays local to this app. Real device actions require a configured controller integration.</div></div></section>
  </main>`;
}

function renderLoading() {
  return `<div class="loading-grid"><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div></div><div style="height:16px"></div><div class="skeleton" style="height:280px"></div>`;
}

function pageHeading(meta, action = "") {
  return `<div class="page-heading"><div><h1>${escapeHtml(meta.title)}</h1><p>${escapeHtml(meta.description)}</p></div>${action ? `<div class="heading-actions">${action}</div>` : ""}</div>`;
}

function statCard(label, value, detail, iconName, tone, detailClass = "") {
  return `<article class="stat-card"><div class="stat-top"><span class="stat-label">${escapeHtml(label)}</span><span class="stat-icon ${tone}">${icon(iconName)}</span></div><div class="stat-value">${escapeHtml(value)}</div><div class="stat-foot"><span class="${detailClass}">${escapeHtml(detail)}</span></div></article>`;
}

function chartPanel() {
  return `<section class="panel"><div class="panel-header"><div><div class="panel-title">Activity pulse</div><div class="panel-subtitle">Illustrative device activity · demo sample</div></div><span class="mini-label demo">${icon("activity")} Sample</span></div><div class="chart-summary"><strong>7</strong><span>sample devices reported</span></div><div class="activity-chart"><svg viewBox="0 0 700 115" preserveAspectRatio="none" role="img" aria-label="Illustrative device activity chart for demo data"><defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5582f2" stop-opacity=".2"/><stop offset="1" stop-color="#5582f2" stop-opacity="0"/></linearGradient></defs><path class="chart-grid" d="M0 18H700M0 55H700M0 92H700"/><path class="chart-area" d="M0 80 C35 76 48 63 80 68 S128 80 160 65 S210 40 240 48 S287 81 320 67 S370 61 400 50 S450 31 480 45 S530 61 560 49 S615 27 640 36 S680 40 700 22 V115 H0Z"/><path class="chart-line" d="M0 80 C35 76 48 63 80 68 S128 80 160 65 S210 40 240 48 S287 81 320 67 S370 61 400 50 S450 31 480 45 S530 61 560 49 S615 27 640 36 S680 40 700 22"/><circle class="chart-dot" cx="480" cy="45" r="4"/><circle class="chart-dot" cx="700" cy="22" r="4"/></svg></div><div class="chart-labels"><span>08:00</span><span>10:00</span><span>12:00</span><span>14:00</span><span>Now</span></div></section>`;
}

function renderNetworkHealth(networks) {
  if (!networks.length) return `<div class="empty-state"><span class="empty-icon">${icon("network")}</span><h3>No networks yet</h3><p>Add an authorized network to start organizing its provider integration.</p><button class="btn" data-action="add-network">${icon("plus")} Add a network</button></div>`;
  return `<div class="network-health-list">${networks.slice(0, 4).map((network) => `<div class="network-health-row"><span class="network-symbol">${icon("wifi")}</span><span class="network-row-copy"><strong>${escapeHtml(network.name)}</strong><span>${escapeHtml(providerLabel(network.provider))}</span></span><span class="network-row-side">${statusPill(network.status)}<small>${network.lastSync ? `${network.provider.simulated ? "Checked" : "Synced"} ${escapeHtml(ago(network.lastSync))}` : "No sync yet"}</small></span></div>`).join("")}</div>`;
}

function renderCompactApproval(request) {
  const network = escapeHtml(request.networkName || "Authorized network");
  return `<article class="approval-card"><div class="approval-top"><div class="approval-device"><span class="device-type-icon">${icon(deviceIcon(request.deviceType))}</span><div><strong>${escapeHtml(request.deviceName)}</strong><span>${escapeHtml(request.deviceType)} · ${network}</span></div></div>${statusPill("pending", "Pending")}</div><div class="approval-detail"><code>${escapeHtml(request.macAddress || "MAC unavailable")}</code><span>Expires ${escapeHtml(until(request.expiresAt))}</span></div><div class="approval-actions"><button class="btn small" data-action="approve-request" data-id="${escapeHtml(request.id)}">Approve</button><button class="btn secondary small" data-action="deny-request" data-id="${escapeHtml(request.id)}">Deny</button></div></article>`;
}

function renderActivityItem(entry) {
  return `<div class="activity-item"><span class="activity-icon">${icon(entry.device ? "shield" : "activity")}</span><span class="activity-copy"><strong>${escapeHtml(entry.action)}</strong><span>${escapeHtml(entry.administrator || "Administrator")}${entry.device ? ` · ${escapeHtml(entry.device)}` : ""}</span></span><span class="activity-time">${escapeHtml(ago(entry.timestamp))}</span></div>`;
}

function renderOverview() {
  const data = state.data;
  const requests = data.requests.slice(0, 3);
  const actions = `<button class="btn" data-action="add-network">${icon("plus")} Add network</button>`;
  const liveSync = data.networks.find((network) => network.lastSync && !network.provider.simulated);
  const demoSync = data.networks.find((network) => network.lastSync && network.provider.simulated);
  const latestSync = liveSync || demoSync;
  const syncLabel = liveSync ? "Last provider sync" : demoSync ? "Last demo check" : "Last successful check";
  const syncDetail = liveSync ? "Reported by the configured provider" : demoSync ? "Demo data · no router contacted" : "No live provider is configured";
  return `${pageHeading(pageMeta.overview, actions)}${demoRibbon()}<section class="welcome-panel"><div class="welcome-copy"><div class="eyebrow">Your network workspace</div><h2>Good to see you, ${escapeHtml(state.session.username)}.</h2><p>Here’s your current view across authorized networks. Demo readings are examples only; a controller integration is needed for live data and access control.</p><button class="btn" data-action="page" data-page="networks">Manage your networks ${icon("arrow")}</button></div><div class="welcome-art" aria-hidden="true"><span class="orb one"></span><span class="orb two"></span><span class="orb three"></span><span class="orb-center">${icon("wifi")}</span></div></section>
    <section class="stat-grid" aria-label="Network summary">${statCard("Managed networks", data.stats.networkCount, data.stats.supportedNetworks ? `${data.stats.supportedNetworks} live provider${data.stats.supportedNetworks === 1 ? "" : "s"} configured` : "No live provider configured", "network", "")}${statCard("Connected devices", data.stats.connectedDevices, "Reported by demo simulation", "device", "cyan")}${statCard("Pending requests", data.stats.pendingRequests, data.stats.pendingRequests ? "Review before they expire" : "You’re all caught up", "inbox", "orange", data.stats.pendingRequests ? "orange-text" : "positive")}${statCard(syncLabel, latestSync ? ago(latestSync.lastSync) : "—", syncDetail, "refresh", "green")}</section>
    <div class="dashboard-grid"><div class="stack">${chartPanel()}<section class="panel"><div class="panel-header"><div><h2 class="panel-title">Network health</h2><p class="panel-subtitle">Connection state for the integrations you’ve added</p></div><button class="text-button" data-action="page" data-page="networks">All networks ${icon("chevron")}</button></div>${renderNetworkHealth(data.networks)}</section><section class="panel data-panel"><div class="data-toolbar"><div><h2 class="panel-title">Recently seen devices</h2><p class="panel-subtitle">Device metadata does not confirm who is using a device.</p></div><button class="text-button" data-action="page" data-page="devices">Open monitor ${icon("chevron")}</button></div>${renderDeviceTable(data.devices.slice(0, 5), true)}</section></div><div class="stack"><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Approval queue</h2><p class="panel-subtitle">Requests supplied by the demo provider</p></div><span class="mini-label demo">${icon("spark")} Simulated</span></div>${requests.length ? `<div class="approval-list">${requests.map(renderCompactApproval).join("")}</div><div style="display:flex;justify-content:flex-end;margin-top:12px"><button class="text-button" data-action="page" data-page="approvals">View all requests ${icon("chevron")}</button></div>` : `<div class="empty-state"><span class="empty-icon">${icon("check")}</span><h3>You’re all caught up</h3><p>New requests appear here only when a configured controller provides them.</p></div>`}</section><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Recent activity</h2><p class="panel-subtitle">Administrator actions and system events</p></div><button class="text-button" data-action="page" data-page="audit">Full log ${icon("chevron")}</button></div><div class="activity-list">${data.audit.slice(0, 5).map(renderActivityItem).join("") || `<div class="empty-state"><p>No activity has been recorded yet.</p></div>`}</div></section></div></div>`;
}

function renderDeviceTable(devices, compact = false) {
  if (!devices.length) return `<div class="empty-state"><span class="empty-icon">${icon("device")}</span><h3>No devices reported</h3><p>Devices appear after a supported controller integration reports them. Demo data is clearly labeled.</p></div>`;
  const rows = devices.map((device) => {
    const network = state.data.networks.find((item) => item.id === device.networkId);
    const support = network?.provider?.supports || {};
    const accessClass = device.blocked ? "blocked" : device.authorized ? "allowed" : "pending";
    const accessLabel = device.blocked ? "Blocked" : device.authorized ? "Authorized" : "Needs approval";
    const grantAction = device.authorized ? "revoke" : "authorize";
    const grantLabel = device.authorized ? "Revoke" : "Authorize";
    const grantSupported = Boolean(support[grantAction]);
    const blockAction = device.blocked ? "unblock" : "block";
    const blockLabel = device.blocked ? "Unblock" : "Block";
    const blockSupported = Boolean(support[blockAction]);
    return `<tr><td><div class="device-cell"><span class="device-type-icon">${icon(deviceIcon(device.deviceType))}</span><span class="device-cell-copy"><strong>${escapeHtml(deviceName(device))}</strong>${device.friendlyLabel ? `<span>${escapeHtml(device.deviceName)} · ${escapeHtml(device.deviceType)}</span>` : `<span>${escapeHtml(device.deviceType)}</span>`}${device.friendlyLabel ? `<span class="device-label">${icon("edit")} Custom label</span>` : ""}</span></div></td><td>${escapeHtml(device.networkName)}</td><td class="mono">${escapeHtml(device.ipAddress || "—")}</td><td class="mono">${escapeHtml(device.macAddress || "—")}</td><td>${escapeHtml(ago(device.firstSeen))}</td><td>${escapeHtml(ago(device.lastSeen))}</td><td>${statusPill(device.connectionStatus, device.connectionStatus === "connected" ? "Connected" : "Offline")}</td><td>${statusPill(accessClass, accessLabel)}</td><td><div class="row-actions"><button class="row-action" data-action="label-device" data-id="${escapeHtml(device.id)}" data-network="${escapeHtml(device.networkId)}" title="Assign a custom device label">${icon("edit")} Label</button><button class="row-action" data-action="device-action" data-id="${escapeHtml(device.id)}" data-network="${escapeHtml(device.networkId)}" data-device-action="${grantAction}" ${grantSupported ? "" : "disabled title=\"Not supported by this integration\""}>${icon(grantAction === "revoke" ? "shieldOff" : "shield")} ${grantLabel}</button><button class="row-action danger" data-action="device-action" data-id="${escapeHtml(device.id)}" data-network="${escapeHtml(device.networkId)}" data-device-action="${blockAction}" ${blockSupported ? "" : "disabled title=\"Not supported by this integration\""}>${icon(blockAction === "block" ? "block" : "unlock")} ${blockLabel}</button></div></td></tr>`;
  }).join("");
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Device</th><th>Network</th><th>IP address</th><th>MAC address</th><th>First seen</th><th>Last seen</th><th>Connection</th><th>Access</th><th>Actions</th></tr></thead><tbody>${rows}</tbody></table></div>${compact ? "" : `<div class="table-foot"><span>Showing <strong>${devices.length}</strong> provider reported devices</span><span>MAC addresses can be randomized</span></div>`}`;
}

function filterDevices() {
  let devices = state.data.devices;
  if (state.networkFilter !== "all") devices = devices.filter((device) => device.networkId === state.networkFilter);
  if (state.deviceFilter === "connected") devices = devices.filter((device) => device.connectionStatus === "connected");
  if (state.deviceFilter === "pending") devices = devices.filter((device) => !device.authorized && !device.blocked);
  if (state.deviceFilter === "blocked") devices = devices.filter((device) => device.blocked);
  if (state.deviceFilter === "offline") devices = devices.filter((device) => device.connectionStatus === "offline");
  const query = state.search.trim().toLowerCase();
  if (query) devices = devices.filter((device) => [deviceName(device), device.deviceName, device.deviceType, device.ipAddress, device.macAddress, device.networkName].some((value) => String(value || "").toLowerCase().includes(query)));
  return devices;
}

function renderDevices() {
  const actions = `<button class="btn secondary" data-action="refresh">${icon("refresh")} Refresh</button>`;
  const networks = state.data.networks;
  const options = networks.map((network) => `<option value="${escapeHtml(network.id)}" ${state.networkFilter === network.id ? "selected" : ""}>${escapeHtml(network.name)}</option>`).join("");
  return `${pageHeading(pageMeta.devices, actions)}${demoRibbon()}<div class="info-callout">${icon("info")}<span><strong>Provider reported metadata.</strong> Names, IPs, and MAC addresses may be incomplete or randomized and do not reliably identify a person. Access actions are shown only when the selected integration supports them.</span></div><section class="panel data-panel"><div class="data-toolbar"><div class="toolbar-left"><label class="search-field">${icon("search")}<input data-search type="search" value="${escapeHtml(state.search)}" placeholder="Search devices, IP, or MAC" aria-label="Search devices" /></label><select class="select-control" data-network-filter aria-label="Filter by network"><option value="all">All networks</option>${options}</select></div><div class="toolbar-right"><span class="mini-label">${icon("refresh")} Updated ${escapeHtml(ago(state.data.networks.find((n) => n.lastSync)?.lastSync))}</span></div></div><div class="filter-row" role="group" aria-label="Filter device status">${[["all", "All devices"], ["connected", "Connected"], ["pending", "Needs approval"], ["blocked", "Blocked"], ["offline", "Offline"]].map(([id, label]) => `<button class="filter-chip ${state.deviceFilter === id ? "active" : ""}" data-action="device-filter" data-filter="${id}">${label}</button>`).join("")}</div><div id="device-results">${renderDeviceTable(filterDevices())}</div></section><p class="panel-subtitle" style="margin:13px 2px 0">Device discovery, authorization, and blocking are available only through a configured router, access point, captive portal, or network controller. Demo actions only change this application’s local sample state.</p>`;
}

function renderNetworkCard(network) {
  const provider = network.provider || {};
  const providerAvailable = Boolean(provider.available);
  const syncLabel = provider.simulated ? "Last simulated check" : providerAvailable ? "Last successful sync" : "Provider status";
  return `<article class="network-card"><div class="network-card-top"><span class="network-symbol">${icon("wifi")}</span><div class="network-card-title"><h3>${escapeHtml(network.name)}</h3><p>${escapeHtml(providerLabel(provider))}</p></div><button class="icon-button" data-action="edit-network" data-id="${escapeHtml(network.id)}" aria-label="Edit ${escapeHtml(network.name)}">${icon("edit")}</button></div><div>${statusPill(network.status)}</div><div class="network-card-meta"><div><span>Provider</span><strong>${escapeHtml(provider.name || "Unsupported")}</strong></div><div><span>${syncLabel}</span><strong>${providerAvailable && network.lastSync ? escapeHtml(safeDate(network.lastSync)) : "Adapter not configured"}</strong></div><div><span>Connected devices</span><strong>${providerAvailable ? `${network.deviceCount} reported` : "Not available"}</strong></div><div><span>Pending requests</span><strong>${provider.supports?.approvals ? `${network.pendingRequests} requests` : "Not provided"}</strong></div></div>${!providerAvailable ? `<div class="info-callout warning">${icon("info")}<span>No router credentials were collected. This integration does not yet have an adapter, so the app cannot scan or control it.</span></div>` : ""}<div class="network-card-actions"><div class="left-actions"><button class="btn secondary" data-action="test-network" data-id="${escapeHtml(network.id)}">${icon("refresh")} Test connection</button><button class="btn ghost remove-network" data-action="remove-network" data-id="${escapeHtml(network.id)}" aria-label="Remove ${escapeHtml(network.name)}">${icon("trash")} Remove</button></div><button class="btn ghost" data-action="edit-network" data-id="${escapeHtml(network.id)}">Edit name</button></div></article>`;
}

function renderNetworks() {
  const action = `<button class="btn" data-action="add-network">${icon("plus")} Add network</button>`;
  const networks = state.data.networks;
  return `${pageHeading(pageMeta.networks, action)}${demoRibbon()}<div class="info-callout">${icon("shield")}<span><strong>Only add networks you own or are authorized to administer.</strong> No Wi-Fi password is requested. A provider adapter must be configured before real device data or access control is available.</span></div>${networks.length ? `<section class="network-grid">${networks.map(renderNetworkCard).join("")}</section>` : `<section class="panel"><div class="empty-state"><span class="empty-icon">${icon("network")}</span><h3>Start with an authorized network</h3><p>Add a friendly name and choose Demo simulation to explore the interface, or select Other controller to keep an unsupported integration visibly unconfigured.</p><button class="btn" data-action="add-network">${icon("plus")} Add a network</button></div></section>`}<section class="integration-callout"><span class="network-symbol">${icon("server")}</span><div><strong>Need a live controller connection?</strong><p>Implement an adapter that uses the router or network controller’s authorized API. Keep controller secrets on the server and expose only provider capabilities and reported metadata to this dashboard. See README for the integration contract.</p></div></section>`;
}

function renderApprovalWide(request) {
  const network = state.data.networks.find((item) => item.id === request.networkId);
  return `<article class="approval-wide"><div class="approval-wide-main"><div class="approval-device"><span class="device-type-icon">${icon(deviceIcon(request.deviceType))}</span><div><strong>${escapeHtml(request.deviceName)}</strong><span>${escapeHtml(request.deviceType)} · ${escapeHtml(request.networkName || "Authorized network")}</span></div></div><div class="approval-wide-meta"><span>${icon("globe")}${escapeHtml(request.ipAddress || "IP not supplied")}</span><span>${icon("device")}${escapeHtml(request.macAddress || "MAC not supplied")}</span><span>${icon("clock")}Received ${escapeHtml(ago(request.receivedAt))}</span></div><p class="request-expiry">${escapeHtml(network?.provider?.simulated ? "Demo request · local-only simulation" : "Provider request")}. Expires ${escapeHtml(until(request.expiresAt))}.</p></div><div class="approval-wide-actions"><button class="btn" data-action="approve-request" data-id="${escapeHtml(request.id)}">Approve</button><button class="btn secondary" data-action="deny-request" data-id="${escapeHtml(request.id)}">Deny</button></div></article>`;
}

function renderApprovals() {
  const requests = state.data.requests;
  const requestsCount = requests.length;
  return `${pageHeading(pageMeta.approvals)}${demoRibbon()}<div class="info-callout">${icon("info")}<span>Requests appear only when the chosen captive portal or network controller provides them. This sample queue is <strong>demo data</strong>; approving or denying only updates the local simulation.</span></div><div class="approval-page-grid"><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Pending queue</h2><p class="panel-subtitle">${requestsCount ? `${requestsCount} request${requestsCount === 1 ? "" : "s"} awaiting review` : "No pending requests"}</p></div><span class="mini-label demo">${icon("clock")} Polls every 30s</span></div>${requestsCount ? `<div class="approval-queue">${requests.map(renderApprovalWide).join("")}</div>` : `<div class="empty-state"><span class="empty-icon">${icon("check")}</span><h3>Nothing waiting for review</h3><p>New requests will appear here when a configured controller reports them. Demo requests are local-only.</p></div>`}</section><aside class="request-aside"><section class="aside-stat"><span>Requests waiting</span><strong>${requestsCount}</strong><p>Sample requests expire automatically in the demo. No push notification service is configured.</p></section><section class="panel"><div class="panel-header"><div><h2 class="panel-title">Review checklist</h2><p class="panel-subtitle">Take a moment before approving access</p></div></div><div class="checklist"><div class="checklist-row"><span class="checklist-icon">${icon("device")}</span><span>Use the provider’s context; a device name is not a verified identity.</span></div><div class="checklist-row"><span class="checklist-icon">${icon("clock")}</span><span>Choose an approval duration when the configured integration supports one.</span></div><div class="checklist-row"><span class="checklist-icon">${icon("audit")}</span><span>Every decision is recorded in the administrator audit history.</span></div><div class="checklist-row"><span class="checklist-icon">${icon("shield")}</span><span>Demo decisions are simulated locally and never reach a router.</span></div></div></section></aside></div>`;
}

function renderAuditRow(entry) {
  const simulated = entry.simulated ? `<span class="audit-tag">SIMULATED</span>` : "";
  return `<div class="audit-row"><span class="activity-icon">${icon(entry.device ? "shield" : "activity")}</span><div class="audit-main"><strong>${escapeHtml(entry.action)}</strong><span>${entry.device ? `Device · ${escapeHtml(entry.device)}` : "System event"}</span></div><span class="audit-network">${escapeHtml(entry.network || "—")}</span><span class="audit-admin">${escapeHtml(entry.administrator || "—")}</span><span><span class="audit-date">${escapeHtml(safeDate(entry.timestamp))}</span>${simulated}</span></div>`;
}

function renderAudit() {
  return `${pageHeading(pageMeta.audit, `<button class="btn secondary" data-action="refresh">${icon("refresh")} Refresh</button>`)}${demoRibbon()}<section class="panel" style="padding:0;overflow:hidden"><div class="data-toolbar"><div><h2 class="panel-title">Administrator activity</h2><p class="panel-subtitle">Actions are retained in the local application data store.</p></div><span class="mini-label">${icon("audit")} ${state.data.audit.length} entries</span></div><div class="audit-list">${state.data.audit.length ? state.data.audit.map(renderAuditRow).join("") : `<div class="empty-state"><span class="empty-icon">${icon("audit")}</span><h3>No audit activity yet</h3><p>Network, device, and request actions will be recorded here.</p></div>`}</div></section>`;
}

function renderSettings() {
  const providers = state.data.providers;
  return `${pageHeading(pageMeta.settings)}${demoRibbon()}<div class="settings-grid"><section class="settings-card"><div class="settings-heading"><span class="stat-icon">${icon("lock")}</span><div><h2>Administrator session</h2><p>Current account and local access protection</p></div></div><div class="settings-row"><div><strong>Signed in as</strong><span>${escapeHtml(state.session.username)}</span></div>${statusPill("connected", "Authenticated")}</div><div class="settings-row"><div><strong>Session lifetime</strong><span>Encrypted, HttpOnly cookie · 8 hours</span></div><span class="mini-label">Protected</span></div><div class="settings-row"><div><strong>Password storage</strong><span>scrypt hash · no plaintext password stored</span></div>${statusPill("connected", "Hashed")}</div><div class="settings-row"><div><strong>Sign out</strong><span>Clears the administrator session cookie.</span></div><button class="btn secondary small" data-action="logout">${icon("logout")} Sign out</button></div></section><section class="settings-card"><div class="settings-heading"><span class="stat-icon cyan">${icon("bell")}</span><div><h2>Notifications</h2><p>In-app queue refresh behavior</p></div></div><div class="settings-row"><div><strong>In-app updates</strong><span>Pending requests refresh while this console is open.</span></div><span class="status-pill simulated">Every 30s</span></div><div class="settings-row"><div><strong>Push notifications</strong><span>No push delivery provider has been configured.</span></div>${statusPill("unsupported", "Not configured")}</div><div class="settings-row"><div><strong>Current pending requests</strong><span>Provider reported requests available to review</span></div><strong>${state.data.stats.pendingRequests}</strong></div></section><section class="settings-card wide"><div class="settings-heading"><span class="stat-icon orange">${icon("server")}</span><div><h2>Network provider integrations</h2><p>Only configured adapters can report metadata or change access</p></div></div>${providers.map((provider) => `<div class="settings-row"><div><strong>${escapeHtml(provider.name)}</strong><span>${escapeHtml(provider.description)}</span></div>${provider.available ? statusPill("simulated", "Demo only") : statusPill("unsupported", "Adapter needed")}</div>`).join("")}<div class="info-callout warning" style="margin:13px 0 0">${icon("info")}<span>No real controller is configured. This app does not scan nearby Wi-Fi, discover arbitrary devices, or change router access. Add a server-side adapter for an authorized controller before enabling live operations.</span></div><div class="code-block" style="margin-top:12px">Provider contract: listDevices · listRequests · testConnection · authorize/revoke · block/unblock · approve/deny</div></section><section class="settings-card wide"><div class="settings-heading"><span class="stat-icon green">${icon("shield")}</span><div><h2>Security posture</h2><p>Server-side defaults and deployment requirements</p></div></div><ul class="security-list"><li>${icon("check")}Passwords use scrypt and are never returned to the browser.</li><li>${icon("check")}Sessions are encrypted, HttpOnly, SameSite=Strict, and expire after eight hours.</li><li>${icon("check")}Mutating routes require a same-origin request and a per-session CSRF token.</li><li>${icon("check")}Sign-in and first-run setup are rate limited. Audit entries identify the administrator and action.</li><li>${icon("check")}Provider credentials are not collected or stored by this demo.</li><li class="caution">${icon("info")}Serve production traffic over HTTPS and set a strong SESSION_SECRET. Use a shared session/data store before running multiple app instances.</li></ul></section></div>`;
}

function renderNotifications() {
  const requests = state.data?.requests || [];
  return `<aside class="notification-popover" aria-label="Notification center"><h3>Notification center</h3><p>In-app polling checks every 30 seconds. Push notifications are not configured.${requests.some((request) => request.simulated) ? " Demo requests are simulated." : ""}</p>${requests.slice(0, 4).map((request) => `<div class="notification-entry"><span class="device-type-icon">${icon(deviceIcon(request.deviceType))}</span><div><strong>${escapeHtml(request.deviceName)} requested access</strong><span>${escapeHtml(request.networkName)} · received ${escapeHtml(ago(request.receivedAt))}</span></div></div>`).join("") || `<div class="notification-entry"><span class="device-type-icon">${icon("check")}</span><div><strong>No pending requests</strong><span>Nothing needs your attention right now.</span></div></div>`}<div class="notification-actions"><button class="text-button" data-action="page" data-page="approvals">Open request inbox ${icon("chevron")}</button></div></aside>`;
}

function renderShell() {
  const meta = pageMeta[state.page] || pageMeta.overview;
  const username = state.session?.username || "Administrator";
  const content = state.loading ? renderLoading() : state.loadError ? `<div class="error-panel">${escapeHtml(state.loadError)} <button class="text-button" data-action="refresh">Try again</button></div>` : (state.data ? ({ overview: renderOverview, networks: renderNetworks, devices: renderDevices, approvals: renderApprovals, audit: renderAudit, settings: renderSettings }[state.page] || renderOverview)() : renderLoading());
  const pending = state.data?.stats.pendingRequests || 0;
  const appClass = `${state.sidebarCollapsed ? "collapsed" : ""}`;
  return `<div class="app-shell ${appClass}"><aside class="sidebar ${state.mobileMenuOpen ? "mobile-open" : ""}" aria-label="Main navigation"><div class="brand"><span class="brand-mark">${icon("wifi")}</span><span class="brand-copy"><span class="brand-name">Bluehaven</span><span class="brand-caption">Network Console</span></span></div><div class="workspace-switcher" aria-label="Workspace"><span class="workspace-dot"></span><span class="workspace-label">Admin workspace</span><span class="workspace-status">${icon("chevron")}</span></div><div class="nav-label">Workspace</div><nav class="nav-list">${[["overview", "Overview"], ["networks", "Networks"], ["devices", "Device monitor"], ["approvals", "Approvals"], ["audit", "Audit history"], ["settings", "Settings"]].map(([page, label]) => `<button class="nav-link ${state.page === page ? "active" : ""}" data-action="page" data-page="${page}" aria-current="${state.page === page ? "page" : "false"}">${icon(page === "networks" ? "network" : page === "devices" ? "device" : page === "approvals" ? "inbox" : page === "audit" ? "audit" : page === "settings" ? "settings" : "overview")}<span>${label}</span>${page === "approvals" && pending ? `<small class="nav-count">${pending}</small>` : ""}</button>`).join("")}</nav><div class="sidebar-spacer"></div><div class="sidebar-note"><strong>${icon("shield")} Authorized use only</strong><p>Manage only networks you own or are explicitly allowed to administer.</p></div><div class="sidebar-bottom"><span class="avatar">${escapeHtml(initials(username))}</span><span class="sidebar-user"><strong>${escapeHtml(username)}</strong><span>Administrator</span></span><button class="sidebar-collapse" data-action="collapse-sidebar" aria-label="Collapse navigation">${icon("chevron")}</button></div></aside><div class="main-shell"><header class="topbar"><div class="topbar-left"><button class="icon-button mobile-menu" data-action="toggle-menu" aria-label="Open navigation">${icon("menu")}</button><div><div class="breadcrumb">Workspace ${icon("chevron")} ${escapeHtml(meta.crumb)}</div><div class="topbar-title">${escapeHtml(meta.title)}</div></div></div><div class="topbar-actions"><span class="sync-caption"><span class="live-dot"></span> Demo environment</span><button class="icon-button" data-action="notifications" aria-label="Open notification center" aria-expanded="${state.notificationsOpen}">${icon("bell")}${pending ? `<span class="notification-badge">${pending}</span>` : ""}</button><span class="topbar-avatar" title="${escapeHtml(username)}">${escapeHtml(initials(username))}</span></div></header><main class="content">${content}</main>${state.notificationsOpen && !state.loading && state.data ? renderNotifications() : ""}</div>${state.modal ? renderModal() : ""}</div>`;
}

function renderModal() {
  const modal = state.modal;
  if (!modal) return "";
  if (modal.kind === "network") {
    const existing = modal.network;
    const providerChoices = state.data.providers;
    const providerOptions = providerChoices.map((provider) => `<option value="${escapeHtml(provider.id)}" ${modal.providerId === provider.id ? "selected" : ""}>${escapeHtml(provider.name)}${provider.available ? "" : " · adapter needed"}</option>`).join("");
    const provider = providerChoices.find((item) => item.id === modal.providerId);
    const providerHint = modal.providerId === "demo" ? "This adds sample devices and requests. Actions remain local to this application." : "This controller has no adapter configured. The network will be listed as unsupported and no data will be discovered.";
    return `<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><h2 id="modal-title">${existing ? "Edit network" : "Add a network"}</h2><p>${existing ? "Update the friendly name shown in your workspace." : "Add a network you own or are authorized to administer."}</p></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon("close")}</button></div><form data-form="network"><div class="form-field"><label for="network-name">Friendly network name</label><input id="network-name" name="name" required minlength="2" maxlength="64" value="${escapeHtml(existing?.name || "")}" placeholder="e.g. Studio · Main floor" /></div>${existing ? "" : `<div class="form-field"><label for="network-provider">Integration</label><select id="network-provider" name="providerId">${providerOptions}</select><span class="form-hint" data-provider-hint>${escapeHtml(providerHint)}</span></div><div class="info-callout" style="margin:11px 0 0">${icon("lock")}<span>No Wi-Fi password is requested. A controller credential would be needed only by a specific adapter and must remain server-side.</span></div>`}<p class="form-error" role="alert"></p><div class="form-actions"><button class="btn secondary" type="button" data-action="close-modal">Cancel</button><button class="btn" type="submit">${existing ? "Save name" : "Add network"} ${icon("arrow")}</button></div></form></section></div>`;
  }
  if (modal.kind === "label") {
    const device = modal.device;
    return `<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><h2 id="modal-title">Label this device</h2><p>${escapeHtml(device.deviceName)} · ${escapeHtml(device.networkName)}</p></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon("close")}</button></div><form data-form="label"><input type="hidden" name="networkId" value="${escapeHtml(device.networkId)}" /><div class="form-field"><label for="device-label">Friendly label</label><input id="device-label" name="label" maxlength="48" value="${escapeHtml(device.friendlyLabel || "")}" placeholder="e.g. Front desk tablet" /><span class="form-hint">This label is stored locally in this demo. It does not verify a person’s identity.</span></div><p class="form-error" role="alert"></p><div class="form-actions"><button class="btn secondary" type="button" data-action="close-modal">Cancel</button><button class="btn" type="submit">Save label</button></div></form></section></div>`;
  }
  const durationField = modal.kind === "approval" && modal.action === "approve" ? `<div class="form-field"><label for="approval-duration">Approval duration <span class="form-hint">(optional)</span></label><select id="approval-duration" name="duration"><option value="">No duration set</option><option value="30">30 minutes</option><option value="60">1 hour</option><option value="240">4 hours</option></select></div>` : "";
  return `<div class="modal-backdrop" data-action="backdrop-close"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div><h2 id="modal-title">${escapeHtml(modal.title)}</h2><p>${escapeHtml(modal.subtitle || "Review this action before continuing.")}</p></div><button class="modal-close" data-action="close-modal" aria-label="Close">${icon("close")}</button></div><p class="confirm-copy ${modal.danger ? "danger" : ""}">${escapeHtml(modal.copy)}</p>${modal.warning ? `<div class="inline-warning">${icon("info")} ${escapeHtml(modal.warning)}</div>` : ""}${durationField}<div class="form-actions"><button class="btn secondary" data-action="close-modal">Cancel</button><button class="btn ${modal.danger ? "danger" : ""}" data-action="confirm-modal">${escapeHtml(modal.confirmLabel || "Confirm")}</button></div></section></div>`;
}

function render() {
  if (!state.session) {
    renderAuth();
    return;
  }
  app.innerHTML = renderShell();
}

async function loadDashboard(silent = false) {
  if (!silent) {
    state.loading = true;
    state.loadError = "";
    render();
  }
  try {
    const data = await api("/api/dashboard");
    state.data = data;
    state.loading = false;
    state.loadError = "";
    if (!silent || !state.modal) render();
  } catch (error) {
    state.loading = false;
    state.loadError = error.message || "Could not load the dashboard.";
    render();
  }
}

function setPage(page) {
  if (!pageMeta[page]) return;
  state.page = page;
  state.mobileMenuOpen = false;
  state.notificationsOpen = false;
  render();
}

function openNetworkModal(network = null) {
  state.modal = { kind: "network", network, providerId: network?.providerId || "demo" };
  render();
  if (network) addNetworkIntegrationEditor();
  document.querySelector("#network-name")?.focus();
}

function addNetworkIntegrationEditor() {
  const form = document.querySelector('form[data-form="network"]');
  if (!form || form.querySelector("#network-provider")) return;
  const field = document.createElement("div");
  field.className = "form-field";
  const label = document.createElement("label");
  label.htmlFor = "network-provider";
  label.textContent = "Integration";
  const select = document.createElement("select");
  select.id = "network-provider";
  select.name = "providerId";
  for (const provider of state.data.providers) {
    const option = document.createElement("option");
    option.value = provider.id;
    option.textContent = `${provider.name}${provider.available ? "" : " · adapter needed"}`;
    select.append(option);
  }
  select.value = state.modal.providerId;
  const hint = document.createElement("span");
  hint.className = "form-hint";
  hint.dataset.providerHint = "";
  hint.textContent = state.modal.providerId === "demo"
    ? "This uses local sample data. No router is connected."
    : "This controller has no adapter configured, so no device data is available.";
  const privacy = document.createElement("span");
  privacy.className = "form-hint";
  privacy.textContent = "No Wi-Fi password is requested. Controller credentials must stay server-side.";
  field.append(label, select, hint, privacy);
  const error = form.querySelector(".form-error");
  if (error) form.insertBefore(field, error);
  const subtitle = form.closest(".modal")?.querySelector(".modal-head p");
  if (subtitle) subtitle.textContent = "Update the friendly name or integration for this network.";
  const submit = form.querySelector('[type="submit"]');
  if (submit) submit.textContent = "Save changes";
}

function openLabelModal(id, networkId) {
  const device = state.data.devices.find((item) => item.id === id && item.networkId === networkId);
  if (!device) return showToast("This device is no longer available.", "error");
  state.modal = { kind: "label", device };
  render();
  document.querySelector("#device-label")?.focus();
}

function openConfirm({ title, subtitle, copy, warning, confirmLabel, danger = false, kind = "confirm", action, onConfirm }) {
  state.modal = { kind, title, subtitle, copy, warning, confirmLabel, danger, action, onConfirm, durationMinutes: "" };
  render();
}

function openDeviceAction(button) {
  const { id, network, deviceAction } = button.dataset;
  const device = state.data.devices.find((item) => item.id === id && item.networkId === network);
  const networkRecord = state.data.networks.find((item) => item.id === network);
  if (!device || !networkRecord) return showToast("This device is no longer available.", "error");
  const descriptions = {
    authorize: { title: "Authorize this device?", copy: `Allow ${deviceName(device)} to access ${networkRecord.name}?`, confirmLabel: "Authorize device", danger: false },
    revoke: { title: "Revoke device access?", copy: `Remove the current authorization for ${deviceName(device)} on ${networkRecord.name}? The device may lose access.`, confirmLabel: "Revoke access", danger: true },
    block: { title: "Block this device?", copy: `Request a block for ${deviceName(device)} on ${networkRecord.name}? This may interrupt its connection.`, confirmLabel: "Block device", danger: true },
    unblock: { title: "Unblock this device?", copy: `Remove the block for ${deviceName(device)} on ${networkRecord.name}?`, confirmLabel: "Unblock device", danger: false },
  }[deviceAction];
  const simulated = Boolean(networkRecord.provider?.simulated);
  openConfirm({ ...descriptions, subtitle: simulated ? "This is a local demo simulation." : "This action will be sent through the configured provider.", warning: `${simulated ? "No router will be contacted. " : ""}Device identifiers can be randomized, including MAC addresses, so blocking is not foolproof and does not reliably identify a person.`, onConfirm: async () => {
    await api(`/api/devices/${encodeURIComponent(id)}/action`, { method: "POST", body: { networkId: network, action: deviceAction } });
    state.modal = null;
    await loadDashboard(true);
    showToast(simulated ? `${descriptions.confirmLabel} · simulated locally.` : `${descriptions.confirmLabel} completed.`);
  } });
}

function openApprovalAction(id, action) {
  const request = state.data.requests.find((item) => item.id === id);
  if (!request) return showToast("This request is no longer pending.", "warning");
  const network = state.data.networks.find((item) => item.id === request.networkId);
  const simulated = Boolean(network?.provider?.simulated || request.simulated);
  const approving = action === "approve";
  openConfirm({
    kind: "approval",
    action,
    title: approving ? "Approve access request?" : "Deny access request?",
    subtitle: `${request.deviceName} · ${request.networkName}`,
    copy: approving ? `Allow this provider-reported device to connect to ${request.networkName}?` : `Decline this access request from ${request.deviceName}?`,
    warning: simulated ? "This request is sample data. Your choice is recorded locally and does not change router access." : "The decision will be sent to the configured access provider.",
    confirmLabel: approving ? "Approve request" : "Deny request",
    danger: !approving,
    onConfirm: async () => {
      const duration = state.modal?.durationMinutes;
      await api(`/api/approvals/${encodeURIComponent(id)}`, { method: "POST", body: { action, ...(duration ? { durationMinutes: Number(duration) } : {}) } });
      state.modal = null;
      await loadDashboard(true);
      showToast(simulated ? `Request ${approving ? "approved" : "denied"} in the demo only.` : `Request ${approving ? "approved" : "denied"}.`);
    },
  });
}

async function handleSubmit(event) {
  const form = event.target.closest("form[data-form]");
  if (!form) return;
  event.preventDefault();
  const formType = form.dataset.form;
  const formData = new FormData(form);
  const errorNode = form.querySelector(".form-error");
  const submitButton = form.querySelector('[type="submit"]');
  const setError = (message) => { if (errorNode) errorNode.textContent = message; };
  if (submitButton) { submitButton.disabled = true; submitButton.textContent = "Please wait…"; }

  try {
    if (formType === "setup" || formType === "login") {
      const username = String(formData.get("username") || "").trim();
      const password = String(formData.get("password") || "");
      if (formType === "setup" && password !== String(formData.get("confirm") || "")) throw new Error("The passwords do not match.");
      const response = await fetch(`/api/${formType}`, { method: "POST", credentials: "same-origin", headers: { accept: "application/json", "content-type": "application/json" }, body: JSON.stringify({ username, password }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Could not sign in.");
      state.status = { ...(state.status || {}), authenticated: true, setupRequired: false };
      state.session = { username: payload.username, csrfToken: payload.csrfToken };
      state.authError = "";
      state.page = "overview";
      await loadDashboard();
      return;
    }

    if (formType === "network") {
      const name = String(formData.get("name") || "").trim();
      if (state.modal.network) {
        const existing = state.modal.network;
        const providerId = String(formData.get("providerId") || existing.providerId);
        await api(`/api/networks/${encodeURIComponent(existing.id)}`, { method: "PATCH", body: { name, providerId } });
        state.modal = null;
        await loadDashboard(true);
        showToast(existing.providerId === providerId ? "Network details updated." : providerId === "demo" ? "Network switched to local demo mode." : "Network marked unsupported until an adapter is configured.", providerId === "demo" || existing.providerId === providerId ? "success" : "warning");
      } else {
        const providerId = String(formData.get("providerId") || "demo");
        const response = await api("/api/networks", { method: "POST", body: { name, providerId } });
        state.modal = null;
        await loadDashboard(true);
        showToast(response.network.provider?.simulated ? "Network added in demo mode. No router is connected." : "Network added. An adapter is required before live data is available.", response.network.provider?.simulated ? "success" : "warning");
      }
      return;
    }

    if (formType === "label") {
      const device = state.modal.device;
      await api(`/api/devices/${encodeURIComponent(device.id)}`, { method: "PATCH", body: { networkId: String(formData.get("networkId") || ""), label: String(formData.get("label") || "") } });
      state.modal = null;
      await loadDashboard(true);
      showToast("Device label saved locally.");
    }
  } catch (error) {
    if ((formType === "login" || formType === "setup") && !state.session) {
      state.authError = error.message;
      renderAuth();
      return;
    }
    setError(error.message);
    if (!errorNode) showToast(error.message, "error");
    if (submitButton) { submitButton.disabled = false; submitButton.textContent = formType === "network" ? "Save changes" : "Try again"; }
  }
}

async function handleClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const { action } = button.dataset;

  if (action === "page") return setPage(button.dataset.page);
  if (action === "toggle-menu") { state.mobileMenuOpen = !state.mobileMenuOpen; render(); return; }
  if (action === "collapse-sidebar") { state.sidebarCollapsed = !state.sidebarCollapsed; render(); return; }
  if (action === "notifications") { state.notificationsOpen = !state.notificationsOpen; render(); return; }
  if (action === "add-network") return openNetworkModal();
  if (action === "edit-network") {
    const network = state.data.networks.find((item) => item.id === button.dataset.id);
    if (network) openNetworkModal(network);
    return;
  }
  if (action === "close-modal") { state.modal = null; render(); return; }
  if (action === "backdrop-close" && event.target === button) { state.modal = null; render(); return; }
  if (action === "label-device") return openLabelModal(button.dataset.id, button.dataset.network);
  if (action === "device-action") return openDeviceAction(button);
  if (action === "approve-request") return openApprovalAction(button.dataset.id, "approve");
  if (action === "deny-request") return openApprovalAction(button.dataset.id, "deny");
  if (action === "device-filter") { state.deviceFilter = button.dataset.filter; render(); return; }
  if (action === "refresh") { await loadDashboard(); showToast("Network view refreshed."); return; }
  if (action === "test-network") {
    button.disabled = true;
    try {
      const result = await api(`/api/networks/${encodeURIComponent(button.dataset.id)}/test`, { method: "POST", body: {} });
      await loadDashboard(true);
      showToast(result.message || "Connection check complete.", result.success ? "success" : "warning");
    } catch (error) { await loadDashboard(true); showToast(error.message, "error"); }
    return;
  }
  if (action === "remove-network") {
    const network = state.data.networks.find((item) => item.id === button.dataset.id);
    if (!network) return;
    const simulated = Boolean(network.provider?.simulated);
    return openConfirm({ title: "Remove this network?", subtitle: network.name, copy: `Remove ${network.name} and its saved local demo state from this console? This can’t be undone.`, warning: simulated ? "This removes sample data from this app only. No router configuration is changed." : "This removes the local network record. No controller credentials are stored here.", danger: true, confirmLabel: "Remove network", onConfirm: async () => {
      await api(`/api/networks/${encodeURIComponent(network.id)}`, { method: "DELETE" });
      state.modal = null;
      await loadDashboard(true);
      showToast("Network removed from this console.");
    } });
  }
  if (action === "confirm-modal") {
    const modal = state.modal;
    if (!modal?.onConfirm) { state.modal = null; render(); return; }
    button.disabled = true;
    try { await modal.onConfirm(); }
    catch (error) { showToast(error.message || "The action failed.", "error"); if (state.modal) { state.modal = null; render(); } }
    return;
  }
  if (action === "logout") {
    try { await api("/api/logout", { method: "POST", body: {} }); }
    catch (error) { showToast(error.message, "error"); }
    state.session = null;
    state.data = null;
    state.modal = null;
    state.authError = "";
    state.status = { ...(state.status || {}), authenticated: false, setupRequired: false };
    render();
  }
}

app.addEventListener("click", (event) => { void handleClick(event); });
app.addEventListener("submit", (event) => { void handleSubmit(event); });
app.addEventListener("input", (event) => {
  const input = event.target.closest("[data-search]");
  if (!input) return;
  state.search = input.value;
  const resultNode = document.querySelector("#device-results");
  if (resultNode) resultNode.innerHTML = renderDeviceTable(filterDevices());
});
app.addEventListener("change", (event) => {
  const networkSelect = event.target.closest("[data-network-filter]");
  if (networkSelect) { state.networkFilter = networkSelect.value; render(); return; }
  const providerSelect = event.target.closest("#network-provider");
  if (providerSelect) {
    state.modal.providerId = providerSelect.value;
    const provider = state.data.providers.find((item) => item.id === providerSelect.value);
    const hint = document.querySelector("[data-provider-hint]");
    if (hint) hint.textContent = providerSelect.value === "demo" ? "This adds sample devices and requests. Actions remain local to this application." : "This controller has no adapter configured. The network will be listed as unsupported and no data will be discovered.";
    return;
  }
  const duration = event.target.closest("#approval-duration");
  if (duration && state.modal) state.modal.durationMinutes = duration.value;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.modal) { state.modal = null; render(); }
  if (event.key === "Escape" && state.notificationsOpen) { state.notificationsOpen = false; render(); }
});

async function initialize() {
  try {
    const response = await fetch("/api/status", { credentials: "same-origin", headers: { accept: "application/json" } });
    state.status = await response.json();
    if (state.status.authenticated) {
      state.session = { username: state.status.username, csrfToken: state.status.csrfToken };
      await loadDashboard();
    } else {
      render();
    }
  } catch {
    app.innerHTML = `<main class="auth-screen"><section class="auth-brand-side"><div class="brand"><span class="brand-mark">${icon("wifi")}</span><span class="brand-copy"><span class="brand-name">Bluehaven</span><span class="brand-caption">Network Console</span></span></div><div class="auth-promo"><div class="eyebrow">Secure network administration</div><h1>We couldn’t reach the local service.</h1><p>Check that the application server is running, then refresh this page.</p></div></section><section class="auth-form-side"><div class="auth-card"><h2>Service unavailable</h2><p>Start the app with <code>npm start</code> and open the configured local address.</p><button class="btn" data-action="reload-page">Retry connection ${icon("refresh")}</button></div></section></main>`;
    app.addEventListener("click", (event) => { if (event.target.closest('[data-action="reload-page"]')) window.location.reload(); });
  }
}

let polling = false;
window.setInterval(async () => {
  if (polling || !state.session || document.visibilityState === "hidden") return;
  polling = true;
  try {
    const status = await api("/api/notifications");
    const previous = state.previousPending;
    state.previousPending = status.pendingRequests;
    if (previous !== null && status.pendingRequests > previous) showToast(`${status.pendingRequests - previous} new access request${status.pendingRequests - previous === 1 ? "" : "s"} received.`, "warning");
    await loadDashboard(true);
  } catch {
    // The next polling interval retries; the UI never claims a live or push notification connection.
  } finally {
    polling = false;
  }
}, 30_000);

initialize();
