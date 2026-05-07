/* ----------------------------------------------------------
   FIRST-VISIT GUIDE DIALOG (C5) — disabled
---------------------------------------------------------- */
(function () {
  return; // dialog removed

  var html =
    '<div id="guide-overlay" role="dialog" aria-modal="true" aria-label="Bienvenido">' +
      '<div id="guide-card">' +
        '<p id="guide-pre">// primera visita detectada</p>' +
        '<h2 id="guide-title">¿Cómo puedo ayudarte?</h2>' +
        '<p id="guide-sub">Cuéntame qué buscas y te llevaré directo a lo más relevante.</p>' +
        '<div id="guide-btns">' +
          '<button id="guide-recruiter" class="guide-btn guide-btn-a">' +
            '<span class="guide-btn-icon">📋</span>' +
            '<strong>Soy reclutador</strong>' +
            '<span>CV, disponibilidad, contacto</span>' +
          '</button>' +
          '<button id="guide-dev" class="guide-btn guide-btn-b">' +
            '<span class="guide-btn-icon">⌨️</span>' +
            '<strong>Soy dev / curioso</strong>' +
            '<span>Código, proyectos, el terminal</span>' +
          '</button>' +
        '</div>' +
        '<button id="guide-skip">saltar — ya conozco el sitio</button>' +
      '</div>' +
    '</div>';

  document.addEventListener('DOMContentLoaded', function () {
    document.body.insertAdjacentHTML('beforeend', html);
    var overlay = document.getElementById('guide-overlay');

    function dismiss() {
      overlay.classList.add('guide-out');
      setTimeout(function () { overlay.remove(); }, 400);
      localStorage.setItem('aiv-guide', '1');
    }

    document.getElementById('guide-recruiter').addEventListener('click', function () {
      dismiss();
      var cvBtn = document.querySelector('a[href$="cv-alfredo-ibanez.pdf"]');
      if (cvBtn) {
        setTimeout(function () {
          cvBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
          cvBtn.classList.add('guide-highlight');
          setTimeout(function () { cvBtn.classList.remove('guide-highlight'); }, 2200);
        }, 420);
      }
    });

    document.getElementById('guide-dev').addEventListener('click', function () {
      dismiss();
      var termBody = document.getElementById('hero-term-body');
      if (termBody) {
        setTimeout(function () {
          termBody.scrollIntoView({ behavior: 'smooth', block: 'center' });
          /* inject a tip line into the terminal */
          var tip = document.createElement('div');
          tip.className = 'tw-line t-info';
          tip.textContent = '// tip: escribe `neofetch` o `pkgxray scan requests`';
          var active = termBody.querySelector('.ht-active');
          if (active) termBody.insertBefore(tip, active);
          else termBody.appendChild(tip);
          termBody.scrollTop = termBody.scrollHeight;
        }, 450);
      }
    });

    document.getElementById('guide-skip').addEventListener('click', dismiss);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) dismiss();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') dismiss();
    }, { once: true });

    /* Show with a slight delay so the page loads first */
    setTimeout(function () { overlay.classList.add('guide-in'); }, 1800);
  });
}());
