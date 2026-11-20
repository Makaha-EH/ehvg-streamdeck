# EHVG-profiel (Module 15 / DeviceType 0)

Het bestand `ehvg.streamDeckProfile` hoort hier. Zonder Stream Deck-hardware kan dit cloud-agent-werk het **niet** exporteren. Zodra het bestand bestaat, werkt de `Profiles`-entry in `manifest.json` (`Name: "profiles/ehvg"`, `DeviceType: 0`, `AutoInstall: true`).

## Eenmalig op de Mac van Patrick

1. Bouw en link de plugin:
   ```bash
   npm install
   npm run watch
   ```
   (Stream Deck Developer Mode + `streamdeck link` indien nodig.)

2. Open de Stream Deck-app (≥ 7.1) met de **Module 15 keys** aangesloten (classic 5×3 = DeviceType 0).

3. Maak een nieuw profiel, bijv. **EHVG**.

4. Sleep acties op het canvas:
   - Teams Mute, Teams Camera, Teams Raise Hand
   - Open URL-slots (configureer titel + URL in de property inspector)

5. **Page background (logo over alle keys):**
   - Rechtsklik op een key → **Set from file…** (page background)
   - Kies de full-size logo (voorkeur):
     `com.ehvg.streamdeck.sdPlugin/imgs/page-background/ehvg-logo.png` (960×576)
   - Alternatief: `…/ehvg-logo-480x288.png` (480×288)
   - Optioneel: **Use current as default** voor het hele profiel
   - Key-iconen zijn transparant zodat het logo zichtbaar blijft

6. Exporteer het profiel:
   - Voorkeuren → Profiles → rechtsklik **EHVG** → **Export**
   - Sla op als `com.ehvg.streamdeck.sdPlugin/profiles/ehvg.streamDeckProfile`
     (exacte bestandsnaam; naast deze README)

7. Opnieuw packen (met validatie):
   ```bash
   npm run pack:strict
   ```
   (of `npm run pack` als je validatiefouten tijdelijk wilt negeren)

Daarna wordt het profiel bij installatie van de `.streamDeckPlugin` aangeboden (`AutoInstall: true`).
