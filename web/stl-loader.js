import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { STLLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/STLLoader.js';

export function setupCadStlOverlay(jimmy) {
  const loader = new STLLoader();
  const group = new THREE.Group();
  group.visible = false;
  jimmy.waistPivot.add(group);
  let loaded = false;

  const cadMat = new THREE.MeshPhysicalMaterial({
    color: 0x38bdf8,
    roughness: 0.2,
    metalness: 0.3,
    wireframe: true,
    transparent: true,
    opacity: 0.65
  });

  function loadOnce() {
    if (loaded) return;
    loaded = true;
    loader.load('../cad/stl/03_torso_armor_shell.stl', (geo) => {
      const m = new THREE.Mesh(geo, cadMat);
      m.scale.setScalar(0.001);
      m.rotation.x = -Math.PI / 2;
      group.add(m);
    });
    loader.load('../cad/stl/04_cyber_clippy_head_visor.stl', (geo) => {
      const m = new THREE.Mesh(geo, cadMat);
      m.scale.setScalar(0.001);
      m.rotation.x = -Math.PI / 2;
      m.position.y = 0.142;
      group.add(m);
    });
  }

  function toggle() {
    loadOnce();
    group.visible = !group.visible;
    return group.visible;
  }
  return { group, toggle };
}
