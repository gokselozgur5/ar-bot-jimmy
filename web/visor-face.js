import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export function createVisorFace() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  let expr = 'PresentPalmHologram';
  let speakUntil = 0;

  function render(timeMs) {
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, 256, 160);
    const blink = (timeMs % 3400) < 130 ? 0.12 : 1.0;
    const leftH = (expr === 'CyberClippyLean' ? 46 : 36) * blink;
    const rightH = (expr === 'CyberClippyLean' ? 24 : 36) * blink;

    ctx.fillStyle = '#38bdf8';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.roundRect(44, 62 - leftH / 2, 56, leftH, 12);
    ctx.roundRect(156, 62 - rightH / 2, 56, rightH, 12);
    ctx.fill();

    if (expr === 'CyberClippyLean') {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(40, 26); ctx.lineTo(104, 18);
      ctx.moveTo(152, 34); ctx.lineTo(214, 42);
      ctx.stroke();
    }
    if (timeMs < speakUntil) {
      ctx.fillStyle = '#fbbf24';
      for (let i = 0; i < 7; i++) {
        const h = 6 + Math.abs(Math.sin(timeMs * 0.025 + i)) * 18;
        ctx.fillRect(76 + i * 16, 126 - h / 2, 10, h);
      }
    }
    texture.needsUpdate = true;
  }
  return {
    texture,
    setExpression: (e, now = performance.now()) => { expr = e; speakUntil = now + 1800; },
    update: render
  };
}
