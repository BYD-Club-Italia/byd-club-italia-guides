# 🚀 Setup iniziale del repo

Questo documento spiega come configurare il repo GitHub **la prima volta** (dopo aver caricato i file di questo pacchetto). Da leggere una sola volta.

## Prerequisiti

- Account GitHub personale
- L'organizzazione **BYD-Club-Italia** già creata su GitHub (puoi crearla da [github.com/organizations/new](https://github.com/organizations/new))

## Passaggi

### 1. Crea il repository

1. Vai su [github.com/organizations/BYD-Club-Italia](https://github.com/BYD-Club-Italia)
2. Clicca **"New repository"**
3. Compila:
   - **Repository name**: `byd-club-italia-guides`
   - **Description**: `Guide community alla gestione del firmware dell'infotainment BYD`
   - **Visibility**: **Public**
   - **⚠ NON** inizializzare con README, `.gitignore` o license (sono già nei file)
4. Clicca **"Create repository"**

### 2. Carica i file del progetto

Hai due opzioni:

**Opzione A — Via web (più semplice):**
1. Sulla pagina del nuovo repo, clicca **"uploading an existing file"**
2. Trascina TUTTO il contenuto della cartella `byd-club-italia-guides/` (inclusi file nascosti come `.github/`, `.gitignore`)
3. Scrivi un messaggio di commit: `Initial commit`
4. Clicca **"Commit changes"**

> ⚠️ Il web upload ha un limite di 100 file per volta. Se hai problemi, usa l'opzione B.

**Opzione B — Via Git CLI (più robusta):**
```bash
cd byd-club-italia-guides
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/BYD-Club-Italia/byd-club-italia-guides.git
git push -u origin main
```

### 3. Attiva GitHub Pages

1. Nel repo, vai su **Settings** (in alto a destra)
2. Nel menu laterale, clicca **Pages**
3. Sotto "Build and deployment":
   - **Source**: seleziona **"GitHub Actions"**
4. Salva.

### 4. Attiva il primo build

1. Vai sulla tab **Actions** del repo
2. Se vedi il workflow "Build and Deploy", clicca su di esso
3. Clicca **"Run workflow"** → **"Run workflow"** (conferma)
4. Attendi ~1-2 minuti.

Dopo il primo build riuscito, il sito sarà accessibile all'URL:
**https://byd-club-italia.github.io/byd-club-italia-guides/**

### 5. Invita i collaboratori

1. Vai su **Settings** → **Collaborators and teams**
2. Clicca **"Add people"**
3. Inserisci gli username GitHub di:
   - Leonardo Bandini
   - Gino (@giino01)
   - Altri collaboratori autorizzati
4. Assegna il ruolo **Write** (possono modificare, non cancellare il repo)

Loro riceveranno un'email di invito. Una volta accettato, potranno modificare i file seguendo le istruzioni in `GUIDE_FOR_EDITORS.md`.

### 6. (Opzionale) Configura il dominio custom

Se vuoi usare un dominio tuo (es. `guide.bydclubitalia.it`):

1. **Settings** → **Pages** → **Custom domain**
2. Inserisci il dominio
3. Aggiungi un record DNS CNAME dal tuo provider che punta a `byd-club-italia.github.io`

## Verifica finale

Una volta fatto tutto:

- [ ] Il repo è pubblico su `github.com/BYD-Club-Italia/byd-club-italia-guides`
- [ ] Il sito è live su `byd-club-italia.github.io/byd-club-italia-guides`
- [ ] La tab Actions mostra un ✅ verde per l'ultimo build
- [ ] Leonardo e Gino hanno accesso come collaboratori

Fatto! Ora le modifiche alle guide avvengono direttamente dal browser, come descritto in `GUIDE_FOR_EDITORS.md`.

## Troubleshooting

### "GitHub Pages is currently disabled"
Vai in Settings → Pages e imposta Source = GitHub Actions (non "Deploy from branch").

### Il build fallisce con "Permission denied"
Vai in Settings → Actions → General → Workflow permissions → seleziona "Read and write permissions" → Save.

### Il sito mostra una 404 dopo il primo build
Attendi 1-2 minuti in più e ricarica. GitHub Pages a volte ci mette tempo la prima volta.

### I link delle immagini sono rotti
Probabile causa: le immagini non sono state caricate. Controlla che la cartella `images/` sul repo contenga i file PNG/JPEG.
