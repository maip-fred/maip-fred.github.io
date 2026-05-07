/* ----------------------------------------------------------
   SKILLS RADAR (skills.html)
---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  var radar = document.getElementById('skills-radar');
  if (!radar) return;

  var DATA = [
    { label: 'Data Science',  value: 0.88, color: 'var(--blue)'   },
    { label: 'DataViz & Geo', value: 0.74, color: 'var(--olive)'  },
    { label: 'Security',      value: 0.82, color: 'var(--green)'  },
    { label: 'Frontend',      value: 0.74, color: 'var(--yellow)' },
    { label: 'DevOps',        value: 0.65, color: 'var(--orange)' },
  ];
  var R = 160;
  var N = DATA.length;

  function pt(angle, radius) {
    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
  }
  function ringPoints(scale) {
    var out = [];
    for (var i = 0; i < N; i++) {
      var a = (Math.PI * 2 * i / N) - Math.PI / 2;
      var p = pt(a, R * scale);
      out.push(p[0].toFixed(1) + ',' + p[1].toFixed(1));
    }
    return out.join(' ');
  }

  var rings = radar.querySelectorAll('.radar-grid polygon');
  rings.forEach(function (poly) {
    poly.setAttribute('points', ringPoints(parseFloat(poly.dataset.rings)));
  });

  var axes = radar.querySelector('.radar-axes');
  var labels = radar.querySelector('.radar-labels');
  var labelHTML = '', axesHTML = '';
  for (var i = 0; i < N; i++) {
    var a = (Math.PI * 2 * i / N) - Math.PI / 2;
    var p = pt(a, R);
    axesHTML += '<line x1="0" y1="0" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) + '" />';
    var lp = pt(a, R + 28);
    var anchor = Math.abs(lp[0]) < 1 ? 'middle' : (lp[0] > 0 ? 'start' : 'end');
    labelHTML += '<text x="' + lp[0].toFixed(1) + '" y="' + (lp[1] + 4).toFixed(1) +
                 '" text-anchor="' + anchor + '">' + DATA[i].label + '</text>';
  }
  axes.innerHTML = axesHTML;
  labels.innerHTML = labelHTML;

  var poly = radar.querySelector('.radar-poly');
  var ptsGroup = radar.querySelector('.radar-points');
  var dataPts = [];
  var pointsHTML = '';
  for (var j = 0; j < N; j++) {
    var ang = (Math.PI * 2 * j / N) - Math.PI / 2;
    var dp = pt(ang, R * DATA[j].value);
    dataPts.push(dp[0].toFixed(1) + ',' + dp[1].toFixed(1));
    pointsHTML += '<g class="rdp" style="--c:' + DATA[j].color + ';">' +
                  '<circle cx="' + dp[0].toFixed(1) + '" cy="' + dp[1].toFixed(1) + '" r="6" class="rdp-halo"/>' +
                  '<circle cx="' + dp[0].toFixed(1) + '" cy="' + dp[1].toFixed(1) + '" r="3.2" class="rdp-dot"/>' +
                  '</g>';
  }
  ptsGroup.innerHTML = pointsHTML;

  poly.setAttribute('points', dataPts.map(function () { return '0,0'; }).join(' '));
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        requestAnimationFrame(function () {
          poly.style.transition = 'all 0.9s cubic-bezier(0.22, 1, 0.36, 1)';
          poly.setAttribute('points', dataPts.join(' '));
          radar.classList.add('radar-active');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  observer.observe(radar);
});
