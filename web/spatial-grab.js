import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function setupSpatialGrabAndPlace(renderer, jimmyRoot) {
  const anchorRing = new THREE.Mesh(
    new THREE.RingGeometry(0.105, 0.125, 32),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.75 })
  );
  anchorRing.rotation.x = -Math.PI / 2;
  anchorRing.position.y = 0.002;
  jimmyRoot.add(anchorRing);

  let grabbedBy = null;
  const forwardOffset = new THREE.Vector3(0, -0.12, -0.38);

  for (const idx of [0, 1]) {
    const ctrl = renderer.xr.getController(idx);
    ctrl.addEventListener('squeezestart', () => {
      grabbedBy = ctrl;
      anchorRing.material.color.setHex(0x38bdf8);
    });
    ctrl.addEventListener('squeezeend', () => {
      if (grabbedBy === ctrl) {
        grabbedBy = null;
        anchorRing.material.color.setHex(0xf59e0b);
      }
    });
  }

  function update(timeMs) {
    anchorRing.rotation.z = timeMs * 0.0012;
    if (grabbedBy) {
      const pos = new THREE.Vector3().setFromMatrixPosition(grabbedBy.matrixWorld);
      const quat = new THREE.Quaternion().setFromRotationMatrix(grabbedBy.matrixWorld);
      const offset = forwardOffset.clone().applyQuaternion(quat);
      jimmyRoot.position.lerp(pos.add(offset), 0.25);
    }
  }
  return { anchorRing, update };
}
