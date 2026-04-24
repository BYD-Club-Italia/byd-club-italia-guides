---
# ============================================================
# TEMPLATE per nuove guide — BYD Club Italia
# ============================================================
# ISTRUZIONI:
#   1. Copia questo file in guides/NOMEGUIDA.md (es. guides/batteria12v.md)
#   2. I file che iniziano con "_" vengono IGNORATI dal build (niente HTML generato)
#   3. Compila il frontmatter qui sotto con i valori della tua guida
#   4. Usa le variabili con {{ nome_variabile }} nel corpo del testo
#   5. Cancella le sezioni che non ti servono
#
# NOTA: i commenti YAML (#) nel frontmatter sono esclusivamente per aiuto editor
# e vengono ignorati dal parser. Lasciali o cancellali, non cambia nulla.
#
# TIPI DI GUIDA SUPPORTATI (qualche idea):
#   - Firmware   → procedure su infotainment, downgrade, sideload, upgrade
#   - Mod        → modifiche hardware/software fai-da-te (es. batteria 12V)
#   - Accessori  → installazione/configurazione accessori (es. dashcam, portapacchi)
#   - Community  → guide informative generali, FAQ, confronti
#   - Troubleshooting → diagnosi e risoluzione di un problema specifico
# ============================================================

# --- IDENTITÀ DELLA GUIDA ---
titolo: "Titolo della guida"       # Il titolo grande dell'hero. Esempi:
                                   # "ATTO 2", "Batteria 12V — da Piombo a LFP",
                                   # "Installazione dashcam", "Guida Generale".
                                   # Se inizia con "Guida" il sistema non duplica
                                   # il prefisso (non avrai "Guida Guida ...").

slug: "nomefile"                   # IMPORTANTE: usato per il nome del file HTML e
                                   # per la cartella immagini (images/NOMEFILE/).
                                   # Deve essere minuscolo, senza spazi, senza accenti.
                                   # Deve coincidere con il nome del file .md.

version: "0.0.1"                   # Versione della guida (NON del firmware o del prodotto)
date: "GG/MM/AAAA"                 # Data ultimo aggiornamento
author: "Nome Autore"
editor: "Nome Editor"              # Opzionale — togli la riga se non c'è

# --- CATEGORIZZAZIONE (opzionale ma consigliata) ---
# overline: etichetta piccola sopra il titolone dell'hero e nella card della landing.
#   Default: "BYD" (se ometti questa riga).
#   Valori tipici: "BYD", "FIRMWARE", "MOD / FAI-DA-TE", "ACCESSORI",
#                  "COMMUNITY". Usa "" per nascondere l'overline del tutto.
# overline: "BYD"

# category: etichetta che compare come PILLOLA colorata sulla card della landing.
#   Se ometti questa riga, la card non mostra nessuna pillola.
#   Valori consigliati (per coerenza nel sito): "Firmware", "Mod",
#   "Accessori", "Guida", "Troubleshooting".
# category: "Guida"

# --- VARIABILI CUSTOM (aggiungi qui quello che serve alla tua guida) ---
# Ogni valore definito qui è richiamabile nel testo con {{ nome }}.
# Qualsiasi modifica si propaga ovunque la variabile compaia.
#
# Esempi (cancella/modifica in base alla tua guida):
# link_telegram: "https://t.me/..."
# modello_prodotto: "XYZ-100"
# durata_intervento: "45 minuti"

# --- PERSONALIZZAZIONE GRAFICA (opzionale) ---
theme_color: "#3B82F6"             # Colore principale (accento). Default blu.
                                   # Idee: verde #10B981 (mod/fai-da-te),
                                   # arancio #F59E0B (troubleshooting),
                                   # viola #8B5CF6 (community).

# --- TESTI EXTRA (tutti opzionali, fallback su default neutri) ---
# subtitle: testo sotto il titolone dell'hero. Default: "Guida della community BYD Club Italia."
# subtitle: "Descrizione breve che appare sotto il titolo dell'hero."

# card_description: testo nella card della landing. Default: "Guida della community BYD Club Italia."
# card_description: "Descrizione breve per la card in landing page."

# meta_description: tag <meta description> per la SEO. Default: "Guida community BYD Club Italia — " + titolo.
# meta_description: "Descrizione per motori di ricerca."
---

# Introduzione

Primo capitolo. Le `h1` (righe con un solo `#`) diventano capitoli numerati automaticamente
(il build aggiunge "Capitolo 1", "Capitolo 2", ecc.) e finiscono nell'indice laterale.

Usa `{{ titolo }}`, `{{ version }}`, `{{ author }}` o qualsiasi variabile custom definita
nel frontmatter per riferirti ai suoi valori. Qualsiasi modifica al frontmatter si propaga
ovunque la variabile compaia.

---

# Capitolo con colore sul bordo {color=warning}

Aggiungendo `{color=...}` dopo il titolo H1, la barra verticale a sinistra del titolo
cambia colore. Valori possibili: `warning` (arancio), `critical` (rosso), `success` (verde),
`info` (celeste). Se ometti l'attributo, resta il colore accento (blu).

## Sottotitolo H2

`## Titolo` → sotto-sezione del capitolo. NON compare nell'indice laterale.

### Sotto-sottotitolo H3

`### Titolo` → sotto-sotto-sezione. Usalo con parsimonia, di solito H1+H2 bastano.

---

# Callout (box colorati)

Ci sono quattro varianti: `info` (blu), `warning` (arancio), `critical` (rosso), `success` (verde).

::: callout info "Titolo del box (opzionale)"
Contenuto del callout. Può contenere **grassetto**, *corsivo*, `codice inline`, [link](https://esempio.it),
e anche **più paragrafi**.

Questo è un secondo paragrafo dentro lo stesso callout.
:::

::: callout warning "Avviso importante"
Usa `warning` per attenzioni generiche (cose facili da sbagliare, prerequisiti da verificare).
:::

::: callout critical "Attenzione assoluta"
Usa `critical` per avvisi dove un errore può causare danni hardware, perdita di dati,
rischi per la sicurezza o problemi legali/garanzia.
:::

::: callout success "Risultato positivo"
Usa `success` per confermare che un passaggio è completato correttamente o per
riepilogare i benefici ottenuti.
:::

::: callout info
Il titolo è opzionale. Se non lo metti, il box parte direttamente dal testo.
:::

---

# Card (riquadri con bordo)

::: card
### 📦 Titolo della card
Contenuto della card. Utile per link a risorse, blocchi informativi compatti,
download, riferimenti esterni, ecc.
:::

::: card highlight
### 🎯 Card evidenziata
Aggiungendo `highlight` dopo `card`, la card ha una barra accento a sinistra.
Usala per evidenziare la risorsa più importante tra più card.
:::

---

# Steps numerati automaticamente

Usa `::: steps` per elenchi ordinati con il cerchietto numerato su linea verticale.

::: callout critical "Limitazione: non annidare blocchi :::"
Il parser NON supporta blocchi `:::` annidati. Non mettere un `::: callout` dentro un `::: steps` (o dentro qualsiasi altro blocco `:::`): il parser chiude il blocco esterno al primo `:::` che trova.

**Soluzione**: se devi evidenziare qualcosa che riguarda un passo specifico, metti il callout PRIMA o DOPO il blocco `::: steps`, non dentro. Oppure usa **grassetto** inline dentro il passo.
:::

Aggiornamento per uso all'interno di `::: steps`:

- Evita di andare a capo con indentazione dopo il numero del passo: scrivi tutto sulla stessa riga logica o usa righe a capo normali (non indentate).
- Puoi includere immagini, blocchi di codice e formattazione inline, ma NON altri contenitori `:::`.

::: steps
1. **Primo passo**. Descrizione del passo. Puoi andare a capo e continuare.

2. **Secondo passo**. Puoi includere blocchi di codice dentro un passo:
   ```bash
   esempio-comando --opzione
   ```

3. **Terzo passo**.
   ![Didascalia immagine](images/nomefile/foto.png){width=400}
:::

---

# Manual-steps (etichette custom)

Quando i passi non sono numerati sequenzialmente ma hanno etichette tipo `[1a]`, `[1b]`, `[2]`...
Usa `::: manual-steps` con le parentesi quadre all'inizio di ogni blocco.

::: manual-steps
[1a] **Opzione A**: se si verifica la condizione X, fai questo.

[1b] **Opzione B**: se non si verifica la condizione X, apri questa pagina.

[2] Prosegui con il passo successivo.

[3] Esegui l'ultimo passaggio.
:::

---

# Workflow (diagramma a step)

Visualizza il processo complessivo a blocchi con frecce.

::: workflow
1. **Preparazione** :: Breve descrizione
2. **Primo step** :: Breve descrizione
3. **Secondo step** :: Breve descrizione
4. **Completamento** :: Breve descrizione
:::

**Sintassi**: ogni riga è `N. **Titolo** :: Descrizione`. Il doppio `::` separa titolo e descrizione.

---

# Checklist (interattiva, cliccabile)

::: checklist
- Primo elemento da spuntare
- Secondo elemento (l'utente clicca per spuntarlo)
- Terzo elemento
:::

::print-hide:: *In stampa/PDF la checklist resta non spuntata. In web è cliccabile.* :::

---

# Glossary (elenco a fisarmonica)

::: glossary
**Termine 1** :: Definizione del primo termine. Può essere lunga quanto serve e contenere **grassetto**, *corsivo*, `codice`, [link](https://esempio.it).

**Termine 2** :: Definizione del secondo termine.

**Termine 3** :: Definizione del terzo.
:::

**Sintassi**: `**Termine** :: Definizione`, separati da una riga vuota.

---

# Tabelle Markdown standard

| Colonna 1 | Colonna 2 | Note |
|-----------|-----------|------|
| Valore A  | Valore B  | Testo libero |
| Valore C  | Valore D  | Supporta {badge:success:badge} anche |

---

# Badge inline

Usa `{badge:TIPO:TESTO}` dentro al testo per piccole etichette colorate.

Tipi disponibili: `{badge:accent:Accento}`, `{badge:warning:Warning}`, `{badge:critical:Critical}`, `{badge:success:Success}`, `{badge:info:Info}`.

Esempio d'uso in una tabella:

| Elemento | Stato | Note |
|----------|-------|------|
| Prerequisito A | {badge:success:OK} | Già soddisfatto |
| Prerequisito B | {badge:warning:Verificare} | Controllare prima di procedere |
| Prerequisito C | {badge:critical:Mancante} | Bloccante |

---

# Immagini

Sintassi standard con larghezza opzionale:

```
![Didascalia descrittiva dell'immagine](images/nomefile/foto.png){width=400}
```

- La didascalia diventa automaticamente il testo sotto l'immagine (in corsivo).
- `{width=400}` imposta la larghezza massima in pixel. Omettilo per larghezza automatica.
- Le immagini vanno messe in `images/NOMEFILE/` (stessa stringa del campo `slug`).
- Il build embedda le immagini come base64 nell'HTML (file standalone).

::: callout info "Immagini cliccabili"
Tutte le immagini nel sito pubblicato sono cliccabili: aprono un lightbox a piena pagina.
:::

---

# Blocchi di codice

I blocchi di codice hanno automaticamente un bottone "Copia" e la colorazione sintattica.

Linguaggi testati: `powershell`, `bash`, `json`, `yaml`, o vuoto per testo generico.

```bash
cd /percorso/cartella
ls -la
```

```powershell
Format /FS:FAT32 O:
```

```
Testo generico senza colorazione.
Utile per output di comando, strutture di directory, ecc.
```

---

# Contenuti che si nascondono in stampa

Ci sono due modi per nascondere elementi nell'export PDF (stampa):

## Testo inline

`::print-hide:: Questo testo appare solo in web. :::`

Esempio:

Benvenuto nella guida. ::print-hide:: *Clicca le voci per espanderle.* :::

In PDF il "Clicca le voci..." sparisce, nel web resta.

## Elementi specifici

Nel template HTML, gli elementi con classe `.print-hide` spariscono in stampa. Di default:
- Topbar, sidebar, bottone copia, bottone stampa → nascosti in PDF
- Glossary e checklist → espansi in PDF (non interattivi)

---

# Footer automatico

Non devi scrivere niente alla fine: il template aggiunge automaticamente un footer con
titolo, versione, data e link al canale Telegram della community.

---

# Checklist finale prima di committare

Prima di caricare la tua guida sul repo, verifica che:

::: checklist
- Tutte le `{{ variabili }}` siano definite nel frontmatter (altrimenti il build fallisce)
- Il campo `titolo` descriva il contenuto (non deve per forza essere un modello di auto)
- Il campo `slug` sia univoco (non collide con altre guide) e coincida col nome del file
- Le immagini referenziate esistano in `images/NOMEFILE/` (stessa stringa di `slug`)
- Hai impostato `overline` e `category` coerenti con la tipologia della guida
- I link esterni siano quelli corretti (non placeholder)
- Il file NON inizi con `_` se vuoi che venga buildato
:::

::: callout success "Guida pronta"
Quando sei pronto, rinomina il file da `_template.md` a `nomefile.md` (senza underscore)
e fai commit. Il sito si aggiorna automaticamente in ~30 secondi.
:::