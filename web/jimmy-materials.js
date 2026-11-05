import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function createSciFiMaterials(visorTexture) {
  return {
    armor: new THREE.MeshPhysicalMaterial({ color: 0xf8fafc, roughness: 0.14, metalness: 0.08, clearcoat: 1.0, clearcoatRoughness: 0.1 }),
    trim: new THREE.MeshPhysicalMaterial({ color: 0x0284c7, roughness: 0.22, metalness: 0.65, clearcoat: 0.8 }),
    titanium: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.85 }),
    glowCyan: new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
    glowAmber: new THREE.MeshBasicMaterial({ color: 0xf59e0b }),
    visor: visorTexture
      ? new THREE.MeshBasicMaterial({ map: visorTexture })
      : new THREE.MeshStandardMaterial({ color: 0x050814, emissive: 0x38bdf8, emissiveIntensity: 0.5 })
  };
}

export function buildCurvedHeadAndBase(root, waistPivot, neckPivot, m) {
  // Multi-tier Hover/Wheeled Base with recessed drive wheels & glowing cyan rim
  const baseSkirt = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.092, 0.028, 36), m.trim);
  baseSkirt.position.y = 0.014;
  const baseDome = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.072, 0.024, 36), m.armor);
  baseDome.position.y = 0.038;
  const rimRing = new THREE.Mesh(new THREE.TorusGeometry(0.082, 0.003, 12, 48), m.glowCyan);
  rimRing.rotation.x = Math.PI / 2; rimRing.position.y = 0.026;
  root.add(baseSkirt, baseDome, rimRing);
  for (const s of [-1, 1]) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.016, 24), m.titanium);
    wheel.rotation.z = Math.PI / 2; wheel.position.set(s * 0.076, 0.024, 0);
    const legStrut = new THREE.Mesh(new THREE.CapsuleGeometry(0.019, 0.058, 12, 24), m.armor);
    legStrut.position.set(s * 0.038, 0.088, 0);
    const kneeRing = new THREE.Mesh(new THREE.TorusGeometry(0.020, 0.0025, 10, 24), m.glowCyan);
    kneeRing.rotation.x = Math.PI / 2; kneeRing.position.set(s * 0.038, 0.088, 0);
    root.add(wheel, legStrut, kneeRing);
  }
  // Curved Astro-Bot Ellipsoid Head Dome + Ear Comms Pods + Wrap-Around Visor
  const headDome = new THREE.Mesh(new THREE.SphereGeometry(0.048, 36, 28), m.armor);
  headDome.scale.set(1.12, 0.92, 0.96); headDome.position.y = 0.044;
  const visorBezel = new THREE.Mesh(new THREE.CapsuleGeometry(0.024, 0.038, 16, 24), m.titanium);
  visorBezel.rotation.z = Math.PI / 2; visorBezel.scale.set(1.0, 1.0, 0.55); visorBezel.position.set(0, 0.044, 0.033);
  const visorScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.068, 0.038), m.visor);
  visorScreen.position.set(0, 0.044, 0.0475);
  neckPivot.add(headDome, visorBezel, visorScreen);
  for (const s of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.018, 0.012, 24), m.trim);
    ear.rotation.z = Math.PI / 2; ear.position.set(s * 0.056, 0.044, 0);
    const earRing = new THREE.Mesh(new THREE.TorusGeometry(0.013, 0.002, 10, 24), m.glowCyan);
    earRing.rotation.y = Math.PI / 2; earRing.position.set(s * 0.062, 0.044, 0);
    neckPivot.add(ear, earRing);
  }
}
