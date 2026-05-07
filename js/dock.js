/* dock.js — floating pill navigation that replaces the header on scroll */
(function () {
  var NAV_ITEMS = [
    { href: 'index.html',    label: '00',  full: 'Inicio'      },
    { href: 'about.html',    label: '01',  full: 'Sobre mí'    },
    { href: 'skills.html',   label: '02',  full: 'Habilidades' },
    { href: 'projects.html', label: '03',  full: 'Proyectos'   },
    { href: 'contact.html',  label: '↗',  full: 'Contacto',   cta: true },
  ];

  var HIDE_HEADER_THRESHOLD = 100; /* px — when to swap header → dock */
  var dock, header;
  var dockItems = [];

  /* ── build DOM ───────────────────────────────────────────── */
  function build() {
    dock = document.createElement('nav');
    dock.id = 'floating-dock';
    dock.setAttribute('aria-label', 'Navegación rápida');
    dock.setAttribute('role', 'navigation');

    /* Logo pill */
    var logo = document.createElement('span');
    logo.className = 'dock-logo';
    logo.textContent = 'AIV';
    dock.appendChild(logo);

    /* Nav links */
    var currentPage = (window.location.pathname.split('/').pop() || 'index.html').replace(/\?.*$/, '');
    if (!currentPage) currentPage = 'index.html';

    NAV_ITEMS.forEach(function (item) {
      var a = document.createElement('a');
      a.href = item.href;
      a.className = 'dock-link' + (item.cta ? ' dock-link-cta' : '');
      a.setAttribute('data-dock-t', '');

      var isActive = (currentPage === item.href) || (currentPage === '' && item.href === 'index.html');
      if (isActive && !item.cta) a.classList.add('dock-link-active');

      /* Show number on small widths, full label on wider */
      var numSpan = document.createElement('span');
      numSpan.className = 'dock-num';
      numSpan.textContent = item.label;

      var labelSpan = document.createElement('span');
      labelSpan.className = 'dock-label';
      labelSpan.textContent = item.full;

      a.appendChild(numSpan);
      a.appendChild(labelSpan);
      dock.appendChild(a);
      dockItems.push(a);
    });

    document.body.appendChild(dock);
  }

  /* ── scroll show / hide ──────────────────────────────────── */
  function onScroll() {
    var scrolled = window.scrollY > HIDE_HEADER_THRESHOLD;
    dock.classList.toggle('dock-visible', scrolled);

    if (header) {
      header.style.opacity        = scrolled ? '0' : '';
      header.style.pointerEvents  = scrolled ? 'none' : '';
      header.style.transition     = 'opacity .3s ease';
    }
  }

  /* ── magnification on hover ──────────────────────────────── */
  function initMagnify() {
    dock.addEventListener('mousemove', function (e) {
      dockItems.forEach(function (item) {
        var rect  = item.getBoundingClientRect();
        var cx    = rect.left + rect.width / 2;
        var dist  = Math.abs(e.clientX - cx);
        var max   = 120; /* px radius of influence */

        if (dist < max) {
          var t     = 1 - dist / max;
          var scale = 1 + t * 0.28;
          item.style.transform = 'scale(' + scale + ')';
          item.style.color     = 'rgba(237,234,228,' + (0.48 + t * 0.52) + ')';
        } else {
          item.style.transform = '';
          item.style.color     = '';
        }
      });
    });

    dock.addEventListener('mouseleave', function () {
      dockItems.forEach(function (item) {
        item.style.transform = '';
        item.style.color     = '';
      });
    });
  }

  /* ── page transitions on dock links ──────────────────────── */
  function initTransitions() {
    dock.querySelectorAll('[data-dock-t]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#')) return;
        e.preventDefault();

        if (document.startViewTransition) {
          document.body.classList.add('leaving');
          document.startViewTransition(function () {
            window.location.href = href;
          });
        } else {
          document.body.classList.add('leaving');
          setTimeout(function () { window.location.href = href; }, 380);
        }
      });
    });
  }

  /* ── init ────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    header = document.getElementById('header');
    build();
    onScroll();
    initMagnify();
    initTransitions();
    window.addEventListener('scroll', onScroll, { passive: true });
  });
})();
