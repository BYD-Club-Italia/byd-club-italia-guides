---
model: Dolphin Surf
model_slug: surf
version: "0.0.2"
date: "12/09/2025"
author: "Leonardo Bandini"
editor: "Stefano Tagliaferri"
firmware_current: "2502"
firmware_downgrade: "2404"
firmware_upgrade_latest: "2510"
firmware_upgrade_stable: "2510"
countrycode_target: "Singapore (65)"
countrycode_original_example: "Netherlands (31)"
service_code: "*#91532547#"
enter_char: "进入"
theme_color: "#3B82F6"
telegram_downgrade: "https://t.me/BYDCLUBITALIANews/96"
telegram_upgrade_latest: "https://t.me/BYDCLUBITALIANews/179"
telegram_adb_package: "https://t.me/BYDCLUBITALIANews/7"
telegram_video_sideload: "https://t.me/just_byd/198"
telegram_video_countrycode: "https://t.me/BYD_CLUB_ITALIA/49776/148512"
---

# Introduzione

Questa guida raccoglie le procedure per effettuare **downgrade**, **sideload di APP** e **upgrade** del sistema Infotainment della BYD {{ model }}. È nata come documento didattico all'interno della community italiana.

L'obiettivo tipico è poter **installare applicazioni Android di terze parti** (navigatori, media player, strumenti diagnostici) sull'infotainment.

::: callout info "Particolarità della {{ model }}"
Sulla {{ model }}, al momento della stesura di questa guida, il firmware preinstallato è il **{{ firmware_current }}**. Questo firmware non è disponibile per il download, quindi in fase di upgrade si sceglie il **{{ firmware_upgrade_latest }}**.
:::

---

# Glossario

Termini ricorrenti in tutta la guida. ::print-hide:: Clicca ogni voce per espanderla. :::

::: glossary
**Firmware** :: Insieme delle istruzioni e delle applicazioni presenti permanentemente nella memoria del sistema, che non possono essere modificate dall'utente.

**Infotainment** :: Il "tablet" integrato nell'auto: la parte multimediale e di controllo del veicolo.

**APK** :: Pacchetto di installazione di un'applicazione di tipo Android.

**APKMirror** :: Sito alternativo per scaricare gli APK di programmi Android.

**Sideload / Sideloading** :: Caricamento laterale. Tecnica che permette di installare APP scaricate da fonti diverse dagli store ufficiali. Sulla {{ model }} si effettua via ADB da PC.

**FAT32** :: File Allocation Table 32-bit. File system utilizzato da Windows e compatibile con la formattazione delle Pen Drive USB.

**Pen Drive** :: Chiavetta di memoria USB.

**OTA (Over-the-Air)** :: Aggiornamento automatico che BYD invia via rete ai nostri infotainment. Aggiorna sia il sistema multimediale sia i firmware delle parti hardware dell'auto (BMS, ADAS).

**OTG (Over-the-Go)** :: Aggiornamento manuale via USB. È la modalità con cui si installano firmware precedenti (downgrade) o successivi (upgrade).

**ADB (Android Debug Bridge)** :: Strumento Android che permette comunicazione e debug avanzato con il sistema. Sulla {{ model }} è il metodo utilizzato per il sideload (non c'è la via USB con password come su Atto 3).
:::

---

# Assunzioni di responsabilità {color=critical}

::: callout critical "Leggere prima di procedere"
Questo documento ha scopo puramente didattico e **non è un invito** a utilizzare queste procedure.

La sovrascrittura del firmware del sistema di Infotainment non è esente da rischi: ogni veicolo può presentare differenze hardware o software tali da produrre il fallimento dell'update o del downgrade.

**Non ci assumiamo alcuna responsabilità** sull'utilizzo di questo materiale e sui danni eventualmente prodotti.

**Non eseguire le procedure se non si sa cosa si sta facendo**, se non si conoscono i termini e le procedure qui citate.
:::

---

# Versioni del firmware

Nel presente documento, per brevità, ci si riferirà alla seguente nomenclatura dei firmware.

| Sigla | Versione completa | Note |
|-------|-------------------|------|
| `2307` | 13.1.32.2307211.1 | Ultima release che consente il sideload USB (su altri modelli) |
| `2310` | 13.1.32.2310180.1 | Prima release che blocca il sideload USB |
| `{{ firmware_downgrade }}` | — | {badge:warning:Downgrade} Firmware di riferimento per il downgrade |
| `{{ firmware_current }}` | — | Versione preinstallata sulle Surf della community |
| `{{ firmware_upgrade_stable }}` | — | {badge:success:Upgrade} Firmware di upgrade (alternativa stabile) |
| `{{ firmware_upgrade_latest }}` | — | {badge:success:Upgrade} Firmware di upgrade (più recente) |

::: callout info "Famiglie di firmware"
**Famiglia 13.1.32** → Atto 3, Dolphin, **Dolphin Surf**, ATTO 2

**Famiglia 13.1.33** → Seal, Han, Seal U DM-i
:::

---

# Provenienza e download dei firmware

I firmware sono reperibili nei canali Telegram della community. I nuovi firmware vengono pubblicati direttamente nel canale principale.

::: card
### {badge:warning:Downgrade} Firmware {{ firmware_downgrade }}
[{{ telegram_downgrade }}]({{ telegram_downgrade }})
:::

::: card
### {badge:success:Upgrade} Firmware {{ firmware_upgrade_latest }} (più recente)
[{{ telegram_upgrade_latest }}]({{ telegram_upgrade_latest }})
:::

::: card
### {badge:success:Upgrade} Firmware {{ firmware_upgrade_stable }} (alternativa)
[{{ telegram_upgrade_stable }}]({{ telegram_upgrade_stable }})
:::

::: card
### 💬 Canale principale (tutti i firmware più recenti)
[https://t.me/BYDCLUBITALIANews](https://t.me/BYDCLUBITALIANews)
:::

::: callout success "Chiedi consiglio alla community"
Si consiglia di chiedere consiglio nel gruppo su quale firmware utilizzare per l'upgrade successivo alla procedura di sblocco.
:::

---

# Istruzioni generali

Scaricare i file ZIP e decomprimerli nelle cartelle corrispondenti. Si consigliano Pen Drive della dimensione 8 GB, 16 GB o 32 GB. Per chiavette di capacità superiore si consiglia un partizionamento, lasciando libero lo spazio non utilizzato e facendo una partizione di dimensione non superiore a 32 GB.

## Formattazione della Pen Drive

La formattazione dovrà essere eseguita in FAT32 (o compatibile). Non è necessario nominare la partizione della chiavetta in modo particolare.

Su Windows si consiglia di procedere alla formattazione mediante PowerShell:

::: steps
1. **Avvia PowerShell con diritti di amministratore**
   Su Start, cerca PowerShell e aprila.
   ![Icona di Windows PowerShell nel menu Start](images/surf/image1.png){width=260}

2. **Inserisci la Pen Drive USB nel PC**
   Accertati della lettera in cui la partizione viene montata. Per esempio immaginiamo `O:`

3. **Digita il comando**
   ```powershell
   Format /FS:FAT32 O:
   ```
   ![Esempio di esecuzione del comando Format in PowerShell](images/surf/image2.png){width=380}
:::

::: callout critical "Verifica la lettera prima di procedere!"
**Attenzione**: verifica la lettera del drive prima di premere Invio. Se sbagli, rischi di formattare un altro dispositivo e perdere dati. Il comando `Format` non chiede conferme aggiuntive.
:::

## Chiavette compatibili

Ci sono alcune Pen Drive che non riescono ad eseguire il boot, soprattutto nel caso del downgrade. Qui una lista di modelli verificati dalla community:

- **SanDisk Ultra Flair 32 GB USB 3.0** — [link Amazon](https://amzn.eu/d/0iLRWRQ)
- **Kingston DataTraveler G4** USB 3.0 da 8 GB
- **Chiavetta USB OTG 2-in-1 Type-C metallo** — [link AliExpress](https://a.aliexpress.com/_EwER8s5)

Per altri modelli verificati, chiedi nel [gruppo Telegram](https://t.me/BYD_CLUB_ITALIA).

## Preparazione della chiavetta per il firmware

::: callout info "Un firmware alla volta"
Per installare il firmware **{{ firmware_downgrade }}** (downgrade), copia il contenuto del relativo file ZIP nella chiavetta.

Per installare il firmware **{{ firmware_upgrade_latest }}** (upgrade), copia il contenuto del relativo file ZIP nella chiavetta.

**Non è possibile copiare entrambi i contenuti contemporaneamente**: il secondo sovrascriverebbe il primo. Si usa la stessa chiavetta in due momenti diversi.
:::

Per eseguire le installazioni del firmware, la chiavetta deve contenere la seguente struttura:

```
<drive USB>\BYDUpdatePackage\msm8953_64\updatefull.zip
```

Per esempio, immaginando che la chiavetta sia montata con la lettera `D`:

```
D:\BYDUpdatePackage\msm8953_64\updatefull.zip
```

![Struttura corretta delle cartelle sulla chiavetta USB](images/surf/image3.png){width=300}

::: callout warning "Errore comune nella decompressione"
Quando il file ZIP viene decompresso, vengono già create le sottocartelle, ma la prima cartella ha il nome del file ZIP stesso. Dovete copiare solo il contenuto.

Copiate la cartella `BYDUpdatePackage` dentro la chiavetta. Visualizzando il contenuto del Drive USB dovrà comparire **unicamente** il nome di tale cartella.
:::

---

# Downgrade dalla {{ firmware_current }} o superiori verso {{ firmware_downgrade }} {color=warning}

::: callout info "Cosa succede durante il downgrade"
Il downgrade **resetta le impostazioni** a livello di sistema multimediale. L'**associazione tra auto e APP** BYD non dovrebbe risentire della procedura.
:::

Non ci sono particolari procedure: inserire la chiavetta USB con la versione {{ firmware_downgrade }} e attendere la comparsa della finestra IVI che guida al riavvio.

::: callout critical "Rimuovi eventuali SD prima di procedere"
Se hai una scheda SD inserita, **estraila prima** di avviare la procedura. La sua presenza può interferire con il riconoscimento della chiavetta in fase di boot.
:::

All'inserimento della chiavetta USB contenente il firmware {{ firmware_downgrade }} si aprirà la seguente finestra:

![Finestra con QR Code che richiede lo sblocco](images/surf/image4.png){width=380}

Questo è il QR Code che viene mostrato per richiedere lo sblocco.

## Riavvio in modalità recovery

Fare comparire il messaggio, poi riavviare tenendo premuti contemporaneamente per circa **10 secondi**, fino al completo riavvio del sistema:

- la **freccia a sinistra** presente nella razza dello sterzo
- la **rotella del volume** in basso presente nella consolle centrale, accanto al selettore della marcia (attenzione, **non** la rotella del volume sullo sterzo!)

![Posizione dei due tasti da tenere premuti: freccia sinistra sullo sterzo + rotella volume della consolle centrale](images/surf/image5.png){width=460}

Al riavvio dovrebbe comparire la finestra di aggiornamento **DiLink 3.0**, riconoscibile dalla presenza di un razzo:

![Schermata DiLink 3.0 con il razzo: il boot dalla chiavetta è andato a buon fine](images/surf/image6.png){width=480}

::: callout warning "Se compare la schermata di ripristino Android"
Se invece della finestra DiLink 3.0 con il razzo appare la schermata di ripristino di Android, la chiavetta USB non viene vista in fase di boot.

**Soluzioni:**
- Riformatta la chiavetta in FAT32 e ricopia i file
- Sostituisci con un'altra chiavetta (vedi lista compatibilità)
- Chiedi nel [gruppo Telegram](https://t.me/BYD_CLUB_ITALIA) in base all'esperienza di altri utenti
:::

---

# Installazione tramite sideload {color=info}

::: callout info "Procedura specifica per {{ model }}"
Sulla {{ model }} il sideload si effettua **tramite ADB da un PC portatile** (Windows o Mac) collegato alla stessa rete WiFi dell'auto. Non si utilizza la chiavetta USB con password come su Atto 3.
:::

## Prerequisiti

Serve andare in macchina con un **PC portatile** (Windows o Mac).

::: card
### 📦 Pacchetto ADB
Scarica il pacchetto di controllo remoto condiviso qui:
[{{ telegram_adb_package }}]({{ telegram_adb_package }})

Decomprimi il file zip: all'interno c'è il client ADB per Windows. Per Mac occorre scaricare ADB per iOS. Scarica su PC anche l'APK `PackageInstallerUnlocked.apk`.
:::

::: callout success "Organizza i file"
Si consiglia di mettere **ADB e l'APK nella stessa cartella** sul PC: rende più comodo il comando `adb install` nel passo 6.
:::

## Procedura completa

::: manual-steps
[1a] **Se hai un cellulare Android**, installa l'APK `BYD secret.APK` ([github.com/ahmada3mar/BYD](https://github.com/ahmada3mar/BYD)).

[1b] **Se non hai un Android** (o non vuoi installare quanto descritto in 1a), apri questa pagina da un cellulare, tablet o PC: [ahmada3mar.github.io/BYD](https://ahmada3mar.github.io/BYD/)

[2] **Collega l'infotainment al cellulare via Bluetooth** in modo da abilitarlo per le telefonate. Poi **disabilita la rete dati dell'auto e l'hotspot verso il cellulare**. Deve essere attivo solo il Bluetooth verso il cellulare per le chiamate.

[3] **Componi nel tastierino del telefono sull'infotainment il numero speciale:**
```
{{ service_code }}
```
*Esattamente scritto così, con gli asterischi davanti.* Questo aprirà una pagina di servizio che riporta alcune informazioni, tra cui:
```
IMEI: NNXXXXYYZZZZZZW   (15 caratteri)
```
Ci sono anche scritte in cinese.
![Pagina di servizio con l'IMEI visualizzato e il campo per inserire la password](images/surf/image7.jpeg){width=460}

[4] **Apri l'APP del punto 1a) oppure la pagina al punto 1b).** Prendi le **ultime 6 cifre o caratteri dell'IMEI**, premi Submit. Ti verranno mostrate alcune password.

[5] **Connetti sia l'auto sia il PC alla stessa rete WiFi.**

Poi, sull'infotainment, nella pagina di servizio aperta al punto 3, inserisci la **prima password** ottenuta al punto 4, quindi premi su `{{ enter_char }}` (corrisponde al tasto Enter). Si aprirà la pagina seguente:
![Pagina del menu tecnico: toccare 'TestTools' per accedere alle opzioni di debug](images/surf/image8.jpeg){width=460}

Fai tap su **TestTools** e si aprirà questa schermata:
![TestTools: scorrere in basso e abilitare 'Debug mode when USB connected' e 'Wireless adb debug switch'](images/surf/image9.jpeg){width=460}

Scorri in basso e abilita **Debug mode when USB connected** e **Wireless adb debug switch**. Con l'ultimo switch attivato comparirà l'indirizzo IP che è stato rilasciato all'infotainment: **prendi nota di questo IP**.

[6] **Sul PC apri una PowerShell**, spostati nella cartella dove è presente ADB e digita:
```powershell
adb connect 192.168.0.10
```
Al posto di `192.168.0.10` scrivi l'indirizzo IP reale dell'infotainment.

A questo punto sull'infotainment comparirà la **richiesta di accesso da remoto**: conferma l'accesso selezionando l'opzione *"ricorda il permesso di accesso"*.

Poi, sempre nella shell del PC, digita:
```powershell
adb install ./PackageInstallerUnlocked.apk
```
Devi passare il percorso completo, oppure, se ADB e l'APK sono nella stessa cartella in cui ti trovi nella shell, puoi usare il comando sopra con `./`.
![Esempio di sessione ADB da PC: connect all'IP, adb devices e adb install dell'APK di sblocco](images/surf/image10.jpeg){width=500}
:::

::: callout success "Sideload completato"
**Fatto!** In questo modo hai sbloccato le installazioni di APP di terze parti sull'infotainment.
:::

Video completo della procedura: [{{ telegram_video_sideload }}]({{ telegram_video_sideload }})

---

# Installazione AppManager

Scarica da [{{ telegram_adb_package }}]({{ telegram_adb_package }}) il pacchetto `USBSIDELOAD.zip`, decomprimilo sulla chiavetta USB e installa il programma AppManager.

In alternativa, l'ultima release di AppManager la trovi nei post del canale: [BYD Club Italia News](https://t.me/BYDCLUBITALIANews)

::: callout critical "Passaggio essenziale"
Questo passaggio è **essenziale per non perdere la modifica** quando si tornerà all'ultimo firmware ({{ firmware_upgrade_stable }} o {{ firmware_upgrade_latest }}).
:::

Apri AppManager e cambia il CountryCode: passa da quello impostato (probabilmente **{{ countrycode_original_example }}** — **prendine nota!**) a **{{ countrycode_target }}**. Dai OK e attendi che il sistema si riavvii.

Puoi vedere la procedura in questo video: [{{ telegram_video_countrycode }}]({{ telegram_video_countrycode }})

---

# Approfondimento CountryCode {color=critical}

::: callout critical "Attenzione: upgrade a firmware 2501 o successivi"
**Passando a firmware più nuovi della 2501 (gennaio 2025), l'upgrade potrebbe cancellare le APP e bloccare nuovamente il sistema.**

Per evitarlo è **necessario** seguire la procedura di seguito indicata. **AppManager deve essere installato** in auto e la **modalità ADB deve essere abilitata**.
:::

## Passi della procedura

::: steps
1. **Apri AppManager**
2. Ricerca `CountryCode`
3. Entra nella **tab Attività** e avvia **Main Activity**
4. **Prendi nota del codice paese di origine**
5. Cambia il codice paese con **{{ countrycode_target }}** (il primo della lista)
6. Riavvia il sistema
7. Inserisci la chiavetta USB con il file di aggiornamento
8. Inizia l'installazione
9. Una volta completata l'installazione, apri `CountryCode` e ripristina il paese di origine (probabilmente **{{ countrycode_original_example }}**)
10. Il sistema si riavvia di nuovo
:::

La procedura è mostrata in questo video passo-passo: [{{ telegram_video_countrycode }}]({{ telegram_video_countrycode }})

## Dettaglio visivo di ogni passo

**Avvio di AppManager**

![Avvio di AppManager dal menu Strumenti di utilità](images/surf/image11.png){width=420}

**Ricerca del CountryCodeTool**

![Ricerca di CountryCodeTool in AppManager](images/surf/image12.png){width=460}

**Entrare nella tab Attività e avviare Main Activity**

![Tab 'Attività' di CountryCodeTool: premere 'Avvia' sulla voce Main Activity](images/surf/image13.png){width=480}

**Prendere nota del codice paese di origine**, scritto in alto a destra. Normalmente troverete **Netherlands, 31**.

![Codice paese attuale: 'The Current Country Code is: Netherlands-NL-31'](images/surf/image14.png){width=480}

**Cambiare il codice paese con {{ countrycode_target }}** (il primo della lista).

![Selezione di {{ countrycode_target }} come primo elemento della lista](images/surf/image14.png){width=480}

**Selezionando e dando OK**, si apre il messaggio: dare conferma con **Yes**. Il sistema si riavvierà.

![Messaggio di conferma Warning: premere YES per applicare il cambio di codice paese](images/surf/image15.png){width=480}

Procedere con upgrade via OTG al firmware desiderato, poi rifare la stessa procedura riselezionando il codice paese originario.

::: callout success "Trovare il paese originale nella lista"
La lista dei paesi può scorrere: fai **swipe verso l'alto** per scorrere le voci in basso e cercare nuovamente Netherlands o il paese in cui era impostato.
:::

---

# Istruzioni upgrade {color=success}

Provenendo da una versione meno aggiornata del firmware, l'installazione di una delle versioni qui presenti produce il cosiddetto *upgrade*. Introdotta la Pen Drive, verrà mostrato il messaggio di richiesta di aggiornamento del sistema. Procedendo, verrà chiesta conferma.

L'aggiornamento di downgrade o di upgrade **non** produce (normalmente) la perdita dei software installati nell'infotainment.

::: callout critical "Dopo il downgrade alla {{ firmware_downgrade }}"
**Dopo aver fatto il downgrade alla {{ firmware_downgrade }}**, procedete a un upgrade manuale fino al firmware più recente disponibile (**{{ firmware_upgrade_latest }}** o **{{ firmware_upgrade_stable }}** a seconda della disponibilità).
:::

Al termine dell'upgrade, apri AppManager e **riporta il CountryCode a quello originale** (di cui avevi preso nota). Il sistema si riavvia.

::: callout success "Sistema pronto"
A questo punto dovresti essere in grado di installare APK di parti terze sull'infotainment.
:::

---

# Consigli generali

Si consiglia di avere sempre l'ultima versione del firmware. Quindi, eseguendo il downgrade per effettuare il caricamento laterale, è opportuno poi tornare alla versione più aggiornata (attualmente la **{{ firmware_upgrade_latest }}** oppure la **{{ firmware_upgrade_stable }}** come alternativa stabile).

## Prima di ogni upgrade

- Annota la versione firmware attuale e la versione di destinazione
- Verifica che la batteria 12V sia in buone condizioni
- Rimuovi eventuali SD card
- Controlla che la chiavetta USB sia una di quelle testate dalla community
- Verifica di aver installato AppManager e abilitato ADB prima di aggiornare a firmware ≥ 2501

## Cosa NON fare

- **Non interrompere** mai l'aggiornamento (non aprire la porta, non spegnere l'auto)
- **Non saltare** la procedura CountryCode quando si passa a firmware ≥ 2501
- **Non procedere** se non è chiaro ogni passaggio: chiedi prima nel gruppo Telegram

## Dove chiedere aiuto

- [Canale News](https://t.me/BYDCLUBITALIANews) — firmware e annunci ufficiali
- [Gruppo di discussione](https://t.me/BYD_CLUB_ITALIA) — supporto e domande
