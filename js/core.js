/* ----------------------------------------------------------
   DEVTOOLS GREETING
---------------------------------------------------------- */
(function () {
  var b = 'background:#030810;color:#3B82F6;font-family:JetBrains Mono,monospace;';
  var c = 'background:#030810;color:#22D3EE;font-family:JetBrains Mono,monospace;';
  var g = 'background:#030810;color:#4ADE80;font-family:JetBrains Mono,monospace;';
  var t = 'background:#030810;color:#EEF2FF;font-family:JetBrains Mono,monospace;';
  var d = 'background:#030810;color:rgba(238,242,255,.4);font-family:JetBrains Mono,monospace;';
  console.log('%c\n' +
    '   █████╗ ██╗██╗   ██╗\n' +
    '  ██╔══██╗██║██║   ██║\n' +
    '  ███████║██║██║   ██║\n' +
    '  ██╔══██║██║╚██╗ ██╔╝\n' +
    '  ██║  ██║██║ ╚████╔╝ \n' +
    '  ╚═╝  ╚═╝╚═╝  ╚═══╝  \n', b + 'font-size:13px;line-height:1.1;font-weight:700;');
  console.log('%cAlfredo Ibáñez Vargas %c· ITAM 8° sem · CDMX', t + 'font-size:13px;font-weight:700;', d + 'font-size:12px;');
  console.log('%c~/data-science/security/dev', c + 'font-size:11px;');
  console.log('%c\n¿Inspeccionando el código? Buena señal.', g + 'font-size:12px;');
  console.log('%cTip: prueba %ccmd/ctrl + K%c o el código Konami %c↑↑↓↓←→←→BA%c en cualquier página.',
    t + 'font-size:11px;', c + 'font-size:11px;font-weight:700;', t + 'font-size:11px;', c + 'font-size:11px;font-weight:700;', t + 'font-size:11px;');
  console.log('%c\nCódigo fuente: %chttps://github.com/maip-fred/maip-fred.github.io',
    t + 'font-size:11px;', c + 'font-size:11px;text-decoration:underline;');
  console.log('%cContacto: %cibanez.alfredo.02.10@gmail.com\n',
    t + 'font-size:11px;', c + 'font-size:11px;text-decoration:underline;');
}());

/* ----------------------------------------------------------
   CORE UI — AOS, scroll bar, header, nav, hamburger,
   page transitions, skill bars, typewriter engine, counters
---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {

  if (typeof AOS !== 'undefined') AOS.init({ once: true, offset: 80, duration: 700 });
  if (typeof lucide !== 'undefined') lucide.createIcons();

  var bar = document.getElementById('scroll-bar');
  if (bar) {
    window.addEventListener('scroll', function () {
      var pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      bar.style.width = Math.min(pct, 100) + '%';
    }, { passive: true });
  }

  var header = document.getElementById('header');
  function updateHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    var match = href.split('/').pop();
    if (match === page || (page === '' && match === 'index.html')) {
      link.classList.add('active');
    }
  });

  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  document.querySelectorAll('a[data-t]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = link.getAttribute('href');
      if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto')) return;
      e.preventDefault();
      function navigate() { window.location.href = href; }
      document.body.classList.add('leaving');
      if (document.startViewTransition) {
        document.startViewTransition(navigate);
      } else {
        setTimeout(navigate, 380);
      }
    });
  });

  var skillRows = document.querySelectorAll('.skill-row');
  if (skillRows.length) {
    var skillObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          skillObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    skillRows.forEach(function (row) { skillObs.observe(row); });
  }

  /* Typewriter engine — exposed as window.runTypewriter */
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  async function typeLine(el, text, speed) {
    for (var i = 0; i < text.length; i++) {
      el.insertAdjacentText('beforeend', text[i]);
      await sleep(speed);
    }
  }

  window.runTypewriter = async function (containerId, lines) {
    var container = document.getElementById(containerId);
    if (!container) return;
    await sleep(600);
    for (var line of lines) {
      if (line.pause) { await sleep(line.pause); continue; }
      var el = document.createElement('div');
      el.className = 'tw-line ' + (line.cls || '');
      container.appendChild(el);
      container.scrollTop = container.scrollHeight;
      if (line.instant) {
        el.textContent = line.text;
      } else {
        await typeLine(el, line.text, line.speed || 45);
      }
      await sleep(line.after || 80);
    }
    var cur = document.createElement('span');
    cur.className = 't-cursor';
    container.lastElementChild.appendChild(cur);
  };

  var counterEls = document.querySelectorAll('.stat-counter-val[data-target]');
  if (counterEls.length) {
    var counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.dataset.target, 10);
        var suffix = el.dataset.suffix || '';
        var start = 0;
        var duration = 1200;
        var startTime = null;
        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.round(eased * target);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        counterObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counterEls.forEach(function (el) { counterObs.observe(el); });
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(function () {});
  }

  /* Galaxy return button — shown on all non-index pages */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage !== 'index.html' && currentPage !== '') {
    var btn = document.createElement('button');
    btn.id    = 'galaxy-return-btn';
    btn.title = 'VOLVER A GALAXIA';
    btn.setAttribute('aria-label', 'Volver a la galaxia');

    /* Inline styles garantizan posición fija independiente del CSS cascade */
    btn.style.cssText = [
      'position:fixed',
      'bottom:1.75rem',
      'right:1.75rem',
      'z-index:9000',
      'width:62px',
      'height:62px',
      'border-radius:50%',
      'background:rgba(3,8,18,0.90)',
      'border:1px solid rgba(59,130,246,0.45)',
      'backdrop-filter:blur(10px)',
      'cursor:pointer',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'padding:0',
      'color:rgba(96,165,250,0.85)',
      'box-shadow:0 0 18px rgba(59,130,246,0.28),0 6px 24px rgba(0,0,0,0.55)',
    ].join(';');

    btn.innerHTML =
      '<svg viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="width:34px;height:auto;display:block;">'
      /* Left solar panel */
      + '<rect x="0.5" y="8.5" width="8" height="5" rx="0.8" stroke="currentColor" stroke-width="0.85" fill="rgba(20,50,120,0.4)"/>'
      + '<line x1="3" y1="8.5" x2="3" y2="13.5" stroke="currentColor" stroke-width="0.5" opacity="0.55"/>'
      + '<line x1="5.5" y1="8.5" x2="5.5" y2="13.5" stroke="currentColor" stroke-width="0.5" opacity="0.55"/>'
      /* Right solar panel */
      + '<rect x="23.5" y="8.5" width="8" height="5" rx="0.8" stroke="currentColor" stroke-width="0.85" fill="rgba(20,50,120,0.4)"/>'
      + '<line x1="26" y1="8.5" x2="26" y2="13.5" stroke="currentColor" stroke-width="0.5" opacity="0.55"/>'
      + '<line x1="28.5" y1="8.5" x2="28.5" y2="13.5" stroke="currentColor" stroke-width="0.5" opacity="0.55"/>'
      /* Arms */
      + '<line x1="8.5" y1="11" x2="11.5" y2="11" stroke="currentColor" stroke-width="0.9" opacity="0.65"/>'
      + '<line x1="20.5" y1="11" x2="23.5" y2="11" stroke="currentColor" stroke-width="0.9" opacity="0.65"/>'
      /* Body */
      + '<rect x="11.5" y="6.5" width="9" height="9" rx="1.5" stroke="currentColor" stroke-width="1.1" fill="rgba(180,200,230,0.08)"/>'
      /* Nav light */
      + '<circle cx="16" cy="11" r="1.4" fill="currentColor"/>'
      /* Antenna mast */
      + '<line x1="16" y1="6.5" x2="16" y2="2.5" stroke="currentColor" stroke-width="0.8" opacity="0.75"/>'
      /* Dish */
      + '<path d="M13.5 3.5 Q16 1.5 18.5 3.5" stroke="currentColor" stroke-width="0.9" fill="none" opacity="0.75"/>'
      + '</svg>';

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      window.location.href = 'galaxy.html';
    });

    btn.addEventListener('mouseover', function () {
      btn.style.transform   = 'scale(1.12)';
      btn.style.borderColor = 'rgba(59,130,246,0.80)';
      btn.style.color       = 'rgba(147,197,253,1)';
      btn.style.boxShadow   = '0 0 32px rgba(59,130,246,0.50),0 8px 28px rgba(0,0,0,0.65)';
    });
    btn.addEventListener('mouseout', function () {
      btn.style.transform   = '';
      btn.style.borderColor = 'rgba(59,130,246,0.45)';
      btn.style.color       = 'rgba(96,165,250,0.85)';
      btn.style.boxShadow   = '0 0 18px rgba(59,130,246,0.28),0 6px 24px rgba(0,0,0,0.55)';
    });

    document.body.appendChild(btn);
  }

});
