/* magnetic.js — magnetic attraction effect on buttons */
(function () {
  var STRENGTH   = 0.38;   /* fraction of distance to pull */
  var RADIUS     = 90;     /* px — how close mouse must be to activate */
  var EASE_BACK  = 'transform 0.55s cubic-bezier(0.22,1,0.36,1)';
  var EASE_TRACK = 'transform 0.1s linear';

  function attach(btn) {
    var strength = parseFloat(btn.dataset.magneticStrength || STRENGTH);

    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var cx = rect.left + rect.width  / 2;
      var cy = rect.top  + rect.height / 2;
      var dx = e.clientX - cx;
      var dy = e.clientY - cy;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < RADIUS) {
        var pull = (1 - dist / RADIUS) * strength;
        btn.style.transition = EASE_TRACK;
        btn.style.transform  = 'translate(' + (dx * pull) + 'px,' + (dy * pull) + 'px)';
      }
    });

    btn.addEventListener('mouseleave', function () {
      btn.style.transition = EASE_BACK;
      btn.style.transform  = '';
    });

    /* Inner icon/text gets a subtler counter-pull for depth */
    var inner = btn.querySelector('i, svg, span');
    if (inner) {
      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var cx = rect.left + rect.width  / 2;
        var cy = rect.top  + rect.height / 2;
        var dx = e.clientX - cx;
        var dy = e.clientY - cy;
        inner.style.transition = EASE_TRACK;
        inner.style.transform  = 'translate(' + (dx * 0.12) + 'px,' + (dy * 0.12) + 'px)';
      });
      btn.addEventListener('mouseleave', function () {
        inner.style.transition = EASE_BACK;
        inner.style.transform  = '';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    /* Skip on touch devices */
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

    document.querySelectorAll('.btn-primary, .btn-outline, [data-magnetic]')
      .forEach(attach);
  });
})();
