import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { ARButton } from 'https://unpkg.com/three@0.160.0/examples/jsm/webxr/ARButton.js';
import { createJimmyRobot } from './jimmy-model.js';
import { createMassEffectOmniHud } from './mass-effect-hud.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.05, 20);
camera.position.set(0, 0.28, 0.58);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(ARButton.createButton(renderer, {
  requiredFeatures: ['local-floor'],
  optionalFeatures: ['dom-overlay'],
  domOverlay: { root: document.body }
}));

const NAMES = ['PresentPalmHologram', 'CyberClippyLean', 'ItalianShrug', 'FriendlyWave'];
let idx = 0;
for (const i of [0, 1]) {
  renderer.xr.getController(i).addEventListener('select', () => {
    idx = (idx + 1) % NAMES.length;
    window.setJimmyGesture(NAMES[idx]);
  });
}

scene.add(new THREE.AmbientLight(0xffffff, 0.9), new THREE.DirectionalLight(0x38bdf8, 1.5));
const jimmy = createJimmyRobot();
jimmy.root.position.set(0, -0.22, -0.45);
scene.add(jimmy.root);
const omniHud = createMassEffectOmniHud();
jimmy.rightArm.palm.add(omniHud.group);

const POSES = {
  PresentPalmHologram: { wP: 0.05, nR: 0.0, rSP: -1.15, rSR: 0.0, rEP: -0.55, lSP: 0.1, lSR: 0.1, msg: 'Quest 3 Passthrough Omni-Tool Ready!' },
  CyberClippyLean: { wP: 0.28, nR: 0.32, rSP: -0.65, rSR: -0.2, rEP: -1.0, lSP: 0.2, lSR: 0.15, msg: 'Looks like you are writing Rust! Need help?' },
  ItalianShrug: { wP: -0.05, nR: -0.2, rSP: -0.45, rSR: -0.65, rEP: -1.25, lSP: -0.45, lSR: 0.65, msg: 'Why use 1 monitor when Quest 3 gives you 5?' },
  FriendlyWave: { wP: 0.0, nR: 0.18, rSP: -1.55, rSR: -0.45, rEP: -0.9, lSP: 0.1, lSR: 0.1, msg: 'Hey Kanka! Welcome to Augmented Reality!' }
};
let target = POSES.PresentPalmHologram;
let audioCtx = null;
function playRobotVoice(idx) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const notes = [[440, 587, 880], [523, 659, 1046], [392, 330, 523], [659, 784, 1174]][idx % 4];
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = i === 1 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.08);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, audioCtx.currentTime + i * 0.08 + 0.07);
      gain.gain.setValueAtTime(0.18, audioCtx.currentTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.08 + 0.075);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + i * 0.08);
      osc.stop(audioCtx.currentTime + i * 0.08 + 0.08);
    });
  } catch (_) {}
}

window.setJimmyGesture = (name) => {
  target = POSES[name] || POSES.PresentPalmHologram;
  omniHud.updateText(name, target.msg);
  document.getElementById('telemetry').textContent = `[LLM Speech]: "${target.msg}"`;
  playRobotVoice(NAMES.indexOf(name));
  if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(target.msg)); }
};
window.setJimmyGesture('PresentPalmHologram');

renderer.setAnimationLoop((t) => {
  const s = 0.08;
  jimmy.waistPivot.rotation.x += (target.wP - jimmy.waistPivot.rotation.x) * s;
  jimmy.neckPivot.rotation.z += (target.nR - jimmy.neckPivot.rotation.z) * s;
  jimmy.rightArm.sh.rotation.x += (target.rSP - jimmy.rightArm.sh.rotation.x) * s;
  jimmy.rightArm.sh.rotation.z += (target.rSR - jimmy.rightArm.sh.rotation.z) * s;
  jimmy.rightArm.elbow.rotation.x += (target.rEP - jimmy.rightArm.elbow.rotation.x) * s;
  jimmy.leftArm.sh.rotation.x += (target.lSP - jimmy.leftArm.sh.rotation.x) * s;
  jimmy.leftArm.sh.rotation.z += (target.lSR - jimmy.leftArm.sh.rotation.z) * s;
  omniHud.core.rotation.y = t * 0.0025;
  omniHud.ring.rotation.z = -t * 0.0018;
  omniHud.screen.lookAt(camera.position);
  renderer.render(scene, camera);
});
