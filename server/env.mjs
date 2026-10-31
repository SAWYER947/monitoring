import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export function loadLocalEnvironment() {
  const envPath = resolve(process.cwd(), ".env");
  let contents;

  try {
    contents = readFileSync(envPath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }

  for (const line of contents.split(/\r?\n/u)) {
    const entry = line.trim();
    if (!entry || entry.startsWith("#")) continue;

    const separator = entry.indexOf("=");
    if (separator < 1) continue;

    const name = entry.slice(0, separator).trim();
    let value = entry.slice(separator + 1).trim();
    if (!/^[A-Z][A-Z0-9_]*$/u.test(name) || process.env[name] !== undefined) continue;

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[name] = value;
  }
}

loadLocalEnvironment();
