# ScanGuard Phase 1 UI

Eleven React Native screens in burgundy and black. Login and Registration are included as additional screens; the nine coursework screens are Home, Scanner, Scan Result, Security Report, Clean Link, History, Scan Details, QR Generator, and Backup & Restore.

## Start

Extract this folder. Open a terminal in it, then run:

```sh
npm ci
npm start
```

Use Expo SDK 58 with a compatible Expo Go, or `npm run web` for a browser. To generate the browser preview, run npm run preview:build, then open Preview.html.

## What works

- Login and Registration UI with simple local validation. No account is created or stored.
- Four tabs: Home, Scan, History, Create. Home also opens Backup & Restore.
- Sample scanning with URL/text/barcode selection, loading and simulated errors.
- Scan results, clipboard copying, reports and tracking parameter review.
- Local removal of known tracking parameters; other parameters stay intact.
- Session history with search, filters, details and confirmed deletion.
- Actual QR encoding with a small library; the Share action is a UI demonstration only.
- Demo connection, backup, restore confirmation, loading and simulated failures.

No real camera, threat API, Google login, cloud backup or persistent database is connected. Security reports are labelled sample outcomes. Cleaning does not certify safety. Session records and backups reset on reload.

## Learn and edit

Read `LEARNING_GUIDE.md` for the lab mapping, code walkthrough and practice tasks. Read `AI_LOG.md` to document assistance and add your own real changes.

Colours: `src/views/theme/theme.ts`. Shared UI: `src/views/components/UI.tsx`. Screen layouts: `src/views/screens/`. Data and local rules: `src/model/`. State and actions: `src/viewmodels/`. Screen selection/back stack: `src/navigation/AppNavigator.tsx`.

The project keeps the simple state-based navigation from the first version. The labs teach Expo Router; this prototype does not claim to use it. For a later migration, keep the screen components and replace AppNavigator with Router routes.

## Checks and rebuilding the preview

```sh
npm run typecheck
npm run preview:build
```

Physical-device testing is still required before submission. The browser preview is generated from the same React Native source.

Validated with TypeScript, production web export, and browser interaction checks for all nine screens: scan/report/clean, history search/filter/delete, QR validation and Unicode generation, backup/restore/error/retry, and narrow layouts. Physical Android/iOS testing has not been performed.

