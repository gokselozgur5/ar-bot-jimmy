import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

function parseAsciiStl(text) {
  const verts = [];
  const re = /vertex\s+([\d.eE+-]+)\s+([\d.eE+-]+)\s+([\d.eE+-]+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    verts.push(parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]));
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
  geo.computeVertexNormals();
  return geo;
}

export function setupCadStlOverlay(jimmy) {
  const group = new THREE.Group();
  group.visible = false;
  jimmy.waistPivot.add(group);
  let loaded = false;
  const cadMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.55 });

  async function loadOnce() {
    if (loaded) return;
    loaded = true;
    try {
      const [torsoTxt, headTxt] = await Promise.all([
        fetch('../cad/stl/03_torso_armor_shell.stl').then((r) => r.text()),
        fetch('../cad/stl/04_cyber_clippy_head_visor.stl').then((r) => r.text())
      ]);
      const torsoMesh = new THREE.Mesh(parseAsciiStl(torsoTxt), cadMat);
      torsoMesh.scale.setScalar(0.001); torsoMesh.rotation.x = -Math.PI / 2;
      const headMesh = new THREE.Mesh(parseAsciiStl(headTxt), cadMat);
      headMesh.scale.setScalar(0.001); headMesh.rotation.x = -Math.PI / 2; headMesh.position.y = 0.142;
      group.add(torsoMesh, headMesh);
    } catch (_) {}
  }

  function toggle() {
    loadOnce();
    group.visible = !group.visible;
    return group.visible;
  }
  return { group, toggle };
}
