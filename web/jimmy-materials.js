import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function createSciFiMaterials(visorTexture) {
  return {
    armor: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.15 }),
    trim: new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.28, metalness: 0.55 }),
    titanium: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.35, metalness: 0.75 }),
    glowCyan: new THREE.MeshBasicMaterial({ color: 0x38bdf8 }),
    glowAmber: new THREE.MeshBasicMaterial({ color: 0xf59e0b }),
    visor: visorTexture
      ? new THREE.MeshBasicMaterial({ map: visorTexture })
      : new THREE.MeshStandardMaterial({ color: 0x050814, emissive: 0x38bdf8, emissiveIntensity: 0.5 })
  };
}

function makeSplitHalfPlatform(side, m) {
  const shape = new THREE.Shape();
  const r = 0.068;
  if (side > 0) {
    shape.absarc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
    shape.lineTo(0, -r);
  } else {
    shape.absarc(0, 0, r, Math.PI / 2, Math.PI * 1.5, false);
    shape.lineTo(0, r);
  }
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.016, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 4, curveSegments: 28 });
  geo.rotateX(Math.PI / 2);
  const pad = new THREE.Mesh(geo, m.trim);
  pad.position.set(-side * 0.026, 0.018, 0);
  const topCap = new THREE.Mesh(new THREE.SphereGeometry(0.025, 20, 14), m.armor);
  topCap.scale.set(0.95, 0.55, 1.35); topCap.position.set(0, 0.018, 0.006);
  const group = new THREE.Group();
  group.add(pad, topCap);
  return group;
}

export function buildSplitLegsAndHead(root, neckPivot, m) {
  const pelvis = new THREE.Mesh(new THREE.CapsuleGeometry(0.024, 0.044, 12, 24), m.titanium);
  pelvis.rotation.z = Math.PI / 2; pelvis.position.set(0, 0.132, 0);
  root.add(pelvis);
  const makeLeg = (s) => {
    const hip = new THREE.Group(); hip.position.set(s * 0.036, 0.126, 0);
    const hipBall = new THREE.Mesh(new THREE.SphereGeometry(0.020, 20, 16), m.trim);
    const thigh = new THREE.Mesh(new THREE.CapsuleGeometry(0.016, 0.034, 12, 20), m.armor); thigh.position.y = -0.028;
    const knee = new THREE.Group(); knee.position.y = -0.056;
    const kneeJoint = new THREE.Mesh(new THREE.SphereGeometry(0.017, 18, 14), m.titanium);
    const shin = new THREE.Mesh(new THREE.CapsuleGeometry(0.015, 0.034, 12, 20), m.armor); shin.position.y = -0.026;
    const ankle = new THREE.Group(); ankle.position.y = -0.056;
    ankle.add(makeSplitHalfPlatform(s, m));
    knee.add(kneeJoint, shin, ankle); hip.add(hipBall, thigh, knee); root.add(hip);
    return { hip, knee, ankle };
  };
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
  return { leftLeg: makeLeg(1), rightLeg: makeLeg(-1) };
}
