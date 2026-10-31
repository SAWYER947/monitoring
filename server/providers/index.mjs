import { demoProvider } from "./demo.mjs";

const providers = new Map([
  [demoProvider.id, demoProvider],
  ["generic-controller", {
    id: "generic-controller",
    name: "Other controller",
    mode: "unconfigured",
    available: false,
    simulated: false,
    supports: { devices: false, authorize: false, revoke: false, block: false, approvals: false, approvalDurations: [] },
    async testConnection() {
      return { success: false, simulated: false, message: "No adapter is configured for this controller. See the integration notes in README.md." };
    },
    async listDevices() { return []; },
    async listRequests() { return []; },
  }],
]);

export function getProvider(providerId) {
  return providers.get(providerId) || null;
}

export function describeProvider(providerId) {
  const provider = getProvider(providerId);
  if (!provider) return { id: providerId, name: "Unsupported integration", mode: "unsupported", available: false, simulated: false, supports: {} };
  return { id: provider.id, name: provider.name, mode: provider.mode, available: provider.available, simulated: provider.simulated, supports: provider.supports };
}

export function listProviderChoices() {
  return [
    { id: "demo", name: "Demo simulation", available: true, simulated: true, description: "Sample devices and requests. Actions stay in this app." },
    { id: "generic-controller", name: "Other controller", available: false, simulated: false, description: "Unsupported until a provider adapter is configured." },
  ];
}
