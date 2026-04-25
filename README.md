# BYD Club Italia — Guide community

> Guide della community per gli utenti BYD: **firmware**, **mod fai-da-te**, **accessori** e altro. Scritte, mantenute e aggiornate dagli utenti, per gli utenti.

🌐 **Sito live**: [byd-club-italia.github.io/byd-club-italia-guides](https://byd-club-italia.github.io/byd-club-italia-guides/)

L'elenco aggiornato delle guide disponibili è sulla home del sito. Ogni guida è consultabile online e scaricabile in PDF direttamente dal browser.

## Come funziona questo repo

Le guide sono scritte in **Markdown** (un file per guida in `guides/`). Ad ogni modifica, GitHub Actions rigenera automaticamente l'HTML e aggiorna il sito live.

**Stack tecnologico:**
- **Contenuto**: Markdown con YAML frontmatter per le variabili (versioni firmware, link, parametri tecnici, ecc.)
- **Template**: Jinja2 + HTML/CSS custom
- **Build**: Python (`build.py`) con `markdown-it-py`
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

## Sei un collaboratore?

Per modificare le guide, leggi **[GUIDE_FOR_EDITORS.md](GUIDE_FOR_EDITORS.md)** — contiene istruzioni passo-passo per modificare i file dal web GitHub senza toccare una riga di comando.

### Creare una nuova guida dal browser

Apri il **wizard web** ([byd-club-italia.github.io/byd-club-italia-guides/wizard/](https://byd-club-italia.github.io/byd-club-italia-guides/wizard/)): compili i campi, carichi le immagini con drag&drop, scrivi il corpo con una toolbar di blocchi (callout, steps, badge, …) e scarichi uno zip pronto da caricare su GitHub. Tutto avviene nel browser: nessun file lascia il tuo computer finché non lo carichi sulla PR. Vedi il [Caso 7 della guida editor](GUIDE_FOR_EDITORS.md#caso-7-aggiungere-una-nuova-guida) per il flusso completo.

In alternativa puoi sempre partire a mano da `guides/_template.md`: è un file di riferimento con il frontmatter commentato e tutti gli elementi grafici disponibili (callout, step, workflow, checklist, badge, ecc.).

## Struttura del repo

```
byd-club-italia-guides/
├── guides/              ← file Markdown delle guide (MODIFICA QUI)
│   └── _template.md         ← template da cui partire per nuove guide
├── images/              ← immagini delle guide (una sottocartella per guida)
│   └── common/              ← asset condivisi (logo, placeholder)
├── templates/           ← struttura grafica condivisa
│   ├── guide.html.j2
│   └── index.html.j2
├── tools/wizard/        ← wizard web per creare nuove guide (HTML/JS statico)
├── build.py             ← script di build
├── requirements.txt     ← dipendenze Python
└── .github/workflows/
    └── build.yml        ← GitHub Actions (autobuild al push)
```

Le sottocartelle di `guides/` e `images/` crescono automaticamente man mano che vengono aggiunte nuove guide: il nome della sottocartella immagini coincide con lo `slug` della guida (es. una guida con `slug: atto2` usa `images/atto2/`).

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
- **Community Telegram**: [BYD Club Italia News](https://t.me/BYDCLUBITALIANews) · [Gruppo di discussione](https://t.me/BYD_CLUB_ITALIA)

---

_Per segnalare errori o proporre modifiche: apri una [Issue](../../issues) oppure una [Pull Request](../../pulls)._