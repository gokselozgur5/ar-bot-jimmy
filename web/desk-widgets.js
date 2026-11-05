import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function createDeskCompanionWidgets(robotRoot) {
  const group = new THREE.Group();
  group.position.set(0.28, 0.24, 0.08);
  group.rotation.y = -0.32;
  const cvs = document.createElement('canvas');
  cvs.width = 360; cvs.height = 220;
  const ctx = cvs.getContext('2d');
  const tex = new THREE.CanvasTexture(cvs);
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(0.18, 0.11),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide })
  );
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.068, 0.003, 12, 48),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.75 })
  );
  ring.position.set(0.052, 0.005, 0.004);
  group.add(panel, ring);
  robotRoot.add(group);
  const startMs = performance.now();

  function update(t, daemonConnected = false) {
    if (!group.visible) return;
    ring.rotation.z = -t * 0.0015;
    const remSec = Math.max(0, 1500 - Math.floor((t - startMs) / 1000));
    const mm = String(Math.floor(remSec / 60)).padStart(2, '0');
    const ss = String(remSec % 60).padStart(2, '0');
    ctx.clearRect(0, 0, 360, 220);
    ctx.fillStyle = 'rgba(2, 12, 27, 0.86)'; ctx.fillRect(4, 4, 352, 212);
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 3; ctx.strokeRect(4, 4, 352, 212);
    ctx.fillStyle = '#fb923c'; ctx.font = 'bold 15px monospace';
    ctx.fillText(`STS3215 17-DOF BUS [${daemonConnected ? 'LIVE' : 'SIM'}]`, 16, 28);
    for (let i = 0; i < 8; i++) {
      const load = 0.25 + 0.55 * Math.abs(Math.sin(t * 0.002 + i * 0.7));
      ctx.fillStyle = load > 0.68 ? '#fb923c' : '#38bdf8';
      ctx.fillRect(18 + i * 20, 185 - load * 115, 13, load * 115);
    }
    ctx.fillStyle = '#e0f2fe'; ctx.font = 'bold 24px monospace';
    ctx.fillText(`${mm}:${ss}`, 232, 118);
    ctx.font = '13px monospace'; ctx.fillStyle = '#4ade80';
    ctx.fillText('FOCUS POMODORO', 214, 145);
    tex.needsUpdate = true;
  }

  return { group, update, toggle: () => { group.visible = !group.visible; return group.visible; } };
}
