/* ----------------------------------------------------------
   HERO TERMINAL — interactive (index.html only)
---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  var heroTermBody = document.getElementById('hero-term-body');
  if (!heroTermBody) return;

  var PROMPT = 'aiv@portfolio:~$ ';
  var history = [];
  var historyIdx = -1;

  function ht_appendLine(cls, text) {
    var el = document.createElement('div');
    el.className = 'tw-line ' + (cls || '');
    el.textContent = text;
    heroTermBody.appendChild(el);
    heroTermBody.scrollTop = heroTermBody.scrollHeight;
    return el;
  }
  function ht_appendHTML(cls, html) {
    var el = document.createElement('div');
    el.className = 'tw-line ' + (cls || '');
    el.innerHTML = html;
    heroTermBody.appendChild(el);
    heroTermBody.scrollTop = heroTermBody.scrollHeight;
    return el;
  }

  function ht_renderPrompt() {
    var existing = heroTermBody.querySelector('.ht-active');
    if (existing) existing.remove();
    var line = document.createElement('div');
    line.className = 'tw-line ht-active';
    line.innerHTML =
      '<span class="t-prompt">' + PROMPT + '</span>' +
      '<span class="ht-typed"></span>' +
      '<span class="t-cursor"></span>';
    heroTermBody.appendChild(line);
    heroTermBody.scrollTop = heroTermBody.scrollHeight;
    return line;
  }

  var COMMANDS = {
    help: function () {
      ht_appendLine('t-info', 'Comandos disponibles:');
      [
        ['  help',                         'muestra esta ayuda'],
        ['  whoami',                        'sobre mí en una línea'],
        ['  ls',                            'lista las secciones del sitio'],
        ['  tree',                          'estructura del proyecto'],
        ['  cat <about|skills|projects|contact>', 'muestra info en el terminal'],
        ['  goto <about|skills|projects|contact|home>', 'navega a la página'],
        ['  cv',                            'descarga el CV'],
        ['  github',                        'abre github.com/maip-fred'],
        ['  pkgxray scan <paquete>',        'demo del scanner'],
        ['  ping <host>',                   'ping simulado'],
        ['  neofetch',                      'info del sistema'],
        ['  uname',                         'versión del entorno'],
        ['  pwd',                           'directorio actual'],
        ['  date',                          'fecha y hora local'],
        ['  history',                       'comandos previos'],
        ['  sudo <cmd>',                    'intenta correr como root'],
        ['  matrix',                        '???'],
        ['  clear',                         'limpia el terminal'],
      ].forEach(function (c) {
        ht_appendHTML('t-out',
          '<span style="color:var(--cyan);">' + c[0] + '</span>' +
          '<span style="color:var(--t-3);"> — ' + c[1] + '</span>');
      });
    },
    whoami: function () {
      ht_appendLine('t-out', 'alfredo-ibanez · ITAM 8° sem · Gen. 2022 · CDMX');
    },
    ls: function () {
      ht_appendHTML('t-out',
        '<span style="color:var(--blue-xl);">about/</span>  ' +
        '<span style="color:var(--blue-xl);">skills/</span>  ' +
        '<span style="color:var(--blue-xl);">projects/</span>  ' +
        '<span style="color:var(--blue-xl);">contact/</span>  ' +
        '<span style="color:var(--green);">cv.pdf</span>');
    },
    cat: function (arg) {
      if (!arg) { ht_appendLine('t-err', 'cat: missing operand'); return; }
      var k = arg.toLowerCase().replace(/\.txt$|\.md$/, '');
      var DOCS = {
        about:    [ 'Estudiante de Ciencia de Datos y Mat. Aplicadas en ITAM.',
                    'Combino matemáticas, estadística y programación.',
                    'Apasionado por finanzas cuantitativas, ciberseguridad y dev.' ],
        skills:   [ 'Lenguajes : Python · SQL · R · Java · JS · HTML/CSS',
                    'Stack     : Docker · MongoDB · Pandas · NumPy · pytest',
                    'Foco      : Data Science · Security · Dev' ],
        projects: [ '01  pkgxray         — scanner Python AST · PyPI v0.2.2',
                    '02  Planck          — sitio corp. multiidioma (privado)',
                    '03  maip-fred.github.io — este portfolio' ],
        contact:  [ 'email  : ibanez.alfredo.02.10@gmail.com',
                    'github : github.com/maip-fred',
                    'loc    : Ciudad de México, MX' ],
      };
      if (!DOCS[k]) { ht_appendLine('t-err', 'cat: ' + arg + ': No such file'); return; }
      DOCS[k].forEach(function (l) { ht_appendLine('t-out', l); });
    },
    goto: function (arg) {
      var routes = { about:'about.html', skills:'skills.html',
                     projects:'projects.html', contact:'contact.html',
                     home:'index.html', build:'build.html' };
      var dest = routes[(arg || '').toLowerCase()];
      if (!dest) { ht_appendLine('t-err', 'goto: usage — goto <about|skills|projects|contact|home>'); return; }
      ht_appendHTML('t-success', 'navegando a <span style="color:var(--cyan);">' + dest + '</span>...');
      document.body.classList.add('leaving');
      setTimeout(function () { window.location.href = dest; }, 380);
    },
    pkgxray: function (arg) {
      var parts = (arg || '').trim().split(/\s+/);
      var pkg = parts[0] === 'scan' ? parts[1] : parts[0];
      if (!pkg) { ht_appendLine('t-err', 'pkgxray: usage — pkgxray scan <paquete>'); return; }
      ht_appendLine('t-out', '  Consultando PyPI · ' + pkg + '...');
      setTimeout(function () { ht_appendLine('t-out', '  Ejecutando 8 analizadores AST...'); }, 350);
      setTimeout(function () {
        var bad = /evil|malware|hack|crack|steal|trojan|exploit/i.test(pkg);
        if (bad) {
          ht_appendLine('t-err', '  ✗ exfiltration detectada → subprocess + curl');
          ht_appendLine('t-err', '  Score: 96/100 — CRITICAL · NO INSTALAR');
        } else {
          ht_appendLine('t-warn',  '  ⚠ network_access → requests');
          ht_appendLine('t-success', '  Score: 32/100 — LOW · paquete legítimo');
        }
        ht_appendLine('t-success', '✓ Reporte completo · prueba la demo en /projects');
        ht_renderPrompt();
      }, 850);
      return true;
    },
    neofetch: function () {
      var lines = [
        [ '  ╭─────────╮  ', 'alfredo@portfolio'                              ],
        [ '  │  >_     │  ', '────────────────'                                ],
        [ '  │   ITAM  │  ', 'OS    : maip-fred.github.io'                     ],
        [ '  │ ░░░░░░░ │  ', 'Stack : HTML5 · CSS · vanilla JS'                ],
        [ '  │ █████░░ │  ', 'Theme : dark developer'                          ],
        [ '  │ ░░░░░░░ │  ', 'Year  : 2026 · Gen. 2022'                        ],
        [ '  ╰─────────╯  ', 'Status: disponible para prácticas'               ],
      ];
      lines.forEach(function (l) {
        ht_appendHTML('', '<span style="color:var(--cyan);">' + l[0] + '</span>' +
                          '<span style="color:var(--t-1);">' + l[1] + '</span>');
      });
    },
    date: function () {
      ht_appendLine('t-out', new Date().toString());
    },
    history: function () {
      if (!history.length) { ht_appendLine('t-out', '(historial vacío)'); return; }
      history.forEach(function (h, i) {
        ht_appendLine('t-out', '  ' + String(i + 1).padStart(3, ' ') + '  ' + h);
      });
    },
    sudo: function () {
      ht_appendLine('t-err', '[sudo] password for aiv: ');
      setTimeout(function () { ht_appendLine('t-err', 'Sorry, try again. Es solo un portfolio :)'); }, 500);
    },
    clear: function () { heroTermBody.innerHTML = ''; },
    echo: function (arg) { ht_appendLine('t-out', arg || ''); },
    exit: function () { ht_appendLine('t-success', 'logout · gracias por visitar.'); },
    uname: function () {
      ht_appendLine('t-out', 'maip-fred.github.io v1.0 — vanilla JS · HTML5 · CSS3');
    },
    pwd: function () {
      ht_appendLine('t-out', '/home/visitor/portfolio');
    },
    tree: function () {
      ['.',
       '├── index.html', '├── about.html', '├── skills.html',
       '├── projects.html', '├── contact.html', '├── pkgxray.html',
       '├── build.html    ← cómo se construyó esto',
       '├── css/  (styles.css · animations.css)',
       '├── js/   (core · terminal · particles · matrix · dock · …)',
       '└── assets/'].forEach(function (l) { ht_appendLine('t-out', l); });
    },
    cv: function () {
      ht_appendHTML('t-success',
        'Abriendo <a href="assets/docs/cv-alfredo-ibanez.pdf" target="_blank" ' +
        'style="color:var(--cyan);">cv-alfredo-ibanez.pdf</a>...');
      setTimeout(function () {
        window.open('assets/docs/cv-alfredo-ibanez.pdf', '_blank');
      }, 350);
    },
    github: function () {
      ht_appendHTML('t-success',
        'Abriendo <a href="https://github.com/maip-fred" target="_blank" rel="noopener" ' +
        'style="color:var(--cyan);">github.com/maip-fred</a>...');
      setTimeout(function () {
        window.open('https://github.com/maip-fred', '_blank');
      }, 350);
    },
    ping: function (arg) {
      if (!arg) { ht_appendLine('t-err', 'ping: uso — ping <host>'); return; }
      ht_appendLine('t-out', 'PING ' + arg + ' (127.0.0.1): 56 bytes');
      var count = 0;
      function tick() {
        if (count >= 4) {
          ht_appendLine('t-out', '--- ' + arg + ' ping statistics ---');
          ht_appendLine('t-success', '4 packets transmitted, 4 received, 0% loss');
          ht_renderPrompt(); return;
        }
        ht_appendLine('t-out',
          '64 bytes icmp_seq=' + count + ' ttl=64 time=' +
          (Math.random() * 3 + 0.5).toFixed(3) + ' ms');
        count++;
        setTimeout(tick, 480);
      }
      setTimeout(tick, 280);
      return true;
    },
  };
  COMMANDS['matrix'] = function () {
    ht_appendHTML('t-success',
      '<span style="color:var(--green);">Iniciando protocolo MATRIX...</span>');
    setTimeout(function () {
      if (typeof window.matrixStart === 'function') {
        window.matrixStart();
      }
      ht_renderPrompt();
    }, 600);
    return true;
  };

  COMMANDS['ll']   = COMMANDS.ls;
  COMMANDS['cls']  = COMMANDS.clear;
  COMMANDS['man']  = COMMANDS.help;
  COMMANDS['open'] = COMMANDS.goto;

  function ht_runCommand(raw) {
    var input = raw.trim();
    if (!input) return;
    history.push(input); historyIdx = history.length;
    var parts = input.split(/\s+/);
    var cmd = parts[0].toLowerCase();
    var arg = parts.slice(1).join(' ');
    var fn = COMMANDS[cmd];
    if (fn) {
      var async = fn(arg);
      if (!async) ht_renderPrompt();
    } else {
      ht_appendLine('t-err', cmd + ': command not found — escribe `help`');
      ht_renderPrompt();
    }
  }

  var heroBuffer = '';
  function ht_renderBuffer() {
    var line = heroTermBody.querySelector('.ht-active');
    if (!line) return;
    var typed = line.querySelector('.ht-typed');
    if (typed) typed.textContent = heroBuffer;
  }

  function ht_handleKey(e) {
    if (!heroTermBody.classList.contains('ht-ready')) return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    if (document.body.classList.contains('cmdk-open')) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      var line = heroTermBody.querySelector('.ht-active');
      if (line) {
        line.classList.remove('ht-active');
        var cur = line.querySelector('.t-cursor');
        if (cur) cur.remove();
      }
      var cmd = heroBuffer;
      heroBuffer = '';
      ht_runCommand(cmd);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      heroBuffer = heroBuffer.slice(0, -1);
      ht_renderBuffer();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length && historyIdx > 0) {
        historyIdx--;
        heroBuffer = history[historyIdx];
        ht_renderBuffer();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx < history.length - 1) {
        historyIdx++;
        heroBuffer = history[historyIdx];
      } else {
        historyIdx = history.length;
        heroBuffer = '';
      }
      ht_renderBuffer();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      var matches = Object.keys(COMMANDS).filter(function (k) {
        return k.indexOf(heroBuffer) === 0 && heroBuffer.length;
      });
      if (matches.length === 1) { heroBuffer = matches[0] + ' '; ht_renderBuffer(); }
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      heroBuffer += e.key;
      ht_renderBuffer();
    }
  }

  window.runTypewriter('hero-term-body', [
    { text: PROMPT + 'whoami', cls: '', speed: 55 },
    { pause: 350 },
    { text: 'alfredo-ibanez', cls: 't-out', instant: true },
    { pause: 250 },
    { text: PROMPT + 'cat roles.txt', cls: '', speed: 50 },
    { pause: 300 },
    { text: 'Data Scientist  ·  Security Researcher  ·  Developer', cls: 't-info', instant: true },
    { pause: 350 },
    { text: '// Terminal interactiva — escribe `help` para ver comandos', cls: 't-out', instant: true },
  ]).then(function () {
    var stray = heroTermBody.querySelector('.t-cursor');
    if (stray) stray.remove();
    heroTermBody.classList.add('ht-ready');
    ht_renderPrompt();
  });

  document.addEventListener('keydown', ht_handleKey);
  heroTermBody.addEventListener('click', function () {
    var line = heroTermBody.querySelector('.ht-active');
    if (line) line.scrollIntoView({ block: 'nearest' });
  });
});
