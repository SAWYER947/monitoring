# Bluehaven Network Console

A responsive, administrator-only network management dashboard. This folder was empty, so the app uses a small dependency-free Node.js server with native ES modules and a browser UI. That keeps the setup easy to run while making the provider boundary explicit.

## What works

- First-run administrator setup, or local-only bootstrap from environment variables.
- Scrypt password hashes, encrypted eight-hour `HttpOnly` sessions, same-origin checks, CSRF tokens for authenticated writes, sign-out, and in-memory sign-in rate limiting.
- Network records with a friendly name, integration selection, status, last successful check, rename, connection test, and removal.
- A provider interface separated from the UI. The bundled provider is **Demo simulation** only.
- Clearly labeled sample device metadata and approval requests. Device labels, access changes, decisions, and audit entries persist locally in `.data/store.json`.
- Search, network and status filters, a 30-second in-app polling fallback, responsive layouts, loading and empty states, and success/error feedback.

## Run locally

Requires Node.js 20 or newer. There are no third-party packages to install.

```powershell
npm start
```

Open <http://127.0.0.1:4173>. On first launch, create an administrator account with a password of at least 12 characters. The password is hashed with scrypt and only the hash is stored.

To bootstrap the first account in **local development only**, copy `.env.example` to `.env` and set `ADMIN_USERNAME` and `ADMIN_PASSWORD` to your own values before the first launch. The server ignores these bootstrap variables when `NODE_ENV=production`. Remove them after setup. If the `.data/store.json` already contains an administrator, environment variables do not replace that account.

Useful local settings:

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4173` | HTTP listener port |
| `HOST` | `127.0.0.1` | Listener address; keep loopback when a local reverse proxy handles public traffic |
| `DATA_DIR` | `./.data` | Server-only local application data directory |
| `SESSION_SECRET` | generated in `.data/session.key` | Session encryption key; set a unique random value of at least 32 characters in managed deployments |
| `TRUST_PROXY` | `0` | Set to `1` only behind a trusted reverse proxy that overwrites `X-Forwarded-Proto` and `X-Forwarded-For` |

The app reads a simple `.env` file without a dotenv dependency. Do not commit `.env`, `.data`, or real controller credentials.

## Demo mode and router support

The initial network is named **Studio · Main floor** and uses **Demo simulation**. Sample devices and requests are illustrative. Device labels, authorize/revoke/block/unblock actions, approval decisions, and connection checks only change or report local app state. The UI identifies them as simulated. This app does not scan nearby Wi-Fi, discover arbitrary networks, or contact a router.

**Other controller** is intentionally marked as unavailable. It creates a visible unsupported integration record with no device or request data. No Wi-Fi password is requested or stored. Real access management requires an adapter for a router, access point, captive portal, or network controller that you own or are explicitly authorized to administer.

### Provider adapter contract

Provider code lives under `server/providers/`, separately from `public/app.js`. The adapter describes its real capabilities and implements only the operations supported by its controller API:

- `testConnection(network)`
- `listDevices(network, store)`
- `listRequests(network, store)` when the controller supplies a captive-portal/access queue
- `updateDevice(network, deviceId, action, value, store)` for supported access actions; friendly labels are stored locally by the app
- `decideRequest(request, action, durationMinutes, store)` when requests are supported
- `supports` capability flags for devices, authorize, revoke, block, approvals, and supported approval durations

To add an adapter, create a provider module in `server/providers/` and register it in `server/providers/index.mjs`. Return validated, provider-reported metadata only. Use the controller’s documented authorized API; add timeouts and clear errors. Store controller tokens in a server-side secret manager or encrypted server configuration, never in browser code or plain text. Do not implement network scanning, packet interception, credential collection, or access actions through undocumented behavior.

Device names and network identifiers do not reliably identify a person. MAC addresses can be randomized, so blocking by MAC is not foolproof. A controller may also omit or stale device metadata; surface its timestamps and errors rather than implying certainty.

## Security and deployment

- Set `NODE_ENV=production`, a strong per-deployment `SESSION_SECRET`, and serve the app over **HTTPS** through a correctly configured reverse proxy. Only set `TRUST_PROXY=1` when that proxy is trusted and overwrites forwarded headers.
- `ADMIN_USERNAME` and `ADMIN_PASSWORD` bootstrap only in non-production mode. Production starts with the first-run setup screen if no administrator exists. Protect access to that setup route at the network perimeter until the account is created.
- The session cookie is encrypted with AES-256-GCM, `HttpOnly`, `SameSite=Strict`, and `Secure` in production. State-changing browser requests require a same-origin `Origin` and a session CSRF token. Sign-in/setup are same-origin checked and rate limited.
- The local JSON store contains administrator password hashes, network records, simulated state, and audit entries. It contains no Wi-Fi passwords or controller credentials. Restrict filesystem access to the service account and back up `.data` securely.
- Rate limits and session data are process-local, and this starter uses a local JSON store. For a multi-instance deployment, replace them with a shared database/session store and a distributed rate limiter before scaling.
- Put the service behind authentication-aware network controls and keep it off public interfaces unless the deployment has been reviewed. Use HTTPS for every production browser session.

## Checks

```powershell
npm run check
```

The check script runs Node’s syntax checker over the server, provider, and browser modules.

## Files

- `server/index.mjs` — HTTP server, static assets, and security headers
- `server/api.mjs` — validated API routes, authentication flow, rate limiting, audit events
- `server/security.mjs` — scrypt password hashing and encrypted session cookies
- `server/store.mjs` — local server-side persistence and session key handling
- `server/providers/` — provider registry and local-only demo provider
- `public/` — dashboard, styles, and browser-side interactions
