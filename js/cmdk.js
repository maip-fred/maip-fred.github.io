/* ----------------------------------------------------------
   COMMAND PALETTE — Ctrl/Cmd + K
---------------------------------------------------------- */
(function () {
  var ITEMS = [
    { t: 'Inicio',          d: 'Página principal · hero',                  k: 'home index inicio',          a: 'index.html' },
    { t: 'Sobre mí',        d: 'Bio, trayectoria, info personal',          k: 'about sobre mi quien',       a: 'about.html' },
    { t: 'Habilidades',     d: 'Stack técnico y áreas de enfoque',          k: 'skills habilidades stack',   a: 'skills.html' },
    { t: 'Proyectos',       d: 'pkgxray, Planck, este sitio',               k: 'projects proyectos',         a: 'projects.html' },
    { t: 'Contacto',        d: 'Email, GitHub, ubicación',                  k: 'contact contacto email',     a: 'contact.html' },
    { t: 'pkgxray en PyPI', d: 'Ver el paquete v0.2.2 publicado',           k: 'pypi pkgxray release',       a: 'https://pypi.org/project/pkgxray/' },
    { t: 'GitHub @maip-fred', d: 'Mi perfil de GitHub',                     k: 'github maip-fred profile',   a: 'https://github.com/maip-fred' },
    { t: 'Repo de pkgxray', d: 'Código fuente del scanner',                 k: 'github pkgxray code source', a: 'https://github.com/maip-fred/pkgxray' },
    { t: 'Email directo',   d: 'ibanez.alfredo.02.10@gmail.com',            k: 'email mail correo',          a: 'mailto:ibanez.alfredo.02.10@gmail.com' },
    { t: 'Descargar CV',    d: 'PDF del currículum',                        k: 'cv resume curriculum pdf',   a: 'assets/docs/cv-alfredo-ibanez.pdf' },
    { t: 'Demo de pkgxray', d: 'Probar el scanner en vivo',                  k: 'demo scan pkgxray',          a: 'projects.html#demo' },
    { t: 'Case study: pkgxray', d: 'Arquitectura, decisiones, código',       k: 'case study pkgxray detalle', a: 'pkgxray.html' },
    { t: 'Ver código fuente del sitio', d: 'Repositorio del portfolio',     k: 'source repo portfolio',      a: 'https://github.com/maip-fred/maip-fred.github.io' },
    { t: 'Visualización de Datos',     d: 'Leaflet, igraph, Shiny, sf — ITAM 2026',            k: 'dataviz visualizacion datos leaflet igraph shiny mapa red geoespacial',  a: 'dataviz.html' },
    { t: 'Case study: DataViz',        d: 'Mapa interactivo de México + red social D3',         k: 'case study dataviz mapas redes network choropleth',                      a: 'dataviz.html' },
    { t: 'Finanzas',                   d: 'Análisis financiero — finanzas_gen',                  k: 'finanzas finance finanzas_gen economia economía análisis financiero',     a: 'finanzas.html' },
  ];

  var html =
    '<div id="cmdk-overlay" aria-hidden="true">' +
      '<div id="cmdk-panel" role="dialog" aria-label="Paleta de comandos">' +
        '<div id="cmdk-search">' +
          '<span id="cmdk-prompt">⌘</span>' +
          '<input id="cmdk-input" type="text" autocomplete="off" spellcheck="false" placeholder="Buscar páginas, proyectos, links..." />' +
          '<kbd class="cmdk-kbd">ESC</kbd>' +
        '</div>' +
        '<ul id="cmdk-list" role="listbox"></ul>' +
        '<div id="cmdk-foot">' +
          '<span><kbd class="cmdk-kbd">↑↓</kbd> navegar</span>' +
          '<span><kbd class="cmdk-kbd">↵</kbd> abrir</span>' +
          '<span><kbd class="cmdk-kbd">⌘K</kbd> alternar</span>' +
        '</div>' +
      '</div>' +
    '</div>';

  document.addEventListener('DOMContentLoaded', function () {
    document.body.insertAdjacentHTML('beforeend', html);
    var overlay = document.getElementById('cmdk-overlay');
    var input   = document.getElementById('cmdk-input');
    var list    = document.getElementById('cmdk-list');
    var sel = 0;
    var filtered = ITEMS;

    function score(it, q) {
      if (!q) return 1;
      var hay = (it.t + ' ' + it.d + ' ' + it.k).toLowerCase();
      var ql = q.toLowerCase().trim();
      if (hay.indexOf(ql) !== -1) return 100 - hay.indexOf(ql);
      var i = 0, j = 0;
      while (i < ql.length && j < hay.length) {
        if (ql[i] === hay[j]) i++;
        j++;
      }
      return i === ql.length ? 1 : 0;
    }

    function render() {
      var q = input.value;
      filtered = ITEMS
        .map(function (it) { return { it: it, s: score(it, q) }; })
        .filter(function (x) { return x.s > 0; })
        .sort(function (a, b) { return b.s - a.s; })
        .map(function (x) { return x.it; });
      list.innerHTML = filtered.map(function (it, i) {
        return '<li class="cmdk-item' + (i === sel ? ' active' : '') + '" data-i="' + i + '">' +
          '<div class="cmdk-it-t">' + it.t + '</div>' +
          '<div class="cmdk-it-d">' + it.d + '</div>' +
        '</li>';
      }).join('') || '<li class="cmdk-empty">Sin resultados</li>';
      Array.prototype.forEach.call(list.querySelectorAll('.cmdk-item'), function (el) {
        el.addEventListener('click', function () { sel = +el.dataset.i; activate(); });
        el.addEventListener('mousemove', function () {
          if (sel === +el.dataset.i) return;
          sel = +el.dataset.i;
          updateActive();
        });
      });
    }
    function updateActive() {
      Array.prototype.forEach.call(list.querySelectorAll('.cmdk-item'), function (el, i) {
        el.classList.toggle('active', i === sel);
      });
    }
    function activate() {
      var item = filtered[sel];
      if (!item) return;
      var a = item.a;
      close();
      if (/^https?:|^mailto:/.test(a) || a.indexOf('.pdf') !== -1) {
        window.open(a, '_blank', 'noopener');
      } else {
        document.body.classList.add('leaving');
        setTimeout(function () { window.location.href = a; }, 280);
      }
    }
    function open() {
      overlay.classList.add('open');
      document.body.classList.add('cmdk-open');
      input.value = '';
      sel = 0;
      render();
      setTimeout(function () { input.focus(); }, 30);
    }
    function close() {
      overlay.classList.remove('open');
      document.body.classList.remove('cmdk-open');
      input.blur();
    }

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (overlay.classList.contains('open')) { close(); }
        else { open(); window.snd && window.snd.open(); }
      } else if (e.key === 'Escape' && overlay.classList.contains('open')) {
        close();
      } else if (overlay.classList.contains('open')) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          sel = Math.min(sel + 1, filtered.length - 1);
          updateActive();
          var act = list.querySelector('.cmdk-item.active');
          if (act) act.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          sel = Math.max(sel - 1, 0);
          updateActive();
          var act2 = list.querySelector('.cmdk-item.active');
          if (act2) act2.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
          e.preventDefault();
          activate();
        }
      }
    });
    input.addEventListener('input', function () { sel = 0; render(); });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
  });
}());
