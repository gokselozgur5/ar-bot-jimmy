import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function createInteractiveIkOrb(jimmyRoot) {
  const orbGroup = new THREE.Group();
  orbGroup.position.set(-0.14, 0.22, 0.14);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.022, 1),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true })
  );
  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.032, 0.0025, 12, 24),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b })
  );
  orbGroup.add(core, halo);
  jimmyRoot.add(orbGroup);

  let active = false;
  let phase = 0;
  orbGroup.visible = false;

  function toggleIkMode() {
    active = !active;
    orbGroup.visible = active;
    return active;
  }

  function update(timeMs, jimmy) {
    core.rotation.y = timeMs * 0.003;
    halo.rotation.x = timeMs * 0.002;
    if (!active) return;
    phase = timeMs * 0.0018;
    orbGroup.position.set(-0.13 + Math.sin(phase) * 0.05, 0.22 + Math.cos(phase * 1.3) * 0.04, 0.14);

    const dx = orbGroup.position.x - (-0.072);
    const dy = orbGroup.position.y - 0.255;
    const dz = orbGroup.position.z;
    jimmy.neckPivot.rotation.y = Math.atan2(orbGroup.position.x, dz);
    jimmy.rightArm.sh.rotation.x = -Math.atan2(dz, -dy) * 0.85;
    jimmy.rightArm.sh.rotation.z = Math.atan2(dx, 0.12) * 0.7;
    jimmy.rightArm.elbow.rotation.x = -0.65;
  }
  return { orb: orbGroup, orbGroup, toggle: toggleIkMode, toggleIkMode, isActive: () => active, update };
}
