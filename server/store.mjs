import { createHash, randomBytes } from "node:crypto";
import { chmodSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const dataDirectory = resolve(process.env.DATA_DIR || ".data");
const storePath = resolve(dataDirectory, "store.json");
const keyPath = resolve(dataDirectory, "session.key");

function ensureDataDirectory() {
  mkdirSync(dataDirectory, { recursive: true, mode: 0o700 });
  try {
    chmodSync(dataDirectory, 0o700);
  } catch {
    // Windows ACLs are managed by the host OS; Unix permissions are tightened where supported.
  }
}

function isoMinutesAgo(minutes) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

function createInitialStore() {
  const now = new Date().toISOString();
  return {
    version: 1,
    admins: [],
    networks: [
      {
        id: "net-demo-001",
        name: "Studio · Main floor",
        providerId: "demo",
        createdAt: now,
        status: "simulated",
        lastSync: now,
      },
    ],
    deviceState: {},
    requestDecisions: {},
    demoRequests: [
      {
        id: "req-demo-101",
        networkId: "net-demo-001",
        deviceName: "Pixel 9",
        deviceType: "Android phone",
        macAddress: "3A:71:9C:22:4B:10",
        ipAddress: "192.168.20.108",
        receivedAt: isoMinutesAgo(7),
        expiresAt: new Date(Date.now() + 48 * 60_000).toISOString(),
      },
      {
        id: "req-demo-102",
        networkId: "net-demo-001",
        deviceName: "MacBook Air",
        deviceType: "Laptop",
        macAddress: "76:2B:41:A0:93:5C",
        ipAddress: "192.168.20.112",
        receivedAt: isoMinutesAgo(18),
        expiresAt: new Date(Date.now() + 31 * 60_000).toISOString(),
      },
    ],
    audit: [
      {
        id: randomBytes(12).toString("hex"),
        administrator: "System",
        action: "Demo environment initialized",
        device: null,
        network: "Studio · Main floor",
        timestamp: now,
        simulated: true,
      },
    ],
  };
}

export function loadStore() {
  ensureDataDirectory();
  if (!existsSync(storePath)) {
    const initial = createInitialStore();
    saveStore(initial);
    return initial;
  }

  try {
    const parsed = JSON.parse(readFileSync(storePath, "utf8"));
    if (parsed.version !== 1 || !Array.isArray(parsed.admins) || !Array.isArray(parsed.networks)) {
      throw new Error("Unsupported data store format");
    }
    parsed.deviceState ||= {};
    parsed.requestDecisions ||= {};
    parsed.demoRequests ||= [];
    parsed.audit ||= [];
    return parsed;
  } catch (error) {
    throw new Error(`Could not read the application data store: ${error.message}`);
  }
}

export function saveStore(store) {
  ensureDataDirectory();
  const temporaryPath = `${storePath}.${process.pid}.${randomBytes(4).toString("hex")}.tmp`;
  const serialized = `${JSON.stringify(store, null, 2)}\n`;
  writeFileSync(temporaryPath, serialized, { encoding: "utf8", mode: 0o600, flag: "wx" });
  try {
    chmodSync(temporaryPath, 0o600);
  } catch {
    // Windows ACLs are managed by the host OS; Unix permissions are tightened where supported.
  }
  renameSync(temporaryPath, storePath);
}

export function getSessionKey() {
  const configured = process.env.SESSION_SECRET;
  if (configured) {
    if (configured.length < 32) throw new Error("SESSION_SECRET must contain at least 32 characters");
    return createHash("sha256").update(configured, "utf8").digest();
  }

  ensureDataDirectory();
  if (!existsSync(keyPath)) {
    try {
      writeFileSync(keyPath, randomBytes(32), { mode: 0o600, flag: "wx" });
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
    }
  }
  const key = readFileSync(keyPath);
  if (key.length !== 32) throw new Error("The generated session key is invalid");
  try {
    chmodSync(keyPath, 0o600);
  } catch {
    // Windows ACLs are managed by the host OS; Unix permissions are tightened where supported.
  }
  return key;
}

export function addAudit(store, event) {
  store.audit.unshift({ id: randomBytes(12).toString("hex"), timestamp: new Date().toISOString(), ...event });
  store.audit = store.audit.slice(0, 250);
}

export function getStorePath() {
  return storePath;
}

export function getDataDirectory() {
  return dirname(storePath);
}
