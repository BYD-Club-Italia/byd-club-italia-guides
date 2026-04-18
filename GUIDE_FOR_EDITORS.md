# 📝 Guida per editor — Come modificare le guide BYD

Questo documento spiega come modificare, aggiungere o correggere le guide senza conoscere programmazione. Puoi fare tutto dal **browser web**, niente da installare.

> 💡 **In sintesi**: modifichi un file di testo su GitHub, salvi, e dopo ~30 secondi il sito si aggiorna automaticamente.

---

## Prima volta: accesso al repo

1. Vai su [github.com/BYD-Club-Italia/byd-club-italia-guides](https://github.com/BYD-Club-Italia/byd-club-italia-guides)
2. Fai login con il tuo account GitHub
3. Se sei stato invitato come collaboratore, vedrai un pulsante per accettare l'invito. Accettalo.
4. Ora hai i permessi per modificare i file.

---

## Caso 1: aggiornare un valore (esempio: CountryCode da China a Singapore)

Questo è il caso più comune. Immagina che il CountryCode per la procedura sia cambiato da **China (86)** a **Singapore (65)**. Devi aggiornare tutte e 3 le guide — ma in realtà basta cambiare **una riga per guida**.

### Passaggi

1. Apri il repo: [github.com/BYD-Club-Italia/byd-club-italia-guides](https://github.com/BYD-Club-Italia/byd-club-italia-guides)
2. Clicca sulla cartella `guides/`
3. Clicca su `atto2.md` (o la guida che vuoi modificare)
4. In alto a destra del file, clicca sull'icona **✏️ matita** ("Edit this file")
5. All'inizio del file vedi una sezione tra `---` che contiene le variabili:
   ```yaml
   ---
   model: ATTO 2
   firmware_downgrade: "2404"
   countrycode_target: "Cina (86)"    ← QUESTA RIGA
   ---
   ```
6. Modifica la riga `countrycode_target` così:
   ```yaml
   countrycode_target: "Singapore (65)"
   ```
7. Scorri in fondo alla pagina, scrivi un messaggio breve che spiega cosa hai fatto:
   ```
   Aggiorna CountryCode da China (86) a Singapore (65)
   ```
8. Clicca il pulsante verde **"Commit changes"**
9. Attendi ~30 secondi. Vai su [byd-club-italia.github.io/byd-club-italia-guides](https://byd-club-italia.github.io/byd-club-italia-guides/) e verifica.

**Fatto.** Il CountryCode è stato aggiornato **ovunque** nella guida ATTO 2 (nel testo, nei passi, nella procedura). Ripeti per `generale.md` e `surf.md` se serve.

### Perché funziona così?

Nel file Markdown, ovunque compaia `{{ countrycode_target }}` il sistema lo sostituisce con il valore definito in testa al file. Cambi il valore una volta, si aggiorna dovunque.

---

## Caso 2: aggiornare la versione firmware (esempio: 2503 → 2508)

Stessa logica del caso 1, ma cambi la variabile `firmware_upgrade` o `firmware_upgrade_latest`:

```yaml
firmware_upgrade: "2508"              # prima era "2503"
```

**Attenzione**: se cambia anche il link Telegram del firmware, aggiorna anche `telegram_upgrade_link`:

```yaml
telegram_upgrade_link: "https://t.me/BYDCLUBITALIANews/123"
```

---

## Caso 3: modificare un paragrafo di testo

Se devi correggere una frase, aggiungere una nota, o riscrivere una sezione:

1. Apri il file della guida (es. `guides/atto2.md`)
2. Clicca sulla matita **✏️**
3. Cerca il testo da modificare (Ctrl+F nel browser)
4. Modificalo come faresti in qualsiasi editor di testo
5. Commit con un messaggio descrittivo

### Sintassi Markdown veloce

| Cosa vuoi fare | Come scriverlo |
|----------------|----------------|
| Grassetto | `**testo in grassetto**` |
| Corsivo | `*testo in corsivo*` |
| Codice inline | `` `comando` `` |
| Link | `[testo del link](https://url)` |
| Titolo capitolo | `# Titolo` |
| Sotto-titolo | `## Sotto-titolo` |
| Lista puntata | `- elemento` |
| Lista numerata | `1. elemento` |

---

## Caso 4: aggiungere un box "ATTENZIONE" o "NOTA"

Le guide usano 4 tipi di box colorati ("callout"). Si scrivono così:

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

---

## Caso 5: aggiungere un blocco di codice (comando)

Per mostrare un comando da copiare (es. comandi PowerShell, ADB):

````
```powershell
Format /FS:FAT32 O:
```
````

Il sistema aggiunge automaticamente il bottone "Copia" e la sintassi colorata.

**Linguaggi supportati**: `powershell`, `bash`, `json`, `yaml`, o lascia vuoto per testo generico.

---

## Caso 6: aggiungere un'immagine

1. Prepara l'immagine (preferibilmente PNG o JPEG, non troppo pesante)
2. Sul repo GitHub, naviga in `images/atto2/` (o la cartella della guida appropriata)
3. Clicca il pulsante **"Add file"** → **"Upload files"**
4. Trascina l'immagine, commit
5. Nel file Markdown della guida, aggiungi:
   ```
   ![Descrizione dell'immagine](images/atto2/nome_file.png){width=400}
   ```

La descrizione diventa automaticamente la didascalia sotto l'immagine.

`{width=400}` è opzionale: imposta la larghezza massima in pixel (utile per immagini molto grandi).

---

## Caso 7: aggiungere una nuova guida (es. BYD Seal U DM-i)

1. Crea un file `guides/sealu.md` prendendo come base `guides/atto2.md`
2. Modifica il frontmatter (tra i `---` in alto) con i valori corretti
3. Crea una cartella `images/sealu/`
4. Carica le immagini necessarie
5. Commit

Il sistema riconoscerà automaticamente la nuova guida e l'aggiungerà alla landing page.

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

Se il campo `model` inizia già con "Guida" (es. `model: "Guida Installazione X"`), il sistema non aggiunge un secondo "Guida" davanti nel titolo, evitando duplicati tipo "Guida Guida Installazione X".

---

## Caso 8: ho fatto un errore, come torno indietro?

Ogni modifica su GitHub è tracciata. Per annullare:

1. Vai su [Commits](https://github.com/BYD-Club-Italia/byd-club-italia-guides/commits/main)
2. Trova il commit da annullare (con il tuo nome e la data)
3. Clicca sul simbolo `< >` per vedere le modifiche
4. Puoi aprire la versione precedente del file e ripristinarla manualmente.

In alternativa, apri una [Issue](https://github.com/BYD-Club-Italia/byd-club-italia-guides/issues) chiedendo aiuto a un altro collaboratore.

---

## Cosa NON modificare

- ❌ La cartella `docs/` — viene rigenerata automaticamente, ogni modifica manuale sarebbe sovrascritta
- ❌ Il file `build.py` — è lo script tecnico, modificarlo può rompere tutto
- ❌ I file in `templates/` — sono la struttura grafica, modifiche qui cambiano lo stile di tutte le guide contemporaneamente

Se vuoi cambiare qualcosa in questi file, apri una Issue e chiedi consiglio a un contributor tecnico.

---

## Cose che SI può modificare in sicurezza

- ✅ Tutti i file in `guides/` (il contenuto delle guide)
- ✅ Tutti i file in `images/` (aggiungere/sostituire/rimuovere immagini)
- ✅ Il `README.md` (descrizione generale del progetto)

---

## Workflow tipico

```
1. Vai su GitHub
2. Apri il file da modificare
3. Clicca ✏️
4. Modifica
5. Commit
6. Aspetta 30 secondi
7. Verifica sul sito live
```

**Se qualcosa non si aggiorna dopo 1 minuto**, clicca sulla tab [Actions](https://github.com/BYD-Club-Italia/byd-club-italia-guides/actions) — vedrai se il build è fallito, e perché.

---

## Domande frequenti

### Il sito live non si è aggiornato dopo la mia modifica
Controlla [Actions](https://github.com/BYD-Club-Italia/byd-club-italia-guides/actions). Se c'è una ❌ rossa, significa che il build è fallito. Clicca sull'errore per vedere il messaggio. Di solito è un errore di sintassi Markdown (es. una `}` mancante in un `{{ variabile }}`).

### Posso modificare dal telefono?
Sì, il web editor di GitHub funziona anche da smartphone, ma è scomodo per modifiche lunghe.

### Posso vedere l'anteprima prima di pubblicare?
Purtroppo GitHub mostra un'anteprima di base del Markdown (non con il nostro stile), ma la sintassi custom (`::: callout`, variabili `{{ }}`) non viene resa. Per vedere il risultato finale devi committare e attendere il build.

### Posso lavorare offline?
Sì, ma servono conoscenze base di Git e Python. Procedura:
```bash
git clone https://github.com/BYD-Club-Italia/byd-club-italia-guides.git
cd byd-club-italia-guides
pip install -r requirements.txt
python build.py
# apri docs/index.html nel browser per vedere il risultato
```

### Come aggiungo una nuova variabile custom?
Aggiungi la variabile nel frontmatter YAML di una guida:
```yaml
---
mia_variabile: "valore"
---
```
Poi usala nel corpo della guida con `{{ mia_variabile }}`.

---

## Contatti per supporto

- **Contributor tecnico**: Stefano Tagliaferri [@Tagliax10](https://t.me/Tagliax10)(editor principale)
- **Autore originale**: Leonardo Bandini ([@LeonardoBandini](https://t.me/LeonardoBandini))
- **Community**: [BYD Club Italia](https://t.me/BYD_CLUB_ITALIA)

Se hai difficoltà, chiedi nel canale Telegram o apri una [Issue su GitHub](https://github.com/BYD-Club-Italia/byd-club-italia-guides/issues/new).