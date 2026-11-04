import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function createJimmyRobot() {
  const root = new THREE.Group();
  const white = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.25, metalness: 0.2 });
  const blue = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3, metalness: 0.5 });
  const visorMat = new THREE.MeshStandardMaterial({ color: 0x050814, emissive: 0x38bdf8, emissiveIntensity: 0.45 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.095, 0.03, 24), blue);
  base.position.y = 0.015;
  root.add(base);
  for (const s of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.11, 0.055), white);
    leg.position.set(s * 0.045, 0.085, 0);
    root.add(leg);
  }
  const waistPivot = new THREE.Group();
  waistPivot.position.set(0, 0.14, 0);
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.13, 0.075), white);
  torso.position.y = 0.065;
  const chestCam = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 16), blue);
  chestCam.position.set(0, 0.07, 0.038);
  const neckPivot = new THREE.Group();
  neckPivot.position.set(0, 0.14, 0);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.075, 0.075), white);
  head.position.y = 0.04;
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.072, 0.045, 0.01), visorMat);
  visor.position.set(0, 0.042, 0.036);
  neckPivot.add(head, visor);
  waistPivot.add(torso, chestCam, neckPivot);
  root.add(waistPivot);
  const makeArm = (s) => {
    const sh = new THREE.Group();
    sh.position.set(s * 0.072, 0.115, 0);
    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.015, 0.075), white);
    upper.position.y = -0.04;
    const elbow = new THREE.Group();
    elbow.position.y = -0.08;
    const fore = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.018, 0.075), white);
    fore.position.y = -0.038;
    const palm = new THREE.Group();
    palm.position.set(0, -0.08, 0.01);
    elbow.add(fore, palm);
    sh.add(new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 16), blue), upper, elbow);
    waistPivot.add(sh);
    return { sh, elbow, palm };
  };
  return { root, waistPivot, neckPivot, leftArm: makeArm(1), rightArm: makeArm(-1) };
}
