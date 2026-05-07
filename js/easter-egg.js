/* ----------------------------------------------------------
   EASTER EGG — Konami Code ↑↑↓↓←→←→BA
---------------------------------------------------------- */
(function () {
  var KONAMI = [38,38,40,40,37,39,37,39,66,65];
  var seq = [];

  var eggHtml =
    '<div id="easter-egg">' +
    '<button class="egg-close" id="egg-close">ESC / cerrar</button>' +
    '<div class="egg-inner">' +
    '<p style="font-family:var(--f-mono);font-size:.65rem;letter-spacing:.2em;color:var(--t-4);margin-bottom:1.5rem;">// easter egg desbloqueado</p>' +
    '<div class="terminal-win">' +
    '<div class="terminal-chrome"><span class="t-dot red"></span><span class="t-dot yellow"></span><span class="t-dot green"></span><span class="terminal-title" style="font-size:.72rem;">alfredo@itam:~$</span></div>' +
    '<div class="terminal-body" id="egg-body"></div>' +
    '</div>' +
    '<p style="font-family:var(--f-display);font-size:1.1rem;font-style:italic;color:var(--t-2);margin-top:2rem;line-height:1.6;">"Cualquiera puede escribir código que entienda una computadora.<br>El buen programador escribe código que entienden otros humanos."</p>' +
    '<p style="font-family:var(--f-mono);font-size:.7rem;color:var(--t-4);margin-top:.5rem;">— Martin Fowler</p>' +
    '</div>' +
    '</div>';

  document.addEventListener('DOMContentLoaded', function () {
    document.body.insertAdjacentHTML('beforeend', eggHtml);

    var egg = document.getElementById('easter-egg');
    var closeBtn = document.getElementById('egg-close');
    var eggBody = document.getElementById('egg-body');

    function openEgg() {
      egg.classList.add('active');
      eggBody.innerHTML = '';
      if (typeof lucide !== 'undefined') lucide.createIcons();
      var lines = [
        { text: '$ whoami', cls: 't-prompt', speed: 60 },
        { pause: 400 },
        { text: 'alfredo-ibanez · ITAM · Gen. 2022', cls: 't-out', instant: true },
        { pause: 300 },
        { text: '$ cat secret.txt', cls: 't-prompt', speed: 55 },
        { pause: 500 },
        { text: '  Encontraste el easter egg! 🎉', cls: 't-success', instant: true },
        { pause: 200 },
        { text: '  Combinación: ↑ ↑ ↓ ↓ ← → ← → B A', cls: 't-info', instant: true },
        { pause: 300 },
        { text: '$ echo $STACK', cls: 't-prompt', speed: 55 },
        { pause: 350 },
        { text: '  Python · SQL · R · Java · Docker · pkgxray', cls: 't-out', instant: true },
        { pause: 300 },
        { text: '$ git log --oneline -1', cls: 't-prompt', speed: 50 },
        { pause: 400 },
        { text: '  HEAD → buscando prácticas y colaboraciones', cls: 't-cyan', instant: true },
      ];
      window.runTypewriter && window.runTypewriter('egg-body', lines);
    }

    closeBtn.addEventListener('click', function () { egg.classList.remove('active'); });
    egg.addEventListener('click', function (e) { if (e.target === egg) egg.classList.remove('active'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') egg.classList.remove('active');
      seq.push(e.keyCode);
      seq.splice(-KONAMI.length - 1, seq.length - KONAMI.length);
      if (seq.join(',') === KONAMI.join(',')) openEgg();
    });
  });
}());
