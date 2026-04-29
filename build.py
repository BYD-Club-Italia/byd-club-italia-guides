#!/usr/bin/env python3
"""
BYD Guides — Build System
=========================

Reads Markdown guides from guides/ directory, processes them through
a Jinja2 template, and outputs HTML files to docs/.

Usage:
    python build.py                 # Build all guides
    python build.py --guide atto2   # Build only one guide
    python build.py --watch         # Rebuild on change (requires watchdog)

The Markdown supports:
- YAML frontmatter for variables (model, firmware versions, etc.)
- Jinja2 templating inside the markdown body ({{ variable }})
- Custom block directives: ::: callout, ::: steps, ::: checklist, etc.
- Inline badges: {badge:warning:text}
- Images with size: ![alt](path){width=400}
"""

import re
import sys
import json
import base64
import shutil
import argparse
from pathlib import Path
from textwrap import dedent

try:
    import yaml
    import jinja2
    from markdown_it import MarkdownIt
except ImportError as e:
    print(f"ERRORE: manca una dipendenza: {e}")
    print("Installa con: pip install -r requirements.txt")
    sys.exit(1)


ROOT = Path(__file__).parent.resolve()
GUIDES_DIR = ROOT / "guides"
TEMPLATE_DIR = ROOT / "templates"
IMAGES_DIR = ROOT / "images"
OUTPUT_DIR = ROOT / "docs"

# Logo community: inlinato come data URL in tutte le pagine (vedi main()).
# Per cambiare il logo, sostituisci il file mantenendo lo stesso path e nome.
COMMUNITY_LOGO_PATH = "images/common/logo-community.jpg"

# ============================================================
# FRONTMATTER PARSING
# ============================================================

def parse_frontmatter(text: str):
    """Split '---\nYAML\n---\nBODY' into (dict, body_str)."""
    if not text.startswith("---\n"):
        return {}, text
    end = text.find("\n---\n", 4)
    if end == -1:
        return {}, text
    yaml_text = text[4:end]
    body = text[end + 5:]
    meta = yaml.safe_load(yaml_text) or {}
    return meta, body


# ============================================================
# CUSTOM MARKDOWN EXTENSIONS (pre-processing)
# ============================================================

def preprocess_custom_syntax(md_text: str) -> str:
    """
    Rewrites custom block/inline syntax into standard markdown-it containers
    or HTML so the main parser can handle them.

    Handles:
    - ::: callout type "title" ... :::        -> :::callout-TYPE with title attr
    - ::: steps ... :::                       -> <ol class="steps">
    - ::: manual-steps ... :::                -> custom ol-like structure
    - ::: checklist ... :::                   -> <ul class="checklist">
    - ::: workflow ... :::                    -> workflow diagram
    - ::: glossary ... :::                    -> <dl>-like collapsible list
    - ::: card [highlight] ... :::            -> <div class="card">
    - ::print-hide:: text :::                 -> <span class="print-hide">
    - {badge:color:text}                      -> <span class="badge badge--color">
    - ![alt](src){width=N}                    -> img with width
    - # Heading {color=warning}               -> h1 with data-color

    NOTE: {badge:...} inline substitution is done AT THE END, after all container
    directives have been processed. If we substituted badges first, their <span>
    tags (with attribute quotes) would break the regex matching of callout titles
    like: ::: callout critical "{badge:critical:X} Attenzione..."
    """
    # Print-hide inline: ::print-hide:: text ::: -> <span class="print-hide">text</span>
    md_text = re.sub(
        r'::print-hide::\s*([^:]+?)\s*:::',
        lambda m: f'<span class="print-hide">{m.group(1).strip()}</span>',
        md_text
    )

    # Image width: ![alt](src){width=400} -> <figure>
    def img_with_width(match):
        alt = match.group(1)
        src = match.group(2)
        attrs = match.group(3) or ''
        width_match = re.search(r'width=(\d+)', attrs)
        width = width_match.group(1) if width_match else None
        # Responsive pattern: width sets the preferred size, max-width:100%
        # ensures the image never exceeds its container (critical on mobile).
        # Using only max-width (without width:100%) made the image try to be
        # exactly Npx even on narrow screens, causing overflow and clipping.
        style = f' style="width:{width}px; max-width:100%"' if width else ''
        return f'<figure><img src="{src}" alt="{alt}"{style}><figcaption>{alt}</figcaption></figure>'
    md_text = re.sub(
        r'!\[([^\]]*)\]\(([^)]+)\)(\{[^}]*\})?',
        img_with_width, md_text
    )

    # Callout: ::: callout TYPE "TITLE" ... :::
    # The markdown-it container plugin already handles ::: name ... :::, so we
    # need to pre-process the callouts into containers with the title encoded as
    # an attribute. We'll transform:
    #   ::: callout warning "Title text"
    #   body
    #   :::
    # into:
    #   <div class="callout callout--warning"><div class="callout__icon"></div><div class="callout__body"><p class="callout__title">Title text</p>
    #   body
    #   </div></div>
    def process_callout(match):
        callout_type = match.group(1)
        title = match.group(2) if match.group(2) else ''
        body = match.group(3).strip()
        # Render inner body as markdown later — for now, wrap in a placeholder
        # that the main markdown-it will process normally.
        # We mark the body with a unique class so Jinja/markdown can process it.
        title_html = f'<p class="callout__title">{_inline_md(title)}</p>' if title else ''
        icon = _callout_icon(callout_type)
        # The body needs to be re-parsed as markdown inside the div.
        # We'll mark it and process later, but simpler: place as-is and rely on
        # markdown-it rendering any markdown inside <div> (which it does if
        # html=True and no leading spaces).
        return (
            f'<div class="callout callout--{callout_type}">\n'
            f'<div class="callout__icon">{icon}</div>\n'
            f'<div class="callout__body">\n{title_html}\n\n{body}\n\n</div>\n</div>\n'
        )
    md_text = re.sub(
        r'::: callout (\w+)(?:\s+"([^"]+)")?\n(.*?)\n:::',
        process_callout, md_text, flags=re.DOTALL
    )

    # Card: ::: card [highlight] ... :::
    def process_card(match):
        variant = match.group(1) or ''
        body = match.group(2).strip()
        cls = 'card card--highlight' if 'highlight' in variant else 'card'
        return f'<div class="{cls}">\n\n{body}\n\n</div>\n'
    md_text = re.sub(
        r'::: card\s*(\w+)?\n(.*?)\n:::',
        process_card, md_text, flags=re.DOTALL
    )

    # Workflow: ::: workflow ... :::
    # Each numbered line "1. **Title** :: Description" -> a step box
    def process_workflow(match):
        body = match.group(1).strip()
        steps = []
        for line in body.split('\n'):
            line = line.strip()
            m = re.match(r'^\d+\.\s+\*\*([^*]+)\*\*\s*::\s*(.+)$', line)
            if m:
                steps.append((m.group(1), m.group(2)))
        if not steps:
            return ''
        html = '<div class="workflow">\n'
        for i, (title, desc) in enumerate(steps, 1):
            html += (
                f'<div class="workflow__step">'
                f'<div class="workflow__step-num">{i}</div>'
                f'<div class="workflow__step-title">{title}</div>'
                f'<div class="workflow__step-desc">{desc}</div>'
                f'</div>\n'
            )
            if i < len(steps):
                html += '<div class="workflow__arrow">→</div>\n'
        html += '</div>\n'
        return html
    md_text = re.sub(
        r'::: workflow\n(.*?)\n:::',
        process_workflow, md_text, flags=re.DOTALL
    )

    # Checklist: ::: checklist  / - item / :::
    def process_checklist(match):
        body = match.group(1).strip()
        items = []
        for line in body.split('\n'):
            m = re.match(r'^\s*-\s+(.+)$', line)
            if m:
                items.append(_inline_md(m.group(1)))
        html = '<ul class="checklist">\n'
        for item in items:
            html += f'  <li>{item}</li>\n'
        html += '</ul>\n'
        return html
    md_text = re.sub(
        r'::: checklist\n(.*?)\n:::',
        process_checklist, md_text, flags=re.DOTALL
    )

    # Glossary: ::: glossary ... :::
    # Each "**Term** :: Definition" becomes a <details> entry
    def process_glossary(match):
        body = match.group(1).strip()
        entries = []
        for line in body.split('\n\n'):
            line = line.strip()
            m = re.match(r'^\*\*([^*]+)\*\*\s*::\s*(.+)$', line, re.DOTALL)
            if m:
                entries.append((m.group(1), m.group(2)))
        html = '<div class="glossary">\n'
        for term, defn in entries:
            html += f'<details>\n<summary>{term}</summary>\n<div>{_inline_md(defn)}</div>\n</details>\n'
        html += '</div>\n'
        return html
    md_text = re.sub(
        r'::: glossary\n(.*?)\n:::',
        process_glossary, md_text, flags=re.DOTALL
    )

    # Steps: ::: steps / 1. content / 2. content / :::
    def process_steps(match):
        body = match.group(1).strip()
        # Split on lines starting with "N. "
        steps = re.split(r'\n(?=\d+\.\s)', body)
        html = '<ol class="steps">\n'
        for step in steps:
            step = step.strip()
            m = re.match(r'^\d+\.\s+(.+)$', step, re.DOTALL)
            if m:
                html += f'<li>\n\n{m.group(1)}\n\n</li>\n'
        html += '</ol>\n'
        return html
    md_text = re.sub(
        r'::: steps\n(.*?)\n:::',
        process_steps, md_text, flags=re.DOTALL
    )

    # Manual steps: ::: manual-steps / [1a] content / [1b] content / :::
    def process_manual_steps(match):
        body = match.group(1).strip()
        # Split on lines starting with "[label] "
        parts = re.split(r'\n(?=\[[^\]]+\]\s)', body)
        html = '<ol class="steps-manual">\n'
        for part in parts:
            part = part.strip()
            m = re.match(r'^\[([^\]]+)\]\s+(.+)$', part, re.DOTALL)
            if m:
                label = m.group(1)
                content = m.group(2)
                html += f'<li><span class="steps-manual__label">{label}</span>\n\n{content}\n\n</li>\n'
        html += '</ol>\n'
        return html
    md_text = re.sub(
        r'::: manual-steps\n(.*?)\n:::',
        process_manual_steps, md_text, flags=re.DOTALL
    )

    # Chapter heading color: # Title {color=warning}
    # Transform into: # Title <!-- data-color=warning -->
    # Then post-process after markdown rendering.
    md_text = re.sub(
        r'^(#{1,3})\s+(.+?)\s+\{color=(\w+)\}\s*$',
        lambda m: f'{m.group(1)} {m.group(2)} <!--data-color:{m.group(3)}-->',
        md_text, flags=re.MULTILINE
    )

    # Inline badges: {badge:warning:Downgrade} -> span.badge
    # IMPORTANT: done LAST, after all container directives have been processed.
    # If we did this earlier, the <span> tags (with their attribute quotes) would
    # break the regex matching of callout titles containing a badge.
    md_text = re.sub(
        r'\{badge:(\w+):([^}]+)\}',
        lambda m: f'<span class="badge badge--{m.group(1)}">{m.group(2)}</span>',
        md_text
    )

    return md_text


def _inline_md(text: str) -> str:
    """Render a short inline fragment as HTML (bold, italic, code, links)."""
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'\*([^*]+)\*', r'<em>\1</em>', text)
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
    return text


def _callout_icon(callout_type: str) -> str:
    """SVG icon for each callout type."""
    icons = {
        'info':     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
        'warning':  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        'critical': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        'success':  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>',
    }
    return icons.get(callout_type, icons['info'])


# ============================================================
# POST-PROCESSING (AFTER MARKDOWN RENDERING)
# ============================================================

def postprocess_html(html: str) -> str:
    """Apply post-render transformations."""
    # Convert <!--data-color:TYPE--> inside headings to data-color attribute
    def apply_color(match):
        tag = match.group(1)
        content = match.group(2)
        color_match = re.search(r'<!--data-color:(\w+)-->', content)
        if color_match:
            color = color_match.group(1)
            content = re.sub(r'<!--data-color:\w+-->', '', content).strip()
            return f'<{tag} class="chapter" data-color="{color}">{content}</{tag}>'
        return match.group(0)
    html = re.sub(r'<(h1)>(.*?)</h1>', apply_color, html, flags=re.DOTALL)

    # Plain h1 (no data-color) still needs chapter class
    html = re.sub(r'<h1>(.*?)</h1>', r'<h1 class="chapter">\1</h1>', html, flags=re.DOTALL)
    # h2 -> section, h3 -> subsection
    html = re.sub(r'<h2>(.*?)</h2>', r'<h2 class="section">\1</h2>', html, flags=re.DOTALL)
    html = re.sub(r'<h3>(.*?)</h3>', r'<h3 class="subsection">\1</h3>', html, flags=re.DOTALL)

    # Wrap code blocks with copy button
    def wrap_code(match):
        lang = match.group(1) or ''
        code = match.group(2)
        # Unescape HTML entities inside <code> for the data-copy attribute
        raw = (code.replace('&lt;', '<').replace('&gt;', '>')
                   .replace('&amp;', '&').replace('&quot;', '"'))
        # Escape for HTML attribute
        data_copy = raw.replace('"', '&quot;').replace('\n', '&#10;')
        label = lang if lang else 'Comando'
        icon = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
                'stroke-width="2" stroke-linecap="round">'
                '<rect x="9" y="9" width="13" height="13" rx="2"/>'
                '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>')
        return (
            f'<div class="code-block">'
            f'<div class="code-block__header">'
            f'<span>{label}</span>'
            f'<button class="code-block__copy" data-copy="{data_copy}">{icon} Copia</button>'
            f'</div>'
            f'<pre><code>{code}</code></pre>'
            f'</div>'
        )
    html = re.sub(
        r'<pre><code(?:\s+class="language-(\w+)")?>(.*?)</code></pre>',
        wrap_code, html, flags=re.DOTALL
    )

    # Auto-append chapter number to chapter headings (data-based)
    # Find all <h1 class="chapter"> and prepend "CAPITOLO N"
    chapter_count = [0]
    def number_chapter(match):
        chapter_count[0] += 1
        attrs = match.group(1) or ''
        content = match.group(2)
        # Extract data-color if present
        color_match = re.search(r'data-color="(\w+)"', attrs)
        color_attr = f' data-color="{color_match.group(1)}"' if color_match else ''
        return (
            f'<div class="chapter__num"{color_attr}>Capitolo {chapter_count[0]}</div>'
            f'<h1 class="chapter"{attrs}>{content}</h1>'
        )
    html = re.sub(
        r'<h1 class="chapter"([^>]*)>(.*?)</h1>',
        number_chapter, html, flags=re.DOTALL
    )

    return html


# ============================================================
# BUILD FUNCTION
# ============================================================

def slugify(text: str) -> str:
    text = re.sub(r'[^\w\s-]', '', text.lower())
    text = re.sub(r'[\s_-]+', '-', text)
    return text.strip('-')


def load_image_as_data_url(relative_path: str) -> str:
    """Load an image from disk and return it as a data: URL for inline embedding.

    Used for assets referenced in Jinja templates (logo, etc.) that are NOT
    processed by embed_images() — which only runs on the per-guide markdown body.
    Returns empty string if the file is missing (warning printed, build continues).
    """
    path = ROOT / relative_path
    if not path.exists():
        print(f"  ⚠ Immagine non trovata: {path}")
        return ""
    ext = path.suffix.lower().lstrip('.')
    mime = 'image/jpeg' if ext in ('jpg', 'jpeg') else f'image/{ext}'
    data = base64.b64encode(path.read_bytes()).decode()
    return f"data:{mime};base64,{data}"


def embed_images(html: str, slug: str) -> str:
    """Replace <img src="images/SLUG/file.png"> with base64 data URLs."""
    def replace_src(match):
        src = match.group(1)
        # Handle both "images/atto2/file.png" and "atto2/file.png" forms
        if src.startswith('images/'):
            path = ROOT / src
        else:
            path = IMAGES_DIR / slug / src
        if not path.exists():
            print(f"  ⚠ Immagine non trovata: {path}")
            return match.group(0)
        ext = path.suffix.lower().lstrip('.')
        mime = 'image/jpeg' if ext in ('jpg', 'jpeg') else f'image/{ext}'
        data = base64.b64encode(path.read_bytes()).decode()
        return f'src="data:{mime};base64,{data}"'
    return re.sub(r'src="(images/[^"]+|[^/"]+/(?:image)[^"]+)"', replace_src, html)


def extract_toc(html: str):
    """Extract a list of (id, text, color) from <h1 class="chapter"> elements."""
    toc = []
    pattern = re.compile(
        r'<h1 class="chapter"(?:\s+data-color="(\w+)")?>(.*?)</h1>',
        re.DOTALL
    )
    for m in pattern.finditer(html):
        color = m.group(1) or ''
        text = re.sub(r'<[^>]+>', '', m.group(2)).strip()
        slug = slugify(text)
        toc.append({'id': slug, 'text': text, 'color': color})
    return toc


def add_ids_to_headings(html: str, toc):
    """Add id="..." to <h1 class="chapter"> matching the TOC (in document order)."""
    idx = [0]
    def add_id(match):
        if idx[0] >= len(toc):
            return match.group(0)
        slug = toc[idx[0]]['id']
        idx[0] += 1
        attrs = match.group(1) or ''
        content = match.group(2)
        # Put id directly on the h1 — no section wrap (the section was closing
        # immediately and leaving the chapter body outside of it, which broke
        # anchor navigation and spacing).
        return f'<h1 id="{slug}" class="chapter"{attrs}>{content}</h1>'
    html = re.sub(
        r'<h1 class="chapter"([^>]*)>(.*?)</h1>',
        add_id, html, flags=re.DOTALL
    )
    return html


def build_guide(guide_path: Path, template: jinja2.Template, logo_src: str = ""):
    """Build a single guide: md -> html."""
    print(f"\n🔨 Building: {guide_path.name}")
    text = guide_path.read_text(encoding='utf-8')
    meta, body = parse_frontmatter(text)

    slug = meta.get('slug', guide_path.stem)

    # Step 1: Jinja2 variable substitution in the markdown body
    body_rendered = jinja2.Template(body).render(**meta)

    # Step 2: Custom syntax preprocessing
    body_rendered = preprocess_custom_syntax(body_rendered)

    # Step 3: Markdown -> HTML
    md = (MarkdownIt('commonmark', {'html': True, 'breaks': False, 'linkify': True})
          .enable('table')
          .enable('strikethrough'))
    html_body = md.render(body_rendered)

    # Step 4: Post-processing
    html_body = postprocess_html(html_body)

    # Step 5: Build TOC from h1.chapter elements
    toc = extract_toc(html_body)

    # Step 6: Add ids to headings for anchor linking
    html_body = add_ids_to_headings(html_body, toc)

    # Step 7: Embed images as base64 (self-contained HTML)
    html_body = embed_images(html_body, slug)

    # Step 8: Render into template
    output_html = template.render(
        meta=meta,
        body=html_body,
        toc=toc,
        logo_src=logo_src,
    )

    # Step 9: Write output
    output_file = OUTPUT_DIR / f"{slug}.html"
    output_file.write_text(output_html, encoding='utf-8')
    size_mb = output_file.stat().st_size / 1024 / 1024
    print(f"  ✅ {output_file.name} ({size_mb:.2f} MB) — {len(toc)} capitoli")
    return {
        'slug': slug,
        'title': meta.get('titolo', slug.upper()),
        'version': meta.get('version', '—'),
        'date': meta.get('date', ''),
        'author': meta.get('author', ''),
        'chapters': len(toc),
        # Campo opzionale: se la guida lo definisce, la landing page lo userà
        # come descrizione della card. Altrimenti la landing usa il default.
        'card_description': meta.get('card_description'),
        # Overline della card (default "BYD" se non dichiarato). Passa ""
        # per nascondere l'overline.
        'overline': meta.get('overline', 'BYD'),
        # Categoria opzionale (es. "Firmware", "Mod", "Accessori"). Se presente
        # compare come badge pillola sulla card della landing page.
        'category': meta.get('category'),
    }


def build_index(guides: list, index_template: jinja2.Template, logo_src: str = ""):
    """Build landing page listing all guides."""
    output = index_template.render(guides=guides, logo_src=logo_src)
    (OUTPUT_DIR / "index.html").write_text(output, encoding='utf-8')
    print(f"\n🏠 index.html generato ({len(guides)} guide)")


# ============================================================
# MAIN
# ============================================================

def main():
    parser = argparse.ArgumentParser(description="Build BYD guides")
    parser.add_argument('--guide', help="Build solo una guida specifica (es. atto2)")
    args = parser.parse_args()

    OUTPUT_DIR.mkdir(exist_ok=True)

    env = jinja2.Environment(
        loader=jinja2.FileSystemLoader(TEMPLATE_DIR),
        autoescape=False
    )
    guide_tmpl = env.get_template("guide.html.j2")
    index_tmpl = env.get_template("index.html.j2")

    # Find all guide markdown files
    if args.guide:
        md_files = [GUIDES_DIR / f"{args.guide}.md"]
        if not md_files[0].exists():
            print(f"❌ Guida non trovata: {md_files[0]}")
            sys.exit(1)
    else:
        # Escludi file che iniziano con "_" (template, bozze, ecc.)
        md_files = sorted(p for p in GUIDES_DIR.glob("*.md") if not p.name.startswith("_"))
        if not md_files:
            print(f"❌ Nessun .md in {GUIDES_DIR}")
            sys.exit(1)

    print(f"📖 Trovate {len(md_files)} guide da processare\n")

    # Carica una volta sola il logo come data URL, poi lo passa ai template.
    # Inlinato direttamente nell'HTML finale (stesso approccio delle immagini
    # delle guide — vedi embed_images). Per cambiare logo sostituisci il file
    # COMMUNITY_LOGO_PATH: nessuna modifica ai template o al codice.
    logo_src = load_image_as_data_url(COMMUNITY_LOGO_PATH)

    built_guides = []
    for md_file in md_files:
        info = build_guide(md_file, guide_tmpl, logo_src=logo_src)
        built_guides.append(info)

    # Only rebuild index if we built all guides
    if not args.guide:
        build_index(built_guides, index_tmpl, logo_src=logo_src)
        copy_wizard()

    print(f"\n✨ Build completato! Apri {OUTPUT_DIR / 'index.html'} nel browser.")


# Categorie canoniche con i preset di stile abbinati. Il wizard le mostra come
# suggerimenti nel combo "categoria"; sceglierne una pre-compila theme_color e
# overline. Categorie già usate da guide esistenti vengono aggiunte in coda.
CANONICAL_CATEGORIES = {
    "Firmware":       {"theme_color": "#3B82F6", "overline": "FIRMWARE"},
    "Sideloading":    {"theme_color": "#3B82F6", "overline": "FIRMWARE"},
    "Mod":            {"theme_color": "#10B981", "overline": "MOD / FAI-DA-TE"},
    "HW Upgrade":     {"theme_color": "#10B981", "overline": "MOD / FAI-DA-TE"},
    "Troubleshooting":{"theme_color": "#F59E0B", "overline": "TROUBLESHOOTING"},
}


def copy_wizard():
    """Copy tools/wizard into docs/wizard and emit guides.json with the
    slugs/categories the wizard needs for validation and UI presets.

    Inject the same payload inline into index.html as window.GUIDES_DATA so
    the wizard works also when opened directly from disk (file://), where
    fetch() is blocked by the browser CORS policy."""
    src = ROOT / "tools" / "wizard"
    if not src.exists():
        return
    dst = OUTPUT_DIR / "wizard"
    shutil.copytree(src, dst, dirs_exist_ok=True)

    # Raccogli slug e categorie già usate dalle guide buildabili.
    slugs = []
    used_categories = []
    for p in sorted(GUIDES_DIR.glob("*.md")):
        if p.name.startswith("_"):
            continue
        meta, _body = parse_frontmatter(p.read_text(encoding="utf-8"))
        slugs.append(meta.get("slug", p.stem))
        cat = meta.get("category")
        if cat and cat not in used_categories:
            used_categories.append(cat)

    # Categorie suggerite: canoniche prima, poi quelle già usate non duplicate.
    categories = list(CANONICAL_CATEGORIES.keys())
    for c in used_categories:
        if c not in categories:
            categories.append(c)

    payload = {
        "slugs": slugs,
        "categories": categories,
        "categoryPresets": CANONICAL_CATEGORIES,
    }
    payload_json = json.dumps(payload, ensure_ascii=False, indent=2)

    # 1) File esterno (utile se servito da web server)
    (dst / "guides.json").write_text(payload_json, encoding="utf-8")

    # 2) Inietta inline nell'index.html, così il wizard funziona anche
    #    aperto direttamente da filesystem. Il marker viene sostituito
    #    ogni build, quindi è sempre allineato.
    index_path = dst / "index.html"
    if index_path.exists():
        html = index_path.read_text(encoding="utf-8")
        # Per evitare che '</script>' contenuto nei dati (improbabile ma
        # possibile via category liberi) chiuda lo script, escapiamo come
        # raccomandato dalla spec HTML.
        safe_json = payload_json.replace("</", "<\\/")
        injected = f'<script id="injected-guides-data">window.GUIDES_DATA={safe_json};</script>'
        # Sostituisce sia il placeholder iniziale (window.GUIDES_DATA=null;)
        # sia uno script già iniettato in build precedente.
        html = re.sub(
            r'<script id="injected-guides-data">[\s\S]*?</script>',
            injected,
            html,
        )
        index_path.write_text(html, encoding="utf-8")

    print(f"🧰 Wizard pubblicato in {dst} (slugs: {len(slugs)}, categorie: {len(categories)})")


if __name__ == '__main__':
    main()