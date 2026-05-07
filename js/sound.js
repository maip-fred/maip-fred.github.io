/* ----------------------------------------------------------
   SOUND DESIGN — opt-in toggle, Web Audio
---------------------------------------------------------- */
window.snd = (function () {
  var ctx = null;
  var enabled = localStorage.getItem('snd') === '1';

  function ensureCtx() {
    if (!ctx) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
      } catch (e) { return null; }
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function tone(freq, dur, type, gain) {
    if (!enabled) return;
    var c = ensureCtx();
    if (!c) return;
    var t = c.currentTime;
    var osc = c.createOscillator();
    var g   = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain || 0.05, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  return {
    isEnabled: function () { return enabled; },
    set: function (on) {
      enabled = !!on;
      localStorage.setItem('snd', enabled ? '1' : '0');
      if (enabled) ensureCtx();
    },
    toggle: function () { this.set(!enabled); return enabled; },
    tick:  function () { tone(2000, 0.04, 'square', 0.025); },
    type:  function () { tone(1800 + Math.random() * 800, 0.025, 'square', 0.015); },
    click: function () { tone(900,  0.08, 'triangle', 0.06); },
    open:  function () { tone(660,  0.06, 'sine', 0.08); setTimeout(function () { tone(990, 0.06, 'sine', 0.06); }, 60); },
    err:   function () { tone(220,  0.18, 'sawtooth', 0.05); },
    boot:  function () { tone(440, 0.06, 'sine', 0.05); setTimeout(function () { tone(660, 0.06, 'sine', 0.05); }, 80); setTimeout(function () { tone(880, 0.1, 'sine', 0.05); }, 160); },
  };
}());

document.addEventListener('DOMContentLoaded', function () {
  var foots = document.querySelectorAll('.footer-inner');
  foots.forEach(function (foot) {
    var btn = document.createElement('button');
    btn.className = 'snd-toggle';
    btn.setAttribute('aria-label', 'Alternar sonido');
    function render() {
      btn.innerHTML = window.snd.isEnabled()
        ? '<i data-lucide="volume-2" class="w-3.5 h-3.5"></i> sound: on'
        : '<i data-lucide="volume-x" class="w-3.5 h-3.5"></i> sound: off';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    render();
    btn.addEventListener('click', function () {
      var on = window.snd.toggle();
      render();
      if (on) window.snd.boot();
    });
    foot.appendChild(btn);
  });

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.closest) return;
    if (t.closest('.btn, button:not(.snd-toggle), .nav-link, .nav-cta, .demo-chip, .focus-area, .interest-chip, .repo-card, .cmdk-item')) {
      window.snd.click();
    }
  }, true);

  var twHook = new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      m.addedNodes.forEach(function (n) {
        if (n.nodeType === 1 && n.classList && n.classList.contains('tw-line')) {
          window.snd.type();
        }
      });
    });
  });
  document.querySelectorAll('.terminal-body, #hero-term-body, #demo-output, #egg-body, #contact-term-body').forEach(function (el) {
    twHook.observe(el, { childList: true });
  });
});
