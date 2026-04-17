---
model: ATTO 3/Seal
model_slug: atto3
version: "0.7.4"
date: "15/07/2025"
author: "Leonardo Bandini"
author_telegram: "LeonardoBandini"
editor: "Stefano Tagliaferri"
firmware_family: "13.1.32"
firmware_downgrade: "2307"
firmware_upgrade: "2511"
sideload_password: "GHY0613byd"
countrycode_target: "Singapore (65)"
countrycode_original_example: "Netherlands (31)"
theme_color: "#3B82F6"
compatible_models: "Atto 3 e Dolphin (stesso firmware). Per Seal/Han/Seal U DM-i si usa la famiglia 13.1.33."
telegram_atto3_2307: "https://t.me/BYDCLUBITALIANews/9"
telegram_seal_2307: "https://t.me/BYDCLUBITALIANews/10"
telegram_sideload: "https://t.me/BYDCLUBITALIANews/7"
telegram_video_countrycode: "https://t.me/BYD_CLUB_ITALIA/49776/148512"
---

# Introduzione

Questa guida raccoglie le procedure per effettuare il **downgrade**, l'installazione di APP via **sideload** e l'**upgrade** del sistema Infotainment dei veicoli BYD {{ model }}. È nata come documento didattico all'interno della community italiana dei possessori BYD, ed è pensata per chi vuole riprendere il controllo completo sul proprio sistema di bordo.

L'obiettivo tipico è poter **installare applicazioni Android di terze parti** (navigatori, media player, ecc.) sull'infotainment, operazione che le versioni recenti del firmware bloccano. La strategia è:

1. **Downgrade** alla versione {{ firmware_downgrade }}, l'ultima che permette il sideload
2. **Sideload** del pacchetto di sblocco (PackageInstallerUnlocked)
3. **Upgrade** manuale alla versione che si desidera (idealmente l'ultima)

::: callout info "Modelli compatibili"
Questa guida si applica ad **Atto 3** e **Dolphin**, che condividono lo stesso firmware della famiglia **13.1.32**. Per Seal, Han e Seal U DM-i è necessario scaricare i firmware della famiglia **13.1.33**.
:::

---

# Glossario

Termini ricorrenti in tutta la guida. ::print-hide:: Clicca ogni voce per espanderla. :::

::: glossary
**Firmware** :: Insieme delle istruzioni e delle applicazioni presenti permanentemente nella memoria del sistema, che non possono essere modificate dall'utente. Rappresenta il cuore della parte software del sistema di Infotainment.

**Infotainment** :: Il "tablet" integrato nell'auto: la parte multimediale e di controllo del veicolo.

**APK** :: Pacchetto di installazione di un'applicazione di tipo Android. È il formato standard con cui vengono distribuite le APP sui dispositivi Android.

**APKMirror** :: Sito alternativo al Play Store per scaricare gli APK di programmi Android.

**Sideload / Sideloading** :: Caricamento laterale. Tecnica che permette di installare APP scaricate da fonti diverse dagli store ufficiali. Sull'infotainment BYD {{ model }} è possibile solo con il firmware {{ firmware_downgrade }} o precedenti.

**FAT32** :: File system di Windows, necessario per formattare la Pen Drive USB usata negli aggiornamenti.

**Pen Drive** :: Chiavetta di memoria USB.

**OTA (Over-the-Air)** :: Aggiornamento automatico che BYD invia via rete. Aggiorna sia il sistema multimediale sia i firmware delle componenti hardware (BMS, ADAS).

**OTG (Over-the-Go)** :: Aggiornamento manuale via USB. È la modalità con cui si installano firmware precedenti (downgrade) o successivi (upgrade). Aggiorna solo il sistema multimediale.

**ADB (Android Debug Bridge)** :: Strumento Android che permette comunicazione e debug avanzato con il sistema. Necessario per alcune operazioni e APP.
:::

---

# Assunzioni di responsabilità {color=critical}

::: callout critical "Leggere prima di procedere"
Questo documento ha scopo puramente didattico. La sovrascrittura del firmware del sistema di Infotainment non è un'operazione esente da rischi: ogni veicolo può presentare differenze hardware o software tali da produrre il fallimento dell'update o del downgrade.

Le operazioni di aggiornamento o retrocessione del firmware non sono necessarie. Chi le esegue si assume il rischio e la responsabilità totali.

**Non eseguire le procedure descritte se non si comprendono i termini e i passaggi qui citati.**
:::

---

# Versioni del firmware

Nel presente documento, per brevità, le versioni del firmware sono indicate con la sola parte della data (anno + mese).

| Sigla | Versione completa | Note |
|-------|-------------------|------|
| `{{ firmware_downgrade }}` | 13.1.32.2307211.1 | {badge:warning:Downgrade} Ultima release che consente il sideload di APK |
| `2310` | 13.1.32.2310180.1 | Prima release che blocca il sideload |
| `2312` | 13.1.32.2312150.1 | Non rilasciata ufficialmente in Italia |
| `{{ firmware_upgrade }}` | — | {badge:success:Target} Versione attuale al momento della stesura |

::: callout info "Famiglie di firmware"
**Famiglia 13.1.32** → **Atto 3**, Dolphin, Dolphin Surf, ATTO 2

**Famiglia 13.1.33** → Seal, Han, Seal U DM-i
:::

---

# Download dei firmware

I firmware sono reperibili nei canali Telegram della community. I nuovi firmware vengono pubblicati direttamente nella chat del gruppo principale.

::: card
### {badge:warning:Downgrade} Atto 3 / Dolphin — firmware {{ firmware_downgrade }}
[{{ telegram_atto3_2307 }}]({{ telegram_atto3_2307 }})
:::

::: card
### Seal / Han / Seal U DM-i — firmware {{ firmware_downgrade }}
[{{ telegram_seal_2307 }}]({{ telegram_seal_2307 }})
:::

::: card
### 💬 Canale principale (tutti i firmware più recenti)
[https://t.me/BYDCLUBITALIANews](https://t.me/BYDCLUBITALIANews)
:::

---

# Workflow completo {color=success}

Prima di entrare nel dettaglio delle singole operazioni, è utile avere chiaro il flusso complessivo. L'obiettivo finale è avere un sistema **aggiornato all'ultimo firmware** ma con la **possibilità di installare APP di terze parti** sbloccata in modo permanente.

::: workflow
1. **Preparazione** :: Annotare versione attuale
2. **Downgrade** :: Alla {{ firmware_downgrade }}
3. **Sideload** :: PackageInstallerUnlocked
4. **ADB attivo** :: Opzionale ma consigliato
5. **Upgrade** :: Ritorno alla versione desiderata
:::

## Checklist di preparazione

Prima di partire, assicurati di avere tutto il necessario. ::print-hide:: *Clicca ogni voce per spuntarla.* :::

::: checklist
- Annotata la versione firmware attualmente installata
- Firmware `{{ firmware_downgrade }}` scaricato (per il downgrade)
- Firmware di destinazione scaricato (stessa versione o superiore all'attuale)
- Pacchetto sideload `USBSIDELOAD.zip` scaricato
- Chiavetta USB 16 o 32 GB (FAT32)
- SD card rimossa dall'auto
- Batteria 12V in buone condizioni
:::

---

# Preparazione della chiavetta USB

La chiavetta USB è l'elemento chiave di tutta la procedura. Una chiavetta sbagliata o formattata male è la causa più comune di fallimento.

## Requisiti della chiavetta

- **Dimensione consigliata:** 16 GB o 32 GB
- Per chiavette di capacità superiore, creare una partizione ≤ 32 GB
- **File system:** FAT32 (obbligatorio)
- Non è necessario assegnare un nome alla partizione

::: callout warning "Compatibilità chiavette"
Alcune Pen Drive non riescono ad eseguire il boot, soprattutto nel caso del downgrade dalla 2407/2408 o superiori. Se la procedura si blocca o l'auto non riconosce la chiavetta, il problema è quasi sempre la chiavetta stessa.

**Modelli verificati dalla community:**
- SanDisk Ultra Flair 32 GB USB 3.0 — [link Amazon](https://amzn.eu/d/0iLRWRQ)
- Kingston DataTraveler G4 USB 3.0 8 GB
- Chiavetta USB OTG 2-in-1 Type-C metallo — [link AliExpress](https://a.aliexpress.com/_EwER8s5)
:::

## Formattazione in FAT32 (Windows)

Su Windows il metodo più affidabile è via PowerShell.

::: steps
1. **Inserisci la chiavetta nel PC**
   Verifica la lettera con cui viene montata (es. `O:`).

2. **Avvia PowerShell come amministratore**
   Cerca "PowerShell" nel menu Start, tasto destro → *Esegui come amministratore*.
   ![Icona di Windows PowerShell nel menu Start](images/atto3/image1.png){width=260}

3. **Lancia il comando di formattazione**
   Sostituisci `O:` con la lettera corretta del tuo drive.
   ```powershell
   Format /FS:FAT32 O:
   ```
:::

::: callout critical "Verifica la lettera prima di premere Invio!"
**Attenzione**: verifica due volte la lettera del drive. Se sbagli, rischi di formattare un altro dispositivo e perdere dati.
:::

## Struttura dei file sulla chiavetta

### Per il firmware (downgrade o upgrade)

Sulla chiavetta la struttura finale deve essere:

```
<drive USB>\BYDUpdatePackage\msm8953_64\UpdateFull.zip
```

Esempio con chiavetta montata come `D:`:

```
D:\BYDUpdatePackage\msm8953_64\UpdateFull.zip
```

::: callout warning "Errore comune nella decompressione"
Quando decomprimi lo ZIP, la maggior parte dei software crea una cartella con il nome dello ZIP (es. `USB_{{ firmware_downgrade }}`) che contiene poi `BYDUpdatePackage`.

**Devi copiare nella chiavetta la cartella `BYDUpdatePackage`, non la cartella esterna.**
:::

### Per il sideload (solo dopo downgrade)

```
<drive USB>\third party apps
```

Dentro a questa cartella vanno inseriti gli APK da installare.

---

# Downgrade alla versione {{ firmware_downgrade }} {color=warning}

::: callout note "Cosa succede durante il downgrade"
Il downgrade **resetta le impostazioni** a livello di sistema multimediale. L'**associazione tra auto e APP** BYD non dovrebbe risentire della procedura.
:::

La procedura di downgrade cambia a seconda della versione attualmente installata. Identifica il tuo scenario e segui solo il paragrafo appropriato.

## Downgrade da versioni fino alla 2401

Il caso più semplice. Non sono richieste procedure particolari.

::: steps
1. Inserisci la chiavetta USB preparata con il firmware {{ firmware_downgrade }} nella porta dati
2. Attendi la comparsa della finestra IVI che guida al riavvio
3. Segui le istruzioni a schermo fino al completo downgrade del sistema
:::

## Downgrade dalla 2403

All'inserimento della chiavetta comparirà una finestra con due opzioni.

![Finestra di scelta OTA / OTG che appare dopo l'inserimento della chiavetta](images/atto3/image4.png){width=340}

::: steps
1. Inserisci la chiavetta USB con il firmware {{ firmware_downgrade }}
2. **Scegli OTG** (non OTA!)
3. Segui le istruzioni a schermo fino al completo downgrade
:::

## Downgrade dalla 2407/2408 o superiore

La procedura più delicata. Le versioni recenti richiedono una sequenza di tasti hardware per forzare il boot dalla chiavetta.

::: callout critical "Rimuovi eventuali SD prima di procedere"
Se hai una scheda SD inserita, **estraila prima** di avviare la procedura. La sua presenza può interferire con il riconoscimento della chiavetta in fase di boot.
:::

::: steps
1. Inserisci la chiavetta USB con il firmware {{ firmware_downgrade }}
2. Apparirà una finestra con un QR Code che richiede lo sblocco
   ![In alto: finestra con QR Code. In basso: posizione dei due tasti da tenere premuti (freccia sinistra sullo sterzo + rotella volume della consolle)](images/atto3/image5.png){width=380}

3. **Forza il riavvio in modalità recovery**: tieni premuti contemporaneamente per circa 10 secondi, fino al riavvio completo, la **freccia a sinistra** sulla razza dello sterzo e la **rotella del volume** della consolle centrale (quella accanto al selettore marcia — **non** la rotella sullo sterzo!).

4. Al riavvio deve apparire la finestra di aggiornamento DiLink 3.0, riconoscibile dall'icona di un razzo:
   ![Schermata DiLink 3.0 con il razzo: il boot dalla chiavetta è andato a buon fine](images/atto3/image6.png){width=460}

5. Segui le istruzioni a schermo fino al completo downgrade.
:::

::: callout warning "Se compare la schermata di ripristino Android"
Se invece della finestra DiLink 3.0 con il razzo appare la schermata di ripristino di Android, la chiavetta USB non viene vista in fase di boot.

![Schermata di Android Recovery: la chiavetta non viene riconosciuta in fase di boot](images/atto3/image7.png){width=460}

**Soluzioni:**
- Riformatta la chiavetta in FAT32 e ricopia i file
- Prova una chiavetta diversa (vedi lista compatibilità)
- Chiedi nel gruppo Telegram con l'esperienza di altri utenti
:::

---

# Sideload del pacchetto di sblocco {color=info}

Una volta effettuato il downgrade alla {{ firmware_downgrade }}, puoi installare APP di terze parti. **Questo è il momento in cui sblocchi permanentemente il sistema**: installando l'APK `PackageInstallerUnlocked` potrai continuare a installare programmi anche dopo l'upgrade a firmware più recenti.

::: callout info "Download del pacchetto sideload"
Il file ZIP con il materiale per il sideload è disponibile qui: [{{ telegram_sideload }}]({{ telegram_sideload }})

Nel pacchetto c'è anche una vecchia versione di AppManager. Per l'ultima versione, consulta i post del canale [BYD Club Italia News](https://t.me/BYDCLUBITALIANews).
:::

## Preparazione della chiavetta per il sideload

::: steps
1. Formatta nuovamente la chiavetta in FAT32 (o usane una diversa)
2. Crea sulla chiavetta la cartella `third party apps`
3. Copia dentro questa cartella gli APK che vuoi installare
:::

![Esempio di contenuto della cartella 'third party apps' con i tre APK consigliati](images/atto3/image8.png){width=480}

::: callout success "APK consigliati"
**PackageInstallerUnlocked.apk** — **essenziale**. Mantiene la possibilità di installare nuovi programmi anche con firmware successivi.

**AppManager** — utile per gestire le applicazioni e, nei firmware ≥ 2501, per la procedura CountryCode.

**wireless_adb_switch.apk** — se vuoi attivare ADB wireless (vedi capitolo successivo).
:::

## Installazione

::: steps
1. Inserisci la chiavetta nella porta USB dati dell'auto (con il firmware {{ firmware_downgrade }} già installato)
2. L'infotainment chiederà la password per l'installazione
3. Inserisci la password:
   ```
   {{ sideload_password }}
   ```
4. Segui le istruzioni a schermo per completare l'installazione di ciascun APK
:::

---

# Attivazione della modalità USB Debug e ADB Wireless {color=info}

Questa fase è **fortemente consigliata**: oltre a essere necessaria per alcune APP avanzate, la modalità ADB è **indispensabile per la procedura CountryCode** richiesta durante l'upgrade a firmware ≥ 2501.

::: callout info "Video tutorial"
Per una dimostrazione video della procedura: [https://youtu.be/-GL3Iv7O2XM](https://youtu.be/-GL3Iv7O2XM?si=zO7-huUz5dMNSuqA)
:::

## Procedura

::: steps
1. Installa l'APK `wireless_adb_switch.apk` via sideload (se non l'hai già fatto nel capitolo 7). È contenuto in: [pacchetto sideload Telegram]({{ telegram_sideload }})

2. Apri **Impostazioni** → **Informazioni sul veicolo** (o sezione equivalente sulla tua auto)

3. Individua la voce **"Ripristina le impostazioni di fabbrica"** e tappaci sopra **8 volte consecutive e ravvicinate** (non cliccando per avviare il reset, solo tapping)
   ![Posizione della voce 'Ripristina le impostazioni di fabbrica' su cui fare gli 8 tap](images/atto3/image9.png){width=480}

4. Si aprirà un menu nascosto con varie opzioni di debug
   ![Menu nascosto di debug: abilitare 'Debug mode when USB is connected' e 'Wireless adb debug switch'](images/atto3/image10.png){width=480}

5. Abilita le due voci:
   - **Debug mode when USB is connected**
   - **Wireless adb debug switch**
:::

---

# Upgrade al firmware finale {color=success}

Dopo aver fatto il downgrade alla {{ firmware_downgrade }} e installato `PackageInstallerUnlocked`, è il momento di tornare al firmware più recente. **Questa è la fase più delicata**: un errore qui può bloccare nuovamente il sistema.

::: callout warning "Scelta del firmware di destinazione"
**Consiglio:** aggiornare alla versione più recente disponibile (attualmente {{ firmware_upgrade }}). Se preferisci essere conservativo, usa lo stesso firmware che avevi prima del downgrade oppure una versione successiva — mai una precedente.
:::

## Upgrade a firmware < 2501 (procedura semplice)

Se il firmware di destinazione è precedente alla 2501 (gennaio 2025), la procedura è diretta:

::: steps
1. Prepara la chiavetta USB con il firmware di destinazione (struttura `BYDUpdatePackage\msm8953_64\UpdateFull.zip`)
2. Inserisci la chiavetta nella porta USB dati
3. L'infotainment mostrerà il messaggio di richiesta di aggiornamento
4. Conferma e attendi il completamento
:::

*Nota: upgrade e downgrade **non** producono (normalmente) la perdita dei software installati nell'infotainment.*

## Upgrade a firmware ≥ 2501 — Procedura CountryCode

::: callout critical "Attenzione: upgrade a firmware 2501 o successivi"
**Passando a firmware più nuovi della 2501 (gennaio 2025), l'upgrade potrebbe cancella le APP installate e riblocca il sistema.**

Per evitarlo è **obbligatorio** seguire la procedura CountryCode descritta qui sotto. Richiede che **AppManager sia già installato** in auto e che la **modalità ADB sia abilitata**.
:::

### Logica della procedura

Il trucco consiste nel **cambiare temporaneamente il codice paese dell'auto a "{{ countrycode_target }}"** prima di avviare l'upgrade. In questo modo l'installer non applica i blocchi regionali che cancellerebbero le APP. Completato l'upgrade, si ripristina il codice paese originale.

### Passi dettagliati

::: steps
1. **Apri AppManager**
   ![Schermata di avvio di AppManager](images/atto3/image11.png){width=420}

2. Cerca `CountryCode` (o `CountryCodeTool`)
   ![Ricerca di CountryCode in AppManager](images/atto3/image12.png){width=460}

3. Entra nella tab **Attività** e avvia **Main Activity**
   ![Tab 'Attività' con la voce Main Activity](images/atto3/image13.png){width=480}

4. **Annota il codice paese attuale** (in alto a destra). Di solito è **{{ countrycode_original_example }}** per il mercato italiano/europeo
   ![Schermata con il codice paese attuale in alto a destra (es. Netherlands)](images/atto3/image14.png){width=480}

5. Cambia il codice paese in **{{ countrycode_target }}**.
   ![Selezione di {{ countrycode_target }} nella lista dei codici paese](images/atto3/image14.png){width=480}

6. Conferma con **OK** e **Yes** al messaggio di conferma. Il sistema si riavvierà automaticamente.

7. Dopo il riavvio, inserisci la chiavetta USB con il firmware di destinazione

8. Avvia l'installazione e attendi il completamento

9. A installazione conclusa, **riapri AppManager → CountryCode** e ripristina il codice paese originale (es. {{ countrycode_original_example }})

10. Il sistema si riavvierà nuovamente. Al termine il sistema sarà aggiornato e con le APP intatte.
:::

::: callout success "Trovare il paese originale nella lista"
La lista dei paesi è lunga. Fai **swipe verso l'alto** per scorrere le voci in basso e cercare Netherlands (o il paese che avevi annotato al passo 4).
:::

::: callout info "Video dimostrativo passo-passo"
Per vedere l'intera procedura CountryCode in video: [{{ telegram_video_countrycode }}]({{ telegram_video_countrycode }})
:::

---

# Consigli generali e buone pratiche

## Mantieni il firmware aggiornato

Una volta completato il ciclo downgrade → sideload → upgrade, **torna sempre alla versione più recente del firmware** (al momento, la {{ firmware_upgrade }}). `PackageInstallerUnlocked` installato durante la fase di sideload ti permetterà di continuare a installare APP anche sui firmware futuri.

## Prima di ogni upgrade

- Annota la versione firmware attuale e la versione di destinazione
- Verifica che la batteria 12V sia in buone condizioni
- Rimuovi eventuali SD card
- Controlla che la chiavetta USB sia una di quelle testate dalla community
- Se l'upgrade è verso firmware ≥ 2501, verifica di avere AppManager installato e ADB attivo

## Cosa NON fare

- **Non interrompere** mai l'aggiornamento (non aprire la porta, non spegnere l'auto)
- **Non usare** la porta USB con il fulmine (è solo per ricarica)
- **Non saltare** la procedura CountryCode se stai passando a firmware ≥ 2501
- **Non procedere** se non hai chiaro ogni passaggio: chiedi nel gruppo Telegram prima

## Dove chiedere aiuto

- [Canale News](https://t.me/BYDCLUBITALIANews) — firmware e annunci ufficiali
- [Gruppo di discussione](https://t.me/BYD_CLUB_ITALIA) — supporto e domande
