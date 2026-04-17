# BYD Club Italia — Guide Firmware

> Guide community alla gestione del firmware dell'infotainment BYD: **downgrade, sideload e upgrade**.

🌐 **Sito live**: [byd-club-italia.github.io/byd-club-italia-guides](https://byd-club-italia.github.io/byd-club-italia-guides/)

## Guide disponibili

| Modello | Versione | Note |
|---------|----------|------|
| [BYD ATTO 2](https://byd-club-italia.github.io/byd-club-italia-guides/atto2.html) | v0.1.1 | Sideload via ADB |
| [BYD ATTO 3](https://byd-club-italia.github.io/byd-club-italia-guides/atto3.html) | v0.7.4 | Sideload via USB + password |
| [BYD Dolphin Surf](https://byd-club-italia.github.io/byd-club-italia-guides/surf.html) | v0.0.2 | Sideload via ADB |

## Come funziona questo repo

Le guide sono scritte in **Markdown** (un file per modello in `guides/`). Ad ogni modifica, GitHub Actions rigenera automaticamente l'HTML e aggiorna il sito live.

**Stack tecnologico:**
- **Contenuto**: Markdown con YAML frontmatter per le variabili (versioni firmware, link, ecc.)
- **Template**: Jinja2 + HTML/CSS custom
- **Build**: Python (`build.py`) con `markdown-it-py`
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

## Sei un collaboratore?

Per modificare le guide, leggi **[GUIDE_FOR_EDITORS.md](GUIDE_FOR_EDITORS.md)** — contiene istruzioni passo-passo per modificare i file dal web GitHub senza toccare una riga di comando.

## Struttura del repo

```
byd-club-italia-guides/
├── guides/              ← file Markdown delle guide (MODIFICA QUI)
│   ├── atto2.md
│   ├── atto3.md
│   └── surf.md
├── images/              ← immagini delle guide
│   ├── atto2/
│   ├── atto3/
│   └── surf/
├── templates/           ← struttura grafica condivisa
│   ├── guide.html.j2
│   └── index.html.j2
├── docs/                ← output generato (non modificare manualmente)
├── build.py             ← script di build
├── requirements.txt     ← dipendenze Python
└── .github/workflows/
    └── build.yml        ← GitHub Actions (autobuild al push)
```

## Build in locale (sviluppatori)

```bash
# Installa dipendenze
pip install -r requirements.txt

# Genera tutte le guide
python build.py

# Genera una sola guida
python build.py --guide atto2

# Apri il risultato
open docs/index.html   # macOS
xdg-open docs/index.html   # Linux
start docs/index.html   # Windows
```

## Licenza

Documento didattico rilasciato per uso della community BYD Club Italia. Uso a proprio rischio.

## Credits

- **Autore originale**: Leonardo Bandini ([@LeonardoBandini](https://t.me/LeonardoBandini))
- **Editor**: Stefano Tagliaferri ([@Tagliax10](https://t.me/Tagliax10))
- **Procedura ATTO 2**: teorizzata da Gino ([@giino01](https://t.me/giino01)), concretizzata da Roberto ([@Migliolfo](https://t.me/Migliolfo))
- **Community**: [BYD Club Italia News](https://t.me/BYDCLUBITALIANews) · [Gruppo di discussione](https://t.me/BYD_CLUB_ITALIA)

---

_Per segnalare errori o proporre modifiche: apri una [Issue](../../issues) oppure una [Pull Request](../../pulls)._
