import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function setupSpatialGrabAndPlace(renderer, jimmyRoot, buttons = [], onButton = null) {
  const anchorRing = new THREE.Mesh(
    new THREE.RingGeometry(0.105, 0.128, 32),
    new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
  );
  anchorRing.rotation.x = -Math.PI / 2;
  anchorRing.position.y = 0.002;
  jimmyRoot.add(anchorRing);

  let grabbedBy = null, holdTimer = null, lastPokeMs = 0;
  const ctrls = [0, 1].map((i) => renderer.xr.getController(i));
  const hands = [0, 1].map((i) => (renderer.xr.getHand ? renderer.xr.getHand(i) : null));
  const startGrab = (src) => { grabbedBy = src; anchorRing.material.color.setHex(0x38bdf8); };
  const stopGrab = () => { clearTimeout(holdTimer); grabbedBy = null; anchorRing.material.color.setHex(0xf59e0b); };

  ctrls.forEach((ctrl, idx) => {
    const hand = hands[idx];
    if (hand) jimmyRoot.parent.add(hand);
    ctrl.addEventListener('squeezestart', () => startGrab(ctrl));
    ctrl.addEventListener('squeezeend', stopGrab);
    ctrl.addEventListener('selectstart', () => {
      const p = new THREE.Vector3().setFromMatrixPosition(ctrl.matrixWorld);
      if (p.distanceTo(jimmyRoot.position) < 0.36) startGrab(ctrl);
      else holdTimer = setTimeout(() => startGrab(ctrl), 220);
    });
    ctrl.addEventListener('selectend', stopGrab);
  });

  function update(timeMs) {
    anchorRing.rotation.z = timeMs * 0.0012;
    if (grabbedBy) {
      const p = new THREE.Vector3().setFromMatrixPosition(grabbedBy.matrixWorld);
      jimmyRoot.position.lerp(new THREE.Vector3(p.x, p.y - 0.14, p.z - 0.12), 0.25);
    }
    if (onButton && timeMs - lastPokeMs > 450) {
      for (const src of [...ctrls, ...hands.filter(Boolean)]) {
        const tip = src.joints?.['index-finger-tip'] || src;
        const p = new THREE.Vector3().setFromMatrixPosition(tip.matrixWorld);
        if (p.lengthSq() < 1e-5) continue;
        for (const btn of buttons) {
          const bp = new THREE.Vector3().setFromMatrixPosition(btn.matrixWorld);
          if (p.distanceTo(bp) < 0.065) { lastPokeMs = timeMs; onButton(btn.userData.gestureName); return; }
        }
      }
    }
  }
  return { anchorRing, update, isGrabbing: () => Boolean(grabbedBy) };
}
