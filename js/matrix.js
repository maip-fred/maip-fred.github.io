/* matrix.js — Matrix digital rain easter egg */
(function () {
  /* Katakana + latin + digits for authentic feel */
  var CHARS = 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ' +
              'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz' +
              '0123456789!@#$%^&*<>/\\|{}[]';

  var FONT_SIZE = 14;
  var GREEN_BRIGHT = '#00ff41';
  var GREEN_DIM    = '#008f11';
  var WHITE_FLASH  = '#e0ffe0';

  var overlay, canvas, ctx;
  var cols, drops, headCol;
  var RAF = null;
  var active = false;

  /* ── bootstrap ──────────────────────────────────────────── */
  function bootstrap() {
    overlay = document.getElementById('matrix-overlay');
    if (!overlay) return;
    canvas  = document.getElementById('matrix-canvas');
    ctx     = canvas.getContext('2d');

    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && active) stop();
    });
    overlay.addEventListener('click', stop);
    onResize();
  }

  function onResize() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    reset();
  }

  function reset() {
    cols    = Math.floor(canvas.width / FONT_SIZE) + 1;
    drops   = new Array(cols).fill(1).map(function () {
      return Math.floor(Math.random() * -80); /* stagger start */
    });
    headCol = new Array(cols).fill(0).map(function () {
      return Math.floor(Math.random() * CHARS.length);
    });
  }

  /* ── render loop ─────────────────────────────────────────── */
  function draw() {
    if (!active) return;
    RAF = requestAnimationFrame(draw);

    /* Fade trail — semi-transparent black fill */
    ctx.fillStyle = 'rgba(0,0,0,0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = FONT_SIZE + 'px "JetBrains Mono", monospace';

    for (var i = 0; i < cols; i++) {
      var drop = drops[i];
      var y    = drop * FONT_SIZE;

      /* Only draw when in viewport range */
      if (y < -FONT_SIZE || y > canvas.height + FONT_SIZE) {
        if (y > canvas.height && Math.random() > 0.97) {
          drops[i] = Math.floor(Math.random() * -40);
        }
        drops[i]++;
        continue;
      }

      var char = CHARS[Math.floor(Math.random() * CHARS.length)];

      /* Head char — bright white flash */
      ctx.fillStyle = WHITE_FLASH;
      ctx.fillText(char, i * FONT_SIZE, y);

      /* Body chars one row back — bright green */
      if (drop > 1) {
        var bodyChar = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = GREEN_BRIGHT;
        ctx.fillText(bodyChar, i * FONT_SIZE, (drop - 1) * FONT_SIZE);
      }

      /* Reset column when it exceeds screen + random tail length */
      if (y > canvas.height && Math.random() > 0.97) {
        drops[i] = Math.floor(Math.random() * -60);
      }
      drops[i]++;
    }
  }

  /* ── public API ──────────────────────────────────────────── */
  window.matrixStart = function () {
    if (!overlay) bootstrap();
    if (!overlay) return;

    active = true;
    reset();
    overlay.classList.add('matrix-active');

    /* Full black clear before starting */
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (RAF) cancelAnimationFrame(RAF);
    draw();
  };

  function stop() {
    active = false;
    if (RAF) { cancelAnimationFrame(RAF); RAF = null; }
    if (overlay) overlay.classList.remove('matrix-active');
  }
  window.matrixStop = stop;

  document.addEventListener('DOMContentLoaded', bootstrap);
})();
