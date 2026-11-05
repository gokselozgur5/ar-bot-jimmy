// Live WebXR to jimmy-daemon (127.0.0.1:8765) HTTP Telemetry Bridge with Offline Fallback
export function createDaemonBridge(endpoint = 'http://127.0.0.1:8765') {
  let state = { connected: false, lastSyncMs: 0, ros2Topic: '/joint_states', servosActive: 17 };

  async function postDaemon(path) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 350);
      const res = await fetch(`${endpoint}${path}`, { method: 'POST', signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok) {
        state.connected = true;
        state.lastSyncMs = performance.now();
        return await res.json();
      }
    } catch (_) {
      state.connected = false;
    }
    return null;
  }

  return {
    state,
    syncGesture: (name) => postDaemon(`/api/gesture/${encodeURIComponent(name)}`),
    syncIkTarget: (x, y, z) => postDaemon(`/api/ik?x=${x.toFixed(3)}&y=${y.toFixed(3)}&z=${z.toFixed(3)}`)
  };
}
