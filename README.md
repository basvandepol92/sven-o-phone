# Sven-o-phone
Angular 17 app met een startscherm, drie mini-games en een feestelijke splash overlay met confetti. Gebouwd als standalone component-architectuur (geen NgModules) met gescope styles.

## Stack & vereisten
- Node 18+ aanbevolen (ontwikkeld met npm 11.x).
- Angular 17, standalone components, Angular CLI voor build/test.
- Headless Chrome voor unit tests via Karma.

## Snel starten
1) `npm install`
2) `npm start` (of `ng serve`) en open `http://localhost:4200`
3) Optioneel: pas configuraties aan in de configurator (zie Features).

## Scripts
- Dev server: `npm start`
- Build (prod): `npm run build`
- Lint: `npm run lint`
- Tests: `npm test -- --watch=false --browsers=ChromeHeadless`

## Projectstructuur (selectie)
- `src/app/components/start-screen/` – startscherm met game-grid, locks/badges en configurator-trigger.
- `src/app/components/configurator-dialog/` – dialoog om thresholds voor mini-games en voortgang te resetten.
- `src/app/components/splash-overlay/` – standalone splash overlay met sluitknop, backdrop, toetsenbord-ondersteuning en confetti.
- `src/app/services/game-state.service.ts` – unlock/progress tracking, splash state (pending/shown), persistentie.
- `src/app/services/game-config.service.ts` – instelbare thresholds voor de mini-games.
- `assets/images/` – logos en splash-afbeelding.

## Belangrijkste features
- **Startscherm**: toont drie games met lock-status (grijs/disabled) en badges voor behaalde spellen. Kleur en logo per game via style variables.
- **Navigatie**: knoppen roepen `openGame` aan en routeren naar de bijbehorende mini-game route.
- **Configurator**: verborgen shortcut; drie snelle kliks op “Slaap status” openen de configurator. Hiermee kun je thresholds aanpassen en voortgang resetten.
- **Splash overlay**: verschijnt automatisch na het behalen van game 3 als hij nog niet eerder is getoond. Markering gebeurt in `GameStateService` zodat de splash éénmalig verschijnt.
- **Confetti**: loopt zolang de splash zichtbaar is. Sluiten kan via de X-knop of via de backdrop (klik/Enter/Spatie). Output-event `closed` laat de ouder (start-screen) de overlay verbergen.
- **Toegankelijkheid**: interacties op de backdrop zijn focusable en reageren op Enter/Spatie; sluitknop heeft aria-label.

## State & configuratie
- **GameStateService**: regelt unlock status, completed status en flags voor de splash (pending/shown). Wordt gebruikt om de overlay te tonen of te verbergen.
- **GameConfigService**: bevat thresholds (minScoreToWin, requiredCorrectCount, etc.) en biedt reset naar defaults. De configurator dialoog leest/schrijft deze waarden.

## Styling
- Component-scoped SCSS. Startscherm en splash hebben eigen styles (`start-screen.component.scss`, `splash-overlay.component.scss`).
- Game-kaarten gebruiken CSS custom properties voor logo- en kleur-injectie.
- Splash gebruikt een fixed overlay, blur-backdrop en confetti-animatie.

## Testen & linten
- Unit tests via Karma/Jasmine: `npm test -- --watch=false --browsers=ChromeHeadless`
- Lint via angular-eslint: `npm run lint`
- Nieuwe componenten: voeg een spec toe in dezelfde map; houd template-a11y rules in het oog (click-handlers vereisen focus/keyboard ondersteuning).

## Deploy
- Productie build: `npm run build` (output in `dist/`).
- Standaard Angular CLI output kan worden gedeployed op statische hosting (bijv. Netlify, Vercel, GitHub Pages).
