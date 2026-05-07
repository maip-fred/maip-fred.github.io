/* finanzas-demo.js — stepper para la demo de finanzas_gen en projects.html */
(function () {
  'use strict';

  function initFinanzasDemo() {
    const buttons = document.querySelectorAll('.fg-step-btn');
    if (!buttons.length) return;

    const panels = {
      1: document.getElementById('fg-p1'),
      2: document.getElementById('fg-p2'),
      3: document.getElementById('fg-p3'),
    };

    const activeStyle = {
      border: '1px solid rgba(22,163,74,.35)',
      background: 'rgba(22,163,74,.06)',
    };
    const inactiveStyle = {
      border: '1px solid rgba(0,0,0,.1)',
      background: '#f9f9f9',
    };

    function activate(step) {
      buttons.forEach(btn => {
        const isActive = btn.dataset.step === String(step);
        btn.style.border      = isActive ? activeStyle.border      : inactiveStyle.border;
        btn.style.background  = isActive ? activeStyle.background  : inactiveStyle.background;
        btn.classList.toggle('fg-active', isActive);
        const numEl = btn.querySelector('span:first-child');
        if (numEl) numEl.style.color = isActive ? '#16A34A' : 'var(--lt-3)';
      });

      Object.entries(panels).forEach(([n, el]) => {
        if (!el) return;
        el.style.display = String(n) === String(step) ? 'grid' : 'none';
      });
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', () => activate(Number(btn.dataset.step)));
    });

    activate(1);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFinanzasDemo);
  } else {
    initFinanzasDemo();
  }
})();
