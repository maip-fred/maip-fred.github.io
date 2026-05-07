/* ============================================================
   GALAXY.JS — Three.js universe navigator v3
   Realistic satellites · elliptical orbits · spaceship
   Trivia access system · warp loader
   ============================================================ */
(function () {
  'use strict';

  var overlay = document.getElementById('galaxy-overlay');
  if (!overlay || typeof THREE === 'undefined') return;

  var IS_MOBILE = window.innerWidth < 768 || ('ontouchstart' in window);
  var W = window.innerWidth;
  var H = window.innerHeight;

  /* ── Scene ─────────────────────────────────────────────── */
  var scene    = new THREE.Scene();
  var camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
  var renderer = new THREE.WebGLRenderer({ antialias: !IS_MOBILE, alpha: false });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, IS_MOBILE ? 1 : 2));
  renderer.setClearColor(0x010409, 1);
  overlay.appendChild(renderer.domElement);
  camera.position.set(0, 5, 44);
  camera.lookAt(0, 0, 0);

  var rotGroup = new THREE.Group();
  scene.add(rotGroup);

  /* ── Lights ─────────────────────────────────────────────── */
  scene.add(new THREE.AmbientLight(0x0d1b2a, 3.5));
  var centerLight = new THREE.PointLight(0x3B82F6, 4.0, 100);
  scene.add(centerLight);
  var sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
  sunLight.position.set(20, 30, 15);
  scene.add(sunLight);

  /* ── Nodes — bigger sz, larger elliptical orbits ─────────── */
  var NODES = [
    { name: 'AIV',       url: null,            col: 0x3B82F6, sz: 1.50, desc: 'Portfolio · Home',   orb: null },
    { name: 'Sobre mí',  url: 'about.html',    col: 0xA78BFA, sz: 0.80, desc: 'Bio · ITAM',        orb: { a:  9.0, b:  5.5, inc:  0.15, ph: 0.00, spd: 0.28 } },
    { name: 'Skills',    url: 'skills.html',   col: 0x4ADE80, sz: 0.80, desc: 'Stack · Radar',     orb: { a: 11.0, b:  6.5, inc: -0.22, ph: 1.26, spd: 0.22 } },
    { name: 'Retos',     url: 'retos.html',    col: 0xF472B6, sz: 0.75, desc: 'Desafíos · CTF',    orb: { a: 12.5, b:  7.5, inc:  0.30, ph: 2.51, spd: 0.30 } },
    { name: 'Proyectos', url: 'projects.html', col: 0xFCD34D, sz: 0.80, desc: 'pkgxray · DataViz', orb: { a: 14.5, b:  9.0, inc: -0.10, ph: 3.77, spd: 0.18 } },
    { name: 'Contacto',  url: 'contact.html',  col: 0x22D3EE, sz: 0.75, desc: 'Form · Cal.com',    orb: { a: 13.0, b:  8.0, inc:  0.40, ph: 5.03, spd: 0.32 } },
    { name: 'DataViz',   url: 'dataviz.html',  col: 0x96C174, sz: 0.75, desc: 'Leaflet · D3 · R',  orb: { a: 16.5, b: 10.5, inc: -0.35, ph: 0.94, spd: 0.15 } },
    { name: 'Universo',  url: 'universo.html', col: 0xB8892A, sz: 0.70, desc: 'Libros · Podcasts', orb: { a: 17.5, b: 11.0, inc:  0.20, ph: 2.20, spd: 0.20 } },
    { name: 'Build',     url: 'build.html',    col: 0xF97316, sz: 0.70, desc: 'Timeline · Stack',  orb: { a: 18.5, b: 11.5, inc: -0.28, ph: 4.40, spd: 0.25 } },
  ];

  /* ── Trivia pool ─────────────────────────────────────────── */
  var TRIVIA = [
    { q: '¿Cuánto es log₂(64)?',                          opts: ['4','6','8','16'],                                                                                              ans: 1 },
    { q: 'La mediana de {1, 3, 5, 7, 9} es:',             opts: ['3','4','5','6'],                                                                                               ans: 2 },
    { q: 'Librería estándar de Python para DataFrames:',   opts: ['NumPy','Matplotlib','pandas','sklearn'],                                                                       ans: 2 },
    { q: 'La derivada de f(x) = x³ es:',                  opts: ['x²','2x²','3x²','3x'],                                                                                        ans: 2 },
    { q: '"Overfitting" ocurre cuando el modelo:',         opts: ['Memoriza el train y falla en datos nuevos','Es demasiado simple','Predice fuera de rango','Tiene bajo error'], ans: 0 },
    { q: '¿Cuánto es √144?',                               opts: ['11','12','13','14'],                                                                                           ans: 1 },
    { q: 'En SQL, GROUP BY sirve para:',                   opts: ['Ordenar filas','Agrupar por valor de columna','Filtrar duplicados','Unir tablas'],                             ans: 1 },
    { q: 'La varianza mide:',                              opts: ['El valor más frecuente','La dispersión cuadrática respecto a la media','La correlación','El percentil 50'],    ans: 1 },
    { q: '¿Cuánto es 5! (cinco factorial)?',               opts: ['20','60','120','720'],                                                                                         ans: 2 },
    { q: 'Un árbol de decisión divide nodos usando:',      opts: ['Gradiente descendente','Backpropagation','Ganancia de información / Gini','Estimación bayesiana'],             ans: 2 },
    { q: 'El número de Euler e ≈',                         opts: ['2.71','3.14','1.73','2.58'],                                                                                   ans: 0 },
    { q: 'Regresión logística produce como salida:',       opts: ['Un valor continuo','Una probabilidad entre 0 y 1','Un cluster','Una distancia euclidiana'],                    ans: 1 },
  ];

  /* ── Stars ──────────────────────────────────────────────── */
  (function () {
    function makeStars(n, rMin, rMax, col, sz, op) {
      var pos = new Float32Array(n * 3);
      for (var i = 0; i < n; i++) {
        var r  = rMin + Math.random() * (rMax - rMin);
        var th = Math.random() * Math.PI * 2;
        var ph = Math.acos(2 * Math.random() - 1);
        pos[i*3]   = r * Math.sin(ph) * Math.cos(th);
        pos[i*3+1] = r * Math.sin(ph) * Math.sin(th);
        pos[i*3+2] = r * Math.cos(ph);
      }
      var geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      scene.add(new THREE.Points(geo, new THREE.PointsMaterial({
        color: col, size: sz, transparent: true, opacity: op, sizeAttenuation: true
      })));
    }
    makeStars(IS_MOBILE ? 1200 : 2500, 80,  200, 0xffffff, 0.17, 0.55);
    makeStars(IS_MOBILE ?  500 : 1000, 160, 220, 0xaabbff, 0.09, 0.35);
    makeStars(IS_MOBILE ?  200 :  600,  90, 160, 0xffeecc, 0.22, 0.18);
  }());

  /* ── Orbit point ────────────────────────────────────────── */
  function orbitPt(nd, t) {
    var x  = nd.orb.a * Math.cos(t);
    var zr = nd.orb.b * Math.sin(t);
    return new THREE.Vector3(x, zr * Math.sin(nd.orb.inc), zr * Math.cos(nd.orb.inc));
  }

  /* ── Build satellite groups ─────────────────────────────── */
  var satGroups = [];
  var labelEls  = [];
  var hitMeshes = [];

  NODES.forEach(function (nd, i) {
    var group = new THREE.Group();
    group.userData.idx         = i;
    group.userData.scaleTarget = 1.0;

    if (i === 0) {
      /* Central hub */
      var seg = IS_MOBILE ? 24 : 48;
      var hub = new THREE.Mesh(
        new THREE.SphereGeometry(nd.sz, seg, seg),
        new THREE.MeshStandardMaterial({ color: nd.col, emissive: nd.col, emissiveIntensity: 0.55, roughness: 0.22, metalness: 0.68 })
      );
      hub.userData.satIdx = 0;
      group.add(hub);
      hitMeshes.push(hub);

      if (!IS_MOBILE) {
        var hubRing = new THREE.Mesh(
          new THREE.TorusGeometry(nd.sz * 1.75, 0.025, 8, 80),
          new THREE.MeshBasicMaterial({ color: nd.col, transparent: true, opacity: 0.25 })
        );
        hubRing.rotation.x = Math.PI / 2;
        group.add(hubRing);
        [2.1, 3.6, 5.5].forEach(function (s, li) {
          group.add(new THREE.Mesh(
            new THREE.SphereGeometry(nd.sz * s, 12, 12),
            new THREE.MeshBasicMaterial({ color: nd.col, transparent: true, opacity: [0.065,0.025,0.010][li], side: THREE.BackSide })
          ));
        });
      }

    } else {
      /* Satellite: body + panels + antenna + blink */
      var bw = nd.sz * 0.9, bh = nd.sz * 0.6, bd = nd.sz * 0.7;

      var body = new THREE.Mesh(
        new THREE.BoxGeometry(bw, bh, bd),
        new THREE.MeshStandardMaterial({ color: 0xb0c0d0, emissive: nd.col, emissiveIntensity: 0.10, roughness: 0.30, metalness: 0.85 })
      );
      body.userData.satIdx = i;
      group.add(body);
      hitMeshes.push(body);
      group.userData.bodyMesh = body;

      /* Solar panels */
      var pw = nd.sz * 1.85, ph = nd.sz * 0.52;
      var panelMat = new THREE.MeshStandardMaterial({ color: 0x1a2e5a, emissive: 0x1a50aa, emissiveIntensity: 0.38, roughness: 0.5, metalness: 0.6 });
      var panelGeo = new THREE.BoxGeometry(pw, ph, 0.032);
      var lPanel   = new THREE.Mesh(panelGeo, panelMat);
      lPanel.position.x = -(bw / 2 + pw / 2 + 0.07);
      group.add(lPanel);
      var rPanel = new THREE.Mesh(panelGeo, panelMat);
      rPanel.position.x = bw / 2 + pw / 2 + 0.07;
      group.add(rPanel);

      /* Panel grid rods */
      var rodMat = new THREE.MeshBasicMaterial({ color: 0x4488cc });
      [-pw * 0.33, 0, pw * 0.33].forEach(function (ox) {
        var rg = new THREE.BoxGeometry(0.022, ph * 1.02, 0.06);
        var r1 = new THREE.Mesh(rg, rodMat); r1.position.x = lPanel.position.x + ox; group.add(r1);
        var r2 = new THREE.Mesh(rg, rodMat); r2.position.x = rPanel.position.x + ox; group.add(r2);
      });

      /* Antenna mast */
      var mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, nd.sz * 0.60, 6),
        new THREE.MeshStandardMaterial({ color: 0x999aaa, roughness: 0.4, metalness: 0.9 })
      );
      mast.position.y = bh / 2 + nd.sz * 0.30;
      group.add(mast);

      /* Dish */
      var dish = new THREE.Mesh(
        new THREE.ConeGeometry(nd.sz * 0.22, nd.sz * 0.30, 14, 1, true),
        new THREE.MeshStandardMaterial({ color: 0xdddddd, emissive: nd.col, emissiveIntensity: 0.25, roughness: 0.25, metalness: 0.92, side: THREE.DoubleSide })
      );
      dish.position.y = bh / 2 + nd.sz * 0.65;
      dish.rotation.x = Math.PI;
      group.add(dish);

      /* Glow halo */
      group.add(new THREE.Mesh(
        new THREE.SphereGeometry(nd.sz * 1.6, 10, 10),
        new THREE.MeshBasicMaterial({ color: nd.col, transparent: true, opacity: 0.055, side: THREE.BackSide })
      ));

      /* Nav blink light */
      var blink = new THREE.Mesh(
        new THREE.SphereGeometry(0.065, 6, 6),
        new THREE.MeshBasicMaterial({ color: nd.col, transparent: true, opacity: 1.0 })
      );
      blink.position.set(0, -(bh / 2 + 0.05), 0);
      blink.userData.isBlink = true;
      group.add(blink);
    }

    if (nd.orb) group.position.copy(orbitPt(nd, nd.orb.ph));
    rotGroup.add(group);
    satGroups.push(group);

    var lbl = document.createElement('div');
    lbl.className = 'galaxy-label' + (i === 0 ? ' center-label' : '');
    lbl.innerHTML = '<span class="gl-name">' + nd.name + '</span>'
                  + '<span class="gl-desc">'  + nd.desc  + '</span>';
    overlay.appendChild(lbl);
    labelEls.push(lbl);
  });

  /* ── Orbit rings ─────────────────────────────────────────── */
  NODES.forEach(function (nd) {
    if (!nd.orb) return;
    var pts = [];
    for (var k = 0; k <= 128; k++) pts.push(orbitPt(nd, (k / 128) * Math.PI * 2));
    rotGroup.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: nd.col, transparent: true, opacity: 0.10 })
    ));
  });

  /* ── Connection lines ────────────────────────────────────── */
  var connLines = [];
  NODES.slice(1).forEach(function (nd, i) {
    var pa  = new Float32Array(6);
    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pa, 3).setUsage(THREE.DynamicDrawUsage));
    var line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: nd.col, transparent: true, opacity: 0.08 }));
    rotGroup.add(line);
    connLines.push({ line: line, ti: i + 1 });
  });

  /* ── Spaceship ──────────────────────────────────────────── */
  var ship = (function () {
    var g = new THREE.Group();
    var fuse = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.27, 1.05, 10),
      new THREE.MeshStandardMaterial({ color: 0xaabccc, roughness: 0.28, metalness: 0.92 })
    );
    fuse.rotation.x = Math.PI / 2;
    g.add(fuse);

    var nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.11, 0.42, 10),
      new THREE.MeshStandardMaterial({ color: 0xccddee, roughness: 0.18, metalness: 0.97 })
    );
    nose.rotation.x = Math.PI / 2;
    nose.position.z = -0.73;
    g.add(nose);

    var wingMat = new THREE.MeshStandardMaterial({ color: 0x556677, roughness: 0.35, metalness: 0.85 });
    var wL = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.055, 0.50), wingMat);
    wL.position.set(-0.65, 0, 0.18); wL.rotation.y =  0.18; g.add(wL);
    var wR = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.055, 0.50), wingMat);
    wR.position.set( 0.65, 0, 0.18); wR.rotation.y = -0.18; g.add(wR);

    var fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.055, 0.36, 0.34),
      new THREE.MeshStandardMaterial({ color: 0x7799aa, roughness: 0.4, metalness: 0.8 })
    );
    fin.position.set(0, 0.20, 0.28);
    g.add(fin);

    var eng = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.75 })
    );
    eng.position.z = 0.58;
    eng.userData.isEngine = true;
    g.add(eng);

    var thrustRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.12, 0.025, 6, 16),
      new THREE.MeshStandardMaterial({ color: 0x334455, roughness: 0.5, metalness: 0.9 })
    );
    thrustRing.rotation.x = Math.PI / 2;
    thrustRing.position.z = 0.54;
    g.add(thrustRing);

    g.scale.setScalar(1.3);
    g.position.set(6, -3, 12);
    scene.add(g);
    return g;
  }());

  var shipLbl = document.createElement('div');
  shipLbl.style.cssText = 'position:absolute;pointer-events:none;z-index:5;transform:translate(-50%,0);text-align:center;transition:opacity .3s;';
  shipLbl.innerHTML = '<span style="font-family:var(--f-mono);font-size:.44rem;letter-spacing:.2em;color:rgba(100,180,255,.4);text-transform:uppercase;">NAVE</span>';
  overlay.appendChild(shipLbl);

  /* ── Trivia system ───────────────────────────────────────── */
  var triviaActive = false;

  function colToHex(c) { return '#' + c.toString(16).padStart(6, '0'); }

  function showTrivia(nodeIdx) {
    if (triviaActive || navigating) return;
    triviaActive = true;

    var nd  = NODES[nodeIdx];
    var col = colToHex(nd.col);
    var q   = TRIVIA[Math.floor(Math.random() * TRIVIA.length)];
    var labels = ['A', 'B', 'C', 'D'];

    var panel = document.createElement('div');
    panel.style.cssText = [
      'position:absolute;inset:0;z-index:15;display:flex;flex-direction:column',
      'align-items:center;justify-content:center;background:rgba(1,4,9,0.88)',
      'backdrop-filter:blur(4px);padding:2rem 1.5rem;',
    ].join(';');

    var optsHTML = q.opts.map(function (opt, oi) {
      return '<button data-oi="' + oi + '" style="font-family:var(--f-mono);font-size:.62rem;'
        + 'letter-spacing:.08em;padding:.72rem 1rem;text-align:left;cursor:pointer;border-radius:4px;'
        + 'border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.04);'
        + 'color:rgba(255,255,255,.8);display:flex;align-items:flex-start;gap:.55rem;'
        + 'transition:border-color .2s,background .2s;">'
        + '<span style="color:' + col + ';flex-shrink:0;">' + labels[oi] + '</span>'
        + '<span>' + opt + '</span></button>';
    }).join('');

    panel.innerHTML = [
      '<div style="font-family:var(--f-mono);font-size:.48rem;letter-spacing:.28em;color:' + col + ';margin-bottom:.8rem;text-transform:uppercase;">⊕ ' + nd.name.toUpperCase() + ' · ACCESO REQUERIDO</div>',
      '<div style="font-family:var(--f-mono);font-size:.44rem;letter-spacing:.16em;color:rgba(255,255,255,.25);margin-bottom:1.6rem;text-transform:uppercase;">DEMUESTRA TU CONOCIMIENTO PARA ACCEDER</div>',
      '<div style="font-family:var(--f-sans);font-size:clamp(.9rem,2.4vw,1.15rem);color:#fff;text-align:center;max-width:520px;line-height:1.55;margin-bottom:1.8rem;padding:1.1rem 1.5rem;border:1px solid rgba(255,255,255,.08);border-radius:6px;background:rgba(255,255,255,.03);">' + q.q + '</div>',
      '<div class="trivia-opts" style="display:grid;grid-template-columns:1fr 1fr;gap:.7rem;max-width:520px;width:100%;">' + optsHTML + '</div>',
      '<div class="trivia-fb" style="margin-top:1.1rem;font-family:var(--f-mono);font-size:.58rem;letter-spacing:.14em;min-height:1.2rem;"></div>',
    ].join('');

    overlay.appendChild(panel);

    var optBtns = panel.querySelectorAll('button[data-oi]');
    optBtns.forEach(function (btn) {
      btn.onmouseover = function () { btn.style.borderColor = col; btn.style.background = 'rgba(255,255,255,.07)'; };
      btn.onmouseout  = function () { btn.style.borderColor = 'rgba(255,255,255,.12)'; btn.style.background = 'rgba(255,255,255,.04)'; };
      btn.onclick = function () {
        optBtns.forEach(function (b) { b.style.pointerEvents = 'none'; });
        var oi = parseInt(btn.getAttribute('data-oi'), 10);
        var fb = panel.querySelector('.trivia-fb');
        if (oi === q.ans) {
          btn.style.cssText += ';border-color:#4ade80;background:rgba(74,222,128,.12);color:#4ade80;';
          fb.textContent = '✓ CORRECTO — INICIANDO PROTOCOLO DE ACCESO';
          fb.style.color = '#4ade80';
          setTimeout(function () {
            if (panel.parentNode) overlay.removeChild(panel);
            triviaActive = false;
            showWarpLoader(nd.url, nd.col, nd.name);
          }, 850);
        } else {
          btn.style.cssText += ';border-color:#f87171;background:rgba(248,113,113,.10);color:#f87171;';
          optBtns[q.ans].style.cssText += ';border-color:#4ade80;background:rgba(74,222,128,.08);';
          fb.textContent = '✗ INCORRECTO — REGRESANDO AL ESPACIO';
          fb.style.color = '#f87171';
          setTimeout(function () {
            panel.style.transition = 'opacity .5s';
            panel.style.opacity    = '0';
            setTimeout(function () {
              if (panel.parentNode) overlay.removeChild(panel);
              triviaActive = false;
              collCd = 4.0;
            }, 520);
          }, 2200);
        }
      };
    });
  }

  /* ── Warp loader (7 s) ───────────────────────────────────── */
  function showWarpLoader(url, nodeCol, nodeName) {
    navigating = true;
    var col  = colToHex(nodeCol);
    var msgs = ['AUTENTICANDO CREDENCIALES...', 'CARGANDO MÓDULOS...', 'CONSTRUYENDO INTERFAZ...', 'OPTIMIZANDO RECURSOS...', 'LISTO'];

    var el = document.createElement('div');
    el.style.cssText = [
      'position:absolute;inset:0;z-index:18;display:flex;flex-direction:column',
      'align-items:center;justify-content:center;background:rgba(1,4,9,0.96);',
    ].join(';');
    el.innerHTML = [
      '<div style="font-family:var(--f-mono);font-size:.5rem;letter-spacing:.3em;color:' + col + ';margin-bottom:1.6rem;text-transform:uppercase;">⊕ ACCESO CONCEDIDO</div>',
      '<div style="font-family:var(--f-display);font-size:clamp(1.5rem,4vw,2.8rem);color:#fff;margin-bottom:2rem;font-weight:600;letter-spacing:-.02em;">' + nodeName + '</div>',
      '<div style="width:280px;height:2px;background:rgba(255,255,255,.07);margin-bottom:1.3rem;overflow:hidden;border-radius:1px;">',
        '<div class="wl-bar" style="height:100%;width:0%;background:' + col + ';transition:width 6.4s linear;"></div>',
      '</div>',
      '<div class="wl-msg" style="font-family:var(--f-mono);font-size:.5rem;letter-spacing:.2em;color:rgba(255,255,255,.25);text-transform:uppercase;min-height:1rem;">' + msgs[0] + '</div>',
    ].join('');
    overlay.appendChild(el);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var bar = el.querySelector('.wl-bar');
        if (bar) bar.style.width = '100%';
      });
    });

    var mi = 0;
    var msgEl = el.querySelector('.wl-msg');
    var iv = setInterval(function () {
      mi++;
      if (msgEl && mi < msgs.length) msgEl.textContent = msgs[mi];
      if (mi >= msgs.length - 1) clearInterval(iv);
    }, 1400);

    setTimeout(function () { window.location.href = url; }, 7000);
  }

  /* ── Input / core state ─────────────────────────────────── */
  var keys    = {};
  var shipVel = new THREE.Vector2(0, 0);
  var collCd  = 3.0;   /* gracia inicial: 3 s antes de activar detección de colisión */
  document.addEventListener('keydown', function (e) {
    keys[e.key] = true;
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.key) !== -1) e.preventDefault();
  });
  document.addEventListener('keyup', function (e) { keys[e.key] = false; });

  var clock      = new THREE.Clock();
  var navigating = false;
  var hoveredIdx = -1;
  var dragging   = false;
  var prevX = 0, prevY = 0, dragStartX = 0, dragStartY = 0;
  var touchStartX = 0, touchStartY = 0;
  var introProg  = 0;
  var INTRO_DUR  = 2.8;
  var mouse2D    = new THREE.Vector2(-9999, -9999);
  var raycaster  = new THREE.Raycaster();
  var worldVec   = new THREE.Vector3();

  function toScreen(pos3d) {
    var v = pos3d.clone().project(camera);
    return { x: (v.x * .5 + .5) * W, y: (-v.y * .5 + .5) * H, ok: v.z < 1.0 };
  }

  function updateOrbits(elapsed) {
    NODES.forEach(function (nd, i) {
      if (!nd.orb) return;
      var t = nd.orb.ph + elapsed * nd.orb.spd;
      satGroups[i].position.copy(orbitPt(nd, t));
      satGroups[i].rotation.y = t + Math.PI * .5;
    });
  }

  function updateLines() {
    var c = satGroups[0].position;
    connLines.forEach(function (cl) {
      var tp = satGroups[cl.ti].position;
      var pa = cl.line.geometry.attributes.position.array;
      pa[0]=c.x; pa[1]=c.y; pa[2]=c.z; pa[3]=tp.x; pa[4]=tp.y; pa[5]=tp.z;
      cl.line.geometry.attributes.position.needsUpdate = true;
    });
  }

  function updateLabels() {
    satGroups.forEach(function (g, i) {
      g.getWorldPosition(worldVec);
      var ss = toScreen(worldVec);
      var el = labelEls[i];
      if (!ss.ok) { el.style.opacity = '0'; return; }
      el.style.left = ss.x + 'px';
      if (i === 0) {
        el.style.top     = (ss.y - NODES[0].sz * 72) + 'px';
        el.style.opacity = '1';
      } else {
        el.style.top     = (ss.y + NODES[i].sz * 62 + 8) + 'px';
        el.style.opacity = (i === hoveredIdx ? '1' : '0.16');
      }
    });
    var ss = toScreen(ship.position);
    if (ss.ok) { shipLbl.style.left = ss.x + 'px'; shipLbl.style.top = (ss.y - 30) + 'px'; shipLbl.style.opacity = '1'; }
    else shipLbl.style.opacity = '0';
  }

  function checkHover() {
    if (navigating) return;
    raycaster.setFromCamera(mouse2D, camera);
    var hits  = raycaster.intersectObjects(hitMeshes);
    var prev  = hoveredIdx;
    hoveredIdx = hits.length > 0 ? (hits[0].object.userData.satIdx || 0) : -1;
    renderer.domElement.style.cursor = hoveredIdx >= 0 ? 'pointer' : 'crosshair';
    if (hoveredIdx !== prev) {
      satGroups.forEach(function (g, i) { g.userData.scaleTarget = (i === hoveredIdx ? 1.28 : 1.0); });
    }
  }

  /* ── Ship ───────────────────────────────────────────────── */
  var ACCEL = 0.22, DRAG = 0.88, MAXV = 0.25;

  function updateShip(dt, elapsed) {
    if (triviaActive || navigating) return;
    if (keys['ArrowLeft']  || keys['a']) shipVel.x -= ACCEL * dt;
    if (keys['ArrowRight'] || keys['d']) shipVel.x += ACCEL * dt;
    if (keys['ArrowUp']    || keys['w']) shipVel.y += ACCEL * dt;
    if (keys['ArrowDown']  || keys['s']) shipVel.y -= ACCEL * dt;

    shipVel.multiplyScalar(DRAG);
    if (shipVel.length() > MAXV) shipVel.normalize().multiplyScalar(MAXV);

    ship.position.x += shipVel.x;
    ship.position.y += shipVel.y;
    ship.rotation.z  = -shipVel.x * 4.2;
    ship.rotation.x  =  shipVel.y * 2.5;

    ship.traverse(function (c) {
      if (c.userData.isEngine)
        c.material.opacity = 0.45 + shipVel.length() * 1.8 + Math.sin(elapsed * 9) * 0.15;
    });

    if (collCd > 0) { collCd -= dt; return; }

    var shipSS = toScreen(ship.position);
    if (!shipSS.ok) return;

    for (var i = 1; i < satGroups.length; i++) {
      satGroups[i].getWorldPosition(worldVec);
      var satSS = toScreen(worldVec);
      if (!satSS.ok) continue;
      var dx = shipSS.x - satSS.x, dy = shipSS.y - satSS.y;
      if (Math.sqrt(dx * dx + dy * dy) < 90) {
        collCd = 0.5;
        showTrivia(i);
        shipVel.multiplyScalar(-0.6);
        break;
      }
    }
  }

  /* ── Navigation (click) — trivia solo vía nave espacial ──── */
  function navigateTo(idx) {
    if (navigating || triviaActive) return;
    var nd = NODES[idx];
    if (!nd.url) { dismissGalaxy(); return; }
    showWarpLoader(nd.url, nd.col, nd.name);
  }

  /* ── Dismiss galaxy ─────────────────────────────────────────
     En galaxy.html: navega a index.html tras el fade.
     En index.html (legacy): oculta el overlay y muestra contenido.
  ──────────────────────────────────────────────────────────── */
  var _onGalaxyPage = window.location.pathname.indexOf('galaxy.html') !== -1;

  function dismissGalaxy() {
    navigating = true;
    overlay.style.transition = 'opacity .72s ease, transform .72s ease';
    overlay.style.opacity    = '0';
    overlay.style.transform  = 'scale(1.04)';
    setTimeout(function () {
      if (_onGalaxyPage) {
        window.location.href = 'index.html?from=galaxy';
      } else {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        window.scrollTo(0, 0);
      }
    }, 730);
  }

  /* ── Events ─────────────────────────────────────────────── */
  var cvs = renderer.domElement;
  cvs.addEventListener('mousemove', function (e) {
    mouse2D.set((e.clientX / W) * 2 - 1, -(e.clientY / H) * 2 + 1);
    if (dragging) {
      rotGroup.rotation.y += (e.clientX - prevX) * 0.0045;
      rotGroup.rotation.x += (e.clientY - prevY) * 0.0028;
      rotGroup.rotation.x  = Math.max(-.55, Math.min(.55, rotGroup.rotation.x));
      prevX = e.clientX; prevY = e.clientY;
    }
  });
  cvs.addEventListener('mousedown', function (e) {
    dragging = true; prevX = dragStartX = e.clientX; prevY = dragStartY = e.clientY;
  });
  cvs.addEventListener('mouseup', function (e) {
    var d = Math.abs(e.clientX - dragStartX) + Math.abs(e.clientY - dragStartY);
    dragging = false;
    if (d < 6 && hoveredIdx >= 0) navigateTo(hoveredIdx);
  });
  cvs.addEventListener('mouseleave', function () { dragging = false; });

  cvs.addEventListener('touchstart', function (e) {
    var t = e.touches[0]; touchStartX = prevX = t.clientX; touchStartY = prevY = t.clientY;
    dragging = true; e.preventDefault();
  }, { passive: false });
  cvs.addEventListener('touchmove', function (e) {
    var t = e.touches[0];
    rotGroup.rotation.y += (t.clientX - prevX) * 0.0045;
    rotGroup.rotation.x += (t.clientY - prevY) * 0.0028;
    rotGroup.rotation.x  = Math.max(-.55, Math.min(.55, rotGroup.rotation.x));
    prevX = t.clientX; prevY = t.clientY; e.preventDefault();
  }, { passive: false });
  cvs.addEventListener('touchend', function (e) {
    dragging = false;
    var t = e.changedTouches[0];
    var d = Math.abs(t.clientX - touchStartX) + Math.abs(t.clientY - touchStartY);
    if (d < 8) {
      mouse2D.set((t.clientX / W) * 2 - 1, -(t.clientY / H) * 2 + 1);
      raycaster.setFromCamera(mouse2D, camera);
      var hits = raycaster.intersectObjects(hitMeshes);
      if (hits.length > 0) navigateTo(hits[0].object.userData.satIdx || 0);
    }
    e.preventDefault();
  }, { passive: false });

  var enterBtn = document.getElementById('galaxy-enter');
  if (enterBtn) enterBtn.addEventListener('click', dismissGalaxy);

  /* Nav accesible sobre la galaxia ─────────────────────────── */
  var hdr = document.getElementById('header');
  if (hdr) hdr.style.zIndex = '100001';

  /* "Inicio" en el nav descarta la galaxia (no recarga la página) */
  document.querySelectorAll('a[href="index.html"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (!navigating && overlay.style.display !== 'none') {
        e.preventDefault();
        e.stopImmediatePropagation();
        dismissGalaxy();
      }
    });
  });

  window.addEventListener('resize', function () {
    W = window.innerWidth; H = window.innerHeight;
    camera.aspect = W / H; camera.updateProjectionMatrix(); renderer.setSize(W, H);
  });

  /* ── Animation loop ─────────────────────────────────────── */
  function animate() {
    requestAnimationFrame(animate);
    var dt      = Math.min(clock.getDelta(), 0.05);
    var elapsed = clock.getElapsedTime();

    if (introProg < 1) {
      introProg = Math.min(introProg + dt / INTRO_DUR, 1);
      var ease  = 1 - Math.pow(1 - introProg, 3);
      camera.position.z = 44 - (44 - 26) * ease;
      camera.position.y = 5  - 5  * ease;
    }

    if (!dragging && !triviaActive) rotGroup.rotation.y += 0.0014;
    centerLight.intensity = 3.8 + Math.sin(elapsed * 1.2) * 0.55;

    satGroups.forEach(function (g) {
      var s = g.userData.scaleTarget || 1.0;
      g.scale.setScalar(g.scale.x + (s - g.scale.x) * 0.10);
      g.traverse(function (c) {
        if (c.userData.isBlink) c.material.opacity = (Math.floor(elapsed * 1.5) % 2 === 0) ? 0.9 : 0.05;
      });
    });

    if (!IS_MOBILE) updateShip(dt, elapsed);
    updateOrbits(elapsed);
    updateLines();
    checkHover();
    updateLabels();
    renderer.render(scene, camera);
  }

  var hint = document.getElementById('galaxy-hint');
  if (hint && !IS_MOBILE) hint.textContent = 'ARRASTRA · CLICK EN NODO · ← → ↑ ↓  PILOTA LA NAVE';

  document.body.style.overflow = 'hidden';
  animate();

}());
