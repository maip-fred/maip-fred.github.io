/**
 * Asistente de navegación — respuestas locales (sin API).
 * Estado cerrado: localStorage['aiv-chatbot-dismissed'] === '1'
 */
(function () {
  var LS_DISMISS = 'aiv-chatbot-dismissed';

  var ICON_MSG =
    '<span class="aiv-chat-launcher__icon" aria-hidden="true">' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>' +
    '<span class="aiv-chat-launcher__label">Asistente</span>';
  var ICON_CLOSE =
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
  var ICON_SEND =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>';

  function replyFor(text) {
    var q = (text || '').toLowerCase().trim();

    if (
      /^(hola|hey|buenas|buenos|hi|hello|que tal|qué tal)/.test(q) ||
      /(empezar|explora|explore)/.test(q)
    ) {
      return {
        html:
          '¡Hola! Este sitio es un CV **interactivo**: terminal en <a href="index.html">Inicio</a>, proyectos, skills y extras ocultos. Escribe **mapa** o usa el chip **Mapa del sitio** para un recorrido rápido.',
      };
    }
    if (
      /(mapa del sitio|^mapa$|recorrido|explorar todo|secciones|ruta|índice|indice|contenidos)/.test(q)
    ) {
      return {
        html:
          'Recorrido sugerido:<br><br>' +
          '· <a href="index.html">Inicio</a> — hero + terminal (<code>help</code>, <code>goto</code>)<br>' +
          '· <a href="about.html">Sobre mí</a> — bio, trayectoria, enlace a **Mi universo**<br>' +
          '· <a href="skills.html">Habilidades</a> — radar y stack<br>' +
          '· <a href="projects.html">Proyectos</a> — pkgxray, Planck, DataViz, demos<br>' +
          '· <a href="dataviz.html">Visualización de datos</a> — mapa de México, red social, Shiny<br>' +
          '· <a href="contact.html">Contacto</a> — formulario<br>' +
          '· <a href="build.html">Cómo se construyó</a> — timeline técnico<br><br>' +
          'Atajos: <code>⌘/Ctrl+K</code> para saltar de página, Konami en cualquier vista.',
      };
    }
    if (/(quién eres|quien eres|alfredo|perfil|cv|sobre ti|itam|estudiante)/.test(q)) {
      return {
        html:
          '**Alfredo Ibáñez Vargas** — ITAM, CDMX. Intersección de data science, ciberseguridad y desarrollo. La bio completa y trayectoria están en <a href="about.html">Sobre mí</a>.',
      };
    }
    if (/(proyecto|pkgxray|pypi|paquete)/.test(q)) {
      return {
        html:
          '**pkgxray** es un proyecto destacado: analiza dependencias de paquetes Python. Resumen y demo en <a href="projects.html">Proyectos</a> y el case study en <a href="pkgxray.html">pkgxray</a>.',
      };
    }
    if (/planck/.test(q)) {
      return {
        html:
          '**Planck** es un case study de diseño de sistema visual (bajo NDA). Vista en <a href="planck.html">Planck</a> y contexto en <a href="projects.html">Proyectos</a>.',
      };
    }
    if (/(habilidad|skill|stack|tecnolog|radar)/.test(q)) {
      return {
        html:
          'Skills, radar y stack del “camino” están en <a href="skills.html">Habilidades</a>.',
      };
    }
    if (/(contacto|correo|email|mail|escribir|hablar|práctica|practica|colabora)/.test(q)) {
      return {
        html:
          'Puedes escribir desde <a href="contact.html">Contacto</a> (formulario) o a <a href="mailto:ibanez.alfredo.02.10@gmail.com">ibanez.alfredo.02.10@gmail.com</a>.',
      };
    }
    if (/(universo|libro|podcast|hobby|lectura)/.test(q)) {
      return {
        html:
          'Libros, podcasts e intereses personales viven en <a href="universo.html">Mi universo</a> (enlace desde Sobre mí).',
      };
    }
    if (/(terminal|comando|konami|matrix|easter|truco|atajo|cmdk|palette|ctrl\+k|⌘k)/.test(q)) {
      return {
        html:
          'En <a href="index.html">Inicio</a> hay una **terminal** con comandos. Prueba también **⌘/Ctrl+K** (paleta), el **código Konami** o el sonido en el pie de página.',
      };
    }
    if (/(dataviz|visualiz|leaflet|choropleth|mapa interactivo|igraph|shiny|gephi|red social|geoespacial|redes|network)/.test(q)) {
      return {
        html:
          '**Visualización de datos** — el case study completo está en <a href="dataviz.html">DataViz</a>: mapa choropleth de México con Leaflet, red social con igraph (388 nodos, D3.js), dashboards en R Shiny y análisis espacial con sf.',
      };
    }
    if (/(finanz|finanzas_gen|economía|economia|mercado|finance|portafolio financiero|análisis financiero)/.test(q)) {
      return {
        html:
          '**Finanzas** — el análisis y el proyecto <a href="finanzas.html">finanzas_gen</a> cubren visualización de datos financieros y modelos cuantitativos.',
      };
    }
    if (/(build|cómo se hizo|stack del sitio|código fuente|github pages)/.test(q)) {
      return {
        html:
          'El **build log** técnico está en <a href="build.html">Cómo se construyó</a>. El repo es <a href="https://github.com/maip-fred/maip-fred.github.io" target="_blank" rel="noopener noreferrer">maip-fred.github.io</a>.',
      };
    }
    if (/(ayuda|help|qué puedes|que puedes|menú|opciones)/.test(q)) {
      return {
        html:
          'Puedes preguntar por **Alfredo**, **pkgxray**, **Planck**, **DataViz**, **contacto**, **universo** o escribir **mapa** para ver todas las secciones. Fuera del chat: **⌘K**, terminal en inicio, **dock** al hacer scroll.',
      };
    }
    if (/(gracias|thanks)/.test(q)) {
      return { html: '¡Con gusto! Si necesitas algo más, aquí estaré.' };
    }

    return {
      html:
        'No tengo una respuesta lista para eso. Prueba **mapa**, **proyectos** o **contacto** — o abre la paleta con **⌘K** y navega el sitio entero.',
    };
  }

  function mdLite(s) {
    return s
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\n/g, '<br>');
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('aiv-chat-root')) return;

    var dismissed = false;
    var lastScrollY = 0;
    var isHidden = false;

    function updateChatVisibility() {
      var currentScrollY = window.scrollY;
      var threshold = 100;

      if (currentScrollY > threshold && currentScrollY > lastScrollY) {
        if (!isHidden && !root.classList.contains('is-dismissed')) {
          root.classList.add('is-hidden');
          isHidden = true;
        }
      } else if (currentScrollY <= threshold || currentScrollY < lastScrollY) {
        if (isHidden) {
          root.classList.remove('is-hidden');
          isHidden = false;
        }
      }
      lastScrollY = currentScrollY;
    }

    window.addEventListener('scroll', updateChatVisibility, { passive: true });

    var root = document.createElement('div');
    root.id = 'aiv-chat-root';
    root.className = 'aiv-chat-root' + (dismissed ? ' is-dismissed' : '');
    root.innerHTML =
      '<button type="button" class="aiv-chat-launcher" id="aiv-chat-launcher" aria-label="Abrir asistente">' +
      ICON_MSG +
      '</button>' +
      '<div class="aiv-chat-panel" id="aiv-chat-panel" role="dialog" aria-modal="false" aria-labelledby="aiv-chat-title">' +
      '<div class="aiv-chat-head">' +
      '<div class="aiv-chat-scan" aria-hidden="true"></div>' +
      '<div class="aiv-chat-brand">' +
      '<span class="aiv-chat-dot" aria-hidden="true"></span>' +
      '<div class="aiv-chat-titles">' +
      '<span class="aiv-chat-title" id="aiv-chat-title">Asistente AIV</span>' +
      '<span class="aiv-chat-sub">Mapa del sitio · sin API</span>' +
      '</div></div>' +
      '<button type="button" class="aiv-chat-x" id="aiv-chat-close" aria-label="Cerrar asistente">' +
      ICON_CLOSE +
      '</button></div>' +
      '<div class="aiv-chat-msgs" id="aiv-chat-msgs"></div>' +
      '<div class="aiv-chat-quick" id="aiv-chat-quick"></div>' +
      '<form class="aiv-chat-form" id="aiv-chat-form" autocomplete="off">' +
      '<input type="text" id="aiv-chat-input" placeholder="mapa · proyectos · contacto…" maxlength="400" aria-label="Tu mensaje" />' +
      '<button type="submit" class="aiv-chat-send" aria-label="Enviar">' +
      ICON_SEND +
      '</button></form>' +
      '<p class="aiv-chat-foot">Heurísticas locales · no LLM</p>' +
      '</div>';

    document.body.appendChild(root);

    var launcher = document.getElementById('aiv-chat-launcher');
    var panel = document.getElementById('aiv-chat-panel');
    var closeBtn = document.getElementById('aiv-chat-close');
    var msgs = document.getElementById('aiv-chat-msgs');
    var quickEl = document.getElementById('aiv-chat-quick');
    var form = document.getElementById('aiv-chat-form');
    var input = document.getElementById('aiv-chat-input');

    var chips = ['Mapa del sitio', 'Proyectos', 'DataViz', 'Finanzas', 'Mi universo', 'Atajos ⌘K'];
    chips.forEach(function (label) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'aiv-chat-chip';
      b.textContent = label;
      b.addEventListener('click', function () {
        sendUser(label);
      });
      quickEl.appendChild(b);
    });

    function scrollMsgs() {
      msgs.scrollTop = msgs.scrollHeight;
    }

    function appendRow(kind, htmlInner) {
      var row = document.createElement('div');
      row.className = 'aiv-chat-row aiv-chat-row--' + kind;
      var bubble = document.createElement('div');
      bubble.className = 'aiv-chat-bubble';
      bubble.innerHTML = htmlInner;
      row.appendChild(bubble);
      msgs.appendChild(row);
      scrollMsgs();
    }

    function showTypingThen(cb) {
      var wrap = document.createElement('div');
      wrap.className = 'aiv-chat-row aiv-chat-row--bot';
      wrap.innerHTML =
        '<div class="aiv-chat-typing" aria-hidden="true"><span></span><span></span><span></span></div>';
      msgs.appendChild(wrap);
      scrollMsgs();
      var delay = 380 + Math.floor(Math.random() * 420);
      setTimeout(function () {
        wrap.remove();
        cb();
      }, delay);
    }

    function sendBot(raw) {
      var r = replyFor(raw);
      var inner = mdLite(r.html);
      showTypingThen(function () {
        appendRow('bot', inner);
      });
    }

    function sendUser(text) {
      var t = (text || '').trim();
      if (!t) return;
      appendRow('user', escapeHtml(t));
      input.value = '';
      sendBot(t);
    }

    function escapeHtml(s) {
      var d = document.createElement('div');
      d.textContent = s;
      return d.innerHTML;
    }

    appendRow(
      'bot',
      mdLite(
        'Soy el **asistente de navegación** de este CV estático: te ayudo a **explorar** cada sección sin perderte. Empieza por el chip **Mapa del sitio** o escribe **mapa**. Tip: en Inicio hay una **terminal** y en cualquier página **⌘/Ctrl+K** abre la paleta.'
      )
    );

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      sendUser(input.value);
    });

    closeBtn.addEventListener('click', function () {
      localStorage.setItem(LS_DISMISS, '1');
      root.classList.add('is-dismissed');
      launcher.focus();
    });

    launcher.addEventListener('click', function () {
      localStorage.removeItem(LS_DISMISS);
      root.classList.remove('is-dismissed');
      input.focus();
      scrollMsgs();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (root.classList.contains('is-dismissed')) return;
      if (!root.contains(document.activeElement)) return;
      e.preventDefault();
      localStorage.setItem(LS_DISMISS, '1');
      root.classList.add('is-dismissed');
      launcher.focus();
    });

    if (!dismissed) {
      setTimeout(function () {
        input.focus();
      }, 400);
    }
  });
})();
