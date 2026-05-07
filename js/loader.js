/* ----------------------------------------------------------
   LOADING SCREEN (index.html only, every visit)
---------------------------------------------------------- */
(function () {
  var loader = document.getElementById('loader');
  if (!loader) return;
  /* Galaxy intro takes over — hide loader and bail; overflow managed by galaxy.js */
  if (document.getElementById('galaxy-overlay')) {
    loader.classList.add('loaded');
    return;
  }

  var linesContainer = document.getElementById('loader-lines');
  var bar = document.getElementById('loader-bar');
  document.body.style.overflow = 'hidden';

  var bootStart = Date.now();
  function ts() {
    var elapsed = (Date.now() - bootStart) / 1000;
    var s = elapsed.toFixed(6);
    while (s.length < 9) s = ' ' + s;
    return '[ ' + s + ']';
  }

  var steps = [
    { kind: 'ok',   svc: 'Mounted /home/alfredo/portfolio',                pct: 6,   delay: 0    },
    { kind: 'ok',   svc: 'Started systemd-resolved.service',                pct: 14,  delay: 530  },
    { kind: 'ok',   svc: 'Reached target Network Online',                   pct: 22,  delay: 1100 },
    { kind: 'ok',   svc: 'Started fonts.service · Cormorant · DM Sans · JetBrains Mono',  pct: 34,  delay: 1750 },
    { kind: 'ok',   svc: 'Started canvas.service · particles=70',           pct: 46,  delay: 2400 },
    { kind: 'ok',   svc: 'Started reticle.service · custom cursor up',      pct: 56,  delay: 3000 },
    { kind: 'busy', svc: 'Starting curiosity.service...',                   pct: 64,  delay: 3600 },
    { kind: 'ok',   svc: 'Started curiosity.service',                       pct: 72,  delay: 4300 },
    { kind: 'ok',   svc: 'Loaded module pkgxray v0.2.2',                    pct: 82,  delay: 4800 },
    { kind: 'warn', svc: 'job for foto-perfil.jpg has been deferred',       pct: 88,  delay: 5350 },
    { kind: 'ok',   svc: 'Reached target Multi-Page Portfolio',             pct: 96,  delay: 5900 },
    { kind: 'hi',   svc: 'Welcome to maip-fred.github.io · v1.0',           pct: 100, delay: 6500 },
  ];

  function badge(kind) {
    if (kind === 'ok')   return '<span class="ld-tag ld-ok">  OK  </span>';
    if (kind === 'warn') return '<span class="ld-tag ld-warn">FAILED</span>';
    if (kind === 'busy') return '<span class="ld-tag ld-busy"> .... </span>';
    if (kind === 'hi')   return '<span class="ld-tag ld-hi">READY </span>';
    return '<span class="ld-tag">      </span>';
  }

  steps.forEach(function (s) {
    setTimeout(function () {
      var line = document.createElement('div');
      line.className = 'loader-line ' + (s.kind === 'hi' ? 'hi' : (s.kind === 'warn' ? 'warn' : (s.kind === 'ok' ? 'ok' : '')));
      line.innerHTML = '<span class="ld-ts">' + ts() + '</span> [ ' + badge(s.kind) + ' ] ' + s.svc;
      linesContainer.appendChild(line);
      var all = linesContainer.querySelectorAll('.loader-line');
      if (all.length > 8) all[0].remove();
      bar.style.width = s.pct + '%';
    }, s.delay);
  });

  setTimeout(function () {
    loader.classList.add('loaded');
    document.body.style.overflow = '';
  }, 7200);
}());
