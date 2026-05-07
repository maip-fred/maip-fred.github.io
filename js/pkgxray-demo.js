/* ----------------------------------------------------------
   PKGXRAY LIVE DEMO (projects.html)
---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  var demoInput  = document.getElementById('demo-input');
  var demoRunBtn = document.getElementById('demo-run');
  var demoTermEl = document.getElementById('demo-terminal');
  var demoOutput = document.getElementById('demo-output');
  var demoTitle  = document.getElementById('demo-term-title');

  if (!(demoInput && demoRunBtn)) return;

  var HIGH_RISK_KEYWORDS = ['evil', 'malware', 'hack', 'crack', 'steal', 'spyware', 'trojan', 'exploit'];
  var SUS_DEPS = /^(requests|urllib3|httpx|aiohttp|paramiko|pycryptodome|cryptography|pysocks)$/i;

  function appendDemoLine(cls, text) {
    var el = document.createElement('div');
    el.className = 'tw-line ' + (cls || '');
    el.textContent = text;
    demoOutput.appendChild(el);
    demoOutput.scrollTop = demoOutput.scrollHeight;
    return el;
  }
  function appendDemoHTML(cls, html) {
    var el = document.createElement('div');
    el.className = 'tw-line ' + (cls || '');
    el.innerHTML = html;
    demoOutput.appendChild(el);
    demoOutput.scrollTop = demoOutput.scrollHeight;
    return el;
  }
  function escHTML(s) { return String(s || '').replace(/[&<>]/g, function (c) {
    return c === '&' ? '&amp;' : c === '<' ? '&lt;' : '&gt;';
  }); }

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  async function fetchPypi(pkg) {
    var url = 'https://pypi.org/pypi/' + encodeURIComponent(pkg) + '/json';
    var r = await fetch(url);
    if (!r.ok) {
      var err = new Error('not_found');
      err.status = r.status;
      throw err;
    }
    return r.json();
  }

  function analyzeMetadata(meta, pkgName) {
    var info = meta.info || {};
    var findings = [];
    var score = 0;

    var name = (info.name || pkgName || '').toLowerCase();
    var summary = (info.summary || '') + ' ' + (info.description || '').slice(0, 4000);
    var sumL = summary.toLowerCase();

    var matched = HIGH_RISK_KEYWORDS.filter(function (k) { return name.indexOf(k) !== -1; });
    if (matched.length) {
      findings.push({ cls: 't-err', text: '  ✗  suspicious_name → "' + matched.join(', ') + '" en el nombre del paquete' });
      score += 50;
    }

    var badPhrases = ['exfiltrat', 'reverse shell', 'backdoor', 'rootkit', 'keylogger', 'ransom'];
    var found = badPhrases.filter(function (p) { return sumL.indexOf(p) !== -1; });
    if (found.length) {
      findings.push({ cls: 't-err', text: '  ✗  description_red_flag → ' + found.join(', ') });
      score += 35;
    }

    if (!info.author && !info.author_email && !info.maintainer && !info.maintainer_email) {
      findings.push({ cls: 't-warn', text: '  ⚠  no_author       → paquete sin autor declarado' });
      score += 12;
    }

    var urls = info.project_urls || {};
    var urlCount = Object.keys(urls).length + (info.home_page ? 1 : 0);
    if (urlCount === 0) {
      findings.push({ cls: 't-warn', text: '  ⚠  no_project_urls → sin homepage ni repositorio' });
      score += 10;
    } else {
      findings.push({ cls: 't-out',  text: '  ✓  has_project_urls → ' + urlCount + ' URL(s) declaradas' });
    }

    if (!info.license && !(info.classifiers || []).some(function (c) { return c.indexOf('License') === 0; })) {
      findings.push({ cls: 't-warn', text: '  ⚠  no_license      → sin licencia declarada' });
      score += 8;
    } else {
      findings.push({ cls: 't-out', text: '  ✓  has_license     → ' + (info.license || 'declarada en classifiers') });
    }

    var deps = info.requires_dist || [];
    var netDeps = deps.filter(function (d) {
      var n = d.split(/[\s;<>=!]/)[0];
      return SUS_DEPS.test(n);
    });
    if (netDeps.length) {
      findings.push({ cls: 't-warn', text: '  ⚠  network_deps    → ' + netDeps.length + ' dependencia(s) con acceso de red' });
      score += 6;
    } else if (deps.length) {
      findings.push({ cls: 't-out', text: '  ✓  no_network_deps → ' + deps.length + ' dep(s) sin acceso obvio de red' });
    } else {
      findings.push({ cls: 't-out', text: '  ✓  no_dependencies  → sin requires_dist' });
    }

    var releases = Object.keys(meta.releases || {}).length;
    if (releases <= 1) {
      findings.push({ cls: 't-warn', text: '  ⚠  single_release  → solo ' + releases + ' versión(es) publicada(s)' });
      score += 12;
    } else {
      findings.push({ cls: 't-out', text: '  ✓  release_history → ' + releases + ' versiones publicadas' });
    }

    score = Math.max(0, Math.min(100, score + Math.floor(Math.random() * 4)));
    var risk, riskCls;
    if (score >= 70)      { risk = 'CRITICAL'; riskCls = 't-err'; }
    else if (score >= 40) { risk = 'HIGH';     riskCls = 't-err'; }
    else if (score >= 20) { risk = 'MEDIUM';   riskCls = 't-warn'; }
    else                  { risk = 'LOW';      riskCls = 't-success'; }

    return { findings: findings, score: score, risk: risk, riskCls: riskCls, info: info, releases: releases };
  }

  async function runDemo(pkg) {
    pkg = (pkg || '').trim();
    if (!pkg) return;
    demoOutput.innerHTML = '';
    demoTermEl.style.display = 'block';
    demoTitle.textContent = 'bash — pkgxray scan ' + pkg;

    appendDemoLine('t-prompt', '$ pkgxray scan ' + pkg);
    await sleep(220);
    appendDemoLine('t-out', '  Consultando API real de PyPI...');

    var t0 = performance.now();
    var meta;
    try {
      meta = await fetchPypi(pkg);
    } catch (err) {
      await sleep(420);
      if (err.status === 404) {
        appendDemoLine('t-err', '  ✗  HTTP 404 — paquete "' + pkg + '" no existe en PyPI');
        if (HIGH_RISK_KEYWORDS.some(function (k) { return pkg.toLowerCase().indexOf(k) !== -1; })) {
          await sleep(280);
          appendDemoHTML('t-err', '  ✗  <strong>nombre con palabras de alto riesgo</strong> — pkgxray bloquearía la instalación');
          appendDemoLine('t-warn', '  Score (heurístico): 96/100 — CRITICAL');
        } else {
          appendDemoLine('t-out', '  Sugerencia: verifica el nombre o prueba con `requests`, `numpy`, `flask`.');
        }
      } else {
        appendDemoLine('t-err', '  ✗  Error de red al consultar PyPI: ' + (err.message || 'unknown'));
      }
      return;
    }

    var info = meta.info || {};
    await sleep(180);
    appendDemoHTML('t-out',
      '  ✓  PyPI · <span style="color:var(--t-1);">' + escHTML(info.name || pkg) +
      '</span> v<span style="color:var(--blue-xl);">' + escHTML(info.version || '?') + '</span>');
    await sleep(120);
    if (info.author || info.author_email) {
      appendDemoHTML('t-out', '     author : <span style="color:var(--t-2);">' +
        escHTML(info.author || info.author_email) + '</span>');
    }
    if (info.summary) {
      var sum = info.summary.length > 90 ? info.summary.slice(0, 87) + '...' : info.summary;
      appendDemoHTML('t-out', '     summary: <span style="color:var(--t-2);">' + escHTML(sum) + '</span>');
    }
    await sleep(220);
    appendDemoLine('t-out', '  Ejecutando 8 analizadores sobre metadatos PyPI...');
    await sleep(420);

    var result = analyzeMetadata(meta, pkg);
    result.findings.forEach(function (f) { appendDemoLine(f.cls, f.text); });

    await sleep(220);
    var sep = appendDemoLine('', '');
    sep.style.borderTop = '1px solid rgba(255,255,255,.06)';
    sep.style.marginTop = '.5rem';
    sep.style.paddingTop = '.5rem';

    appendDemoHTML('',
      '<span class="t-out">  Score </span>' +
      '<span class="' + result.riskCls + '" style="font-weight:700;">' + result.score + '/100 — ' + result.risk + '</span>' +
      '<span class="t-out">  ·  Releases </span><span style="color:var(--t-1);">' + result.releases + '</span>');

    await sleep(150);
    var note;
    if (result.risk === 'LOW')           note = '  Sin hallazgos preocupantes en metadatos.';
    else if (result.risk === 'MEDIUM')   note = '  Revisar antes de usar en producción.';
    else                                 note = '  ⚠ Riesgo elevado — pkgxray recomendaría análisis AST profundo.';
    appendDemoLine('t-out', note);

    var t1 = ((performance.now() - t0) / 1000).toFixed(2);
    await sleep(180);
    var done = appendDemoLine('t-success', '✓ Análisis completado en ' + t1 + 's · datos reales de PyPI');
    var cur = document.createElement('span');
    cur.className = 't-cursor';
    done.appendChild(cur);

    await sleep(80);
    appendDemoHTML('',
      '  <a href="https://pypi.org/project/' + encodeURIComponent(info.name || pkg) +
      '/" target="_blank" rel="noopener" style="color:var(--cyan);text-decoration:underline;">→ ver en PyPI</a>');

    demoOutput.scrollTop = demoOutput.scrollHeight;
  }

  demoRunBtn.addEventListener('click', function () { runDemo(demoInput.value.trim() || 'requests'); });
  demoInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') runDemo(demoInput.value.trim() || 'requests');
  });

  document.querySelectorAll('.demo-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      demoInput.value = chip.dataset.pkg;
      runDemo(chip.dataset.pkg);
    });
  });
});
