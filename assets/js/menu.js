/* =====================================================================
   Navbar utility menu — résumé and links.
   Shared by index.html and project.html.
   ===================================================================== */
(function () {
  'use strict';

  const host = document.getElementById('menu');
  if (!host) return;

  const RESUME = 'assets/Youssef-Anbar-Resume.pdf';

  const ICONS = {
    down: '<path d="M12 3v12M7 11l5 5 5-5M4 20h16"/>',
    open: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    hub:  '<path d="M12 2.6a9.4 9.4 0 0 0-3 18.3c.47.09.64-.2.64-.45v-1.6c-2.61.57-3.16-1.26-3.16-1.26-.43-1.08-1.04-1.37-1.04-1.37-.85-.58.06-.57.06-.57.94.07 1.44.97 1.44.97.84 1.44 2.2 1.02 2.74.78.09-.61.33-1.02.6-1.26-2.09-.24-4.28-1.04-4.28-4.64 0-1.02.36-1.86.96-2.51-.1-.24-.42-1.2.09-2.49 0 0 .79-.25 2.58.96a9 9 0 0 1 4.7 0c1.79-1.21 2.58-.96 2.58-.96.51 1.29.19 2.25.09 2.49.6.65.96 1.49.96 2.51 0 3.61-2.2 4.4-4.29 4.63.34.29.64.87.64 1.75v2.58c0 .25.17.55.65.45A9.4 9.4 0 0 0 12 2.6Z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.6 6.5 12 13l8.4-6.5"/>'
  };
  const ico = k => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[k] + '</svg>';

  const ITEMS = [
    { k:'down', label:'Download résumé', sub:'PDF · 308 KB', href:RESUME, download:'Youssef-Anbar-Resume.pdf' },
    { k:'open', label:'Open résumé',     sub:'in a new tab',  href:RESUME, blank:true },
    { k:'hub',  label:'GitHub',          sub:'YoussefAnbar',  href:'https://github.com/YoussefAnbar', blank:true },
    { k:'mail', label:'Email me',        sub:'yha249@my.utexas.edu', href:'mailto:yha249@my.utexas.edu' }
  ];

  host.innerHTML =
    '<button class="menu-btn" id="menu-btn" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="menu-list">' +
      '<span>Résumé &amp; links</span>' +
      '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' +
    '</button>' +
    '<div class="menu-list" id="menu-list" role="menu" aria-labelledby="menu-btn" hidden>' +
      ITEMS.map(function (i) {
        return '<a role="menuitem" href="' + i.href + '"' +
          (i.download ? ' download="' + i.download + '"' : '') +
          (i.blank ? ' target="_blank" rel="noopener"' : '') + '>' +
          '<span class="mi-ic">' + ico(i.k) + '</span>' +
          '<span class="mi-t"><b>' + i.label + '</b><small>' + i.sub + '</small></span></a>';
      }).join('') +
    '</div>';

  const btn = document.getElementById('menu-btn');
  const list = document.getElementById('menu-list');
  const items = Array.prototype.slice.call(list.querySelectorAll('[role="menuitem"]'));

  function open() {
    list.hidden = false;
    host.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    document.addEventListener('pointerdown', outside, true);
  }
  function close(focusBtn) {
    list.hidden = true;
    host.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', outside, true);
    if (focusBtn) btn.focus();
  }
  function outside(e) { if (!host.contains(e.target)) close(false); }
  const isOpen = () => !list.hidden;

  btn.addEventListener('click', function () { isOpen() ? close(false) : open(); });

  btn.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isOpen()) open();
      items[0].focus();
    }
  });

  list.addEventListener('keydown', function (e) {
    const i = items.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); close(true); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    else if (e.key === 'Home')      { e.preventDefault(); items[0].focus(); }
    else if (e.key === 'End')       { e.preventDefault(); items[items.length - 1].focus(); }
    else if (e.key === 'Tab')       { close(false); }
  });

  // Selecting an item closes the menu, but never before the browser has acted on it.
  items.forEach(a => a.addEventListener('click', () => setTimeout(() => close(false), 0)));
})();
