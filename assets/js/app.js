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

  /* ---------- interest icons (24×24 line) --------------------------- */
  const ICON = {
    board:'<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M7 8h4l2 3h5M7 16h3l2-2"/><circle cx="7" cy="8" r="1.1"/><circle cx="17" cy="11" r="1.1"/>',
    chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3"/>',
    wave: '<path d="M2 12c2.5 0 2.5-7 5-7s2.5 14 5 14 2.5-7 5-7 2.5 3 5 3"/>',
    arm:  '<path d="M4 21h6M7 21v-5l6-4 4-6"/><circle cx="7" cy="16" r="2"/><circle cx="13" cy="12" r="1.8"/><circle cx="17" cy="6" r="2.4"/>',
    car:  '<path d="M3 15h18M5 15l1.8-5A2 2 0 0 1 8.7 8.6h6.6a2 2 0 0 1 1.9 1.4L19 15v3.5h-3V17H8v1.5H5Z"/><circle cx="8" cy="15" r="1"/><circle cx="16" cy="15" r="1"/>',
    brain:'<circle cx="6" cy="7" r="2"/><circle cx="6" cy="17" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="7" r="2"/><circle cx="19" cy="17" r="2"/><path d="M8 8l2.4 2.6M8 16l2.4-2.6M14 11l3-2.6M14 13l3 2.6"/>',
    code: '<path d="M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5M13.5 4.5l-3 15"/>'
  };
  const icon = k => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON[k] || ICON.chip) + '</svg>';

  /* ---------- project cover art ------------------------------------- */
  const C = 'var(--copper-2)', D = 'var(--copper)';
  const COVER = {
    board:'<path d="M20 100h48l26-28h60l24 26h92" /><path d="M20 40h34l22 24h84" /><path d="M232 40v34l-20 20"/>' +
          '<circle cx="68" cy="100" r="5"/><circle cx="94" cy="72" r="5"/><circle cx="154" cy="72" r="5"/>' +
          '<circle cx="54" cy="40" r="5"/><circle cx="140" cy="64" r="5"/><rect x="112" y="90" width="46" height="30" rx="3"/>',
    trace:'<path d="M0 110h50l30-30h60l30 30h130"/><path d="M0 66h30l26-26h70"/><path d="M300 30H210l-26 26"/>' +
          '<path d="M0 24h90l20 20"/><circle cx="50" cy="110" r="4.5"/><circle cx="140" cy="80" r="4.5"/><circle cx="184" cy="56" r="4.5"/>',
    wave: '<path d="M0 66q18-46 36 0t36 0q18-46 36 0t36 0q18-46 36 0t36 0q18-46 36 0t36 0"/>' +
          '<path d="M0 96q24-22 48 0t48 0q24-22 48 0t48 0q24-22 48 0" opacity=".45"/>',
    coil: '<circle cx="150" cy="66" r="14"/><circle cx="150" cy="66" r="28"/><circle cx="150" cy="66" r="42"/>' +
          '<circle cx="150" cy="66" r="56" opacity=".5"/><path d="M0 66h80M220 66h80"/>' +
          '<path d="M84 52v28M216 52v28"/>',
    flow: '<rect x="16" y="46" width="56" height="40" rx="6"/><rect x="122" y="46" width="56" height="40" rx="6"/>' +
          '<rect x="228" y="46" width="56" height="40" rx="6"/><path d="M72 66h50M178 66h50"/>' +
          '<path d="M112 60l10 6-10 6M218 60l10 6-10 6" fill="currentColor" stroke="none"/>',
    arm:  '<path d="M40 118h60M70 118V78l50-26 42-30"/><circle cx="70" cy="78" r="9"/><circle cx="120" cy="52" r="7"/>' +
          '<circle cx="162" cy="22" r="10"/><path d="M162 32v26M150 58h24" opacity=".6"/><path d="M200 118h70" opacity=".4"/>',
    doc:  '<rect x="46" y="18" width="90" height="100" rx="5"/><rect x="70" y="30" width="90" height="100" rx="5" opacity=".55"/>' +
          '<path d="M86 52h58M86 68h58M86 84h36"/><path d="M186 46l14 14 26-30" stroke-width="4"/>',
    grid: '<rect x="24" y="24" width="52" height="34" rx="5"/><rect x="124" y="24" width="52" height="34" rx="5"/>' +
          '<rect x="224" y="24" width="52" height="34" rx="5"/><rect x="74" y="86" width="52" height="34" rx="5"/>' +
          '<rect x="174" y="86" width="52" height="34" rx="5"/><path d="M76 41h48M176 41h48M100 58v28M200 58v28"/>',
    chart:'<path d="M22 118V66M62 118V38M102 118V84M142 118V52M182 118V72M222 118V30M262 118V60" stroke-width="7" stroke-linecap="round"/>' +
          '<path d="M22 100l40-26 40 22 40-30 40 14 40-26 40 18" opacity=".55" stroke-width="2"/>',
    stack:'<rect x="60" y="86" width="180" height="26" rx="5"/><rect x="76" y="54" width="148" height="26" rx="5" opacity=".72"/>' +
          '<rect x="92" y="22" width="116" height="26" rx="5" opacity=".48"/>',
    net:  '<circle cx="44" cy="40" r="8"/><circle cx="44" cy="92" r="8"/><circle cx="150" cy="26" r="8"/>' +
          '<circle cx="150" cy="66" r="8"/><circle cx="150" cy="106" r="8"/><circle cx="256" cy="66" r="8"/>' +
          '<path d="M52 40l90-12M52 40l90 26M52 40l90 62M52 92l90-62M52 92l90-24M52 92l90 12' +
          'M158 26l90 36M158 66h90M158 106l90-36" opacity=".45"/>'
  };
  function cover(kind) {
    return '<svg viewBox="0 0 300 132" preserveAspectRatio="xMidYMid slice" aria-hidden="true" ' +
      'fill="none" stroke="' + C + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
      (COVER[kind] || COVER.trace) + '</svg>';
  }

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
      const dx = b.x - a.x, dy = b.y - a.y, ax = Math.abs(dx), ay = Math.abs(dy);
      const mid = ax > ay ? { x: b.x - Math.sign(dx) * ay, y: a.y }
                          : { x: a.x, y: b.y - Math.sign(dy) * ax };
      return [a, mid, b];
    }

    addEventListener('pointermove', function (e) {
      target = { x: e.clientX, y: e.clientY };
      if (!head) { head = target; pads.push({ x: head.x, y: head.y, t: performance.now() }); }
      if (!running) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });

    function tick(now) {
      if (head && target && Math.hypot(target.x - head.x, target.y - head.y) > MIN_STEP) {
        const p = route(head, target);
        segs.push({ a: p[0], b: p[1], t: now }, { a: p[1], b: p[2], t: now });
        pads.push({ x: p[1].x, y: p[1].y, t: now }, { x: p[2].x, y: p[2].y, t: now });
        head = target;
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
        ctx.globalAlpha = k * k * .55; ctx.fillStyle = copper;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3.1, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = k * k; ctx.fillStyle = paper;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.15, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (segs.length || pads.length) requestAnimationFrame(tick); else running = false;
    }
  })();

  /* =================================================================
     about — interests, skills, education
     ================================================================= */
  (function about() {
    const ints = $('#interests');
    if (ints && typeof INTERESTS !== 'undefined') {
      ints.innerHTML = INTERESTS.map(function (x) {
        const c = (PAL[x.c] || PAL.slate)[0];
        return '<div class="int" style="--c:' + c + '" data-rv>' +
          icon(x.i) + '<b>' + x.t + '</b><span>' + x.d + '</span></div>';
      }).join('');
    }

    const sk = $('#skills');
    if (sk && typeof SKILLS !== 'undefined') {
      sk.innerHTML = SKILLS.map(function (s) {
        return '<div class="sk" data-rv><h4>' + icon(s.g) + s.t + '</h4><div class="badges">' +
          s.items.map(function (i) {
            const p = PAL[i.c] || PAL.slate;
            return '<button class="badge" type="button" style="--bg:' + p[0] + ';--fg:' + p[1] + '"' +
              ' data-skill="' + i.n + '" data-match="' + (i.m || [i.n]).join('|') + '">' +
              '<span class="badge-ic">' + icon(s.g) + '</span><span class="badge-t">' + i.n + '</span>' +
              '</button>';
          }).join('') + '</div></div>';
      }).join('');
    }
    const ed = $('#edu');
    if (ed && typeof EDUCATION !== 'undefined') {
      ed.innerHTML = EDUCATION.map(e =>
        '<li><b>' + e.school + '</b><i>' + e.when + '</i><span>' + e.detail + '</span></li>').join('');
    }
  })();

  /* =================================================================
     experience — alternating timeline
     ================================================================= */
  (function timeline() {
    const host = $('#timeline');
    if (!host || typeof EXPERIENCE === 'undefined') return;
    host.innerHTML = EXPERIENCE.map(function (e, i) {
      const side = i % 2 === 0 ? 'left' : 'right';
      return '<div class="tl-item ' + side + '" data-rv>' +
        '<span class="tl-via" aria-hidden="true"></span>' +
        '<article class="tl-card" style="--acc:var(--acc-' + (e.accent || 'copper') + ')">' +
          '<h3 class="tl-role">' + e.role + '</h3>' +
          '<p class="tl-org">' + e.org + ' &middot; ' + e.where + '</p>' +
          '<p class="tl-when">' + e.when + '</p>' +
          '<ul class="tl-bul">' + e.bullets.map(b => '<li>' + b + '</li>').join('') + '</ul>' +
        '</article></div>';
    }).join('');
  })();

  /* =================================================================
     projects
     ================================================================= */
  (function projects() {
    const host = $('#proj');
    if (!host || typeof GROUPS === 'undefined' || typeof PROJECTS === 'undefined') return;

    function linkHTML(l) {
      if (l[2] === 'private') {
        const t = l[1] ? 'Private repository — happy to walk through it' : 'Confidential — employer work';
        return '<span class="p-link locked" title="' + t + '">' + LOCK + l[0] + '</span>';
      }
      if (!l[1]) return '<span class="p-link plain">' + l[0] + '</span>';
      return '<a class="p-link" href="' + l[1] + '" target="_blank" rel="noopener">' + l[0] + ' &rarr;</a>';
    }

    host.innerHTML = GROUPS.map(function (g) {
      const items = PROJECTS.filter(p => p.g === g.id);
      if (!items.length) return '';
      return '<section class="pgroup">' +
        '<h3 class="pgroup-pill" data-rv>' + g.label + '</h3>' +
        '<p class="pgroup-note">' + g.note + '</p>' +
        '<div class="cards">' + items.map(p =>
          '<article class="card" data-rv data-hay="' +
            (p.title + ' ' + p.stack + ' ' + p.d).replace(/<[^>]+>/g, ' ').replace(/"/g, '')
              .toLowerCase() + '">' +
            '<div class="card-cover">' + cover(p.cover) + '</div>' +
            '<div class="card-body">' +
              '<div class="card-head"><h4 class="card-t">' + p.title + '</h4>' +
              '<span class="card-w">' + p.when + '</span></div>' +
              '<p class="card-stack">' + p.stack + '</p>' +
              '<p class="card-d">' + p.d + '</p>' +
              '<dl class="card-stats">' + p.stats.map(s =>
                '<div><dt>' + s[0] + '</dt><dd>' + s[1] + '</dd></div>').join('') + '</dl>' +
              '<div class="card-foot">' + p.links.map(linkHTML).join('') + '</div>' +
            '</div>' +
          '</article>').join('') + '</div>' +
      '</section>';
    }).join('');
  })();

  /* =================================================================
     skill badge → project cross-filter
     Clicking a skill answers the question a badge normally dodges:
     "fine, but where did you actually use it?"
     ================================================================= */
  (function crossFilter() {
    const bar = $('#filter-bar');
    const badges = $$('.badge');
    if (!bar || !badges.length) return;

    const cards = $$('.card');
    const groups = $$('.pgroup');
    let active = null;

    function clear() {
      active = null;
      badges.forEach(b => { b.classList.remove('on'); b.setAttribute('aria-pressed', 'false'); });
      cards.forEach(c => { c.hidden = false; c.classList.remove('hit'); });
      groups.forEach(g => { g.hidden = false; });
      bar.hidden = true;
      bar.innerHTML = '';
    }

    function apply(btn) {
      const terms = btn.dataset.match.toLowerCase().split('|').filter(Boolean);
      const name = btn.dataset.skill;
      let n = 0;

      cards.forEach(function (c) {
        const hay = c.dataset.hay || '';
        const hit = terms.some(t => hay.indexOf(t) > -1);
        c.hidden = !hit;
        c.classList.toggle('hit', hit);
        if (hit) n++;
      });
      // hide any group left with nothing in it
      groups.forEach(function (g) {
        g.hidden = !$$('.card', g).some(c => !c.hidden);
      });

      active = name;
      badges.forEach(function (b) {
        const on = b === btn;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      bar.hidden = false;
      bar.innerHTML =
        '<span class="fb-text">' +
          (n ? 'Showing <b>' + n + '</b> project' + (n === 1 ? '' : 's') + ' using <b>' + name + '</b>'
             : 'No project on this page uses <b>' + name + '</b> directly — it shows up in coursework and bench work instead.') +
        '</span><button class="fb-clear" type="button">Show everything</button>';
      bar.querySelector('.fb-clear').addEventListener('click', function () {
        clear();
        $('#skills').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
      });
    }

    badges.forEach(function (b) {
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        if (active === b.dataset.skill) { clear(); return; }
        apply(b);
        $('#projects').scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
      });
    });

    addEventListener('keydown', e => { if (e.key === 'Escape' && active) clear(); });
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
      read.innerHTML = '<p class="fr-name">' + b.name + '</p><p class="fr-type">' + b.type +
        '</p><p class="fr-d">' + b.d + '</p>';
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
     navbar — hairline, retract on scroll, section highlighting
     ================================================================= */
  (function nav() {
    const bar = $('.navbar');
    const links = $$('.nav-links a');
    const secs = links.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);

    if (bar) {
      let queued = false, last = scrollY;
      addEventListener('scroll', function () {
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () {
          queued = false;
          const y = scrollY;
          bar.classList.toggle('stuck', y > 12);
          const down = y > last && y > 260;
          if (Math.abs(y - last) > 6) bar.classList.toggle('hide', down);
          last = y;
        });
      }, { passive: true });
      bar.addEventListener('focusin', () => bar.classList.remove('hide'));
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
