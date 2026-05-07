/* scramble.js — Mr.Robot-style text decryption on viewport entry */
(function () {
  var CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#<>[]{}|/\\';
  var FRAME_MS  = 32;   /* ~30 fps */
  var REVEAL_PER_FRAME = 1; /* chars revealed each 2nd frame */

  function scramble(el, delay) {
    var original   = el.textContent;
    var len        = original.length;
    var revealed   = 0;
    var frame      = 0;
    var intervalId;

    /* Store so external code can skip animation */
    el._scrambleOriginal = original;

    intervalId = setInterval(function () {
      frame++;

      /* Reveal one character every 2 frames */
      if (frame % 2 === 0) {
        revealed = Math.min(revealed + REVEAL_PER_FRAME, len);
      }

      var result = '';
      for (var i = 0; i < len; i++) {
        var ch = original[i];
        if (ch === ' ' || ch === '\n') { result += ch; continue; }
        if (i < revealed)              { result += ch; continue; }
        /* Random char, keeping uppercase/lowercase feel */
        result += CHARS[Math.floor(Math.random() * CHARS.length)];
      }

      el.textContent = result;

      if (revealed >= len) {
        clearInterval(intervalId);
        el.textContent = original;
        el.removeAttribute('data-scramble-running');
      }
    }, FRAME_MS);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var targets = document.querySelectorAll('[data-scramble]');
    if (!targets.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.hasAttribute('data-scramble-running')) return;
        observer.unobserve(el);
        el.setAttribute('data-scramble-running', '');
        var delay = parseInt(el.dataset.scrambleDelay || '0', 10);
        setTimeout(function () { scramble(el); }, delay);
      });
    }, { threshold: 0.25 });

    targets.forEach(function (el) { observer.observe(el); });
  });
})();
