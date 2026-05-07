/* ----------------------------------------------------------
   HERO CANVAS — connected particles reacting to mouse
   (index.html only)
---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  var heroCanvas = document.getElementById('hero-canvas');
  if (!heroCanvas) return;

  var ctx = heroCanvas.getContext('2d');
  var mouse = { x: -9999, y: -9999 };
  var particles = [];
  var PARTICLE_COUNT = 70;
  var MAX_DIST = 140;
  var MOUSE_DIST = 180;

  function resize() {
    heroCanvas.width  = heroCanvas.offsetWidth;
    heroCanvas.height = heroCanvas.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  for (var i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x:  Math.random() * heroCanvas.width,
      y:  Math.random() * heroCanvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 1.5 + 0.8,
      tx: null, ty: null,
    });
  }

  var formActive = false;
  var formColor  = 'rgba(34,211,238,';

  function sampleText(text, maxPoints) {
    var off = document.createElement('canvas');
    var w = heroCanvas.width || 600;
    var h = heroCanvas.height || 400;
    off.width = w; off.height = h;
    var octx = off.getContext('2d');
    octx.fillStyle = '#fff';
    var fontSize = Math.min(180, Math.max(80, w * 0.18));
    octx.font = 'bold ' + fontSize + 'px JetBrains Mono, monospace';
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.fillText(text, w / 2, h / 2);
    var data = octx.getImageData(0, 0, w, h).data;
    var pts = [];
    var step = Math.max(4, Math.floor(Math.sqrt(w * h / (maxPoints * 1.6))));
    for (var y = 0; y < h; y += step) {
      for (var x = 0; x < w; x += step) {
        var idx = (y * w + x) * 4;
        if (data[idx + 3] > 128) pts.push([x, y]);
      }
    }
    for (var k = pts.length - 1; k > 0; k--) {
      var j = Math.floor(Math.random() * (k + 1));
      var tmp = pts[k]; pts[k] = pts[j]; pts[j] = tmp;
    }
    return pts;
  }

  function formWord(text, color) {
    var pts = sampleText(text, particles.length);
    formActive = true;
    formColor = color || 'rgba(34,211,238,';
    particles.forEach(function (p, i) {
      var t = pts[i % pts.length];
      if (t) { p.tx = t[0]; p.ty = t[1]; }
    });
  }
  function releaseWord() {
    formActive = false;
    particles.forEach(function (p) {
      p.tx = null; p.ty = null;
      p.vx = (Math.random() - 0.5) * 0.35;
      p.vy = (Math.random() - 0.5) * 0.35;
    });
  }

  function timeWord() {
    var h = new Date().getHours();
    if (h < 6)  return 'ZZZ';
    if (h < 12) return 'GM';
    if (h < 18) return 'HI';
    if (h < 21) return 'PM';
    return 'NIGHT';
  }

  var WORDS = [
    { sel: 'a[href="about.html"]',     word: timeWord() },
    { sel: 'a[href="projects.html"]',  word: '</>'      },
    { sel: 'a[href$="cv-alfredo-ibanez.pdf"]', word: 'CV' },
  ];
  document.querySelectorAll('.hero-actions a, .hero-actions .btn').forEach(function (btn) {
    var match = WORDS.find(function (w) { return btn.matches(w.sel); });
    if (!match) return;
    btn.addEventListener('mouseenter', function () { formWord(match.word, 'rgba(34,211,238,'); });
    btn.addEventListener('mouseleave', releaseWord);
  });

  heroCanvas.addEventListener('mousemove', function (e) {
    var rect = heroCanvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  heroCanvas.addEventListener('mouseleave', function () {
    mouse.x = -9999; mouse.y = -9999;
  });
  heroCanvas.style.pointerEvents = 'auto';

  function drawParticles() {
    ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);

    particles.forEach(function (p) {
      if (formActive && p.tx !== null) {
        p.x += (p.tx - p.x) * 0.12;
        p.y += (p.ty - p.y) * 0.12;
      } else {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = heroCanvas.width;
        if (p.x > heroCanvas.width)  p.x = 0;
        if (p.y < 0) p.y = heroCanvas.height;
        if (p.y > heroCanvas.height) p.y = 0;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, formActive ? p.r * 1.4 : p.r, 0, Math.PI * 2);
      ctx.fillStyle = formActive ? formColor + '0.85)' : 'rgba(59,130,246,0.55)';
      ctx.fill();
    });

    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var dx = particles[a].x - particles[b].x;
        var dy = particles[a].y - particles[b].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = 'rgba(37,99,235,' + (1 - dist / MAX_DIST) * 0.25 + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
      var mdx = particles[a].x - mouse.x;
      var mdy = particles[a].y - mouse.y;
      var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < MOUSE_DIST) {
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = 'rgba(34,211,238,' + (1 - mdist / MOUSE_DIST) * 0.55 + ')';
        ctx.lineWidth = 0.9;
        ctx.stroke();
      }
    }

    requestAnimationFrame(drawParticles);
  }
  drawParticles();
});
