import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { createSciFiMaterials, buildSplitLegsAndHead } from './jimmy-materials.js?v=5';

export function createJimmyRobot(visorTexture = null) {
  const root = new THREE.Group();
  const m = createSciFiMaterials(visorTexture);
  const waistPivot = new THREE.Group();
  waistPivot.position.set(0, 0.14, 0);
  const neckPivot = new THREE.Group();
  neckPivot.position.set(0, 0.142, 0);
  const { leftLeg, rightLeg } = buildSplitLegsAndHead(root, neckPivot, m);

  const waistCore = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.038, 0.032, 28), m.titanium);
  waistCore.position.y = 0.012;
  const lowerTorso = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.038, 0.068, 32), m.armor);
  lowerTorso.scale.set(1.08, 1.0, 0.82); lowerTorso.position.y = 0.054;
  const upperChest = new THREE.Mesh(new THREE.SphereGeometry(0.058, 36, 28), m.armor);
  upperChest.scale.set(1.16, 0.88, 0.78); upperChest.position.y = 0.098;
  const chestBezel = new THREE.Mesh(new THREE.TorusGeometry(0.019, 0.0035, 14, 32), m.trim);
  chestBezel.position.set(0, 0.095, 0.044);
  const chestCore = new THREE.Mesh(new THREE.CircleGeometry(0.015, 28), m.glowCyan);
  chestCore.position.set(0, 0.095, 0.046);
  const collarRing = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.003, 12, 28), m.glowCyan);
  collarRing.rotation.x = Math.PI / 2; collarRing.position.y = 0.138;
  waistPivot.add(waistCore, lowerTorso, upperChest, chestBezel, chestCore, collarRing, neckPivot);
  root.add(waistPivot);

  const makeArm = (s) => {
    const sh = new THREE.Group();
    sh.position.set(s * 0.076, 0.114, 0);
    const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.025, 24, 20), m.trim);
    const shRing = new THREE.Mesh(new THREE.TorusGeometry(0.024, 0.0022, 10, 24), m.glowCyan);
    shRing.rotation.y = Math.PI / 2;
    const upper = new THREE.Mesh(new THREE.CapsuleGeometry(0.0155, 0.052, 12, 24), m.armor);
    upper.position.y = -0.042;
    const elbow = new THREE.Group();
    elbow.position.y = -0.082;
    const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.017, 20, 16), m.titanium);
    const fore = new THREE.Mesh(new THREE.CapsuleGeometry(0.0145, 0.048, 12, 24), m.armor);
    fore.position.y = -0.038;
    const wristRing = new THREE.Mesh(new THREE.TorusGeometry(0.015, 0.0022, 10, 24), m.glowAmber);
    wristRing.rotation.x = Math.PI / 2; wristRing.position.y = -0.072;
    const palm = new THREE.Group();
    palm.position.set(0, -0.08, 0.008);
    const palmShell = new THREE.Mesh(new THREE.SphereGeometry(0.014, 20, 16), m.trim);
    palmShell.scale.set(1.1, 0.8, 0.65); palm.add(palmShell);
    const fingers = [-0.011, 0, 0.011].map((fx) => {
      const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.0038, 0.018, 8, 16), m.armor);
      f.position.set(fx, -0.014, 0.004); palm.add(f); return f;
    });
    elbow.add(elbowJoint, fore, wristRing, palm);
    sh.add(pauldron, shRing, upper, elbow);
    waistPivot.add(sh);
    return { sh, elbow, palm, fingers };
  };
  return { root, waistPivot, neckPivot, leftArm: makeArm(1), rightArm: makeArm(-1), leftLeg, rightLeg };
}
