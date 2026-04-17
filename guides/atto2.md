---
model: ATTO 2
model_slug: atto2
version: "0.1.1"
date: "15/07/2025"
author: "Leonardo Bandini"
author_telegram: "LeonardoBandini"
editor: "Stefano Tagliaferri"
firmware_family: "13.1.33"
firmware_current: "2511"
firmware_downgrade: "2404"
firmware_upgrade: "2511"
countrycode_target: "Singapore (65)"
countrycode_original_example: "Netherlands (31)"
service_code: "*#91532547#"
enter_char: "进入"
theme_color: "#3B82F6"
telegram_downgrade_link: "https://t.me/BYDCLUBITALIANews/6"
telegram_upgrade_link: "https://t.me/BYDCLUBITALIANews/146"
telegram_adb_package: "https://t.me/BYDCLUBITALIANews/7"
telegram_video_sideload: "https://t.me/just_byd/198"
telegram_video_countrycode: "https://t.me/BYD_CLUB_ITALIA/49776/148512"
credits:
  - name: "Gino"
    handle: "giino01"
    role: "ha teorizzato la procedura"
  - name: "Roberto"
    handle: "Migliolfo"
    role: "l'ha concretizzata"
hero_closing: "L'autore di questa guida, per una volta, è lo spettatore 😊"
---

# Introduzione

Questa guida raccoglie le procedure per effettuare **downgrade**, **sideload di APP** e **upgrade** del sistema Infotainment della BYD {{ model }}. È nata come documento didattico all'interno della community italiana, pensato per chi vuole riprendere il controllo completo sul proprio sistema di bordo.

L'obiettivo tipico è poter **installare applicazioni Android di terze parti** (navigatori, media player, strumenti diagnostici) sull'infotainment, operazione che le versioni recenti del firmware bloccano.

::: card highlight
### 🙏 Credits
{% for c in credits %}- **{{ c.name }}** ([@{{ c.handle }}](https://t.me/{{ c.handle }})) {{ c.role }}
{% endfor %}
{{ hero_closing }}
:::

---

# Glossario

Termini ricorrenti in tutta la guida. ::print-hide:: Clicca ogni voce per espanderla. :::

::: glossary
**Firmware** :: Insieme delle istruzioni e delle applicazioni presenti permanentemente nella memoria del sistema, che non possono essere modificate dall'utente. Rappresenta il cuore della parte software del sistema di Infotainment.

**Infotainment** :: Il "tablet" integrato nell'auto: la parte multimediale e di controllo del veicolo.

**APK** :: Pacchetto di installazione di un'applicazione di tipo Android. È il formato standard con cui vengono distribuite le APP sui dispositivi Android.

**APKMirror** :: Sito alternativo al Play Store per scaricare gli APK di programmi Android.

**Sideload / Sideloading** :: Caricamento laterale. Tecnica diffusa su Android, iOS e Windows Mobile, dove esiste uno Store ufficiale (es. Google Play Store). Con il sideloading si prelevano i pacchetti di installazione delle APP da canali alternativi. Lo Store BYD è composto da soli tre programmi: per installarne altri è necessario il sideloading. Solo le versioni del firmware antecedenti alla 1.7 (ottobre 2023, versione 2310) consentono il sideloading diretto via USB.

**FAT32** :: File Allocation Table 32-bit. File system utilizzato da Windows e compatibile con la formattazione delle Pen Drive USB.

**Pen Drive** :: Chiavetta di memoria USB.

**OTA (Over-the-Air)** :: Aggiornamento automatico che BYD invia via rete ai nostri infotainment. Aggiorna sia il sistema multimediale sia i firmware delle parti hardware dell'auto, in particolare BMS (gestore della batteria motrice) e ADAS.

**OTG (Over-the-Go)** :: Aggiornamento manuale via USB. È la modalità con cui si installano firmware precedenti (downgrade) o successivi (upgrade). Aggiorna solo il sistema multimediale.

**ADB (Android Debug Bridge)** :: Strumento Android che permette comunicazione e debug avanzato con il sistema. Sulla {{ model }} è il metodo utilizzato per il sideload, insieme all'accesso al menu di servizio.
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
| `{{ firmware_downgrade }}` | 13.1.33.2404140.1 | {badge:warning:Downgrade} Firmware di riferimento per il downgrade |
| `{{ firmware_upgrade }}` | — | {badge:success:Target} Firmware di upgrade finale |

::: callout info "Famiglie di firmware"
**Famiglia 13.1.32** → Atto 3, Dolphin, Dolphin Surf

**Famiglia 13.1.33** → Seal, Han, Seal U DM-i, **{{ model }}**
:::

---

# Provenienza e download dei firmware

I firmware sono reperibili nei canali Telegram della community. I nuovi firmware vengono pubblicati direttamente nella chat del canale principale.

::: card
### {badge:warning:Downgrade} Firmware {{ firmware_downgrade }}
[{{ telegram_downgrade_link }}]({{ telegram_downgrade_link }})
:::

::: card
### {badge:success:Upgrade} Firmware {{ firmware_upgrade }}
[{{ telegram_upgrade_link }}]({{ telegram_upgrade_link }})
:::

::: card
### 💬 Canale principale (tutti i firmware più recenti)
[https://t.me/BYDCLUBITALIANews](https://t.me/BYDCLUBITALIANews)
:::

---

# Workflow completo {color=success}

Prima di entrare nel dettaglio delle singole operazioni, ecco il flusso complessivo che seguiremo. L'obiettivo finale è avere un sistema **aggiornato all'ultimo firmware** ma con la **possibilità di installare APP di terze parti** sbloccata in modo permanente.

::: workflow
1. **Preparazione** :: Chiavetta USB + PC portatile
2. **Downgrade** :: {{ firmware_current }} → {{ firmware_downgrade }}
3. **Sideload ADB** :: Installazione sblocco
4. **AppManager** :: CountryCode
5. **Upgrade** :: {{ firmware_downgrade }} → {{ firmware_upgrade }}
:::

## Checklist di preparazione

Prima di partire, assicurati di avere tutto il necessario. ::print-hide:: *Clicca ogni voce per spuntarla.* :::

::: checklist
- Chiavetta USB 8, 16 o 32 GB (FAT32)
- PC portatile (Windows o Mac) da portare in auto
- Firmware `{{ firmware_downgrade }}` scaricato (per il downgrade)
- Firmware `{{ firmware_upgrade }}` scaricato (per l'upgrade finale)
- Pacchetto ADB + `PackageInstallerUnlocked.apk` scaricati
- Pacchetto AppManager scaricato
- SD card rimossa dall'auto
- Batteria 12V in buone condizioni
- Cellulare (Android o altro) per generare password IMEI
:::

---

# Preparazione della chiavetta USB

La chiavetta USB è l'elemento chiave di tutta la procedura. Una chiavetta sbagliata o formattata male è la causa più comune di fallimento.

## Requisiti della chiavetta

- **Dimensione consigliata:** 8 GB, 16 GB o 32 GB
- Per chiavette di capacità superiore, creare una partizione ≤ 32 GB lasciando libero il resto dello spazio
- **File system:** FAT32 (obbligatorio)
- Non è necessario assegnare un nome alla partizione

::: callout warning "Compatibilità chiavette"
Alcune Pen Drive non riescono ad eseguire il boot, soprattutto nel caso del downgrade. Se la procedura si blocca, il problema è quasi sempre la chiavetta.

**Modelli verificati dalla community:**
- SanDisk Ultra Flair 32 GB USB 3.0 — [link Amazon](https://amzn.eu/d/0iLRWRQ)
- Kingston DataTraveler G4 USB 3.0 8 GB
- Chiavetta USB OTG 2-in-1 Type-C metallo — [link AliExpress](https://a.aliexpress.com/_EwER8s5)
:::

## Formattazione in FAT32 (Windows)

Su Windows il metodo più affidabile è via PowerShell. Non usare la finestra di formattazione standard: su chiavette grandi non offre l'opzione FAT32.

::: steps
1. **Inserisci la chiavetta nel PC**
   Verifica la lettera con cui viene montata (esempio: `O:`).

2. **Avvia PowerShell come amministratore**
   Cerca "PowerShell" nel menu Start, tasto destro → *Esegui come amministratore*.
   ![Icona di Windows PowerShell nel menu Start](images/atto2/image1.png){width=260}

3. **Lancia il comando di formattazione**
   Sostituisci `O:` con la lettera corretta del tuo drive.
   ```powershell
   Format /FS:FAT32 O:
   ```
   ![Esempio di esecuzione del comando Format in PowerShell](images/atto2/image2.png){width=380}
:::

::: callout critical "Verifica la lettera prima di premere Invio!"
**Attenzione**: verifica due volte la lettera del drive. Se sbagli, rischi di formattare un altro dispositivo (hard disk esterno, disco di sistema) e perdere dati. Il comando `Format` non chiede conferme aggiuntive.
:::

## Struttura dei file sulla chiavetta

I file ZIP dei firmware, una volta decompressi, contengono già tutta la struttura di cartelle necessaria. Sulla chiavetta la struttura finale deve essere:

```
<drive USB>\BYDUpdatePackage\msm8953_64\updatefull.zip
```

Esempio: se la chiavetta è montata come `D:`

```
D:\BYDUpdatePackage\msm8953_64\updatefull.zip
```

![Struttura corretta delle cartelle sulla chiavetta USB](images/atto2/image3.png){width=300}

::: callout warning "Errore comune nella decompressione"
Quando decomprimi lo ZIP, la maggior parte dei software crea una cartella con il nome dello ZIP stesso (es. `USB_{{ firmware_downgrade }}`) che contiene poi `BYDUpdatePackage`.

**Devi copiare nella chiavetta la cartella `BYDUpdatePackage`, non la cartella esterna.** Visualizzando il contenuto della chiavetta dalla radice deve comparire unicamente `BYDUpdatePackage`.
:::

::: callout info "Un firmware alla volta"
Non è possibile copiare i contenuti di {{ firmware_downgrade }} e {{ firmware_upgrade }} contemporaneamente: il secondo sovrascriverebbe il primo. Si usa la stessa chiavetta in due momenti diversi: prima per il downgrade, poi per l'upgrade.
:::

---

# Downgrade dalla {{ firmware_current }} verso {{ firmware_downgrade }} {color=warning}

::: callout info "Cosa succede durante il downgrade"
Il downgrade **resetta le impostazioni** a livello di sistema multimediale (preferenze, layout, account).

L'**associazione tra auto e APP BYD** (smartphone) **non dovrebbe** risentire della procedura.
:::

Non ci sono particolari procedure: inserisci la chiavetta USB con la versione {{ firmware_downgrade }} e attendi la comparsa della finestra IVI che guida al riavvio.

::: callout critical "Rimuovi eventuali SD prima di procedere"
Se hai una scheda SD inserita, **estraila prima** di avviare la procedura. La sua presenza può interferire con il riconoscimento della chiavetta in fase di boot.
:::

All'inserimento della chiavetta USB contenente il firmware {{ firmware_downgrade }} si aprirà la seguente finestra con un QR Code che richiede lo sblocco:

![Finestra con QR Code che richiede lo sblocco](images/atto2/image4.png){width=380}

## Riavvio in modalità recovery

Fai comparire il messaggio, poi riavvia tenendo premuti contemporaneamente per circa **10 secondi**, fino al completo riavvio del sistema:

- la **freccia a sinistra** presente nella razza dello sterzo
- la **rotella del volume** in basso presente nella consolle centrale, accanto al selettore della marcia (**non** la rotella del volume sullo sterzo!)

![Posizione dei due tasti da tenere premuti: freccia sinistra sullo sterzo + rotella volume della consolle centrale](images/atto2/image5.png){width=460}

Al riavvio dovrebbe comparire la finestra di aggiornamento **DiLink 3.0**, riconoscibile dalla presenza di un razzo:

![Schermata DiLink 3.0 con il razzo: il boot dalla chiavetta è andato a buon fine](images/atto2/image6.png){width=480}

::: callout warning "Se compare la schermata di ripristino Android"
Se invece della finestra DiLink 3.0 con il razzo appare la schermata di ripristino di Android, la chiavetta USB non viene vista in fase di boot.

**Soluzioni:**
- Riformatta la chiavetta in FAT32 e ricopia i file
- Prova una chiavetta diversa (vedi lista compatibilità)
- Chiedi nel [gruppo Telegram](https://t.me/BYD_CLUB_ITALIA) in base all'esperienza di altri utenti
:::

---

# Sideload via ADB {color=info}

::: callout info "Procedura specifica per {{ model }}"
Sulla {{ model }} il sideload si effettua **tramite ADB da un PC portatile** (Windows o Mac) collegato alla stessa rete WiFi dell'auto.
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
Metti **ADB e l'APK nella stessa cartella** sul PC: rende più comodo il comando `adb install` finale.
:::

## Procedura completa

::: manual-steps
[1a] **Se hai un cellulare Android**, installa l'APK `BYD secret.APK` ([github.com/ahmada3mar/BYD](https://github.com/ahmada3mar/BYD)).

[1b] **Se non hai un Android** (o non vuoi installare quanto descritto in 1a), apri questa pagina da un cellulare, tablet o PC: [ahmada3mar.github.io/BYD](https://ahmada3mar.github.io/BYD/)

[2] **Collega l'infotainment al cellulare via Bluetooth** in modo da abilitarlo per le telefonate. Poi **disabilita la rete dati dell'auto e l'hotspot verso il cellulare**. Deve essere attivo solo il Bluetooth per le chiamate.

[3] **Componi nel tastierino del telefono sull'infotainment il numero speciale:**
```
{{ service_code }}
```
*Esattamente scritto così, con gli asterischi davanti.* Questo aprirà una pagina di servizio con informazioni tra cui l'IMEI (15 caratteri) e scritte in cinese.
![Pagina di servizio con l'IMEI visualizzato e il campo per inserire la password](images/atto2/image7.jpeg){width=460}

[4] **Apri l'APP del punto 1a) o la pagina al punto 1b).** Prendi le **ultime 6 cifre o caratteri dell'IMEI**, premi Submit. Ti verranno mostrate alcune password.

[5] Sull'infotainment, inserisci la **prima password** ottenuta al punto 4, quindi premi su `{{ enter_char }}` (corrisponde al tasto Enter). Si aprirà la pagina seguente:
![Pagina del menu tecnico: toccare 'TestTools' per accedere alle opzioni di debug](images/atto2/image8.jpeg){width=460}

Fai tap su **TestTools** e si aprirà questa schermata:
![TestTools: scorrere in basso e abilitare 'Debug mode when USB connected' e 'Wireless adb debug switch'](images/atto2/image9.jpeg){width=460}

Scorri in basso e abilita **Debug mode when USB connected** e **Wireless adb debug switch**. Con l'ultimo switch attivato comparirà l'indirizzo IP dell'infotainment: **prendi nota di questo IP**.

[6] **Connetti sia l'auto sia il PC alla stessa rete WiFi** — può essere la WiFi di casa oppure un hotspot generato dal cellulare.

[7] **Sul PC apri una PowerShell**, spostati nella cartella dove è presente ADB e digita:
```powershell
adb connect 192.168.0.10
```
Sostituisci `192.168.0.10` con l'IP reale dell'infotainment. Sull'infotainment comparirà la **richiesta di accesso da remoto**: conferma selezionando l'opzione *"ricorda il permesso di accesso"*.

Poi, sempre nella shell del PC, digita:
```powershell
adb install ./PackageInstallerUnlocked.apk
```
Se ADB e l'APK sono nella stessa cartella, usa il comando sopra. Altrimenti passa il percorso completo: `adb install c:/percorso/PackageInstallerUnlocked.apk`
![Esempio di sessione ADB da PC: connect all'IP, adb devices e adb install dell'APK di sblocco](images/atto2/image10.jpeg){width=500}
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
Questo passaggio è **essenziale per non perdere la modifica** quando si tornerà all'ultimo firmware ({{ firmware_upgrade }}).
:::

Apri AppManager e cambia il CountryCode: passa da quello impostato (probabilmente **{{ countrycode_original_example }}** — **prendine nota!**) a **{{ countrycode_target }}**. Dai OK e attendi che il sistema si riavvii.

Puoi vedere la procedura in questo video: [Video Telegram passo-passo]({{ telegram_video_countrycode }})

---

# Procedura CountryCode {color=critical}

::: callout critical "Attenzione upgrade a firmware recenti"
**Firmware ≥ 2501**
**Passando a firmware più nuovi della 2501 (gennaio 2025), l'upgrade potrebbe cancellare le APP e bloccare nuovamente il sistema.**
Per evitarlo è **necessario** seguire la procedura CountryCode. Richiede che **AppManager sia già installato** e che la **modalità ADB sia abilitata**.
:::

## Logica della procedura

Il trucco consiste nel **cambiare temporaneamente il codice paese dell'auto a "{{ countrycode_target }}"** prima di avviare l'upgrade. In questo modo l'installer non applica i blocchi regionali che cancellerebbero le APP. Completato l'upgrade, si ripristina il codice paese originale.

## Passi della procedura

::: steps
1. **Apri AppManager**
   ![Avvio di AppManager dal menu Strumenti di utilità](images/atto2/image11.png){width=420}

2. **Ricerca `CountryCode`** (o `CountryCodeTool`)
   ![Ricerca di CountryCodeTool in AppManager](images/atto2/image12.png){width=460}

3. **Entra nella tab Attività e avvia Main Activity**
   ![Tab 'Attività' di CountryCodeTool: premere 'Avvia' sulla voce Main Activity](images/atto2/image13.png){width=480}

4. **Prendi nota del codice paese attuale** (in alto a destra). Di solito è **{{ countrycode_original_example }}** per il mercato italiano.
   ![Codice paese attuale mostrato in alto](images/atto2/image14.png){width=480}

5. **Cambia il codice paese con {{ countrycode_target }}**.
   ![Selezione di {{ countrycode_target }} nella lista](images/atto2/image14.png){width=480}

6. **Conferma con OK e Yes** al messaggio. Il sistema si riavvierà automaticamente.
   ![Messaggio di conferma Warning: premere YES per applicare il cambio di codice paese](images/atto2/image15.png){width=480}

7. **Inserisci la chiavetta USB** con il firmware di destinazione.

8. **Avvia l'installazione** e attendi il completamento.

9. **Riapri AppManager → CountryCode** e ripristina il codice paese originale (es. {{ countrycode_original_example }}).

10. **Il sistema si riavvia di nuovo.** Al termine il sistema è aggiornato con le APP intatte.
:::

::: callout success "Trovare il paese originale nella lista"
La lista dei paesi è lunga. Fai **swipe verso l'alto** per scorrere le voci in basso e cercare {{ countrycode_original_example }} o il paese che avevi annotato.
:::

Video dimostrativo passo-passo: [{{ telegram_video_countrycode }}]({{ telegram_video_countrycode }})

---

# Upgrade finale alla {{ firmware_upgrade }} {color=success}

Provenendo da una versione meno aggiornata del firmware, l'installazione della {{ firmware_upgrade }} produce il cosiddetto *upgrade*. Introdotta la Pen Drive, verrà mostrato il messaggio di richiesta di aggiornamento del sistema. Procedendo, verrà chiesta conferma.

L'aggiornamento di downgrade o di upgrade **non** produce (normalmente) la perdita dei software installati nell'infotainment.

::: callout critical "Dopo il downgrade alla {{ firmware_downgrade }}"
**Dopo aver fatto il downgrade alla {{ firmware_downgrade }}**, procedete a un upgrade manuale fino alla **{{ firmware_upgrade }}** (secondo la disponibilità del firmware). La {{ firmware_upgrade }} richiede la procedura CountryCode (capitolo precedente).
:::

Al termine dell'upgrade, apri AppManager e **riporta il CountryCode a quello originale** (di cui avevi preso nota). Il sistema si riavvia.

::: callout success "Sistema pronto"
A questo punto dovresti essere in grado di installare APK di parti terze sull'infotainment, mantenendo il firmware più recente.
:::

---

# Consigli generali

Si consiglia di avere sempre l'ultima versione del firmware. Eseguendo il downgrade per effettuare il caricamento laterale, è opportuno tornare alla versione più aggiornata (attualmente la **{{ firmware_upgrade }}**).

## Prima di ogni upgrade

- Annota la versione firmware attuale e la versione di destinazione
- Verifica che la batteria 12V sia in buone condizioni
- Rimuovi eventuali SD card
- Controlla che la chiavetta USB sia una di quelle testate dalla community
- Verifica di aver installato AppManager e abilitato ADB prima di aggiornare a firmware ≥ 2501

## Cosa non fare

- **Non interrompere** mai l'aggiornamento (non aprire la porta, non spegnere l'auto)
- **Non saltare** la procedura CountryCode quando si passa a firmware ≥ 2501
- **Non procedere** se non è chiaro ogni passaggio: chiedi prima nel gruppo Telegram

## Dove chiedere aiuto

- [Canale News](https://t.me/BYDCLUBITALIANews) — firmware e annunci ufficiali
- [Gruppo di discussione](https://t.me/BYD_CLUB_ITALIA) — supporto e domande
