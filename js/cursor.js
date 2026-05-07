/* cursor.js — particle trail following the cursor */
(function () {
  var canvas, ctx, W, H, RAF;
  var particles = [];
  var mouse = { x: -9999, y: -9999 };

  function init() {
    canvas = document.createElement('canvas');
    canvas.id = 'cursor-trail-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    loop();
  }

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function onMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    var count = Math.floor(Math.random() * 2) + 1;
    for (var i = 0; i < count; i++) {
      spawnParticle(
        mouse.x + (Math.random() - 0.5) * 5,
        mouse.y + (Math.random() - 0.5) * 5
      );
    }
  }

  function spawnParticle(x, y) {
    var r = Math.random();
    /* blue, cyan, or purple hue */
    var hue = r > 0.6 ? 213 : r > 0.3 ? 185 : 270;
    particles.push({
      x: x,
      y: y,
      r: Math.random() * 2.8 + 1.2,
      life: 1,
      decay: Math.random() * 0.05 + 0.025,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7 - 0.25,
      hue: hue,
    });
  }

  function loop() {
    RAF = requestAnimationFrame(loop);
    if (!particles.length) return;

    ctx.clearRect(0, 0, W, H);

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.life -= p.decay;
      p.x += p.vx;
      p.y += p.vy;

      if (p.life <= 0) { particles.splice(i, 1); continue; }

      var alpha  = p.life * 0.55;
      var radius = p.r * p.life;

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
      g.addColorStop(0, 'hsla(' + p.hue + ',100%,75%,' + alpha + ')');
      g.addColorStop(1, 'hsla(' + p.hue + ',100%,60%,0)');
      ctx.fillStyle = g;
      ctx.fill();
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    /* Only on pointer-capable (non-touch-only) devices */
    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
      init();
    }
  });
})();
