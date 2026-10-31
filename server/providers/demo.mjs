const deviceSeeds = [
  { id: "dev-001", deviceName: "Maya’s MacBook Pro", deviceType: "Laptop", ipAddress: "192.168.20.101", macAddress: "D8:9E:F3:7A:12:C1", firstSeenHoursAgo: 68, lastSeenMinutesAgo: 1, connectionStatus: "connected", authorized: true, signal: "Strong" },
  { id: "dev-002", deviceName: "Samsung Galaxy S24", deviceType: "Android phone", ipAddress: "192.168.20.104", macAddress: "A2:4C:18:90:FE:73", firstSeenHoursAgo: 42, lastSeenMinutesAgo: 2, connectionStatus: "connected", authorized: true, signal: "Strong" },
  { id: "dev-003", deviceName: "Design iPad", deviceType: "Tablet", ipAddress: "192.168.20.106", macAddress: "E0:7D:12:5B:4A:92", firstSeenHoursAgo: 27, lastSeenMinutesAgo: 3, connectionStatus: "connected", authorized: true, signal: "Good" },
  { id: "dev-004", deviceName: "Unknown device", deviceType: "Unknown", ipAddress: "192.168.20.109", macAddress: "2E:56:BF:18:31:40", firstSeenHoursAgo: 2, lastSeenMinutesAgo: 1, connectionStatus: "connected", authorized: false, signal: "Fair" },
  { id: "dev-005", deviceName: "Meeting room display", deviceType: "Smart display", ipAddress: "192.168.20.116", macAddress: "88:2F:6A:01:CD:44", firstSeenHoursAgo: 176, lastSeenMinutesAgo: 5, connectionStatus: "connected", authorized: true, signal: "Good" },
  { id: "dev-006", deviceName: "ThinkPad X1", deviceType: "Laptop", ipAddress: "192.168.20.118", macAddress: "54:0A:7C:43:93:BB", firstSeenHoursAgo: 92, lastSeenMinutesAgo: 406, connectionStatus: "offline", authorized: true, signal: "—" },
  { id: "dev-007", deviceName: "Nintendo Switch", deviceType: "Gaming console", ipAddress: "192.168.20.123", macAddress: "00:1F:32:88:73:9A", firstSeenHoursAgo: 15, lastSeenMinutesAgo: 2, connectionStatus: "connected", authorized: false, signal: "Good" },
];

function ago(milliseconds) {
  return new Date(Date.now() - milliseconds).toISOString();
}

export const demoProvider = {
  id: "demo",
  name: "Demo simulation",
  mode: "demo",
  available: true,
  simulated: true,
  supports: {
    devices: true,
    authorize: true,
    revoke: true,
    block: true,
    approvals: true,
    approvalDurations: [30, 60, 240],
  },
  async testConnection() {
    return { success: true, simulated: true, message: "Demo connection ready. No router was contacted." };
  },
  async listDevices(network, store) {
    const overrides = store.deviceState[network.id] || {};
    return deviceSeeds.map((seed) => {
      const saved = overrides[seed.id] || {};
      return {
        ...seed,
        networkId: network.id,
        networkName: network.name,
        friendlyLabel: saved.label || "",
        authorized: saved.authorized ?? seed.authorized,
        blocked: saved.blocked ?? false,
        firstSeen: ago(seed.firstSeenHoursAgo * 60 * 60_000),
        lastSeen: ago(seed.lastSeenMinutesAgo * 60_000),
        lastSeenMinutesAgo: undefined,
        firstSeenHoursAgo: undefined,
      };
    });
  },
  async listRequests(network, store) {
    return store.demoRequests
      .filter((request) => request.networkId === network.id && !store.requestDecisions[request.id])
      .map((request) => ({ ...request, networkName: network.name, simulated: true }));
  },
  async updateDevice(network, deviceId, action, value, store) {
    if (!deviceSeeds.some((device) => device.id === deviceId)) throw new Error("Device was not found in the demo provider");
    store.deviceState[network.id] ||= {};
    const current = store.deviceState[network.id][deviceId] || {};
    if (action === "label") current.label = value;
    if (action === "authorize") current.authorized = true;
    if (action === "revoke") current.authorized = false;
    if (action === "block") current.blocked = true;
    if (action === "unblock") current.blocked = false;
    store.deviceState[network.id][deviceId] = current;
    return { success: true, simulated: true };
  },
  async decideRequest(request, action, durationMinutes, store) {
    store.requestDecisions[request.id] = { action, durationMinutes, decidedAt: new Date().toISOString() };
    return { success: true, simulated: true };
  },
};
