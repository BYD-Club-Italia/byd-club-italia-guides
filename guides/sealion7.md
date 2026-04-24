---
titolo: "Sealion 7"
slug: "sealion7"
overline: "FIRMWARE"
category: "Firmware"
version: "1.0.0"
date: "18/07/2025"
author: "@vinelluke e @highvoltage25"
editor: "Stefano Tagliaferri"
subtitle: "Istruzioni generali per l'attivazione del <strong>Sideloading</strong> su BYD Sealion 7 tramite ADB wireless e installazione di app di terze parti."
card_description: "Sideload via ADB wireless, installazione di App Manager, e altre app di terze parti sull'infotainment della Sealion 7."
meta_description: "Guida community BYD Sealion 7: attivazione del sideload via ADB wireless, installazione di App Manager, Gbox e app di terze parti."
theme_color: "#3B82F6"

# --- Variabili custom ---
telegram_news: "https://t.me/BYDCLUBITALIANews"
telegram_discussion: "https://t.me/BYD_CLUB_ITALIA"
telegram_controlloremoto: "https://t.me/BYDCLUBITALIANews/8"
telegram_appmanager: "https://t.me/BYDCLUBITALIANews/14"
telegram_guidafdroid: "https://t.me/BYD_CLUB_ITALIA/49776/88148"
---

# Introduzione

Questa guida raccoglie la procedura per attivare il **sideloading** sull'infotainment della BYD {{ titolo }} e installare applicazioni Android di terze parti (navigatori, media player, browser, ecc.) non presenti nello store di sistema.

Procedura descritta ed applicata da [@vinelluke](https://t.me/vinelluke) e [@highvoltage25](https://t.me/highvoltage25).

::: callout info "In sintesi"
Si utilizza un **PC Windows** collegato alla stessa rete WiFi dell'auto per inviare via **ADB wireless** il file `App Manager`, che poi permette di installare comodamente tutte le altre app dall'infotainment.
:::

---

# Assunzioni di responsabilità {color=critical}

::: callout critical "Leggere prima di procedere"
Questo documento ha scopo puramente didattico e **non è un invito** a utilizzare queste procedure.

Ogni intervento sul firmware dell'Infotainment non è esente da rischi: differenze hardware o software tra veicoli possono produrre esiti imprevisti.

**Non ci assumiamo alcuna responsabilità** sull'utilizzo di questo materiale e sui danni eventualmente prodotti.

**Non eseguire le procedure se non si sa cosa si sta facendo**, se non si conoscono i termini e le procedure qui citate.
:::

---

# Workflow complessivo

::: workflow
1. **Preparazione PC** :: Scaricare pacchetto ADB e APK di App Manager
2. **In macchina** :: Abilitare ADB wireless dal menu di servizio
3. **Connessione** :: Collegare PC e auto alla stessa rete, connettere ADB
4. **Installazione App Manager** :: Inviare il primo APK via `adb install`
5. **Altre app** :: Scegliere uno dei tre metodi (Gbox / USB / File Manager+)
:::

---

# Prima di andare in macchina

Tutte le operazioni di questa sezione si fanno **da PC Windows**, comodamente a casa.

## Scaricare il pacchetto ADB

::: steps
1. **Scaricare `ControlloRemoto.zip`** da questo link condiviso sul canale Telegram: [{{ telegram_controlloremoto }}]({{ telegram_controlloremoto }})

2. **Decomprimere il file** ed entrare nella cartella appena estratta. Troverete due sottocartelle: in questa fase ci interessa la cartella **`WIN`**.

3. **Aprire la cartella `WIN`** e verificare la presenza del file `adb.exe`.

4. **Creare una sottocartella `APK`** dentro `WIN`. In questa cartella andranno inseriti tutti gli APK che si vogliono caricare sul sistema.

5. **Spostare la cartella `WIN` sul disco locale `C:\`**. Questo accorgimento permette di scrivere un comando più breve nel prompt.
:::

::: callout info "Link alternativo"
Se il link diretto non fosse più disponibile, accedere al canale [BYD Club Italia News]({{ telegram_news }}) e cercare `ControlloRemoto.zip`.
:::

## Scaricare App Manager

::: steps
1. **Scaricare `AppManager_v4.0.4.apk`** dal canale Telegram: [{{ telegram_appmanager }}]({{ telegram_appmanager }})

2. **Rinominare il file in `appman.apk`** (per velocità nella digitazione del comando).

3. **Inserire `appman.apk` dentro la cartella `C:\WIN\APK\`**. Questa è la prima applicazione che verrà installata sull'infotainment.
:::

::: callout success "Struttura finale sul PC"
```
C:\WIN\
├── adb.exe
├── (altri file del pacchetto)
└── APK\
    └── appman.apk
```
:::

---

# Operazioni in macchina

Portare in macchina il **PC portatile** con tutti i file già scaricati e la cartella `WIN` posizionata in `C:\`.

## Collegamento fisico

::: steps
1. **Connettere auto e PC alla stessa rete Internet** (hotspot del cellulare oppure WiFi di casa se l'auto è vicina).

2. **Collegare il PC all'auto con un cavo USB‑C o USB‑C ↔ USB‑C**, utilizzando la **seconda presa USB‑C** dell'auto, quella di **destra** (porta dati).
:::

## Abilitare ADB sul pad

::: steps
1. Sul pad dell'auto, navigare nel menu e selezionare la voce **Versione**. Fare tap ripetutamente su **Ripristino impostazioni di fabbrica** finché non compare la schermata del Factory Service Interface.

   ![Menu 'Factory Service Interface' visualizzato sul pad dell'auto dopo i tap ripetuti](images/sealion7/image1.jpeg){width=500}

2. Fare tap sull'**icona in basso a destra** per ruotare il pad. Compariranno due banner grigi aggiuntivi in alto.

   ![Schermata ruotata con i banner 'CONNECT USB TO ENABLE DEBUGGING MODE' in alto](images/sealion7/image2.jpeg){width=500}

3. Cliccare sul **primo banner grigio** e attendere che compaia la dicitura **`adb turn on`** (un piccolo rettangolino grigio sovrimpresso al resto della schermata).

4. Quando si legge **`adb turn on`** si può tornare indietro e uscire dalla sezione.
:::

::: callout warning "Uno dei due ripristini"
Non è certo quale sia il tasto corretto tra i due ripristini presenti nel menu Versione: se il primo che provate non porta alla schermata del Factory Service Interface, provare con l'altro.
:::

## Rilevare l'indirizzo IP dell'auto

::: steps
1. Sempre dal pad, andare nel **menu delle connessioni** e toccare **WLAN** per visualizzare l'indirizzo IP dell'auto.

2. **Annotare l'IP**: servirà nel passaggio successivo per collegare ADB dal PC.
:::

::: callout critical "Stessa rete!"
Ricordare che **auto e PC devono essere connessi alla stessa rete**. Se non lo sono, ADB non riuscirà a stabilire la connessione.
:::

## Connettere ADB dal PC

::: steps
1. Aprire il **prompt dei comandi** di Windows: nel campo di ricerca scrivere `cmd` e premere Invio.

2. Nella finestra cmd digitare:
   ```powershell
   cd win
   ```
   e premere Invio.

3. Digitare il comando di connessione sostituendo l'IP con quello annotato in precedenza:
   ```powershell
   adb connect 192.xxx.xxx.xxx
   ```
   e premere Invio.

4. Verificare che la finestra del cmd restituisca il messaggio **`adb connected`** (o `already connected to ...`).

   ![Prompt dei comandi con il ritorno 'already connected to 192.168.1.231:5555'](images/sealion7/image3.jpeg){width=500}
:::

::: callout warning "Se la connessione fallisce"
In caso di errore o mancato collegamento, ripetere la procedura da `cd win` in poi. Quando la connessione riesce, significa che PC e auto **dialogano tra loro**.
:::

## Installare App Manager

::: steps
1. Sempre nella finestra cmd (ancora posizionata in `C:\WIN>`) digitare:
   ```powershell
   adb install c:\win\apk\appman.apk
   ```
   e premere Invio.

2. Attendere l'installazione: la conferma arriva con il messaggio **`success`**.

   ![Prompt dei comandi con il comando adb install c:\win\apk\appman.apk e l'output 'Performing Streamed Install'](images/sealion7/image4.jpeg){width=500}

3. Sul pad, tornare alla pagina principale: tra le app troverete **App Manager** (icona con sfondo beige).
:::

::: callout success "App Manager installato"
Da questo momento l'installazione delle altre applicazioni non richiede più il PC: si può fare tutto dall'infotainment utilizzando App Manager (o uno dei metodi alternativi descritti sotto).
:::

---

# Come installare le altre app {color=info}

::: callout warning "Aurora Store non consigliato"
Su Sl7 si potrebbe installare **Aurora Store**, ma **non funziona bene**: richiede di cambiare impostazioni per autorizzare l'installazione di app tramite App Manager. Meglio seguire uno dei tre metodi descritti di seguito, in base alla propria necessità e comodità.
:::

Ci sono **3 possibilità** per caricare le app sull'infotainment:

::: card highlight
### 🎯 Metodo 1 — Gbox + Play Store (consigliato)

Scaricare e installare **Gbox**: al suo interno è presente il **Play Store**, da cui si possono installare tutte le app che si vogliono.

**Vantaggi**: tutte le app girano nell'ambiente Gbox e si aggiornano automaticamente tramite il Play Store.

**Svantaggio**: rallenta leggermente il sistema, ma in modo quasi impercettibile.
:::

::: card
### 📦 Metodo 2 — Chiavetta USB

Cercare sul web le applicazioni in estensione **`.apkm`** o **`.xapk`** e copiarle su chiavetta USB. Inserire poi la chiavetta nella **porta dati della vettura** (seconda sulla destra) e aprire il contenuto tramite la gestione file dell'auto: selezionare la chiavetta, cliccare sul file da installare e proseguire con l'installazione.
:::

::: card
### 📱 Metodo 3 — File Manager + + Telegram/Browser

Dopo aver installato App Manager (metodo 1), installare anche:

- **File Manager +** — per gestire i file scaricati
- **Telegram** — per scaricare gli APK condivisi nel gruppo (selezionare l'APK, "salva in download")
- **Un browser** — consigliato **Firefox**, da cui navigare e cercare APK
- **Aurora Store** — Scaricando prima **F-Droid** seguendo questa guida [{{ telegram_guidafdroid }}]({{ telegram_guidafdroid }})

Terminato il download, aprire File Manager +, andare nella cartella **Download**: vi troverete sia i file scaricati da web sia quelli scaricati da Telegram (nella sua sottocartella). Cliccare sull'APK da installare e, nella schermata che si apre, selezionare **Installa con App Manager**.
:::

::: callout warning "Aggiornamenti manuali"
I metodi **2 e 3** non consentono l'aggiornamento automatico delle app: vanno aggiornate manualmente scaricando i vari `apk`, `xapk` o `apkm` e reinstallandoli.

La scelta è personale: Gbox non supporta tutte le app, quindi l'ideale è avere **sia Gbox sia app esterne** per ciò che Gbox non copre.
:::

---

# Installazione di Gbox {color=success}

Procedura dettagliata per il Metodo 1.

::: steps
1. **Scaricare il file Gbox** reperibile nella community.

2. **Copiare il file Gbox** nella cartella `C:\WIN\APK\` (la stessa sottocartella creata all'inizio per `appman.apk`).

3. **Rinominare il file in `gbox.apk`**.

4. **Assicurarsi di avere il prompt in `C:\WIN>`** e digitare:
   ```powershell
   adb install c:\win\apk\gbox.apk
   ```
   e premere Invio.
:::

::: callout success "Gbox pronto"
Una volta installato Gbox, aprirlo dal pad: al primo avvio troverete il **Play Store**, da cui potrete scaricare tutte le app compatibili come su un normale dispositivo Android.
:::

---

# Checklist finale

::: checklist
- Ho scaricato `ControlloRemoto.zip` e posizionato `WIN` in `C:\`
- Ho creato la sottocartella `C:\WIN\APK\` con `appman.apk` dentro
- In macchina, ho abilitato `adb turn on` dal Factory Service Interface
- Ho annotato l'indirizzo IP dell'auto dal menu WLAN
- PC e auto sono sulla **stessa rete**
- `adb connect` ha restituito `connected` (o `already connected`)
- `adb install ...\appman.apk` ha restituito `success`
- App Manager compare tra le app del pad
- Ho scelto uno dei 3 metodi per le app successive
:::

---

Queste sono tutte le operazioni necessarie per installare le famose **Third Party Apps** su Sealion 7.
