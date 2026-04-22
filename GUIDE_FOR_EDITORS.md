# 📝 Guida per editor — Come modificare le guide BYD

Questo documento spiega come modificare, aggiungere o correggere le guide senza conoscere programmazione. Puoi fare tutto dal **browser web**, niente da installare.

> 💡 **In sintesi**: modifichi un file di testo su GitHub, proponi la modifica, un altro collaboratore approva, e dopo ~30 secondi il sito si aggiorna automaticamente.

-----

## Come funziona il flusso di modifica

Il ramo principale del repo (`main`) è **protetto**: nessuno può modificarlo direttamente, neanche chi ha i permessi di scrittura. Tutte le modifiche passano attraverso una **Pull Request** (PR), che è semplicemente una proposta di modifica che qualcun altro deve approvare prima che venga applicata.

Non preoccuparti: GitHub gestisce tutto in automatico. Tu modifichi e clicchi un pulsante, il sistema crea un “ramo” temporaneo con le tue modifiche e apre la PR da solo. Non devi sapere nulla di Git o branch.

**Il flusso è questo:**

```
1. Clicchi ✏️ su un file
2. Modifichi
3. Clicchi "Propose changes" (GitHub crea un branch in automatico)
4. Si apre una Pull Request
5. Un altro collaboratore la approva
6. Merge → build → sito aggiornato in ~30 secondi
```

-----

## Prima volta: accesso al repo

1. Vai su [github.com/BYD-Club-Italia/byd-club-italia-guides](https://github.com/BYD-Club-Italia/byd-club-italia-guides)
1. Fai login con il tuo account GitHub
1. Se sei stato invitato come collaboratore, vedrai un pulsante per accettare l’invito. Accettalo.
1. Ora hai i permessi per proporre modifiche.

-----

## Caso 1: aggiornare un valore (esempio: CountryCode da China a Singapore)

Questo è il caso più comune. Immagina che il CountryCode per la procedura sia cambiato da **China (86)** a **Singapore (65)**. Devi aggiornare tutte e 3 le guide — ma in realtà basta cambiare **una riga per guida**.

### Passaggi

1. Apri il repo: [github.com/BYD-Club-Italia/byd-club-italia-guides](https://github.com/BYD-Club-Italia/byd-club-italia-guides)
1. Clicca sulla cartella `guides/`
1. Clicca su `atto2.md` (o la guida che vuoi modificare)
1. In alto a destra del file, clicca sull’icona **✏️ matita** (“Edit this file”)
1. All’inizio del file vedi una sezione tra `---` che contiene le variabili:
   
   ```yaml
   ---
   model: ATTO 2
   firmware_downgrade: "2404"
   countrycode_target: "Cina (86)"    ← QUESTA RIGA
   ---
   ```
1. Modifica la riga `countrycode_target` così:
   
   ```yaml
   countrycode_target: "Singapore (65)"
   ```
1. Scorri in fondo alla pagina e clicca il pulsante verde **“Commit changes…”**
1. Si aprirà un dialog. Compila:
- **Commit message**: un titolo breve, es. `Aggiorna CountryCode a Singapore (65)`
- **Extended description** (opzionale): dettagli più lunghi, se servono
- Seleziona **“Create a new branch for this commit and start a pull request”** (dovrebbe già essere selezionato in automatico, visto che il main è protetto)
- **Branch name**: lascia quello proposto da GitHub (es. `patch-1`), va benissimo
1. Clicca **“Propose changes”**
1. GitHub ti porta alla pagina di creazione della Pull Request. Compila titolo e descrizione (di default riprende il commit message), poi clicca **“Create pull request”**
1. **Attendi l’approvazione** di un altro collaboratore. Se vuoi, nella pagina della PR puoi menzionare qualcuno scrivendo un commento tipo `@username puoi dare un'occhiata?`
1. Quando la PR viene approvata e “mergiata”, dopo ~30 secondi il sito si aggiorna. Verifica su [byd-club-italia.github.io/byd-club-italia-guides](https://byd-club-italia.github.io/byd-club-italia-guides/).

**Fatto.** Il CountryCode è stato aggiornato **ovunque** nella guida ATTO 2 (nel testo, nei passi, nella procedura). Ripeti per `generale.md` e `surf.md` se serve — puoi farle anche nella stessa PR, modificando più file prima del passo 7.

### Perché funziona così?

Nel file Markdown, ovunque compaia `{{ countrycode_target }}` il sistema lo sostituisce con il valore definito in testa al file. Cambi il valore una volta, si aggiorna dovunque.

### E se la modifica viene rifiutata?

Chi fa la review può lasciare commenti direttamente sulla PR e chiederti di correggere qualcosa. Non è un rifiuto personale — serve solo per evitare errori. Per aggiornare la PR:

1. Vai sulla PR → tab **“Files changed”**
1. Clicca l’icona ✏️ sul file da correggere
1. Modifica e commit → le modifiche si aggiungono automaticamente alla stessa PR

-----

## Caso 2: aggiornare la versione firmware (esempio: 2503 → 2508)

Stessa logica del caso 1, ma cambi la variabile `firmware_upgrade` o `firmware_upgrade_latest`:

```yaml
firmware_upgrade: "2508"              # prima era "2503"
```

**Attenzione**: se cambia anche il link Telegram del firmware, aggiorna anche `telegram_upgrade_link`:

```yaml
telegram_upgrade_link: "https://t.me/BYDCLUBITALIANews/123"
```

Procedi come nel Caso 1 per aprire la PR.

-----

## Caso 3: modificare un paragrafo di testo

Se devi correggere una frase, aggiungere una nota, o riscrivere una sezione:

1. Apri il file della guida (es. `guides/atto2.md`)
1. Clicca sulla matita **✏️**
1. Cerca il testo da modificare (Ctrl+F nel browser)
1. Modificalo come faresti in qualsiasi editor di testo
1. Commit con un messaggio descrittivo → apri la PR → aspetta approvazione

### Sintassi Markdown veloce

|Cosa vuoi fare |Come scriverlo                 |
|---------------|-------------------------------|
|Grassetto      |`**testo in grassetto**`       |
|Corsivo        |`*testo in corsivo*`           |
|Codice inline  |``comando``                    |
|Link           |`[testo del link](https://url)`|
|Titolo capitolo|`# Titolo`                     |
|Sotto-titolo   |`## Sotto-titolo`              |
|Lista puntata  |`- elemento`                   |
|Lista numerata |`1. elemento`                  |

-----

## Caso 4: aggiungere un box “ATTENZIONE” o “NOTA”

Le guide usano 4 tipi di box colorati (“callout”). Si scrivono così:

### Box informativo (blu)

```
::: callout info "Titolo del box"
Testo del contenuto, può essere multilinea.

Anche con più paragrafi.
:::
```

### Box di avviso (arancione)

```
::: callout warning "Titolo del box"
Contenuto...
:::
```

### Box critico (rosso)

```
::: callout critical "Titolo del box"
Contenuto...
:::
```

### Box successo (verde)

```
::: callout success "Titolo del box"
Contenuto...
:::
```

**Importante**: le righe `:::` devono essere da sole sulla loro riga, senza altri caratteri attorno.

-----

## Caso 5: aggiungere un blocco di codice (comando)

Per mostrare un comando da copiare (es. comandi PowerShell, ADB):

````
```powershell
Format /FS:FAT32 O:
```
````

Il sistema aggiunge automaticamente il bottone “Copia” e la sintassi colorata.

**Linguaggi supportati**: `powershell`, `bash`, `json`, `yaml`, o lascia vuoto per testo generico.

-----

## Caso 6: aggiungere un’immagine

1. Prepara l’immagine (preferibilmente PNG o JPEG, non troppo pesante)
1. Sul repo GitHub, naviga in `images/atto2/` (o la cartella della guida appropriata)
1. Clicca il pulsante **“Add file”** → **“Upload files”**
1. Trascina l’immagine
1. In fondo alla pagina, scegli **“Create a new branch… and start a pull request”** (come al Caso 1) e clicca **“Propose changes”**
1. Nel file Markdown della guida, aggiungi:
   
   ```
   ![Descrizione dell'immagine](images/atto2/nome_file.png){width=400}
   ```

La descrizione diventa automaticamente la didascalia sotto l’immagine.

`{width=400}` è opzionale: imposta la larghezza massima in pixel (utile per immagini molto grandi).

> 💡 **Suggerimento**: upload dell’immagine e modifica del Markdown che la usa possono stare nella **stessa PR**. Dopo l’upload al passo 5 puoi tornare al file `.md` della guida sullo stesso branch che GitHub ha creato e modificarlo lì — le modifiche si aggiungeranno alla stessa PR.

-----

## Caso 7: aggiungere una nuova guida (es. BYD Seal U DM-i)

1. Crea un file `guides/sealu.md` prendendo come base `guides/atto2.md`
1. Modifica il frontmatter (tra i `---` in alto) con i valori corretti
1. Crea una cartella `images/sealu/`
1. Carica le immagini necessarie
1. Apri la PR e aspetta approvazione

Il sistema riconoscerà automaticamente la nuova guida e l’aggiungerà alla landing page.

### Campi frontmatter opzionali per personalizzare la guida

Oltre ai campi obbligatori (`model`, `model_slug`, `version`, ecc.), puoi aggiungere tre campi opzionali per rendere la guida più descrittiva:

```yaml
---
model: "Installazione XYZ"
model_slug: xyz
version: "1.0"
# ... altri campi ...

# Campi opzionali (se omessi si usa un testo generico):
subtitle: |
  Guida passo-passo all'installazione di <strong>XYZ</strong> sull'infotainment BYD,
  con configurazione e troubleshooting comune.
card_description: "Procedura completa per l'installazione di XYZ sull'infotainment."
meta_description: "Installazione XYZ su BYD - tutorial community BYD Club Italia"
---
```

- `subtitle` → sottotitolo nel box blu in cima alla guida (accetta HTML con `<strong>`, `<em>`, ecc.)
- `card_description` → descrizione della card sulla landing page
- `meta_description` → meta description HTML per la SEO

Se il campo `model` inizia già con “Guida” (es. `model: "Guida Installazione X"`), il sistema non aggiunge un secondo “Guida” davanti nel titolo, evitando duplicati tipo “Guida Guida Installazione X”.

-----

## Caso 8: ho fatto un errore, come torno indietro?

Dipende in che fase sei:

### Se la PR non è ancora stata mergiata

È la situazione più semplice. Hai due opzioni:

- **Correggere**: vai sulla PR → tab **“Files changed”** → ✏️ sul file → modifica → commit. Le modifiche si aggiungono alla stessa PR.
- **Annullare tutto**: vai sulla PR e clicca **“Close pull request”** in fondo. Il branch rimane ma non viene mergiato.

### Se la PR è già stata mergiata (la modifica è live)

1. Vai su [Commits](https://github.com/BYD-Club-Italia/byd-club-italia-guides/commits/main)
1. Trova il commit da annullare (con il nome di chi ha fatto merge e la data)
1. Clicca sul simbolo `< >` per vedere le modifiche
1. Apri una nuova PR che ripristina la versione precedente del file

In alternativa, apri una [Issue](https://github.com/BYD-Club-Italia/byd-club-italia-guides/issues) chiedendo aiuto a un altro collaboratore.

-----

## Rivedere e approvare una PR di qualcun altro

Se qualcuno apre una PR e ti chiede di revisionarla:

1. Vai sulla PR (te la notifica GitHub via email)
1. Tab **“Files changed”**: vedi in verde le righe aggiunte, in rosso quelle rimosse
1. Se tutto va bene, in alto a destra clicca **“Review changes”** → **“Approve”** → **“Submit review”**
1. Se c’è qualcosa da correggere, scegli **“Request changes”** e spiega cosa rivedere nel commento
1. Una volta approvata, la PR può essere “mergiata” (solitamente lo fa l’autore o tu stesso cliccando **“Merge pull request”**)

**Nota**: non puoi approvare le tue PR. Serve sempre un altro collaboratore.

-----

## Cosa NON modificare

- ❌ La cartella `docs/` — viene rigenerata automaticamente, ogni modifica manuale sarebbe sovrascritta
- ❌ Il file `build.py` — è lo script tecnico, modificarlo può rompere tutto
- ❌ I file in `templates/` — sono la struttura grafica, modifiche qui cambiano lo stile di tutte le guide contemporaneamente

Se vuoi cambiare qualcosa in questi file, apri una Issue e chiedi consiglio a un contributor tecnico.

-----

## Cose che SI può modificare in sicurezza

- ✅ Tutti i file in `guides/` (il contenuto delle guide)
- ✅ Tutti i file in `images/` (aggiungere/sostituire/rimuovere immagini)
- ✅ Il `README.md` (descrizione generale del progetto)

-----

## Workflow tipico

```
1. Vai su GitHub
2. Apri il file da modificare
3. Clicca ✏️
4. Modifica
5. "Commit changes…" → "Propose changes" (GitHub crea il branch)
6. "Create pull request"
7. Un altro collaboratore approva
8. Merge → aspetta ~30 secondi
9. Verifica sul sito live
```

**Se qualcosa non si aggiorna dopo 1 minuto dal merge**, clicca sulla tab [Actions](https://github.com/BYD-Club-Italia/byd-club-italia-guides/actions) — vedrai se il build è fallito, e perché.

-----

## Domande frequenti

### Il sito live non si è aggiornato dopo il merge

Controlla [Actions](https://github.com/BYD-Club-Italia/byd-club-italia-guides/actions). Se c’è una ❌ rossa, significa che il build è fallito. Clicca sull’errore per vedere il messaggio. Di solito è un errore di sintassi Markdown (es. una `}` mancante in un `{{ variabile }}`).

### Perché non posso salvare direttamente su main?

Il branch `main` è protetto: richiede PR e almeno 1 approvazione. È una misura di sicurezza per evitare errori e per avere sempre due paia di occhi su ogni modifica. Non è una mancanza di fiducia — è una buona pratica standard.

### Posso fare più modifiche nella stessa PR?

Sì. Una PR è un “contenitore” di modifiche correlate. Puoi modificare più file prima di aprirla, oppure aggiungere altre modifiche al branch mentre la PR è aperta. Esempio: nella stessa PR puoi aggiornare `countrycode_target` in tutte e 3 le guide.

### Il build scatta anche sulle PR?

Sì. Quando apri una PR, GitHub Actions costruisce il sito in una versione di prova (non pubblicata) per controllare che tutto si compili senza errori. Se il build fallisce, nella PR appare una ❌ rossa e il merge viene bloccato finché non risolvi il problema. Così se hai sbagliato una variabile Markdown te ne accorgi prima del merge.

### Posso modificare dal telefono?

Sì, il web editor di GitHub funziona anche da smartphone, ma è scomodo per modifiche lunghe.

### Posso vedere l’anteprima prima di pubblicare?

Purtroppo GitHub mostra un’anteprima di base del Markdown (non con il nostro stile), ma la sintassi custom (`::: callout`, variabili `{{ }}`) non viene resa. Il controllo automatico del build sulla PR ti dice almeno se la sintassi è valida — per vedere il risultato finale serve il merge.

### Posso lavorare offline?

Sì, ma servono conoscenze base di Git e Python. Procedura:

```bash
git clone https://github.com/BYD-Club-Italia/byd-club-italia-guides.git
cd byd-club-italia-guides
pip install -r requirements.txt
python build.py
# apri docs/index.html nel browser per vedere il risultato
```

Anche da locale dovrai poi pushare su un branch e aprire una PR — non direttamente su main.

### Come aggiungo una nuova variabile custom?

Aggiungi la variabile nel frontmatter YAML di una guida:

```yaml
---
mia_variabile: "valore"
---
```

Poi usala nel corpo della guida con `{{ mia_variabile }}`.

-----

## Contatti per supporto

- **Contributor tecnico**: Stefano Tagliaferri ([@Tagliax10](https://t.me/Tagliax10))
- **Autore originale**: Leonardo Bandini ([@LeonardoBandini](https://t.me/LeonardoBandini))
- **Community**: [BYD Club Italia](https://t.me/BYD_CLUB_ITALIA)

Se hai difficoltà, chiedi nel canale Telegram o apri una [Issue su GitHub](https://github.com/BYD-Club-Italia/byd-club-italia-guides/issues/new).