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
- Eenmalig: macOS **Automation**-toestemming voor Stream Deck / `osascript` bij de eerste Teams-knop (Systeeminstellingen → Privacy en beveiliging → Automatisering)

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

1. **Automation:** eerste Teams-knop → macOS vraagt Automatisering → toestaan voor Stream Deck.
2. **Profiel + logo:** layout zetten, page background uit `imgs/page-background/ehvg-logo.png`, exporteren naar `profiles/ehvg.streamDeckProfile` (stappen in `profiles/README.md`).
3. **Pack opnieuw** (`npm run pack:strict`) en intern verdelen.

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
