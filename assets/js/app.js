/* =====================================================================
   Hand-written. No dependencies.
   ===================================================================== */
(function () {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.documentElement.classList.add('js');

  const LOCK = '<svg viewBox="0 0 16 16" aria-hidden="true">' +
    '<path d="M4.6 7V5.2a3.4 3.4 0 1 1 6.8 0V7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
    '<rect x="3.1" y="7" width="9.8" height="6.6" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';

  /* =================================================================
     theme
     ================================================================= */
  (function theme() {
    const btn = $('#theme'); if (!btn) return;
    const meta = $('meta[name="theme-color"]');
    const paint = () => {
      const dark = document.documentElement.dataset.theme === 'dark';
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
      if (meta) meta.setAttribute('content', dark ? '#17140F' : '#F7F3EC');
    };
    btn.addEventListener('click', function () {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      paint();
    });
    paint();
  })();

  /* =================================================================
     copper routing that follows the cursor
     Traces grow toward the pointer the way a board is actually routed:
     one orthogonal run, then a 45° break, with a via at every turn.
     ================================================================= */
  (function routing() {
    const cv = $('#traces'); if (!cv) return;
    if (REDUCED || !matchMedia('(pointer:fine)').matches) return;

    let W = 0, H = 0, ctx = null;
    const LIFE = 5200, MIN_STEP = 46;
    let head = null, segs = [], pads = [], target = null, running = false;

    function size() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const r = cv.getBoundingClientRect();
      cv.width = Math.max(1, Math.round(r.width * dpr));
      cv.height = Math.max(1, Math.round(r.height * dpr));
      ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      W = r.width; H = r.height;
    }
    size();
    addEventListener('resize', size, { passive: true });

    function route(a, b) {
      const dx = b.x - a.x, dy = b.y - a.y;
      const ax = Math.abs(dx), ay = Math.abs(dy);
      const mid = ax > ay
        ? { x: b.x - Math.sign(dx) * ay, y: a.y }
        : { x: a.x, y: b.y - Math.sign(dy) * ax };
      return [a, mid, b];
    }

    addEventListener('pointermove', function (e) {
      target = { x: e.clientX, y: e.clientY };
      if (!head) { head = target; pads.push({ x: head.x, y: head.y, t: performance.now() }); }
      if (!running) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });

    function tick(now) {
      if (head && target) {
        const d = Math.hypot(target.x - head.x, target.y - head.y);
        if (d > MIN_STEP) {
          const p = route(head, target);
          segs.push({ a: p[0], b: p[1], t: now }, { a: p[1], b: p[2], t: now });
          pads.push({ x: p[1].x, y: p[1].y, t: now }, { x: p[2].x, y: p[2].y, t: now });
          head = target;
        }
      }

      segs = segs.filter(s => now - s.t < LIFE);
      pads = pads.filter(p => now - p.t < LIFE);

      const cs = getComputedStyle(document.documentElement);
      const copper = cs.getPropertyValue('--copper-2').trim() || '#BE7146';
      const paper  = cs.getPropertyValue('--paper').trim()   || '#F7F3EC';

      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 2.2;
      ctx.strokeStyle = copper;
      segs.forEach(function (s) {
        const k = 1 - (now - s.t) / LIFE;
        ctx.globalAlpha = k * k * .5;
        ctx.beginPath(); ctx.moveTo(s.a.x, s.a.y); ctx.lineTo(s.b.x, s.b.y); ctx.stroke();
      });

      pads.forEach(function (p) {
        const k = 1 - (now - p.t) / LIFE;
        ctx.globalAlpha = k * k * .55;
        ctx.fillStyle = copper;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3.1, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = k * k;
        ctx.fillStyle = paper;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.15, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      if (segs.length || pads.length) requestAnimationFrame(tick);
      else running = false;
    }
  })();

  /* =================================================================
     education
     ================================================================= */
  (function edu() {
    const ul = $('#edu');
    if (!ul || typeof EDUCATION === 'undefined') return;
    ul.innerHTML = EDUCATION.map(e =>
      '<li><b>' + e.school + '</b><i>' + e.when + '</i><span>' + e.detail + '</span></li>').join('');
  })();

  /* =================================================================
     skills
     ================================================================= */
  (function skills() {
    const host = $('#skill-grid');
    if (!host || typeof SKILLS === 'undefined') return;
    host.innerHTML = SKILLS.map(s =>
      '<div class="skill-col" data-rv><h3>' + s.t + '</h3><ul>' +
      s.items.map(i => '<li>' + i + '</li>').join('') +
      '</ul></div>').join('');
  })();

  /* =================================================================
     experience
     ================================================================= */
  (function xp() {
    const ol = $('#xp');
    if (!ol || typeof EXPERIENCE === 'undefined') return;
    ol.innerHTML = EXPERIENCE.map(e =>
      '<li data-rv>' +
        '<div class="xp-head">' +
          '<h3 class="xp-role">' + e.role + '</h3>' +
          '<span class="xp-when">' + e.when + '</span>' +
        '</div>' +
        '<p class="xp-org">' + e.org + ' &middot; ' + e.where + '</p>' +
        '<ul class="xp-bul">' + e.bullets.map(b => '<li>' + b + '</li>').join('') + '</ul>' +
      '</li>').join('');
  })();

  /* =================================================================
     projects — grouped, compact cards
     ================================================================= */
  (function projects() {
    const host = $('#proj');
    if (!host || typeof GROUPS === 'undefined' || typeof PROJECTS === 'undefined') return;

    function linkHTML(l) {
      if (l[2] === 'private') {
        const t = l[1] ? 'Private repository — happy to walk through it' : 'Confidential — described above';
        return '<span class="p-link locked" title="' + t + '">' + LOCK + l[0] + '</span>';
      }
      if (!l[1]) return '<span class="p-link plain">' + l[0] + '</span>';
      return '<a class="p-link" href="' + l[1] + '" target="_blank" rel="noopener">' + l[0] + ' &rarr;</a>';
    }

    function cardHTML(p) {
      return '<article class="card" data-rv>' +
        '<div class="card-head">' +
          '<h3 class="card-t">' + p.title + '</h3>' +
          '<span class="card-w">' + p.when + '</span>' +
        '</div>' +
        '<p class="card-stack">' + p.stack + '</p>' +
        '<p class="card-d">' + p.d + '</p>' +
        '<dl class="card-stats">' + p.stats.map(s =>
          '<div><dt>' + s[0] + '</dt><dd>' + s[1] + '</dd></div>').join('') + '</dl>' +
        '<div class="card-foot">' + p.links.map(linkHTML).join('') + '</div>' +
      '</article>';
    }

    host.innerHTML = GROUPS.map(function (g) {
      const items = PROJECTS.filter(p => p.g === g.id);
      if (!items.length) return '';
      return '<section class="pgroup">' +
        '<div class="pgroup-head" data-rv>' +
          '<h3 class="pgroup-t">' + g.label + '</h3>' +
          '<p class="pgroup-n">' + g.note + '</p>' +
        '</div>' +
        '<div class="cards">' + items.map(cardHTML).join('') + '</div>' +
      '</section>';
    }).join('');
  })();

  /* =================================================================
     the eight bytes
     ================================================================= */
  (function frame() {
    const strip = $('#strip'), read = $('#frame-read');
    if (!strip || !read || typeof BYTES === 'undefined') return;

    strip.innerHTML = BYTES.map((b, i) =>
      '<button class="bt" type="button"><small>' + i + '</small><b>' + b.hex + '</b></button>').join('');

    const btns = $$('.bt', strip);
    function show(i) {
      const b = BYTES[i];
      btns.forEach((x, j) => x.classList.toggle('on', j === i));
      read.innerHTML = '<p class="fr-name">' + b.name + '</p>' +
        '<p class="fr-type">' + b.type + '</p><p class="fr-d">' + b.d + '</p>';
    }
    function idle() {
      btns.forEach(x => x.classList.remove('on'));
      read.innerHTML = '<p class="fr-idle">Pick a byte. Each one is a decision somebody had to make ' +
        'and then live with, which is most of what protocol design turns out to be.</p>';
    }
    btns.forEach((b, i) => {
      b.addEventListener('mouseenter', () => show(i));
      b.addEventListener('focus', () => show(i));
      b.addEventListener('click', () => show(i));
    });
    strip.addEventListener('mouseleave', idle);
    idle();
  })();

  /* =================================================================
     header hairline + nav highlighting
     ================================================================= */
  (function nav() {
    const top = $('.top');
    const links = $$('.top nav a');
    const secs = links.map(a => document.getElementById(a.getAttribute('href').slice(1)))
                      .filter(Boolean);

    if (top) {
      let queued = false, last = scrollY;
      addEventListener('scroll', function () {
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () {
          queued = false;
          const y = scrollY;
          top.classList.toggle('stuck', y > 12);
          // Retract on the way down, return on the way up. The header is worth
          // ~14% of a phone viewport, which is too much to hold while reading.
          const down = y > last && y > 260;
          if (Math.abs(y - last) > 6) top.classList.toggle('hide', down);
          last = y;
        });
      }, { passive: true });

      // Never leave it retracted when a keyboard user tabs into it.
      top.addEventListener('focusin', () => top.classList.remove('hide'));
    }

    if (!secs.length || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(l => l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secs.forEach(s => io.observe(s));
  })();

  /* =================================================================
     reveal — with a safety net so content can never stay hidden
     ================================================================= */
  (function reveal() {
    const all = $$('[data-rv]');
    const showAll = () => all.forEach(e => e.classList.add('in'));
    if (REDUCED || !('IntersectionObserver' in window)) { showAll(); return; }

    const io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .05 });

    all.forEach(e => io.observe(e));
    setTimeout(showAll, 2500);
  })();

})();
