import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function setupMirrorHandTeleop(renderer) {
  let active = false;
  const ctrl = renderer.xr.getController(1);
  const hand = renderer.xr.getHand ? renderer.xr.getHand(1) : null;

  function toggle() {
    active = !active;
    return active;
  }

  function update(jimmy) {
    if (!active) return;
    const src = hand?.joints?.['wrist'] || ctrl;
    const p = new THREE.Vector3().setFromMatrixPosition(src.matrixWorld);
    if (p.lengthSq() < 1e-5) return;
    const local = p.sub(jimmy.root.position);
    const shPitch = THREE.MathUtils.clamp(-1.0 - (local.y - 0.18) * 3.2, -1.9, 0.3);
    const shRoll = THREE.MathUtils.clamp((local.x + 0.08) * 2.5, -0.9, 0.6);
    const elbowPitch = THREE.MathUtils.clamp(-0.55 - (0.35 - local.z) * 2.2, -1.6, -0.15);
    jimmy.rightArm.sh.rotation.x += (shPitch - jimmy.rightArm.sh.rotation.x) * 0.22;
    jimmy.rightArm.sh.rotation.z += (shRoll - jimmy.rightArm.sh.rotation.z) * 0.22;
    jimmy.rightArm.elbow.rotation.x += (elbowPitch - jimmy.rightArm.elbow.rotation.x) * 0.22;

    if (hand?.joints?.['index-finger-tip'] && hand?.joints?.['wrist']) {
      const tip = new THREE.Vector3().setFromMatrixPosition(hand.joints['index-finger-tip'].matrixWorld);
      const wrist = new THREE.Vector3().setFromMatrixPosition(hand.joints['wrist'].matrixWorld);
      const curl = THREE.MathUtils.clamp((0.15 - tip.distanceTo(wrist)) * 12.0, 0.0, 1.25);
      jimmy.rightArm.fingers.forEach((f) => { f.rotation.x += (curl - f.rotation.x) * 0.25; });
    }
  }
  return { toggle, update, isActive: () => active };
}
