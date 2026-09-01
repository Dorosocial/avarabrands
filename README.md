# avarabrands

Static marketing site (`index.html`) plus the **Digital Asset Passport** app — an
institutional transaction terminal for commercial real estate and heavy
industrial equipment deals.

## Asset Passport

| Path | Purpose |
| --- | --- |
| `components/asset-passport/AssetPassport.jsx` | The dashboard. Fully data-driven — takes one `asset` record. |
| `components/asset-passport/data/lyricTower.js` | Parsed Lyric Tower listing record. |
| `app/assets/lyric-tower/page.jsx` | Route rendering the passport. |
| `app/globals.css` | Design tokens (`@theme`) — palette and typefaces. |

```bash
npm install
npm run dev     # http://localhost:3000/assets/lyric-tower
```

### Interaction model

The dossier splits into three views driven by React state:

1. **Financial Waterfall** — investor metrics, the live underwriting calculator,
   the filterable lease roll, and marketed suites.
2. **Physical & Component Health** — expandable inspection trays and the asset
   profile.
3. **Due-Diligence Vault** — the exhibit index.

- **Underwriting calculator** — cap rate, LTV and interest rate sliders reprice
  the asset live. NOI is held constant, so price moves inversely with the cap
  rate; the DSCR readout flags `CLEARS` / `TIGHT` / `BREACH` against a 1.25×
  covenant. Debt service is a true 30-year amortising payment, not interest-only.
  Inputs live in the root component, so switching dossier views never discards a
  model the reader has dialled in.
- **Inspection trays** — each integrity row expands to technician notes, service
  timestamps, warranty serials and a remaining-useful-life meter banded against
  expected service life, with a button that opens the underlying exhibit.
- **Lease roll filters** — `Show All` / `Near-Term (2026–2027)` /
  `Anchors & Long-Term (2028+)`. Bars rescale and
  the footer re-foots to the visible set, so a filtered subtotal is always
  correct for what is on screen.
- **Document previews** — any exhibit row opens a modal facsimile. Open exhibits
  show their first page, NDA exhibits show a redacted body, undelivered ones show
  an expected date. Escape or the backdrop closes it.

### Design system

Institutional, not SaaS: bone paper (`#F8F9FA`), navy ink (`#0A192F`), forest
green (`#105B38`) for positive status, ochre for review, oxblood for negative.
Playfair Display for headings, Inter for UI, JetBrains Mono with tabular figures
for every number. Sharp corners, hairline rules, no shadows or gradients.

### Adding another asset

Copy `data/lyricTower.js`, replace the values, and render
`<AssetPassport asset={yourAsset} />`. No code changes needed for a new deal.

### Data provenance

Every figure carries a `source` marker rendered as a badge:

- **As listed** — verbatim from the broker's marketing material.
- **Modeled** — Avarabrands underwriting derived from listing inputs. Assumptions
  are written inline in the data file. Not broker-warranted.

The Lyric Tower model reconciles: the lease roll sums to 385,000 SF, market rent
($22.35/SF) is the size-weighted average of the six disclosed asking rates, opex
ties to $13.75/SF, and the NOI bridge ties to the $58.75M valuation anchor at a
9.34% going-in yield.

### Asset imagery

Set `heroImage` on the asset record (e.g. `"/assets/lyric-tower/hero.jpg"`) to
replace the placeholder slot in the masthead.
