# avarabrands

Static marketing site (`index.html`) plus the **Digital Asset Passport** app — an
institutional transaction terminal for commercial real estate and heavy
industrial equipment deals.

## Asset Passports

Two asset classes on one shared kit.

| Path | Purpose |
| --- | --- |
| `components/asset-passport/shared.jsx` | Primitives and sections common to every asset class — masthead, nav, metric band, integrity trays, exhibit index, document modal, colophon. |
| `components/asset-passport/AssetPassport.jsx` | Commercial real estate: cap-rate underwriting, lease roll, marketed suites. |
| `components/asset-passport/EquipmentPassport.jsx` | Heavy industrial equipment: duty-cycle economics, service intervals, operating sequence. |
| `components/asset-passport/data/lyricTower.js` | Lyric Tower — Class A office, Houston CBD. |
| `components/asset-passport/data/wheelDiscTilter.js` | Wheel disc hydraulic tilter — 1 t, dual platform. |
| `app/globals.css` | Design tokens (`@theme`) — palette and typefaces. |

```bash
npm install
npm run dev     # / lists both passports
```

Anything that names a specific asset type — cap rates, lease rolls, duty cycles —
lives in the passport that owns it. `shared.jsx` holds only what is genuinely
common, which is why the CRE passport's table headers never leak "% NRA" into a
machine dossier.

### The two calculators

A cap rate has no meaning for a machine, so the equipment passport substitutes
the analogous engine rather than reusing the CRE one:

| | Real estate | Equipment |
| --- | --- | --- |
| Sliders | Cap rate, LTV, interest rate | Tilt time (throttle valve), cycles per shift, capex |
| Headline | Implied purchase price | Annual throughput |
| Constraint | DSCR against a 1.25× covenant | Payback against a 24-month hurdle |
| Operational limit | — | Duty utilisation; over 100% the cell cannot meet demand |

### Interaction model

The dossier splits into three views driven by React state:

Each view keeps its own scroll position, so switching context and returning
puts the reader back where they were.

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
- **Document previews** — any exhibit row opens a modal facsimile. Closing by
  any route (Close, Download, backdrop, Escape) returns focus to that exhibit's
  Preview control. Open exhibits
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
