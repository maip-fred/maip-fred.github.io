/* ----------------------------------------------------------
   PYPI LIVE METRICS (pkgxray.html) — D5
   Fetches real data from PyPI and updates the metrics grid
---------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  var versionEl  = document.getElementById('pypi-version');
  var releasesEl = document.getElementById('pypi-releases');
  var updatedEl  = document.getElementById('pypi-updated');

  if (!versionEl) return;

  fetch('https://pypi.org/pypi/pkgxray/json')
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function (data) {
      var info = data.info || {};
      var releases = Object.keys(data.releases || {});

      if (versionEl && info.version) {
        versionEl.textContent = 'v' + info.version;
      }
      if (releasesEl) {
        releasesEl.textContent = releases.length;
      }
      if (updatedEl) {
        var latestRelease = data.releases[info.version];
        if (latestRelease && latestRelease.length) {
          var uploadTime = latestRelease[0].upload_time_iso_8601 || latestRelease[0].upload_time;
          if (uploadTime) {
            var d = new Date(uploadTime);
            updatedEl.textContent = d.toLocaleDateString('es-MX', { month: 'short', year: 'numeric' });
          }
        }
      }
    })
    .catch(function () {
      /* silently keep the static values on error */
    });
});
