import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function createMassEffectOmniHud() {
  const group = new THREE.Group();
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const drawHud = (title, status) => {
    ctx.clearRect(0, 0, 512, 256);
    ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
    ctx.fillRect(8, 8, 496, 240);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, 488, 232);
    for (let y = 16; y < 240; y += 8) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.fillRect(14, y, 484, 2);
    }
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 25px monospace';
    ctx.fillText('OMNI-LINK // JIMMY TF2', 28, 56);
    ctx.fillStyle = '#38bdf8';
    ctx.font = '21px monospace';
    ctx.fillText(`INTENT: ${title}`, 28, 110);
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '17px monospace';
    ctx.fillText(status, 28, 160);
    ctx.fillText('BUS: 17-DoF (14 Base + 3 Hand) OK', 28, 210);
  };
  drawHud('PresentPalmHologram', 'Anchor: right_wrist_flange_link');
  const tex = new THREE.CanvasTexture(canvas);
  const curvedGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.11, 32, 1, true, -0.75, 1.5);
  const screen = new THREE.Mesh(curvedGeo, new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide }));
  screen.rotation.y = Math.PI;
  screen.position.set(0, 0.09, 0);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.042, 0.003, 12, 32), new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true }));
  ring.rotation.x = Math.PI / 2;
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.025, 1), new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true }));
  core.position.y = 0.035;
  group.add(screen, ring, core);
  return { group, core, ring, updateText: (t, s) => { drawHud(t, s); tex.needsUpdate = true; } };
}
