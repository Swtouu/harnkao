# HarnKao — Session Summary (2026-06-21)

## Project

Single-file trip expense splitter web app at `/Users/wat/Documents/Project/harnkao/`.  
Thai: หารข้าว ("split the rice/bill"). No build step — vanilla HTML/CSS/JS, CDN deps only.  
Deployed on Netlify. `netlify.toml` rewrites `/` → `/HarnKao.html`.

---

## What was done this session

### 1. Feature additions (`HarnKao.html` fully rewritten, ~1990 lines)

All "high value" features added:

| Feature | Detail |
|---------|--------|
| Trip name + dates | Card at top; saved on keystroke; appears in PDF header |
| Multiple trips | `hk_trips` index + `hk_trip_{id}` per-trip in localStorage; My Trips modal; migration from old `harnkao` key |
| Per-expense currency | Rate snapshotted at select time; `currencyRate=null` → excluded from math + warning banner |
| Per-expense date | Optional ISO date field per expense |
| Custom splits | Per-person amount inputs in expense currency; live total indicator (green/red) |
| Settle-up tracking | "Mark paid" toggle per settlement row; clears on any balance-affecting edit |
| Export PDF | `buildPrintHTML()` → Blob URL → new tab → auto-print after `document.fonts.ready` + 400 ms |
| Export PNG | html2canvas lazy-loaded from cdnjs; `scale:2`; `onclone` hides toolbar + propagates theme |

### 2. Bug fixes (5 found by `/scrutinize`, all fixed)

| # | Severity | Bug | Fix |
|---|----------|-----|-----|
| 1 | Blocker | `x.cr\|\|1` coerced `null` rate to `1` on shared-trip load → wrong THB conversion | `x.cr!==undefined?x.cr:1` (both `loadFromId` + `tryLoadFromUrl`) |
| 2 | Major | `esc()` converts `'` to `&#39;`; HTML parser decodes it back before JS evaluates onclick — names with apostrophes broke handlers | All 4 handlers (`removePerson`, `toggleSplit`, `updateCustomAmount`, `toggleSettled`) switched to `data-*` + `this.dataset.*` |
| 3 | Major | PNG export captured the Export toolbar buttons | Added `doc.querySelectorAll('.export-bar').forEach(el=>el.style.display='none')` to `onclone` |
| 4 | Minor | Dead `toTHB()` function — defined but never called | Deleted |
| 5 | Minor | `getAv` negative modulo: `indexOf` returns `-1` for removed payers; `-1 % 8 === -1` in JS → `undefined` avatar class | `((i%AV.length)+AV.length)%AV.length` |

### 3. PWA support

New files: `manifest.json`, `sw.js`  
SW cache: `harnkao-v2`  
Shell pre-cached: `HarnKao.html`, `manifest.json`, `Harnkao.png`  
Strategies: cache-first (shell), stale-while-revalidate (Google Fonts), network-only (`api.jsonbin.io`, `api.exchangerate-api.com`, `cdnjs.cloudflare.com`)  
Meta tags added to `<head>`: `theme-color`, `mobile-web-app-capable`, `apple-mobile-web-app-*`, `manifest`, `apple-touch-icon`  
SW registration at end of `<script>` (`.catch(()=>{})` — silent fail on `file://`)

### 4. Logo update

`Harnkao.png` (1254×1254 px, official logo) replaced emoji 🍚 in header.  
Used in: header `.logo-icon`, `manifest.json` icons (both `any` + `maskable`), `<link rel="apple-touch-icon">`.  
`icon.svg` (old SVG placeholder) is now unused — safe to delete.  
SW cache bumped from `harnkao-v1` → `harnkao-v2` to ensure installs pick up new logo.

### 5. Files created/updated

| File | Status |
|------|--------|
| `HarnKao.html` | Full rewrite + bug patches + PWA meta + logo |
| `manifest.json` | New — PWA manifest |
| `sw.js` | New — service worker |
| `CLAUDE.md` | New — project guide for Claude Code |
| `docs/20260621_harnkao_feature_additions.md` | New (gitignored) — changelog with revisions A/B/C |
| `.gitignore` | `docs/` added |
| `Harnkao.png` | Existing — now used as logo everywhere |
| `icon.svg` | Existing — now unused |

---

## Current state schema

```js
state = {
  id: 'trip_abc123',
  tripName: '', tripDateStart: '', tripDateEnd: '',
  people: ['Alice', 'Bob'],
  expenses: [{
    id: 1234567890,          // Date.now()
    desc: '', date: '',
    amount: '', currency: 'THB',
    currencyRate: 1,         // null = rate unavailable → excluded from settlements
    payer: '',
    splitMode: 'equal',      // 'equal' | 'custom'
    splitWith: [],
    customAmounts: {}        // {name: amountString} for custom mode
  }],
  settledTransfers: ['Alice→Bob']  // cleared on any balance edit
}
```

## localStorage keys

| Key | Value |
|-----|-------|
| `hk_trips` | Trip index array |
| `hk_trip_{id}` | Full trip state |
| `hk_current` | Active trip ID |
| `hk_rates` | `{ts, rates}` — 1-hour cached exchange rates |
| `hk_currency` | Last selected display currency |
| `hk_theme` | `'light'` \| `'dark'` |
| `harnkao` | Legacy format — auto-migrated on first load |

---

## Key invariants (must not break)

- Never embed person names as JS string literals in `onclick`. Always use `data-*` + `this.dataset.*`.
- `currencyRate` snapshotted at currency-select time. Never recalculate from global `rates` at settlement time.
- `settledTransfers` must be cleared on any edit to: amount, currency, payer, splitWith, customAmounts.
- `buildPrintHTML()` duplicates settlement calc from `renderSummary()` — keep both in sync.
- Bump `CACHE` in `sw.js` when shell files change before deploy.

---

## Potentially next

- Delete `icon.svg` (confirmed unused)
- Test PWA install flow on mobile (requires Netlify deploy)
- Consider adding expense categories / tags
- Consider sharing improvements (currently jsonbin.io — requires API key in URL)
