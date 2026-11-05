import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { ARButton } from 'https://unpkg.com/three@0.160.0/examples/jsm/webxr/ARButton.js';
import { createJimmyRobot } from './jimmy-model.js?v=5';
import { createMassEffectOmniHud } from './mass-effect-hud.js?v=5';
import { createVisorFace } from './visor-face.js?v=5';
import { createSpatialHoloMenu } from './holo-menu.js?v=5';
import { setupLiveConversation } from './llm-chat.js?v=5';
import { setupSpatialGrabAndPlace } from './spatial-grab.js?v=5';
import { createInteractiveIkOrb } from './ik-target.js?v=5';
import { setupCadStlOverlay } from './stl-loader.js?v=5';
import { setupMirrorHandTeleop } from './hand-teleop.js?v=5';
import { createDaemonBridge } from './daemon-client.js?v=5';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.05, 20);
camera.position.set(0, 0.12, 0.55);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['local-floor'], optionalFeatures: ['dom-overlay', 'hand-tracking'], domOverlay: { root: document.body } }));

scene.add(new THREE.AmbientLight(0xffffff, 0.9), new THREE.DirectionalLight(0x38bdf8, 1.5));
const visorFace = createVisorFace();
const jimmy = createJimmyRobot(visorFace.texture);
jimmy.root.position.set(0, -0.22, -0.45);
scene.add(jimmy.root);
const omniHud = createMassEffectOmniHud();
jimmy.rightArm.palm.add(omniHud.group);

const NAMES = ['PresentPalmHologram', 'CyberClippyLean', 'ItalianShrug', 'FriendlyWave', 'BipedalWalk'];
const ALL_MODES = [...NAMES, 'Live3dIkOrb'];
const holoMenu = createSpatialHoloMenu(ALL_MODES);
jimmy.root.add(holoMenu.menuGroup);
const ikOrb = createInteractiveIkOrb(jimmy.root);
const cadStl = setupCadStlOverlay(jimmy);
const handTeleop = setupMirrorHandTeleop(renderer);
const daemonBridge = createDaemonBridge();
window.toggleJimmyIkOrb = () => {
  const on = ikOrb.toggle();
  omniHud.updateText('Live 3D IK Orb', on ? '3-Pivot IK tracking floating Desk Orb!' : 'Returned to gesture preset mode.');
  playRobotVoice(1);
};
window.toggleJimmyCadStl = () => {
  const on = cadStl.toggle();
  omniHud.updateText('3D-Printable CAD STL', on ? 'Showing OpenSCAD 2-manifold STL wireframe!' : 'CAD STL overlay hidden.');
};
window.toggleJimmyTeleop = () => {
  const on = handTeleop.toggle();
  omniHud.updateText('Mirror Hand Teleop', on ? 'Mirroring your real right hand & fingers!' : 'Teleop off.');
};
const triggerMenuAction = (g) => (g === 'Live3dIkOrb' ? window.toggleJimmyIkOrb() : window.setJimmyGesture(g));
const spatialGrab = setupSpatialGrabAndPlace(renderer, jimmy.root, holoMenu.buttons, triggerMenuAction);
const raycaster = new THREE.Raycaster();
const tempMat = new THREE.Matrix4();
let idx = 0;
for (const i of [0, 1]) {
  const ctrl = renderer.xr.getController(i);
  ctrl.add(holoMenu.makeLaser());
  scene.add(ctrl);
  ctrl.addEventListener('select', () => {
    if (spatialGrab.isGrabbing()) return;
    tempMat.identity().extractRotation(ctrl.matrixWorld);
    raycaster.ray.origin.setFromMatrixPosition(ctrl.matrixWorld);
    raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMat);
    const hits = raycaster.intersectObjects(holoMenu.buttons);
    if (hits.length > 0) { triggerMenuAction(hits[0].object.userData.gestureName); return; }
    idx = (idx + 1) % ALL_MODES.length;
    triggerMenuAction(ALL_MODES[idx]);
  });
}

const POSES = {
  PresentPalmHologram: { wP: 0.05, nR: 0.0, rSP: -1.15, rSR: 0.0, rEP: -0.55, lSP: 0.1, lSR: 0.1, fG: [0, 0, 0], msg: 'Quest 3 Passthrough Omni-Tool Ready!' },
  CyberClippyLean: { wP: 0.28, nR: 0.32, rSP: -0.65, rSR: -0.2, rEP: -1.0, lSP: 0.2, lSR: 0.15, fG: [0.9, 0.0, 1.1], msg: 'Looks like you are writing Rust! Need help?' },
  ItalianShrug: { wP: -0.05, nR: -0.2, rSP: -0.45, rSR: -0.65, rEP: -1.25, lSP: -0.45, lSR: 0.65, fG: [0.2, 0.2, 0.2], msg: 'Why use 1 monitor when Quest 3 gives you 5?' },
  FriendlyWave: { wP: 0.0, nR: 0.18, rSP: -1.55, rSR: -0.45, rEP: -0.9, lSP: 0.1, lSR: 0.1, fG: [0.0, 0.0, 0.0], msg: 'Hey Kanka! Welcome to Augmented Reality!' },
  BipedalWalk: { wP: 0.08, nR: 0.0, rSP: -0.55, rSR: -0.15, rEP: -0.75, lSP: -0.55, lSR: 0.15, fG: [0.2, 0.2, 0.2], msg: 'Split-platform bipedal walking gait active!' }
};
let target = POSES.PresentPalmHologram;
let walkingContinuous = false, stepUntilMs = 0;
let audioCtx = null;
function playRobotVoice(k) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    [[440, 587, 880], [523, 659, 1046], [392, 330, 523], [659, 784, 1174]][k % 4].forEach((freq, i) => {
      const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.08);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.08 + 0.075);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + i * 0.08); osc.stop(audioCtx.currentTime + i * 0.08 + 0.08);
    });
  } catch (_) {}
}
window.setJimmyGesture = (name, customMsg = null) => {
  if (ikOrb?.orb?.visible) ikOrb.toggle?.();
  walkingContinuous = (name === 'BipedalWalk');
  stepUntilMs = performance.now() + 1400;
  target = POSES[name] || POSES.PresentPalmHologram;
  const msg = customMsg || target.msg;
  omniHud.updateText(name, msg);
  visorFace.setExpression(name);
  document.getElementById('telemetry').textContent = `[LLM Speech]: "${msg}"`;
  daemonBridge.syncGesture(name);
  playRobotVoice(NAMES.indexOf(name));
};
setupLiveConversation(({ gesture, msg }) => window.setJimmyGesture(gesture, msg));
window.setJimmyGesture('PresentPalmHologram');

renderer.setAnimationLoop((t) => {
  const s = 0.08;
  visorFace.update(t);
  spatialGrab.update(t);
  jimmy.waistPivot.rotation.x += (target.wP - jimmy.waistPivot.rotation.x) * s;
  jimmy.neckPivot.rotation.z += (target.nR - jimmy.neckPivot.rotation.z) * s;
  jimmy.rightArm.sh.rotation.x += (target.rSP - jimmy.rightArm.sh.rotation.x) * s;
  jimmy.rightArm.sh.rotation.z += (target.rSR - jimmy.rightArm.sh.rotation.z) * s;
  jimmy.rightArm.elbow.rotation.x += (target.rEP - jimmy.rightArm.elbow.rotation.x) * s;
  jimmy.leftArm.sh.rotation.x += (target.lSP - jimmy.leftArm.sh.rotation.x) * s;
  jimmy.leftArm.sh.rotation.z += (target.lSR - jimmy.leftArm.sh.rotation.z) * s;
  jimmy.rightArm.fingers.forEach((f, i) => { f.rotation.x += (target.fG[i] - f.rotation.x) * s; });
  if (walkingContinuous || t < stepUntilMs) {
    const g = t * 0.0085, sw = Math.sin(g) * 0.36;
    const lK = Math.max(0, Math.sin(g)) * 0.45, rK = Math.max(0, -Math.sin(g)) * 0.45;
    jimmy.leftLeg.hip.rotation.x += (sw - jimmy.leftLeg.hip.rotation.x) * 0.2;
    jimmy.leftLeg.knee.rotation.x += (lK - jimmy.leftLeg.knee.rotation.x) * 0.2;
    jimmy.leftLeg.ankle.rotation.x = -jimmy.leftLeg.hip.rotation.x - jimmy.leftLeg.knee.rotation.x;
    jimmy.rightLeg.hip.rotation.x += (-sw - jimmy.rightLeg.hip.rotation.x) * 0.2;
    jimmy.rightLeg.knee.rotation.x += (rK - jimmy.rightLeg.knee.rotation.x) * 0.2;
    jimmy.rightLeg.ankle.rotation.x = -jimmy.rightLeg.hip.rotation.x - jimmy.rightLeg.knee.rotation.x;
    jimmy.waistPivot.rotation.z = Math.cos(g) * 0.05;
  } else {
    for (const leg of [jimmy.leftLeg, jimmy.rightLeg]) {
      leg.hip.rotation.x *= 0.85; leg.knee.rotation.x *= 0.85; leg.ankle.rotation.x *= 0.85;
    }
    jimmy.waistPivot.rotation.z *= 0.85;
  }
  ikOrb.update(t, jimmy);
  handTeleop.update(jimmy);
  omniHud.core.rotation.y = t * 0.0025;
  omniHud.ring.rotation.z = -t * 0.0018;
  omniHud.screen.lookAt(camera.position);
  renderer.render(scene, camera);
});
