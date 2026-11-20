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
- Node.js **24+** op je PATH (bij voorkeur via [nvm](https://github.com/nvm-sh/nvm))
- Eenmalig: macOS **Automation**-toestemming voor Stream Deck / `osascript` bij de eerste Teams-knop (Systeeminstellingen → Privacy en beveiliging → Automatisering)

### 1. Node.js 24+ installeren (nvm, voorkeur)

In Terminal:

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

### 2. nvm / Node op PATH (Terminal)

De nvm-installer voegt normaal regels toe aan `~/.zshrc`. Controleer dat daar iets staat als:

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
```

Open daarna een **nieuwe** Terminal. De Stream Deck CLI (`streamdeck` / `@elgato/cli`) verwacht `node` en `npm` op je PATH; zonder dat werken `npx streamdeck …` en `npm run pack` niet.

Verifieer:

```bash
node -v   # → v24.x of nieuwer
npm -v
which node
```

### 3. CLI + project installeren

```bash
npm install -g @elgato/cli   # Stream Deck CLI (streamdeck)
npm install
npm run build                # → com.ehvg.streamdeck.sdPlugin/bin/plugin.js
```

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
3. **Pack opnieuw** (`npm run pack`) en intern verdelen.

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
