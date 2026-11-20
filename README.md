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

## Vereisten (Mac)

- Stream Deck-app ≥ 7.1 + device (Module 15 keys = classic 5×3)
- Node.js **24+** (bijv. via nvm)
- Microsoft Teams desktop
- Eenmalig: macOS **Automation**-toestemming voor Stream Deck / `osascript` bij de eerste Teams-knop (Systeeminstellingen → Privacy en beveiliging → Automatisering)

## Lokaal ontwikkelen

```bash
npm install
npm run build          # → com.ehvg.streamdeck.sdPlugin/bin/plugin.js
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
