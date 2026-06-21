# CLAUDE.md — HarnKao

Single-file trip expense splitter web app. No build step, no framework, no dependencies beyond Google Fonts and two optional runtime APIs.

## Commands

```bash
# Open directly in browser (basic testing — PWA/SW won't work on file://)
open HarnKao.html

# Serve locally for full PWA testing (SW + manifest require HTTP)
npx serve .
# or
python3 -m http.server 8080
```

## Project files

| File | Purpose |
|------|---------|
| `HarnKao.html` | The entire app — HTML, CSS, and JS in one file |
| `manifest.json` | Web App Manifest (PWA install metadata) |
| `sw.js` | Service worker — offline caching |
| `Harnkao.png` | Official app logo (1254×1254 px), used in header and as PWA icon |
| `netlify.toml` | Deploys root dir; rewrites `/` → `/HarnKao.html` |
| `icon.svg` | Superseded by `Harnkao.png` — safe to delete |
| `docs/` | Changelog documents (gitignored) |

## Architecture

Everything lives in `HarnKao.html`. JS is organised into sections delimited by block comments:

- **Constants** — `SYM`, `NODEC`, `CURRENCIES`, `AV`
- **Currency & rates** — `fetchRates`, `updateRateBanner`, `fmt`, `fmtCur`, `onCurrencyChange`
- **Theme** — `toggleTheme`, `loadTheme`
- **State** — global `state` object; `getAv`, `findExp`, `avEl`
- **Trips management** — `genId`, `getTripsIdx`, `save`, `migrateState`, `newTrip`, `switchTrip`, `deleteTrip`, `syncTripInfoUI`, `renderTripsModal`
- **People** — `addPerson`, `removePerson`, `renderPeople`
- **Expenses** — `addExpense`, `removeExpense`, `updateExpense`, `toggleSplit`, `setSplitMode`, `updateCustomAmount`, `rerenderCustomTotal`, `customTotalHTML`, `rerenderFooter`, `footerHTML`, `currencyOptionsHTML`, `renderExpenses`
- **Summary** — `toggleSettled`, `renderSummary`
- **Settlement algorithm** — `computeSettlements` (greedy creditor/debtor)
- **Export PDF** — `exportPDF`, `buildPrintHTML`
- **Export PNG** — `exportPNG`, `loadScript`
- **Share** — `shareTrip`, `doShare`, `loadFromId`, `tryLoadFromUrl` (jsonbin.io)
- **Utils** — `copyText`, `showToast`, `esc`
- **Persistence** — `loadState`
- **Init** — async IIFE; SW registration

## State shape

```js
state = {
  id: 'trip_abc123',          // unique ID per trip
  tripName: '',               // freeform trip name
  tripDateStart: '',          // ISO date (YYYY-MM-DD)
  tripDateEnd: '',
  people: ['Alice', 'Bob'],
  expenses: [{
    id: 1234567890,           // Date.now() at creation
    desc: 'Hotel',
    date: '2025-06-21',       // optional
    amount: '3000',
    currency: 'JPY',
    currencyRate: 4.19,       // snapshotted from rates[currency] at select time
    payer: 'Alice',
    splitMode: 'equal',       // 'equal' | 'custom'
    splitWith: ['Alice','Bob'],
    customAmounts: {}         // {name: amountString} when splitMode==='custom'
  }],
  settledTransfers: ['Alice→Bob']  // visually marked paid; cleared on balance edits
}
```

## localStorage keys

| Key | Value |
|-----|-------|
| `hk_trips` | JSON array of trip index entries |
| `hk_trip_{id}` | Full state JSON for each trip |
| `hk_current` | ID of the currently loaded trip |
| `hk_rates` | `{ts, rates}` — cached exchange rates (1-hour TTL) |
| `hk_currency` | Last selected display currency |
| `hk_theme` | `'light'` or `'dark'` |
| `harnkao` | Legacy single-trip format — migrated on first load |

## Currency conversion

Base currency is always THB. `rates` object from `exchangerate-api.com/v4/latest/THB` stores "1 THB = N units".

- Convert expense amount to THB: `amtTHB = parseFloat(expense.amount) / expense.currencyRate`
- `currencyRate` is snapshotted onto the expense when the user changes its currency — never read from global `rates` at calc time
- If `currencyRate` is `null` (rate unavailable when selected), the expense is excluded from settlement math and a warning banner appears
- Offline fallback rates are hardcoded as approximate mid-2025 values

## PWA / Service worker

- Cache name: `harnkao-v2` — bump version when deploying changes to shell files
- Shell files pre-cached on install: `HarnKao.html`, `manifest.json`, `Harnkao.png`
- Google Fonts: stale-while-revalidate (works offline after first load)
- `api.jsonbin.io`, `api.exchangerate-api.com`, `cdnjs.cloudflare.com`: network-only pass-through
- SW only activates over HTTPS; `file://` silently skips registration

## External dependencies (runtime only)

| Service | Used for | Fallback |
|---------|----------|---------|
| `exchangerate-api.com` | Live exchange rates | Hardcoded approximate rates + localStorage cache |
| `jsonbin.io` | Share/load trips by ID | None — share requires network |
| Google Fonts (DM Sans) | Typography | System UI font stack |
| `cdnjs` html2canvas 1.4.1 | PNG export | Lazy-loaded only on first PNG click |

## Deployment

Netlify reads `netlify.toml`. Push to the connected branch → Netlify deploys root dir, serves `HarnKao.html` at both `/HarnKao.html` and `/` (200 rewrite). SW scope covers `/`.

## Key invariants to maintain

- `esc()` must be used for all user-supplied strings rendered into HTML. Never embed person names directly in `onclick` attribute strings — use `data-*` attributes and `this.dataset.*` instead.
- `currencyRate` must be snapshotted at currency-select time, never read from global `rates` during settlement calculation.
- `state.settledTransfers` must be cleared (`= []`) whenever any balance-affecting field changes (amount, currency, payer, splitWith, customAmounts).
- `buildPrintHTML` duplicates the balance/settlement calculation from `renderSummary` — keep both in sync when editing the math.
- Bump `CACHE` constant in `sw.js` whenever shell files change and a deploy is planned.
