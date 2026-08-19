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
    code: '<path d="M8.5 7.5 4 12l4.5 4.5M15.5 7.5 20 12l-4.5 4.5M13.5 4.5l-3 15"/>',
    sat:  '<rect x="9.5" y="9.5" width="5" height="5" rx="1" transform="rotate(45 12 12)"/><path d="M6.5 6.5 3 10l3.5 3.5M17.5 10.5 21 14l-3.5 3.5M12 16v4M9.5 20h5"/>'
  };
  const icon = k => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON[k] || ICON.chip) + '</svg>';

  /* ---------- project cover art ------------------------------------- */
  // --c1 is the hardware accent: cyan in dark, a darker teal in light. Keep
  // the fallback — an undefined custom property with no fallback makes the
  // stroke declaration invalid, which computes to none and hides every cover.
  const C = 'var(--c1, #22E0FF)';
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
    sat:  '<rect x="128" y="46" width="44" height="40" rx="5"/><path d="M128 56H86l-18-14 26-18 20 22M172 76h44l16 14-26 16-18-20"/>' +
          '<path d="M150 46V22M138 22h24"/><circle cx="150" cy="16" r="6"/>' +
          '<path d="M30 108q40-34 80 0t80 0" opacity=".45"/>',
    thermal:'<rect x="24" y="34" width="60" height="64" rx="6"/><rect x="216" y="34" width="60" height="64" rx="6"/>' +
          '<path d="M84 52h132M84 80h132"/><path d="M204 46l12 6-12 6M96 74l-12 6 12 6"/>' +
          '<path d="M120 22q10 10 0 20t0 20M150 22q10 10 0 20t0 20M180 22q10 10 0 20t0 20" opacity=".5"/>',
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
      const c1 = cs.getPropertyValue('--c1').trim() || "#01798F";
      const c3 = cs.getPropertyValue('--c2').trim() || '#6134D4';
      const bg = cs.getPropertyValue('--bg').trim() || '#FAFAFC';

      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';

      // The trace cools from cyan to magenta as it ages, like a discharging arc.
      segs.forEach(function (s, i) {
        const k = 1 - (now - s.t) / LIFE;
        ctx.globalAlpha = k * k * .30;
        ctx.strokeStyle = i % 2 ? c3 : c1;
        ctx.lineWidth = 1.6 + k * 1.4;
        ctx.shadowColor = i % 2 ? c3 : c1;
        ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.moveTo(s.a.x, s.a.y); ctx.lineTo(s.b.x, s.b.y); ctx.stroke();
      });

      pads.forEach(function (p) {
        const k = 1 - (now - p.t) / LIFE;
        ctx.globalAlpha = k * k * .40;
        ctx.fillStyle = c1; ctx.shadowBlur = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, 3.4, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0; ctx.globalAlpha = k * k; ctx.fillStyle = bg;
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
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
        return '<div class="int" style="--c:' + (HUE[x.c] || HUE.hw) + '" data-rv>' +
          icon(x.i) + '<b>' + x.t + '</b><span>' + x.d + '</span></div>';
      }).join('');
    }

    const sk = $('#skills');
    if (sk && typeof SKILLS !== 'undefined') {
      sk.innerHTML = SKILLS.map(function (s) {
        const c = HUE[s.hue] || HUE.hw;
        return '<div class="sk" style="--c:' + c + '" data-rv><h4>' + icon(s.g) + s.t + '</h4>' +
          '<div class="badges">' +
          s.items.map(function (i) {
            return '<button class="badge" type="button"' +
              ' data-skill="' + i.n + '" data-match="' + (i.m || [i.n]).join('|') + '">' +
              '<span class="badge-ic">' + icon(s.g) + '</span><span class="badge-t">' + i.n + '</span>' +
              '</button>';
          }).join('') + '</div></div>';
      }).join('');
    }

    /* marquee — the whole toolchain, looping */
    const mq = $('#mq');
    if (mq && typeof SKILLS !== 'undefined') {
      const all = SKILLS.reduce((a, s) => a.concat(s.items.map(i => i.n)), []);
      const run = '<span>' + all.join('</span><span>') + '</span>';
      mq.innerHTML = run + run;          // duplicated so the -50% loop is seamless
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
        '<span class="tl-via" aria-hidden="true" style="--acc:' + (HUE[e.accent] || HUE.hw) + '"></span>' +
        '<article class="tl-card" style="--acc:' + (HUE[e.accent] || HUE.hw) + '">' +
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
            (p.title + ' ' + p.stack + ' ' + p.d + ' ' + p.stats.map(s => s[0]).join(' '))
              .replace(/<[^>]+>/g, ' ').replace(/"/g, '').toLowerCase() + '">' +
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
     awards
     ================================================================= */
  (function awards() {
    const host = $('#awards-grid');
    if (!host || typeof AWARDS === 'undefined') return;
    host.innerHTML = AWARDS.map(function (a) {
      return '<article class="award" style="--c:' + (HUE[a.accent] || HUE.hw) + '" data-rv>' +
        '<span class="aw-place">' + a.place + '</span>' +
        '<b class="aw-prize" data-count="' + a.prize + '">$' + a.prize.toLocaleString('en-US') + '</b>' +
        '<p class="aw-name">' + a.name + '</p>' +
        '<p class="aw-d">' + a.d + '</p>' +
      '</article>';
    }).join('');
  })();

  /* =================================================================
     count-up on prize figures
     ================================================================= */
  (function countUp() {
    const els = $$('[data-count]');
    if (!els.length || REDUCED || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target, end = +el.dataset.count, t0 = performance.now(), D = 1200;
        (function step(now) {
          const k = Math.min(1, (now - t0) / D);
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = '$' + Math.round(end * eased).toLocaleString('en-US');
          if (k < 1) requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: .5 });
    els.forEach(e => io.observe(e));
  })();

  /* =================================================================
     scroll progress
     ================================================================= */
  (function progress() {
    const bar = $('#progress'); if (!bar) return;
    let queued = false;
    const paint = function () {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0) + ')';
    };
    addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; paint(); });
    }, { passive: true });
    paint();
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

    // Naive substring matching is wrong here: "CAN" hits "cannot", "C" hits
    // everything. Match on word boundaries instead, treating + # / . as part
    // of a token so "C/C++" and "ROS 2" behave.
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rxCache = {};
    function matches(hay, term) {
      const rx = rxCache[term] ||
        (rxCache[term] = new RegExp('(^|[^a-z0-9+#/.])' + esc(term) + '([^a-z0-9+#/.]|$)', 'i'));
      return rx.test(hay);
    }

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
        const hit = terms.some(t => matches(hay, t));
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
             : '<b>' + name + '</b> doesn’t appear in a project card — it comes from the roles in Experience above.') +
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
    const showAll = () => all.forEach(e => { e.style.transitionDelay = '0ms'; e.classList.add('in'); });
    if (REDUCED || !('IntersectionObserver' in window)) { showAll(); return; }

    const io = new IntersectionObserver(function (es) {
      // Stagger siblings that arrive together so grids cascade in.
      const hit = es.filter(e => e.isIntersecting);
      hit.forEach(function (e, i) {
        e.target.style.transitionDelay = Math.min(i * 55, 330) + 'ms';
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .05 });

    all.forEach(e => io.observe(e));
    setTimeout(showAll, 2500);
  })();

  /* =================================================================
     pointer-tracked tilt on project cards
     ================================================================= */
  (function tilt() {
    if (REDUCED || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const MAX = 5;  // degrees — enough to read as depth, not enough to nauseate
    $$('.card').forEach(function (card) {
      let raf = null;
      card.addEventListener('pointermove', function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - .5;
          const py = (e.clientY - r.top) / r.height - .5;
          card.style.transform =
            'perspective(900px) rotateY(' + (px * MAX * 2).toFixed(2) + 'deg) rotateX(' +
            (-py * MAX * 2).toFixed(2) + 'deg) translateY(-3px)';
        });
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  })();

})();
