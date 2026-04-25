/* wizard.js — BYD Guide Wizard
   Tutto lato client. Niente network calls (a parte il caricamento di guides.json
   alla partenza per ottenere lista slug e categorie esistenti). */

'use strict';

// ============================================================
// STATE
// ============================================================
const state = {
  meta: {
    titolo: '',
    slug: '',
    version: '0.1.0',
    date: '',
    author: '',
    editor: '',
    category: '',
    overline: '',
    theme_color: '#3B82F6',
    subtitle: '',
    card_description: '',
    meta_description: '',
  },
  vars: [],
  gallery: [],
  body: '',
  slugTouched: false,
  guidesData: { slugs: [], categories: [], categoryPresets: {} },
};

let nextGalleryId = 1;
let placeholderBlob = null;

// ============================================================
// UTILITY
// ============================================================
const $ = (sel) => document.querySelector(sel);

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function isValidSlug(s) { return /^[a-z0-9][a-z0-9-]{1,39}$/.test(s); }
function isValidDate(s) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return false;
  const [d, m, y] = s.split('/').map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  if (y < 2020 || y > 2100) return false;
  return true;
}
function isValidHexColor(s) { return /^#[0-9A-Fa-f]{6}$/.test(s); }
function isValidFilename(s) { return /^[A-Za-z0-9_.\-]+\.(png|jpg|jpeg|gif|webp|svg)$/i.test(s); }
function isImageBlob(b) { return b && /^image\//.test(b.type); }
function setStatus(el, text, kind) {
  el.textContent = text;
  el.className = 'status' + (kind ? ' ' + kind : '');
}

// ============================================================
// LOAD guides.json
// ============================================================
async function loadGuidesData() {
  try {
    const res = await fetch('guides.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    state.guidesData = {
      slugs: data.slugs || [],
      categories: data.categories || [],
      categoryPresets: data.categoryPresets || {},
    };
  } catch (e) {
    console.warn('guides.json non disponibile, valido in offline-only:', e);
  }
  const dl = $('#cat-suggestions');
  dl.innerHTML = '';
  for (const c of state.guidesData.categories) {
    const opt = document.createElement('option');
    opt.value = c;
    dl.appendChild(opt);
  }
}

// ============================================================
// DATA <-> UI BINDING
// ============================================================
function bindMetaInputs() {
  const map = {
    'f-titolo': 'titolo', 'f-slug': 'slug', 'f-version': 'version',
    'f-date': 'date', 'f-author': 'author', 'f-editor': 'editor',
    'f-category': 'category', 'f-overline': 'overline', 'f-theme': 'theme_color',
    'f-subtitle': 'subtitle', 'f-card-desc': 'card_description', 'f-meta-desc': 'meta_description',
  };
  for (const [id, key] of Object.entries(map)) {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
      state.meta[key] = el.value;
      onMetaChanged(key);
    });
  }

  $('#f-titolo').addEventListener('input', () => {
    if (!state.slugTouched) {
      const s = slugify(state.meta.titolo);
      $('#f-slug').value = s;
      state.meta.slug = s;
      validateSlug();
      refreshSidebar();
      refreshHints();
    }
  });
  $('#f-slug').addEventListener('input', () => {
    state.slugTouched = $('#f-slug').value !== slugify(state.meta.titolo);
    validateSlug();
    refreshSidebar();
    refreshHints();
  });

  $('#f-category').addEventListener('change', () => {
    const cat = state.meta.category.trim();
    const preset = state.guidesData.categoryPresets[cat];
    if (preset) {
      if (preset.theme_color) {
        state.meta.theme_color = preset.theme_color;
        $('#f-theme').value = preset.theme_color;
        $('#f-theme-picker').value = preset.theme_color;
      }
      if (preset.overline) {
        state.meta.overline = preset.overline;
        $('#f-overline').value = preset.overline;
      }
      refreshSidebar();
    }
  });

  $('#f-theme-picker').addEventListener('input', (e) => {
    const c = e.target.value;
    state.meta.theme_color = c;
    $('#f-theme').value = c;
    refreshSidebar();
  });
  $('#f-theme').addEventListener('input', () => {
    if (isValidHexColor(state.meta.theme_color)) {
      $('#f-theme-picker').value = state.meta.theme_color;
    }
  });
}

function onMetaChanged(_key) {
  refreshSidebar();
  refreshHints();
}

function validateSlug() {
  const slug = state.meta.slug;
  const el = $('#slug-status');
  if (!slug) { setStatus(el, '', ''); return; }
  if (!isValidSlug(slug)) {
    setStatus(el, 'Solo minuscole, numeri e trattini (2-40 caratteri).', 'error');
    return;
  }
  if (state.guidesData.slugs.includes(slug)) {
    setStatus(el, `Lo slug "${slug}" è già usato da una guida esistente.`, 'error');
    return;
  }
  setStatus(el, 'Slug disponibile.', 'ok');
}

// ============================================================
// CUSTOM VARIABLES
// ============================================================
function renderVarsTable() {
  const tbody = $('#vars-body');
  tbody.innerHTML = '';
  state.vars.forEach((v, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" data-i="${i}" data-f="key" value="${escapeHtml(v.key)}" placeholder="nome_variabile"></td>
      <td><input type="text" data-i="${i}" data-f="value" value="${escapeHtml(v.value)}" placeholder="valore"></td>
      <td><button type="button" class="del-btn" data-del="${i}" title="Rimuovi">×</button></td>
    `;
    tbody.appendChild(tr);
  });
  tbody.querySelectorAll('input').forEach((inp) => {
    inp.addEventListener('input', (e) => {
      const i = +e.target.dataset.i;
      const f = e.target.dataset.f;
      state.vars[i][f] = e.target.value;
      refreshVariableButton();
      refreshSidebar();
    });
  });
  tbody.querySelectorAll('[data-del]').forEach((b) => {
    b.addEventListener('click', () => {
      state.vars.splice(+b.dataset.del, 1);
      renderVarsTable();
      refreshVariableButton();
      refreshSidebar();
    });
  });
}

function bindVars() {
  $('#add-var').addEventListener('click', () => {
    state.vars.push({ key: '', value: '' });
    renderVarsTable();
  });
}

function refreshVariableButton() {
  const valid = state.vars.some((v) => v.key.trim());
  $('#btn-variable').disabled = !valid;
}

// ============================================================
// GALLERY
// ============================================================
function suggestImageName() {
  const used = new Set(state.gallery.map((g) => g.filename));
  let n = 1;
  while (used.has(`image${n}.png`)) n++;
  return `image${n}.png`;
}

function addImageFromBlob(blob, suggestedName) {
  const ext = (blob.type.split('/')[1] || 'png').toLowerCase().replace('jpeg', 'jpg');
  let base = suggestedName || 'image';
  if (!/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(base)) base += '.' + ext;
  base = base.replace(/[^A-Za-z0-9_.\-]/g, '_');
  let name = base;
  let n = 1;
  const used = new Set(state.gallery.map((g) => g.filename));
  while (used.has(name)) {
    name = base.replace(/(\.[^.]+)?$/, `_${n}$1`);
    n++;
  }
  state.gallery.push({
    id: nextGalleryId++, filename: name, blob,
    caption: '', width: 560, isPlaceholder: false,
  });
  renderGallery();
  refreshImageButton();
  refreshPreview();
}

function addPlaceholderRow() {
  const name = suggestImageName();
  state.gallery.push({
    id: nextGalleryId++, filename: name, blob: null,
    caption: '', width: 560, isPlaceholder: true,
  });
  renderGallery();
  refreshImageButton();
  refreshPreview();
}

function renderGallery() {
  const root = $('#gallery');
  root.innerHTML = '';
  state.gallery.forEach((g, i) => {
    const div = document.createElement('div');
    div.className = 'gallery__item';
    const thumbHtml = g.isPlaceholder
      ? `<div class="gallery__thumb gallery__thumb--placeholder">PLACEHOLDER</div>`
      : `<img class="gallery__thumb" src="${URL.createObjectURL(g.blob)}" alt="">`;
    div.innerHTML = `
      ${thumbHtml}
      <div class="row">
        <input type="text" data-i="${i}" data-f="filename" value="${escapeHtml(g.filename)}" placeholder="nome.png">
        <button type="button" class="del" data-del="${i}" title="Rimuovi">×</button>
      </div>
      <label>Didascalia</label>
      <input type="text" data-i="${i}" data-f="caption" value="${escapeHtml(g.caption)}" placeholder="(diventa la didascalia sotto l'immagine)">
      <label>Larghezza (px)</label>
      <input type="number" min="100" max="1600" step="20" data-i="${i}" data-f="width" value="${g.width}">
    `;
    root.appendChild(div);
  });
  root.querySelectorAll('input').forEach((inp) => {
    inp.addEventListener('input', (e) => {
      const i = +e.target.dataset.i;
      const f = e.target.dataset.f;
      let val = e.target.value;
      if (f === 'width') val = parseInt(val, 10) || 0;
      state.gallery[i][f] = val;
      refreshPreview();
    });
  });
  root.querySelectorAll('[data-del]').forEach((b) => {
    b.addEventListener('click', () => {
      state.gallery.splice(+b.dataset.del, 1);
      renderGallery();
      refreshImageButton();
      refreshPreview();
    });
  });
}

function refreshImageButton() {
  $('#btn-image').disabled = state.gallery.length === 0;
}

function bindGallery() {
  const dz = $('#dropzone');
  const fi = $('#file-input');
  $('#pick-file').addEventListener('click', () => fi.click());
  fi.addEventListener('change', (e) => {
    for (const f of e.target.files) if (isImageBlob(f)) addImageFromBlob(f, f.name);
    fi.value = '';
  });
  ['dragenter', 'dragover'].forEach((ev) => {
    dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('is-dragover'); });
  });
  ['dragleave', 'drop'].forEach((ev) => {
    dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove('is-dragover'); });
  });
  dz.addEventListener('drop', (e) => {
    for (const f of e.dataTransfer.files) if (isImageBlob(f)) addImageFromBlob(f, f.name);
  });
  $('#add-placeholder').addEventListener('click', addPlaceholderRow);
}

// ============================================================
// FRONTMATTER GENERATION
// ============================================================
function yamlEscape(s) {
  return '"' + String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

function buildFrontmatter() {
  const m = state.meta;
  const lines = ['---'];
  lines.push(`titolo: ${yamlEscape(m.titolo || 'Senza titolo')}`);
  lines.push(`slug: ${yamlEscape(m.slug || 'nuova-guida')}`);
  lines.push(`version: ${yamlEscape(m.version || '0.1.0')}`);
  lines.push(`date: ${yamlEscape(m.date || '')}`);
  lines.push(`author: ${yamlEscape(m.author || '')}`);
  if (m.editor) lines.push(`editor: ${yamlEscape(m.editor)}`);
  if (m.overline) lines.push(`overline: ${yamlEscape(m.overline)}`);
  if (m.category) lines.push(`category: ${yamlEscape(m.category)}`);
  if (m.theme_color) lines.push(`theme_color: ${yamlEscape(m.theme_color)}`);
  if (m.subtitle) lines.push(`subtitle: ${yamlEscape(m.subtitle)}`);
  if (m.card_description) lines.push(`card_description: ${yamlEscape(m.card_description)}`);
  if (m.meta_description) lines.push(`meta_description: ${yamlEscape(m.meta_description)}`);
  for (const v of state.vars) {
    const k = v.key.trim();
    if (!k) continue;
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(k)) continue;
    lines.push(`${k}: ${yamlEscape(v.value)}`);
  }
  lines.push('---');
  return lines.join('\n');
}

// ============================================================
// SKELETON
// ============================================================
let skeletonText = null;

async function loadSkeleton() {
  if (skeletonText !== null) return skeletonText;
  try {
    const res = await fetch('skeleton.md.tmpl', { cache: 'no-cache' });
    skeletonText = await res.text();
  } catch (e) {
    skeletonText = '{{FRONTMATTER}}\n\n# Introduzione\n\nScrivi qui...\n';
  }
  return skeletonText;
}

function buildSkeletonBody() {
  const sections = {
    SEZ_DISCLAIMER: $('#sec-disclaimer').checked ? `

::: callout critical "Disclaimer"
Procedura potenzialmente rischiosa. Leggere attentamente prima di iniziare. La community non si assume responsabilità per danni derivati da un uso scorretto delle informazioni qui riportate.
:::
` : '',
    SEZ_WORKFLOW: $('#sec-workflow').checked ? `

# Workflow

::: workflow
1. **Preparazione** :: Materiale e prerequisiti
2. **Esecuzione** :: Operazione principale
3. **Verifica** :: Controlli post-intervento
:::
` : '',
    SEZ_STEPS: $('#sec-steps').checked ? `

# Procedura passo passo

::: steps
1. **Primo passo**. Descrizione dettagliata.

2. **Secondo passo**. Descrizione dettagliata.

3. **Terzo passo**. Descrizione dettagliata.
:::
` : '',
    SEZ_CHECKLIST: $('#sec-checklist').checked ? `

# Checklist finale

::: checklist
- Primo controllo
- Secondo controllo
- Terzo controllo
:::
` : '',
    SEZ_CONCLUSIONI: $('#sec-conclusioni').checked ? `

# Conclusioni

Riepiloga i risultati ottenuti, eventuali raccomandazioni e contatti per supporto nella community.
` : '',
  };
  let out = skeletonText
    .replace('{{FRONTMATTER}}', buildFrontmatter())
    .replace('{{TITOLO}}', state.meta.titolo || 'la tua guida');
  for (const [k, v] of Object.entries(sections)) {
    out = out.replace('{{' + k + '}}', v);
  }
  return out;
}

async function applySkeletonToBody() {
  await loadSkeleton();
  const body = buildSkeletonBody();
  $('#body').value = body;
  state.body = body;
  refreshPreview();
  refreshSidebar();
}

// ============================================================
// PREVIEW
// ============================================================
function renderPreview(md) {
  if (md.startsWith('---\n')) {
    const end = md.indexOf('\n---\n', 4);
    if (end !== -1) md = md.slice(end + 5);
  }
  for (const v of state.vars) {
    if (!v.key.trim()) continue;
    const re = new RegExp(`\\{\\{\\s*${v.key.trim()}\\s*\\}\\}`, 'g');
    md = md.replace(re, v.value);
  }
  md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)(\{[^}]*\})?/g, (_m, alt, src, attrs) => {
    const w = (attrs || '').match(/width=(\d+)/);
    let resolvedSrc = src;
    const slug = state.meta.slug;
    if (slug && src.startsWith(`images/${slug}/`)) {
      const fname = src.slice(`images/${slug}/`.length);
      const g = state.gallery.find((x) => x.filename === fname);
      if (g && g.blob) resolvedSrc = URL.createObjectURL(g.blob);
      else if (g && g.isPlaceholder) resolvedSrc = '../images/common/placeholder.png';
    }
    const style = w ? ` style="width:${w[1]}px;max-width:100%"` : '';
    return `<figure><img src="${escapeHtml(resolvedSrc)}" alt="${escapeHtml(alt)}"${style}><figcaption>${escapeHtml(alt)}</figcaption></figure>`;
  });
  md = md.replace(/::: callout (\w+)(?:\s+"([^"]+)")?\n([\s\S]*?)\n:::/g, (_m, type, title, body) => {
    const t = title ? `<p class="callout__title">${inlineFmt(title)}</p>` : '';
    return `<div class="callout callout--${type}">${t}${renderBlock(body)}</div>`;
  });
  md = md.replace(/::: steps\n([\s\S]*?)\n:::/g, (_m, body) => {
    const items = body.split(/\n(?=\d+\.\s)/).map((s) => s.replace(/^\d+\.\s+/, '').trim());
    return '<ol>' + items.map((i) => `<li>${inlineFmt(i)}</li>`).join('') + '</ol>';
  });
  md = md.replace(/::: checklist\n([\s\S]*?)\n:::/g, (_m, body) => {
    const items = [];
    body.split('\n').forEach((l) => {
      const m = l.match(/^\s*-\s+(.+)$/);
      if (m) items.push(m[1]);
    });
    return '<ul class="checklist">' + items.map((i) => `<li>${inlineFmt(i)}</li>`).join('') + '</ul>';
  });
  md = md.replace(/::: workflow\n([\s\S]*?)\n:::/g, (_m, body) => {
    const items = [];
    body.split('\n').forEach((l) => {
      const m = l.match(/^\d+\.\s+\*\*([^*]+)\*\*\s*::\s*(.+)$/);
      if (m) items.push([m[1], m[2]]);
    });
    return '<ol>' + items.map(([t, d]) => `<li><strong>${inlineFmt(t)}</strong> — ${inlineFmt(d)}</li>`).join('') + '</ol>';
  });
  md = md.replace(/::: glossary\n([\s\S]*?)\n:::/g, (_m, body) => {
    const items = [];
    body.split('\n\n').forEach((p) => {
      const m = p.match(/^\*\*([^*]+)\*\*\s*::\s*([\s\S]+)$/);
      if (m) items.push([m[1], m[2]]);
    });
    return '<dl>' + items.map(([t, d]) => `<dt><strong>${inlineFmt(t)}</strong></dt><dd>${inlineFmt(d)}</dd>`).join('') + '</dl>';
  });
  md = md.replace(/::: card\s*(\w+)?\n([\s\S]*?)\n:::/g, (_m, _v, body) => {
    return `<div class="card">${renderBlock(body)}</div>`;
  });
  md = md.replace(/::: manual-steps\n([\s\S]*?)\n:::/g, (_m, body) => {
    const items = body.split(/\n(?=\[[^\]]+\]\s)/).map((p) => {
      const m = p.match(/^\[([^\]]+)\]\s+([\s\S]+)$/);
      return m ? `<li><strong>[${m[1]}]</strong> ${inlineFmt(m[2])}</li>` : '';
    });
    return '<ol>' + items.join('') + '</ol>';
  });
  md = md.replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, lang, code) => {
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  });
  md = md.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  md = md.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  md = md.replace(/^#\s+(.+?)(?:\s+\{color=\w+\})?$/gm, '<h1>$1</h1>');
  md = md.replace(/^---$/gm, '<hr>');
  md = renderBlock(md);
  return md;
}

function renderBlock(text) {
  return text.split(/\n{2,}/).map((p) => {
    p = p.trim();
    if (!p) return '';
    if (/^<(h\d|ul|ol|dl|div|figure|pre|hr|table)/.test(p)) return p;
    if (/^- /.test(p)) {
      return '<ul>' + p.split('\n').map((l) => l.replace(/^- /, '')).map((i) => `<li>${inlineFmt(i)}</li>`).join('') + '</ul>';
    }
    if (/^\d+\. /.test(p)) {
      return '<ol>' + p.split('\n').map((l) => l.replace(/^\d+\. /, '')).map((i) => `<li>${inlineFmt(i)}</li>`).join('') + '</ol>';
    }
    if (p.includes('\n|') || p.startsWith('|')) {
      const rows = p.split('\n').filter((r) => r.startsWith('|'));
      let out = '<table>';
      rows.forEach((r, i) => {
        if (/^\|\s*-+/.test(r)) return;
        const cells = r.split('|').slice(1, -1).map((c) => c.trim());
        const tag = i === 0 ? 'th' : 'td';
        out += '<tr>' + cells.map((c) => `<${tag}>${inlineFmt(c)}</${tag}>`).join('') + '</tr>';
      });
      return out + '</table>';
    }
    return '<p>' + inlineFmt(p).replace(/\n/g, '<br>') + '</p>';
  }).join('\n');
}

function inlineFmt(s) {
  s = escapeHtml(s);
  s = s.replace(/&lt;(\/?(strong|em|code|a|br|span|figure|figcaption|img)[^&]*?)&gt;/g, '<$1>');
  s = s.replace(/\{badge:(\w+):([^}]+)\}/g, '<span class="badge badge--$1">$2</span>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return s;
}

function refreshPreview() {
  const md = $('#body').value;
  state.body = md;
  $('#preview').innerHTML = renderPreview(md);
}

// ============================================================
// SIDEBAR + HINTS
// ============================================================
function refreshSidebar() {
  const slug = state.meta.slug || 'nuova-guida';
  $('#filename-preview').textContent = `${slug}.md`;
  $('#frontmatter-preview').textContent = buildFrontmatter();
}

function refreshHints() {
  const slug = state.meta.slug || '<slug>';
  const titolo = state.meta.titolo || '<titolo>';
  $('#hint-md-name').textContent = `${slug}.md`;
  $('#hint-branch').textContent = `guida/${slug}`;
  $('#hint-pr-title').textContent = `Aggiunta guida: ${titolo}`;
  $('#hint-pr-body').textContent = `Nuova guida creata col wizard.`;
  $('#hint-imgdir').textContent = `${slug}/`;
  $('#hint-imgcreate').textContent = `${slug}/dummy`;
  $('#hint-cmd-branch').textContent = `git checkout -b guida/${slug}`;
  $('#hint-cmd-add').innerHTML =
    `git add guides/${escapeHtml(slug)}.md images/${escapeHtml(slug)}/\n` +
    `git commit -m "Aggiunta guida: ${escapeHtml(titolo)}"`;
  $('#hint-cmd-push').textContent = `git push -u origin guida/${slug}`;
}

// ============================================================
// TOOLBAR
// ============================================================
function insertAtCursor(text) {
  const ta = $('#body');
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const before = ta.value.slice(0, start);
  const after = ta.value.slice(end);
  let prefix = '';
  if (before.length > 0 && !before.endsWith('\n\n')) {
    prefix = before.endsWith('\n') ? '\n' : '\n\n';
  }
  let suffix = '';
  if (after.length > 0 && !after.startsWith('\n\n')) {
    suffix = after.startsWith('\n') ? '\n' : '\n\n';
  }
  const inserted = prefix + text + suffix;
  ta.value = before + inserted + after;
  const cursor = before.length + prefix.length + text.length;
  ta.selectionStart = ta.selectionEnd = cursor;
  ta.focus();
  state.body = ta.value;
  refreshPreview();
}

function wrapSelection(open, close, placeholder) {
  const ta = $('#body');
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const sel = ta.value.slice(start, end) || placeholder;
  const before = ta.value.slice(0, start);
  const after = ta.value.slice(end);
  const piece = open + sel + close;
  ta.value = before + piece + after;
  ta.selectionStart = before.length + open.length;
  ta.selectionEnd = before.length + open.length + sel.length;
  ta.focus();
  state.body = ta.value;
  refreshPreview();
}

function showModal(title, fields) {
  return new Promise((resolve) => {
    const d = $('#modal');
    $('#modal-title').textContent = title;
    const root = $('#modal-fields');
    root.innerHTML = '';
    fields.forEach((f, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'field';
      const label = document.createElement('label');
      label.textContent = f.label;
      wrap.appendChild(label);
      let inp;
      if (f.type === 'select') {
        inp = document.createElement('select');
        for (const o of f.options) {
          const opt = document.createElement('option');
          opt.value = o.value; opt.textContent = o.label || o.value;
          inp.appendChild(opt);
        }
        if (f.value) inp.value = f.value;
      } else if (f.type === 'textarea') {
        inp = document.createElement('textarea');
        if (f.value) inp.value = f.value;
        if (f.placeholder) inp.placeholder = f.placeholder;
      } else {
        inp = document.createElement('input');
        inp.type = f.type || 'text';
        if (f.value !== undefined) inp.value = f.value;
        if (f.placeholder) inp.placeholder = f.placeholder;
      }
      inp.dataset.k = f.name;
      if (i === 0) setTimeout(() => inp.focus(), 50);
      wrap.appendChild(inp);
      root.appendChild(wrap);
    });
    const form = $('#modal-form');
    const onCancel = () => { d.close('cancel'); cleanup(); resolve(null); };
    const onSubmit = (e) => {
      e.preventDefault();
      const result = {};
      root.querySelectorAll('[data-k]').forEach((el) => { result[el.dataset.k] = el.value; });
      d.close('ok'); cleanup(); resolve(result);
    };
    function cleanup() {
      $('#modal-cancel').removeEventListener('click', onCancel);
      form.removeEventListener('submit', onSubmit);
    }
    $('#modal-cancel').addEventListener('click', onCancel);
    form.addEventListener('submit', onSubmit);
    d.showModal();
  });
}

async function handleInsert(action) {
  switch (action) {
    case 'h1': insertAtCursor('# Titolo capitolo'); break;
    case 'h2': insertAtCursor('## Titolo sezione'); break;
    case 'h3': insertAtCursor('### Titolo sotto-sezione'); break;
    case 'bold': wrapSelection('**', '**', 'testo'); break;
    case 'italic': wrapSelection('*', '*', 'testo'); break;
    case 'code': wrapSelection('`', '`', 'codice'); break;
    case 'hr': insertAtCursor('---'); break;
    case 'ul': insertAtCursor('- Voce 1\n- Voce 2\n- Voce 3'); break;
    case 'ol': insertAtCursor('1. Voce 1\n2. Voce 2\n3. Voce 3'); break;
    case 'checklist': insertAtCursor('::: checklist\n- Voce 1\n- Voce 2\n- Voce 3\n:::'); break;
    case 'link': {
      const r = await showModal('Inserisci link', [
        { name: 'text', label: 'Testo del link', value: '' },
        { name: 'url', label: 'URL', placeholder: 'https://…' },
      ]);
      if (r) wrapSelection(`[${r.text || 'testo'}](${r.url || 'https://example.com'})`, '', '');
      break;
    }
    case 'callout': {
      const r = await showModal('Inserisci callout', [
        { name: 'type', label: 'Tipo', type: 'select', options: [
          { value: 'info' }, { value: 'warning' }, { value: 'critical' }, { value: 'success' },
        ] },
        { name: 'title', label: 'Titolo (opzionale)', placeholder: 'Lascia vuoto per nessun titolo' },
        { name: 'body', label: 'Contenuto', type: 'textarea', value: 'Testo del callout.' },
      ]);
      if (r) {
        const t = r.title ? ` "${r.title.replace(/"/g, "'")}"` : '';
        insertAtCursor(`::: callout ${r.type}${t}\n${r.body}\n:::`);
      }
      break;
    }
    case 'steps': {
      const r = await showModal('Inserisci steps', [
        { name: 'count', label: 'Numero di passi', type: 'number', value: '3' },
      ]);
      if (r) {
        const n = Math.max(1, parseInt(r.count, 10) || 3);
        const lines = [];
        for (let i = 1; i <= n; i++) lines.push(`${i}. **Passo ${i}**. Descrizione del passo.`);
        insertAtCursor('::: steps\n' + lines.join('\n\n') + '\n:::');
      }
      break;
    }
    case 'manual-steps':
      insertAtCursor('::: manual-steps\n[1a] **Variante A**: descrizione.\n\n[1b] **Variante B**: descrizione.\n\n[2] Passo successivo.\n:::');
      break;
    case 'workflow':
      insertAtCursor('::: workflow\n1. **Preparazione** :: Materiale e prerequisiti\n2. **Esecuzione** :: Operazione principale\n3. **Verifica** :: Controllo finale\n:::');
      break;
    case 'glossary':
      insertAtCursor('::: glossary\n**Termine 1** :: Definizione del primo termine.\n\n**Termine 2** :: Definizione del secondo termine.\n:::');
      break;
    case 'card': {
      const r = await showModal('Inserisci card', [
        { name: 'variant', label: 'Variante', type: 'select', options: [
          { value: 'normale', label: 'Normale' }, { value: 'highlight', label: 'Highlight' },
        ] },
        { name: 'title', label: 'Titolo', value: 'Titolo della card' },
        { name: 'body', label: 'Contenuto', type: 'textarea', value: 'Contenuto della card.' },
      ]);
      if (r) {
        const v = r.variant === 'highlight' ? ' highlight' : '';
        insertAtCursor(`::: card${v}\n### ${r.title}\n${r.body}\n:::`);
      }
      break;
    }
    case 'badge': {
      const r = await showModal('Inserisci badge', [
        { name: 'type', label: 'Tipo', type: 'select', options: [
          { value: 'info' }, { value: 'warning' }, { value: 'critical' }, { value: 'success' }, { value: 'accent' },
        ] },
        { name: 'text', label: 'Testo', value: 'Etichetta' },
      ]);
      if (r) insertAtCursor(`{badge:${r.type}:${r.text}}`);
      break;
    }
    case 'table': {
      const r = await showModal('Inserisci tabella', [
        { name: 'cols', label: 'Colonne', type: 'number', value: '3' },
        { name: 'rows', label: 'Righe (oltre l\'intestazione)', type: 'number', value: '3' },
      ]);
      if (r) {
        const c = Math.max(1, parseInt(r.cols, 10) || 3);
        const ro = Math.max(1, parseInt(r.rows, 10) || 3);
        const head = '| ' + Array.from({ length: c }, (_, i) => `Col ${i + 1}`).join(' | ') + ' |';
        const sep = '|' + Array.from({ length: c }, () => '---').join('|') + '|';
        const rows = [];
        for (let i = 0; i < ro; i++) {
          rows.push('| ' + Array.from({ length: c }, () => '…').join(' | ') + ' |');
        }
        insertAtCursor([head, sep, ...rows].join('\n'));
      }
      break;
    }
    case 'codeblock': {
      const r = await showModal('Inserisci code block', [
        { name: 'lang', label: 'Linguaggio', type: 'select', options: [
          { value: '' }, { value: 'bash' }, { value: 'powershell' }, { value: 'json' }, { value: 'yaml' },
        ] },
        { name: 'code', label: 'Codice', type: 'textarea', value: '' },
      ]);
      if (r) insertAtCursor('```' + r.lang + '\n' + (r.code || 'comando-esempio') + '\n```');
      break;
    }
    case 'image': {
      const slug = state.meta.slug || 'nuova-guida';
      const r = await showModal('Inserisci immagine', [
        { name: 'file', label: 'Immagine dalla galleria', type: 'select',
          options: state.gallery.map((g) => ({ value: g.filename, label: g.filename })) },
        { name: 'caption', label: 'Didascalia (override)', placeholder: 'Lascia vuoto per usare quella della galleria' },
        { name: 'width', label: 'Larghezza (px)', type: 'number', value: '560' },
      ]);
      if (r) {
        const g = state.gallery.find((x) => x.filename === r.file);
        const caption = r.caption || (g ? g.caption : '') || r.file;
        const w = parseInt(r.width, 10) || 560;
        insertAtCursor(`![${caption}](images/${slug}/${r.file}){width=${w}}`);
      }
      break;
    }
    case 'variable': {
      const r = await showModal('Inserisci variabile', [
        { name: 'name', label: 'Variabile', type: 'select',
          options: state.vars.filter((v) => v.key.trim()).map((v) => ({ value: v.key.trim(), label: `${v.key.trim()} = ${v.value}` })) },
      ]);
      if (r) insertAtCursor(`{{ ${r.name} }}`);
      break;
    }
  }
}

function bindToolbar() {
  $('#toolbar').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-insert]');
    if (!btn) return;
    handleInsert(btn.dataset.insert);
  });
  $('#body').addEventListener('input', () => {
    state.body = $('#body').value;
    refreshPreview();
  });
  $('#apply-sections').addEventListener('click', applySkeletonToBody);
}

// ============================================================
// PLACEHOLDER LOADER
// ============================================================
async function loadPlaceholderBlob() {
  if (placeholderBlob) return placeholderBlob;
  const candidates = ['../images/common/placeholder.png', '../../images/common/placeholder.png'];
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (res.ok) {
        placeholderBlob = await res.blob();
        return placeholderBlob;
      }
    } catch (_e) { /* try next */ }
  }
  return null;
}

// ============================================================
// VALIDATION
// ============================================================
function validateAll() {
  const errs = [];
  if (!state.meta.titolo.trim()) errs.push('Titolo mancante.');
  if (!isValidSlug(state.meta.slug)) errs.push('Slug non valido (minuscole, numeri, trattini).');
  else if (state.guidesData.slugs.includes(state.meta.slug)) errs.push(`Slug "${state.meta.slug}" già usato.`);
  if (!isValidDate(state.meta.date)) errs.push('Data non valida (formato gg/mm/aaaa).');
  if (!state.meta.author.trim()) errs.push('Autore mancante.');
  if (state.meta.theme_color && !isValidHexColor(state.meta.theme_color)) errs.push('Theme color non valido (#RRGGBB).');
  const seen = new Set();
  for (const g of state.gallery) {
    if (!isValidFilename(g.filename)) errs.push(`Nome immagine non valido: "${g.filename}".`);
    else if (seen.has(g.filename)) errs.push(`Nome immagine duplicato: "${g.filename}".`);
    seen.add(g.filename);
  }
  for (const v of state.vars) {
    if (v.key.trim() && !/^[A-Za-z_][A-Za-z0-9_]*$/.test(v.key.trim())) {
      errs.push(`Nome variabile non valido: "${v.key}".`);
    }
  }
  return errs;
}

// ============================================================
// OUTPUT — ZIP
// ============================================================
async function buildZip() {
  const errs = validateAll();
  const status = $('#output-status');
  if (errs.length) {
    setStatus(status, 'Errori: ' + errs.join(' '), 'error');
    return;
  }
  setStatus(status, 'Genero lo zip…', 'warn');
  const slug = state.meta.slug;
  const md = $('#body').value || (buildFrontmatter() + '\n\n# Introduzione\n\nScrivi qui...\n');
  const zip = new JSZip();
  zip.file(`guides/${slug}.md`, md);
  let placeholder = null;
  for (const g of state.gallery) {
    let blob = g.blob;
    if (g.isPlaceholder) {
      if (!placeholder) placeholder = await loadPlaceholderBlob();
      if (placeholder) blob = placeholder;
      else {
        setStatus(status, 'Placeholder non trovato. Impossibile generare lo zip.', 'error');
        return;
      }
    }
    if (!blob) continue;
    zip.file(`images/${slug}/${g.filename}`, blob);
  }
  const out = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
  const url = URL.createObjectURL(out);
  const a = document.createElement('a');
  a.href = url; a.download = `${slug}.zip`;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
  const sizeKb = Math.round(out.size / 1024);
  setStatus(status, `Zip pronto: ${slug}.zip (${sizeKb} KB).`, 'ok');
}

async function copyMd() {
  const errs = validateAll();
  const status = $('#output-status');
  if (errs.length) {
    setStatus(status, 'Errori: ' + errs.join(' '), 'error');
    return;
  }
  const md = $('#body').value;
  try {
    await navigator.clipboard.writeText(md);
    setStatus(status, 'Markdown copiato negli appunti.', 'ok');
  } catch (_e) {
    setStatus(status, 'Impossibile copiare automaticamente. Copia manualmente dalla textarea.', 'error');
  }
}

function bindOutput() {
  $('#download-zip').addEventListener('click', buildZip);
  $('#copy-md').addEventListener('click', copyMd);
  document.querySelectorAll('input[name="mode"]').forEach((r) => {
    r.addEventListener('change', () => {
      const m = document.querySelector('input[name="mode"]:checked').value;
      $('#instructions-web').hidden = m !== 'web';
      $('#instructions-git').hidden = m !== 'git';
    });
  });
}

// ============================================================
// INIT
// ============================================================
async function init() {
  await loadGuidesData();
  bindMetaInputs();
  bindVars();
  bindGallery();
  bindToolbar();
  bindOutput();
  refreshSidebar();
  refreshHints();
  refreshImageButton();
  refreshVariableButton();
  await applySkeletonToBody();
}

document.addEventListener('DOMContentLoaded', init);
