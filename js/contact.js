/* ----------------------------------------------------------
   CONTACT FORM + TERMINAL (contact.html)
---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {

  /* Contact form */
  var cform = document.getElementById('contact-form');
  if (cform) {
    var statusEl = document.getElementById('cf-status');
    var submitBtn = document.getElementById('cf-submit');
    var btnLabel  = cform.querySelector('.cf-btn-label');

    function clearError(field) {
      var err = cform.querySelector('.cform-error[data-for="' + field.id + '"]');
      if (err) err.textContent = '';
      field.classList.remove('cf-invalid');
    }
    function setError(field, msg) {
      var err = cform.querySelector('.cform-error[data-for="' + field.id + '"]');
      if (err) err.textContent = '[error] ' + msg;
      field.classList.add('cf-invalid');
    }
    function validate() {
      var ok = true;
      var fields = cform.querySelectorAll('input[required], textarea[required]');
      fields.forEach(function (f) {
        clearError(f);
        if (f.type === 'email') {
          if (!f.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) {
            setError(f, 'email inválido — formato esperado: nombre@dominio.com');
            ok = false;
          }
        } else if (!f.value.trim()) {
          setError(f, 'campo requerido');
          ok = false;
        } else if (f.minLength && f.value.trim().length < f.minLength) {
          setError(f, 'mínimo ' + f.minLength + ' caracteres (actual: ' + f.value.trim().length + ')');
          ok = false;
        }
      });
      return ok;
    }

    cform.querySelectorAll('input, textarea').forEach(function (f) {
      f.addEventListener('blur', function () {
        if (f.value) validate();
      });
      f.addEventListener('input', function () { clearError(f); });
    });

    cform.addEventListener('submit', async function (e) {
      e.preventDefault();
      statusEl.className = 'cform-status';
      if (!validate()) {
        statusEl.classList.add('cf-status-err');
        statusEl.textContent = '[error] revisa los campos marcados arriba';
        return;
      }

      var action = cform.getAttribute('action') || '';
      if (action.indexOf('REPLACE_WITH_YOUR_ID') !== -1) {
        statusEl.classList.add('cf-status-warn');
        statusEl.textContent = '[info] form aún no conectado a Formspree — usa el email directo abajo ↓';
        return;
      }

      submitBtn.disabled = true;
      btnLabel.textContent = 'Enviando...';
      statusEl.className = 'cform-status cf-status-pending';
      statusEl.textContent = 'POST → formspree.io · esperando respuesta...';

      try {
        var resp = await fetch(action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: new FormData(cform),
        });
        if (resp.ok) {
          cform.reset();
          statusEl.className = 'cform-status cf-status-ok';
          statusEl.textContent = '✓ 200 OK · mensaje enviado · te respondo pronto';
          btnLabel.textContent = 'Enviado ✓';
          setTimeout(function () { btnLabel.textContent = 'Enviar mensaje'; submitBtn.disabled = false; }, 3000);
        } else {
          throw new Error('HTTP ' + resp.status);
        }
      } catch (err) {
        statusEl.className = 'cform-status cf-status-err';
        statusEl.textContent = '[error] ' + (err.message || 'falló el envío') + ' — usa el email directo abajo';
        submitBtn.disabled = false;
        btnLabel.textContent = 'Enviar mensaje';
      }
    });
  }

  /* Contact terminal typewriter */
  if (document.getElementById('contact-term-body')) {
    window.runTypewriter('contact-term-body', [
      { text: '$ whoami', cls: 't-prompt', speed: 55 },
      { pause: 350 },
      { text: 'alfredo-ibanez', cls: 't-out', instant: true },
      { pause: 400 },
      { text: '$ contact --info', cls: 't-prompt', speed: 55 },
      { pause: 400 },
      { text: '  email:  ibanez.alfredo.02.10@gmail.com', cls: 't-info', instant: true },
      { pause: 200 },
      { text: '  github: github.com/maip-fred', cls: 't-info', instant: true },
      { pause: 200 },
      { text: '  loc:    Ciudad de México, México', cls: 't-info', instant: true },
      { pause: 500 },
      { text: '$ echo "Disponible para prácticas y colaboraciones"', cls: 't-prompt', speed: 40 },
      { pause: 300 },
      { text: 'Disponible para prácticas y colaboraciones', cls: 't-success', instant: true },
      { pause: 350 },
      { text: '$ send_email --to alfredo', cls: 't-prompt', speed: 50 },
    ]);
  }

});
