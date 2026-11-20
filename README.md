# EHVG Stream Deck-plugin (macOS)

Private Stream Deck-plugin voor EHVG: Microsoft Teams (mute / camera / hand) en configureerbare Open URL-acties.

| | |
| --- | --- |
| UUID | `com.ehvg.streamdeck` |
| Platform | **macOS alleen** (Stream Deck ≥ 7.1, Node 24) |
| Distributie | Intern `.streamDeckPlugin` via `streamdeck pack` |
| Marketplace | **Niet** — wordt niet gepubliceerd op de Elgato Marketplace |

Geen geheimen of tokens in deze repo. Teams-status komt niet uit een API: de plugin stuurt de standaard Mac-sneltoetsen via AppleScript en houdt een **optimistische** toggle-state op de key.

## Acties

| Actie | Shortcut | Gedrag |
| --- | --- | --- |
| Teams Mute | ⌘⇧M | AppleScript → Teams focussen → toets → vorige app terug |
| Teams Camera | ⌘⇧O | idem |
| Teams Raise Hand | ⌘⇧K | idem |
| Open URL | — | Property inspector: titel + URL → `streamDeck.system.openUrl` |

## macOS vereisten / setup

- Stream Deck-app ≥ 7.1 + device (Module 15 keys = classic 5×3)
- Microsoft Teams desktop
- Node.js **24+** op je PATH
- Eenmalig: macOS-rechten voor **Automatisering** (en zo nodig **Toegankelijkheid**) — zie [Troubleshooting Teams-knoppen](#troubleshooting-teams-knoppen-gele-driehoek)

### 1. Controleren of Node al goed staat

In Terminal:

```bash
node -v
npm -v
```

Staat er **v24.x of nieuwer**? Dan kun je installatie overslaan en door naar [§3 CLI + project](#3-cli--project-installeren).

Geen `node` / te oude versie → kies hieronder **A of B**.

### 2. Node.js 24+ installeren (kies één)

#### A. Officiële macOS-installer (nodejs.org)

Patrick gebruikt deze route.

1. Ga naar [https://nodejs.org](https://nodejs.org) en download de **LTS / Current macOS-installer** voor Node **24+**.
2. Draai het `.pkg` en volg de wizard (macOS kan om een admin-wachtwoord vragen).
3. Open een **nieuwe** Terminal.

**PATH:** de installer zet `node` en `npm` meestal direct op je PATH. Verifieer met `node -v`, `npm -v` en `which node`. Werkt het niet in Terminal, herstart Terminal of log opnieuw in.

#### B. Via nvm

```bash
# nvm installeren (als je het nog niet hebt)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Sluit Terminal en open een nieuw venster (of laad je shell-config opnieuw), daarna:

```bash
nvm install 24
nvm use 24
nvm alias default 24
```

**PATH:** nvm staat niet standaard globaal op PATH; de installer voegt regels toe aan `~/.zshrc`. Controleer dat daar iets staat als:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

Open daarna een **nieuwe** Terminal en verifieer met `node -v`, `npm -v` en `which node`.

De Stream Deck CLI (`streamdeck` / `@elgato/cli`) verwacht `node` en `npm` op je PATH; zonder dat werken `npx streamdeck …` en `npm run pack` niet.

### 3. CLI + project installeren

```bash
npm install -g @elgato/cli   # Stream Deck CLI (streamdeck); soms sudo nodig
npm install
npm run build                # → com.ehvg.streamdeck.sdPlugin/bin/plugin.js
```

Sommige stappen (nodejs.org-installer, globale `npm install -g`) kunnen om **admin** / `sudo` vragen.

## Lokaal ontwikkelen

```bash
npm run watch          # hot-reload + streamdeck restart
```

Plugin linken (eenmalig, met Stream Deck geopend):

```bash
npx streamdeck link com.ehvg.streamdeck.sdPlugin
npx streamdeck dev     # developer mode indien nodig
```

## Private pack (interne install)

```bash
npm run pack
```

Levert `dist/com.ehvg.streamdeck.streamDeckPlugin` op. Deel dit **alleen** via interne kanalen (SharePoint/MDM/private release). Collega’s openen het bestand → Stream Deck installeert lokaal.

**Dit is geen Marketplace-plugin.** Geen Maker Console-publicatie, geen catalogusvermelding, geen auto-update.

## Logo & EHVG-profiel

- Page-background assets: `com.ehvg.streamdeck.sdPlugin/imgs/page-background/`
  - `ehvg-logo.png` (960×576)
  - `ehvg-logo-480x288.png` (480×288)
- Key-iconen zijn **transparant** (licht/oranje) zodat het logo erdoorheen zichtbaar blijft.
- Profiel-exportstappen (DeviceType 0, Module 15): zie [`com.ehvg.streamdeck.sdPlugin/profiles/README.md`](com.ehvg.streamdeck.sdPlugin/profiles/README.md).

Het bestand `profiles/ehvg.streamDeckProfile` moet **eenmalig op de Mac** geëxporteerd worden (Stream Deck-app + hardware). De manifest-`Profiles`-entry staat al klaar; zonder dat bestand ontbreekt alleen de gebundelde layout.

## Wat Patrick eenmalig op de Mac moet doen

1. **Rechten:** eerste Teams-knop → macOS kan om Automatisering vragen → toestaan; zo niet (of gele driehoek): zie troubleshooting hieronder.
2. **Profiel + logo:** layout zetten, page background uit `imgs/page-background/ehvg-logo.png`, exporteren naar `profiles/ehvg.streamDeckProfile` (stappen in `profiles/README.md`).
3. **Pack opnieuw** (`npm run pack:strict`) en intern verdelen.

## Troubleshooting Teams-knoppen (gele driehoek)

De gele driehoek / uitroepteken op een key is Stream Deck **`showAlert()`**: de AppleScript-hotkey (`osascript` via `run-teams-hotkey`) is mislukt. Succes toont kort een vinkje (`showOk`); de mic/cam/hand-state is alleen **optimistisch** (geen echte Teams-API).

Typische oorzaken: ontbrekende macOS-rechten, Teams niet geïnstalleerd/niet te activeren, of System Events mag geen toetsen sturen.

### 1. Automatisering (verplicht)

**Sonoma / Sequoia — exact pad:**

1. Open **Systeeminstellingen** (System Settings).
2. Ga naar **Privacy en beveiliging** → **Automatisering** (Privacy & Security → Automation).
3. Zoek in de lijst links o.a. **Stream Deck** (soms *Elgato Stream Deck*). Bij Linked Development kan ook **node** of de plugin-runtime verschijnen.
4. Zet aan wat nodig is om andere apps aan te sturen, met name:
   - **Systeemgebeurtenissen** / **System Events**
   - **Microsoft Teams** (of *Microsoft Teams (work or school)*)
5. Sluit Stream Deck volledig (Cmd+Q) en open opnieuw. Druk opnieuw op een Teams-knop.

Als er **geen** popup was bij de eerste druk: macOS toont die vaak één keer; daarna moet je het handmatig in Automatisering aanzetten zoals hierboven.

### 2. Toegankelijkheid (indien keystrokes blijven falen)

System Events heeft soms ook Toegankelijkheid nodig om `keystroke` te sturen:

1. **Systeeminstellingen** → **Privacy en beveiliging** → **Toegankelijkheid** (Accessibility).
2. Zet **Stream Deck** (en zo nodig **osascript** / **Terminal** als je daar test) **aan**.
3. Stream Deck herstarten, opnieuw Teams-knop testen.

### 3. Sneltest in Terminal

Teams desktop open laten, daarna:

```bash
# Mag Teams activeren? (kan Automatisering vragen voor Terminal)
osascript -e 'tell application id "com.microsoft.teams2" to activate'

# Mag System Events de frontmost app lezen?
osascript -e 'tell application "System Events" to get name of first application process whose frontmost is true'
```

Werkt dit in Terminal maar niet vanaf de Stream Deck-key → rechten ontbreken voor **Stream Deck**, niet voor Terminal. Falen beide met een permission-/(-1743)/not authorized-fout → eerst Automatisering (en zo nodig Toegankelijkheid) fixen, dan Stream Deck herstarten.

### 4. Teams zelf

- Microsoft Teams **desktop** moet geïnstalleerd zijn (bundle `com.microsoft.teams2` of `com.microsoft.teams`).
- Browser-only Teams werkt niet met deze hotkeys.

## Structuur

```
com.ehvg.streamdeck.sdPlugin/   # runtime plugin
  manifest.json
  imgs/                         # icons + page-background logo
  ui/open-url.html              # property inspector
  profiles/                     # ehvg.streamDeckProfile (na Mac-export)
src/
  plugin.ts
  actions/                      # Teams + Open URL
  mac/run-teams-hotkey.ts       # osascript wrapper
```

---

_Initial PR branch `cursor/ehvg-plugin-bde0` — 2026-11-20._
