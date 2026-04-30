# Guida per editor — Come modificare le guide BYD

Questo documento spiega come creare, modificare e correggere le guide senza conoscere programmazione. Puoi fare tutto dal **browser web**, niente da installare.

> **In sintesi**: per una nuova guida usa il Wizard. Per modificare guide esistenti clicca ✏️ direttamente su GitHub. In entrambi i casi proponi una Pull Request, qualcun altro approva, e dopo ~30 secondi il sito si aggiorna automaticamente.

---

## Come funziona il flusso di modifica

Il ramo principale del repo (`main`) è **protetto**: nessuno può modificarlo direttamente. Tutte le modifiche passano attraverso una **Pull Request** (PR), cioè una proposta che un altro collaboratore deve approvare prima che venga applicata.

Non devi sapere nulla di Git: GitHub crea il branch temporaneo in automatico quando clicchi "Propose changes".

```
1. Modifichi (con il Wizard o direttamente su GitHub)
2. Proponi le modifiche → GitHub crea un branch in automatico
3. Si apre una Pull Request
4. Un altro collaboratore la approva
5. Merge → build → sito aggiornato in ~30 secondi
```

---

## Prima volta: accesso al repo

1. Vai su [github.com/BYD-Club-Italia/byd-club-italia-guides](https://github.com/BYD-Club-Italia/byd-club-italia-guides)
2. Fai login con il tuo account GitHub
3. Se sei stato invitato come collaboratore, accetta l'invito (arriva via email e compare un banner giallo sul repo)
4. Ora puoi proporre modifiche

---

## Il Wizard — crea una nuova guida dal browser

Il **Wizard** è lo strumento consigliato per creare nuove guide. Tutto avviene nel browser: i tuoi file non lasciano il computer finché non li carichi tu su GitHub.

**Apri il Wizard:** [byd-club-italia.github.io/byd-club-italia-guides/wizard/](https://byd-club-italia.github.io/byd-club-italia-guides/wizard/)

Il Wizard è diviso in 7 sezioni. Compilale nell'ordine — l'anteprima a destra si aggiorna in tempo reale.

---

### Sezione 1 — Identità

| Campo | Obbligatorio | Note |
|---|---|---|
| **Titolo della guida** | ✅ | Compare come titolone nell'hero della guida |
| **Slug** | ✅ | Generato in automatico dal titolo. Deve essere unico, solo minuscole/numeri/trattini. Il Wizard lo valida subito e ti avvisa se è già usato |
| **Versione** | — | Default `1.0.0`. Segui il formato `MAJOR.MINOR.PATCH` |
| **Data** | ✅ | Formato `GG/MM/AAAA` |
| **Autore** | ✅ | Il tuo nome, compare nel footer della guida |
| **Editor** | — | Lascia vuoto se non c'è un revisore |

Lo **slug** è il nome del file `.md` e della cartella immagini. Una volta scelto non cambiarlo: romperebbe i link esistenti. Se lo slug è già usato da una guida esistente, il Wizard lo segnala con un errore rosso.

---

### Sezione 2 — Categoria

| Campo | Note |
|---|---|
| **Categoria** | Testo libero. Il menu a tendina mostra le categorie già usate: scegliendo una di quelle il Wizard compila automaticamente il colore e l'overline. Puoi anche digitare una categoria nuova |
| **Overline** | Etichetta piccola sopra il titolone (es. `MOD / FAI-DA-TE`). Lascia vuoto per nasconderla |
| **Theme color** | Colore esadecimale `#RRGGBB` usato per l'hero. Usa il color picker oppure digita il codice direttamente |

Le categorie con preset automatici sono: **Firmware**, **Mod**, **Sideloading**, **Diagnostica**, **Accessori**. Scegliendo una di queste il Wizard imposta colore e overline consigliati, ma puoi cambiarli.

---

### Sezione 3 — Testi descrittivi

| Campo | Dove appare |
|---|---|
| **Sottotitolo** | Sotto il titolone nell'hero della guida |
| **Card description** | Riga di testo sulla card della landing page |
| **Meta description** | Descrizione per i motori di ricerca (SEO), ~150 caratteri |

Tutti e tre sono opzionali. Se omessi, il sito usa un testo generico.

---

### Sezione 4 — Variabili custom

Le variabili custom sono coppie chiave/valore (es. `firmware_target` = `2508`) richiamabili nel corpo della guida con la sintassi `{{ nome_variabile }}`. Il sistema le sostituisce con il valore al momento del build.

Sono utili per valori che compaiono più volte nella guida (link, numeri di versione, codici). Se il valore cambia, basta aggiornarlo in un posto solo.

**Aggiungere una variabile:**
1. Clicca **+ Aggiungi variabile**
2. Inserisci il nome (solo lettere, numeri e `_`, es. `link_telegram`) e il valore
3. Usa il pulsante **Variabile** della toolbar per inserirla nel testo

---

### Sezione 5 — Galleria immagini

Le immagini caricate nel Wizard restano nel tuo browser — non vengono inviate ad alcun server. Finiscono nello zip solo quando premi "Scarica zip".

**Caricare immagini reali:**
- Trascina i file nell'area tratteggiata, oppure clicca **scegli dal computer**
- Formati accettati: PNG, JPEG, GIF, WebP, SVG
- Per ogni immagine puoi modificare: nome file, didascalia, larghezza (px)

**Usare un placeholder (immagine non ancora disponibile):**
- Clicca **+ Aggiungi placeholder senza file**
- Il Wizard inserisce un segnaposto grigio; nello zip viene inclusa l'immagine `placeholder.png`
- Sostituisci il file con l'immagine reale quando ce l'hai (caricandola nella PR)

Dopo aver aggiunto almeno un'immagine, il pulsante **Immagine** nella toolbar del corpo si attiva.

> **Nota sul ripristino bozza**: se chiudi il browser e riapri il Wizard, le immagini caricate non vengono recuperate (i file rimangono solo nel browser attivo). Al ripristino di una bozza le voci della galleria tornano come placeholder con i nomi originali, così sai esattamente quali file ricaricare.

---

### Sezione 6 — Corpo della guida

L'editor è diviso in due colonne: il testo Markdown a sinistra, l'anteprima a destra.

#### Toolbar — blocchi disponibili

**Testo base**

| Pulsante | Inserisce |
|---|---|
| H1 / H2 / H3 | Titolo di capitolo, sezione, sotto-sezione |
| **B** | Testo in **grassetto** (`**testo**`) |
| *I* | Testo in *corsivo* (`*testo*`) |
| `</>` | Codice inline (`` `codice` ``) |
| Link | Dialog: inserisce `[testo](url)` |

**Liste**

| Pulsante | Inserisce |
|---|---|
| • Lista | Lista puntata (`- voce`) |
| 1. Lista | Lista numerata (`1. voce`) |
| ☐ Checklist | Blocco `::: checklist` con voci spuntabili |

**Blocchi strutturati**

| Pulsante | Inserisce | Usa per |
|---|---|---|
| Callout | `::: callout tipo "Titolo"` | Box informativi, avvisi, note critiche, conferme. Tipi: `info` (blu), `warning` (arancione), `critical` (rosso), `success` (verde) |
| Steps | `::: steps` | Procedura numerata a passi singoli |
| Manual-steps | `::: manual-steps` | Procedura con varianti (es. `[1a]` / `[1b]`) |
| Workflow | `::: workflow` | Panoramica visiva di un flusso end-to-end |
| Glossary | `::: glossary` | Elenco termine → definizione |
| Card | `::: card` | Box neutro per approfondimenti o riepilogo |

**Elementi inline e blocchi tecnici**

| Pulsante | Inserisce |
|---|---|
| Badge | `{badge:tipo:testo}` — etichetta colorata inline. Tipi: `info`, `warning`, `critical`, `success`, `accent` |
| Tabella | Griglia Markdown con n colonne e n righe |
| Code block | Blocco di codice con evidenziazione sintattica. Linguaggi: `bash`, `powershell`, `json`, `yaml` |
| — HR — | Linea di separazione orizzontale (`---`) |
| Immagine | Dialog: sceglie dalla galleria, imposta didascalia e larghezza. Attivo solo se hai caricato almeno un'immagine |
| Variabile | Dialog: inserisce `{{ nome_variabile }}`. Attivo solo se hai definito almeno una variabile custom |

**Come usare la toolbar:**
- Clicca un pulsante per inserire il blocco alla posizione del cursore
- Per **grassetto**, **corsivo**, **codice inline**: seleziona prima il testo, poi clicca il pulsante
- Blocchi come **Callout** e **Card** aprono un piccolo dialog per configurarne il tipo e il contenuto prima di inserirli

---

### Sezione 7 — Output e caricamento su GitHub

#### Scarica lo zip

Clicca **Scarica `<slug>.zip`**. Il Wizard valida tutti i campi obbligatori prima di procedere: se manca qualcosa appare un messaggio rosso con l'elenco degli errori.

Lo zip ha questa struttura, pronta da estrarre nella root del repo:

```
guides/<slug>.md
images/<slug>/<immagini>
```

#### Caricamento via GitHub web (consigliato, zero strumenti locali)

1. **Carica il file Markdown**
   - Vai su [`guides/`](https://github.com/BYD-Club-Italia/byd-club-italia-guides/tree/main/guides)
   - Clicca **Add file → Upload files**
   - Trascina `<slug>.md` estratto dallo zip
   - In fondo alla pagina, seleziona *«Create a new branch for this commit and start a pull request»*
   - Come nome branch usa quello suggerito dal Wizard: `guida/<slug>`
   - Clicca **Propose changes**

2. **Apri la Pull Request**
   - GitHub ti porta alla pagina di creazione PR
   - Titolo suggerito: `Aggiunta guida: <titolo>` (il Wizard lo mostra nella sezione 7)
   - Clicca **Create pull request**

3. **Carica le immagini sulla stessa branch**
   - Sulla branch della PR appena aperta, vai su `images/`
   - Crea la cartella `<slug>/`: clicca **Add file → Create new file**, digita `<slug>/dummy` come nome file, poi cancella `dummy` — in questo modo GitHub crea la cartella
   - Clicca **Add file → Upload files** e trascina tutte le immagini contenute nello zip
   - Commit scegliendo *«Commit directly to the `guida/<slug>` branch»*

4. **Aspetta review e merge** — il sito si rigenera in ~30 secondi

> **Nota**: passaggi 1 e 3 possono essere fatti nell'ordine che preferisci, l'importante è che entrambi stiano sulla stessa branch prima del merge.

#### Caricamento via Git locale

Se hai Git installato e preferisci usarlo da terminale:

1. Crea il branch: `git checkout -b guida/<slug>`
2. Estrai lo zip nella root del repo
3. Commit e push:
   ```bash
   git add guides/<slug>.md images/<slug>/
   git commit -m "Aggiunta guida: <titolo>"
   git push -u origin guida/<slug>
   ```
4. Il link per aprire la PR viene stampato direttamente nel terminale

### Salvataggio automatico della bozza

Il Wizard salva automaticamente il lavoro nel browser (localStorage) ogni volta che modifichi un campo. Non devi fare nulla: il salvataggio avviene in background.

**Se chiudi il tab o aggiorni la pagina per sbaglio**, alla riapertura compare un banner blu in cima con la data, l'ora e il titolo dell'ultima bozza salvata. Hai due opzioni:

- **Riprendi bozza** — ripristina tutti i campi compilati, le variabili e il corpo della guida. Le immagini reali tornano come placeholder (vedi nota nella Sezione 5)
- **Inizia da capo** — cancella la bozza e riparte dal form vuoto

**La bozza viene cancellata automaticamente** dopo un export riuscito (scarica zip o copia negli appunti): a quel punto il lavoro è completato.

---

## Modificare guide esistenti

### Caso 1 — Aggiornare un valore (es. CountryCode)

Questo è il caso più comune. Immagina che il CountryCode sia cambiato da **China (86)** a **Singapore (65)**: basta cambiare **una riga per guida**.

1. Apri il file della guida su GitHub (es. `guides/atto2.md`)
2. Clicca l'icona **✏️ matita** in alto a destra
3. All'inizio del file trovi le variabili tra `---`:

   ```yaml
   ---
   countrycode_target: "Cina (86)"    ← QUESTA RIGA
   ---
   ```

4. Modifica il valore: `countrycode_target: "Singapore (65)"`
5. Clicca **Commit changes…**, seleziona *«Create a new branch and start a pull request»*, clicca **Propose changes**
6. Compila titolo PR (es. `Aggiorna CountryCode a Singapore`) e clicca **Create pull request**
7. Attendi l'approvazione. Puoi menzionare qualcuno con `@username` nei commenti

Ovunque nel file compaia `{{ countrycode_target }}` il sistema lo sostituirà con il nuovo valore. Cambi la riga una volta, si aggiorna dappertutto.

Per aggiornare più guide nella stessa PR: modifica i file uno alla volta sullo stesso branch prima di aprire la PR.

---

### Caso 2 — Aggiornare la versione firmware

Stessa logica del Caso 1, ma cambi la variabile `firmware_upgrade`:

```yaml
firmware_upgrade: "2508"          # prima era "2503"
```

Se cambia anche il link Telegram del firmware, aggiorna anche `telegram_upgrade_link`:

```yaml
telegram_upgrade_link: "https://t.me/BYDCLUBITALIANews/123"
```

---

### Caso 3 — Modificare un paragrafo di testo

1. Apri il file della guida e clicca **✏️**
2. Cerca il testo (Ctrl+F nel browser), modifica come in un normale editor
3. Commit → PR → aspetta approvazione

**Sintassi Markdown veloce:**

| Cosa vuoi fare | Come scriverlo |
|---|---|
| Grassetto | `**testo**` |
| Corsivo | `*testo*` |
| Codice inline | `` `comando` `` |
| Link | `[testo del link](https://url)` |
| Titolo capitolo | `# Titolo` |
| Titolo sezione | `## Sezione` |
| Lista puntata | `- elemento` |
| Lista numerata | `1. elemento` |

---

### Caso 4 — Aggiungere un box callout

Le guide usano 4 tipi di box colorati:

```
::: callout info "Titolo del box"
Testo informativo (blu).
:::

::: callout warning "Attenzione"
Avviso (arancione).
:::

::: callout critical "Pericolo"
Messaggio critico (rosso).
:::

::: callout success "Completato"
Conferma (verde).
:::
```

**Importante**: le righe `:::` devono stare da sole sulla riga, senza altri caratteri attorno. Il titolo tra virgolette è opzionale.

---

### Caso 5 — Aggiungere un blocco di codice

Per mostrare comandi con il bottone "Copia":

````
```powershell
Format /FS:FAT32 O:
```
````

**Linguaggi supportati**: `powershell`, `bash`, `json`, `yaml`, oppure lascia il nome linguaggio vuoto per testo generico.

---

### Caso 6 — Aggiungere un'immagine a una guida esistente

1. Nel repo GitHub, naviga in `images/<slug-della-guida>/`
2. **Add file → Upload files**, trascina l'immagine, fai commit su un branch nuovo
3. Nel file `.md` della stessa guida (sullo stesso branch), aggiungi:

   ```
   ![Descrizione immagine](images/<slug>/nome_file.png){width=400}
   ```

   La descrizione diventa la didascalia. `{width=400}` è opzionale.

> Upload dell'immagine e modifica del Markdown possono stare nella stessa PR: carica l'immagine per prima, poi modifica il `.md` sullo stesso branch.

---

### Caso 7 — Ho fatto un errore, come torno indietro?

**Se la PR non è ancora stata mergiata:**
- **Correggere**: vai sulla PR → tab **Files changed** → ✏️ → modifica → commit. Le modifiche si aggiungono alla stessa PR
- **Annullare tutto**: clicca **Close pull request** in fondo alla PR

**Se la PR è già stata mergiata (la modifica è live):**
1. Vai su [Commits](https://github.com/BYD-Club-Italia/byd-club-italia-guides/commits/main)
2. Trova il commit da annullare
3. Clicca `< >` per vedere le modifiche
4. Apri una nuova PR che ripristina la versione precedente del file

In alternativa apri una [Issue](https://github.com/BYD-Club-Italia/byd-club-italia-guides/issues) e chiedi aiuto.

---

## Rivedere e approvare una PR

Se qualcuno ti chiede di revisionare una PR:

1. Vai sulla PR (notifica GitHub via email)
2. Tab **Files changed**: verde = aggiunto, rosso = rimosso
3. Se tutto va bene: **Review changes → Approve → Submit review**
4. Se c'è da correggere: **Request changes** con spiegazione nel commento
5. Una volta approvata, il merge può farlo l'autore o tu stesso cliccando **Merge pull request**

**Nota**: non puoi approvare le tue PR. Serve sempre un altro collaboratore.

---

## Cosa NON modificare

- ❌ La cartella `docs/` — viene rigenerata automaticamente dalla build, ogni modifica manuale viene sovrascritta
- ❌ Il file `build.py` — è lo script tecnico che genera il sito
- ❌ I file in `templates/` — controllano il layout grafico di tutte le guide

Per cambiare questi file apri una Issue e chiedi a un contributor tecnico.

## Cosa SI può modificare liberamente

- ✅ Tutti i file in `guides/` (contenuto delle guide)
- ✅ Tutti i file in `images/` (aggiungere, sostituire, rimuovere immagini)
- ✅ `README.md` (descrizione del progetto)

---

## Domande frequenti

### Il sito non si è aggiornato dopo il merge

Controlla la tab [Actions](https://github.com/BYD-Club-Italia/byd-club-italia-guides/actions). Una ❌ rossa significa che il build è fallito. Clicca sull'errore per vedere il messaggio — di solito è un errore di sintassi (es. `}}` mancante in una variabile `{{ }}`).

### Perché non posso salvare direttamente su main?

Il branch `main` richiede PR e almeno 1 approvazione. È una misura standard per evitare errori: ogni modifica ha sempre due paia di occhi. Non è una questione di fiducia.

### Posso fare più modifiche nella stessa PR?

Sì. Puoi modificare più file prima di aprirla, o aggiungere modifiche al branch mentre la PR è aperta. Esempio: aggiornare `countrycode_target` in tutte e 3 le guide nella stessa PR.

### Il build scatta anche sulle PR?

Sì. Quando apri una PR, GitHub Actions costruisce il sito in prova (non pubblicato) per verificare che tutto si compili. Se il build fallisce appare una ❌ rossa e il merge viene bloccato finché non risolvi l'errore.

### Posso vedere l'anteprima prima del merge?

Il Wizard mostra un'anteprima live del corpo Markdown mentre scrivi. Per le modifiche manuali su GitHub, l'anteprima del browser mostra il Markdown grezzo (senza il nostro stile), ma il build automatico sulla PR ti dice almeno se la sintassi è valida.

### Posso lavorare offline?

Sì, ma serve Git e Python:

```bash
git clone https://github.com/BYD-Club-Italia/byd-club-italia-guides.git
cd byd-club-italia-guides
pip install -r requirements.txt
python build.py
# apri docs/index.html nel browser
```

Anche da locale dovrai aprire una PR — non puoi pushare direttamente su main.

### Come aggiungo una variabile custom a una guida esistente?

Aggiungi la variabile nel frontmatter YAML:

```yaml
---
mia_variabile: "valore"
---
```

Poi usala nel corpo con `{{ mia_variabile }}`. Per le nuove guide usa la Sezione 4 del Wizard.

---

## Contatti per supporto

- **Autore**: Leonardo Bandini ([@LeonardoBandini](https://t.me/LeonardoBandini))
- **Contributor tecnico**: Stefano Tagliaferri ([@Tagliax10](https://t.me/Tagliax10))
- **Community**: [BYD Club Italia](https://t.me/BYD_CLUB_ITALIA)

Per difficoltà chiedi nel canale Telegram o apri una [Issue su GitHub](https://github.com/BYD-Club-Italia/byd-club-italia-guides/issues/new).
