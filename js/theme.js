/* ============================================================
   theme.js — Toggle de modo oscuro (preparado, no activo)

   Para activar:
   1. Descomentar todo el bloque de abajo.
   2. Agregar un botón con id="theme-toggle" en el HTML
      (en el <nav>, junto al menú hamburguesa).
   3. Descomentar el bloque .dark en css/styles.css.
   ============================================================ */

/*

(function () {
  var STORAGE_KEY = 'theme';
  var htmlEl = document.documentElement;

  // Leer preferencia guardada o usar la del sistema operativo
  function getPreferredTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Aplicar tema al elemento <html>
  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlEl.classList.add('dark');
    } else {
      htmlEl.classList.remove('dark');
    }
  }

  // Aplicar al cargar la página (antes del DOMContentLoaded para evitar flash)
  applyTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', function () {
    var toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', function () {
      var current = htmlEl.classList.contains('dark') ? 'dark' : 'light';
      var next    = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    });
  });
})();

*/
