/* Reconstrucao estatica dos popups do Elementor (o WordPress original fazia isso via elementor-pro).
   Este script roda no fim do <body>: captura os popups embutidos no HTML antes que os scripts
   do tema os removam do DOM, e os reapresenta como modal quando um link elementor-action e clicado. */
(function () {
  var css = document.createElement('style');
  css.textContent =
    '.sx-overlay{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.88);' +
    'overflow-y:auto;padding:6vh 16px 10vh}' +
    '.sx-close{position:fixed;top:14px;right:18px;z-index:100000;font:700 30px/1 sans-serif;' +
    'color:#fff;background:none;border:0;cursor:pointer}';
  document.head.appendChild(css);

  // captura e destaca os popups do DOM (garante rodape limpo, igual ao original)
  var popups = {};
  document.querySelectorAll('.elementor-location-popup').forEach(function (p) {
    popups[p.getAttribute('data-elementor-id')] = p;
    p.remove();
  });

  var overlay = null;
  function closeAll() {
    if (overlay) { overlay.remove(); overlay = null; }
  }

  function openPopup(id) {
    closeAll();
    var pop = popups[id];
    if (!pop) return;
    overlay = document.createElement('div');
    overlay.className = 'sx-overlay';
    var btn = document.createElement('button');
    btn.className = 'sx-close';
    btn.setAttribute('aria-label', 'Fechar');
    btn.textContent = '×';
    btn.addEventListener('click', closeAll);
    overlay.appendChild(btn);
    overlay.appendChild(pop);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeAll();
    });
    document.body.appendChild(overlay);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href*="elementor-action"]');
    if (!a) return;
    var href = decodeURIComponent(a.getAttribute('href') || '');
    var m = href.match(/settings=([A-Za-z0-9+/=]+)/);
    if (!m) return;
    e.preventDefault();
    try {
      var settings = JSON.parse(atob(m[1]));
      if (settings && settings.id) openPopup(String(settings.id));
    } catch (err) {}
  });
})();
