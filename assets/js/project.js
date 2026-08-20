/* =====================================================================
   Per-project page. Reads ?p=<slug>, renders the overview from data.js
   and the long-form write-up from stories.js when one exists.
   ===================================================================== */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  const LOCK = '<svg viewBox="0 0 16 16" aria-hidden="true">' +
    '<path d="M4.6 7V5.2a3.4 3.4 0 1 1 6.8 0V7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
    '<rect x="3.1" y="7" width="9.8" height="6.6" rx="1.4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
  const host = $('#story');
  if (!host) return;

  const slug = new URLSearchParams(location.search).get('p') || '';
  const project = (typeof PROJECTS !== 'undefined')
    ? PROJECTS.find(p => p.slug === slug) : null;

  /* ---------- unknown slug ---------- */
  if (!project) {
    document.title = 'Project not found — Youssef Anbar';
    host.innerHTML =
      '<header class="proj-head"><p class="proj-kicker">404</p>' +
      '<h1 class="proj-title">That project isn’t here</h1>' +
      '<p class="proj-lede">The link may be out of date. Everything I’ve built is on the main page.</p>' +
      '<p class="proj-back"><a class="button" href="index.html#projects">See all projects</a></p></header>';
    return;
  }

  const story = (typeof STORIES !== 'undefined' && STORIES[slug]) || { status: 'draft' };
  const plain = project.title.replace(/&amp;/g, '&');
  document.title = plain + ' — Youssef Anbar';
  const meta = $('meta[name="description"]');
  if (meta) meta.setAttribute('content', project.d.replace(/<[^>]+>/g, '').slice(0, 155));

  const group = (typeof GROUPS !== 'undefined' && GROUPS.find(g => g.id === project.g)) || null;

  function linkHTML(l) {
    if (l[2] === 'private') {
      return '<span class="p-link locked" title="Private repository — happy to walk through it">' +
             LOCK + l[0] + '</span>';
    }
    if (!l[1]) return '<span class="p-link plain">' + l[0] + '</span>';
    return '<a class="p-link" href="' + l[1] + '" target="_blank" rel="noopener">' + l[0] + ' &rarr;</a>';
  }

  function section(s) {
    let out = '<section class="proj-sec" data-rv>';
    if (s.h) out += '<h2>' + s.h + '</h2>';
    if (s.p) out += '<p>' + s.p + '</p>';
    if (s.list) out += '<ul class="proj-list">' + s.list.map(i => '<li>' + i + '</li>').join('') + '</ul>';
    if (s.quote) out += '<blockquote class="proj-quote">' + s.quote + '</blockquote>';
    return out + '</section>';
  }

  let html = '';

  /* ---------- header ---------- */
  html +=
    '<header class="proj-head">' +
      '<p class="proj-kicker">' + (group ? group.label : 'Project') + ' &middot; ' + esc(project.when) + '</p>' +
      '<h1 class="proj-title">' + project.title + '</h1>' +
      '<p class="proj-stack">' + esc(project.stack) + '</p>' +
      '<p class="proj-lede">' + (story.lede || project.d) + '</p>' +
      '<dl class="proj-stats">' + project.stats.map(s =>
        '<div><dt>' + esc(s[0]) + '</dt><dd>' + esc(s[1]) + '</dd></div>').join('') + '</dl>' +
      '<div class="proj-links">' + project.links.map(linkHTML).join('') + '</div>' +
    '</header>';

  /* A story written from the work rather than from a public repository says so,
     rather than letting the reader assume a commit history sits behind it. */
  if (story.note) {
    html += '<p class="proj-note">' + story.note + '</p>';
  }

  /* ---------- body ---------- */
  if (story.status === 'ready') {
    if (story.sections) html += story.sections.map(section).join('');

    if (story.diagrams && story.diagrams.length) {
      html += '<section class="proj-sec" data-rv><h2>Diagrams</h2>' +
        story.diagrams.map(d =>
          '<figure class="proj-fig"><img src="' + esc(d.src) + '" alt="' + esc(d.alt || '') +
          '" loading="lazy" decoding="async">' +
          (d.cap ? '<figcaption>' + d.cap + '</figcaption>' : '') + '</figure>').join('') +
        '</section>';
    }

    if (story.decisions && story.decisions.length) {
      html += '<section class="proj-sec" data-rv><h2>Decisions</h2><div class="proj-decisions">' +
        story.decisions.map(x =>
          '<div class="decision"><b>' + x.d + '</b><p>' + x.why + '</p></div>').join('') +
        '</div></section>';
    }

    if (story.journal && story.journal.length) {
      html += '<section class="proj-sec" data-rv><h2>Journal</h2><ol class="proj-journal">' +
        story.journal.map(j =>
          '<li><span class="j-when">' + esc(j.when) + '</span><p>' + j.p + '</p></li>').join('') +
        '</ol></section>';
    }
  } else {
    html +=
      '<section class="proj-sec proj-draft" data-rv>' +
        '<h2>Write-up in progress</h2>' +
        '<p>The full account of this one — how it was planned, what broke, the diagrams, and the ' +
        'decisions I would defend or take back — isn’t written yet. The overview above is accurate ' +
        'and the numbers come from the work itself.</p>' +
        '<p class="proj-draft-note">This page is ready for it. When the write-up lands it will ' +
        'appear here without any change to the site’s structure.</p>' +
      '</section>';
  }

  html += '<p class="proj-back" data-rv><a class="button ghost" href="index.html#projects">' +
          '&larr; All projects</a></p>';

  host.innerHTML = html;

  /* ---------- reveal + progress, same behaviour as the main page ---------- */
  (function reveal() {
    const all = Array.prototype.slice.call(document.querySelectorAll('[data-rv]'));
    const showAll = () => all.forEach(e => e.classList.add('in'));
    if (REDUCED || !('IntersectionObserver' in window)) { showAll(); return; }
    const io = new IntersectionObserver(es => {
      es.forEach((e, i) => {
        if (!e.isIntersecting) return;
        e.target.style.transitionDelay = Math.min(i * 55, 220) + 'ms';
        e.target.classList.add('in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .05 });
    all.forEach(e => io.observe(e));
    setTimeout(showAll, 2500);
  })();

  (function progress() {
    const bar = $('#progress'); if (!bar) return;
    let queued = false;
    const paint = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0) + ')';
    };
    addEventListener('scroll', () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; paint(); });
    }, { passive: true });
    paint();
  })();

})();
