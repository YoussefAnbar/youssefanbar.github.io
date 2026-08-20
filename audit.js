const fs = require('fs');
const src = fs.readFileSync('assets/js/data.js', 'utf8') + fs.readFileSync('assets/js/stories.js', 'utf8');

const body = [
  "const strip = s => String(s).replace(/<[^>]+>/g,'').replace(/&[a-z]+;/g,' ').replace(/\\s+/g,' ').trim();",
  "const out = [];",
  "const push = (loc, t) => { t = strip(t); if (t) out.push(loc + ' :: ' + t); };",
  "PROJECTS.forEach(p => push('CARD ' + p.slug, p.d));",
  "GROUPS.forEach(g => push('GROUP ' + g.id, g.note));",
  "EXPERIENCE.forEach(e => e.bullets.forEach(b => push('EXP ' + e.org, b)));",
  "AWARDS.forEach(a => push('AWARD ' + a.name, a.d));",
  "INTERESTS.forEach(i => push('INTEREST ' + i.t, i.d));",
  "BYTES.forEach(b => push('BYTE ' + b.name, b.d));",
  "Object.entries(STORIES).forEach(([k, s]) => {",
  "  if (s.lede) push('LEDE ' + k, s.lede);",
  "  (s.sections || []).forEach(x => {",
  "    if (x.p) push('SEC ' + k, x.p);",
  "    if (x.quote) push('QUOTE ' + k, x.quote);",
  "    (x.list || []).forEach(l => push('LIST ' + k, l));",
  "  });",
  "  (s.decisions || []).forEach(d => push('DEC ' + k, d.why));",
  "  (s.journal || []).forEach(j => push('JRN ' + k, j.p));",
  "  (s.diagrams || []).forEach(d => push('CAP ' + k, d.cap));",
  "});",
  "globalThis.__OUT = out;"
].join('\n');

eval(src + body);
fs.writeFileSync(process.env.AUDIT_OUT || 'copy.txt', globalThis.__OUT.join('\n'), 'utf8');
console.log('strings extracted:', globalThis.__OUT.length);
