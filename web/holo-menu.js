import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function createSpatialHoloMenu(names) {
  const menuGroup = new THREE.Group();
  menuGroup.position.set(-0.34, 0.28, 0.12);
  menuGroup.rotation.y = 0.28;
  const buttons = [];

  names.forEach((name, idx) => {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 64;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(2, 2, 252, 60);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 56);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(name.replace(/([A-Z])/g, ' $1').trim(), 16, 38);

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.18, 0.044),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, side: THREE.DoubleSide })
    );
    mesh.position.y = (2.0 - idx) * 0.052;
    mesh.userData.gestureName = name;
    menuGroup.add(mesh);
    buttons.push(mesh);
  });

  const makeLaser = () => {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1.2)]);
    return new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xf59e0b }));
  };
  return { menuGroup, buttons, makeLaser };
}
