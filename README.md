# avarabrands

Static marketing site (`index.html`) plus the **Digital Asset Passport** app — a
mobile-first transaction dashboard for commercial real estate and heavy industrial
equipment deals.

## Asset Passport

| Path | Purpose |
| --- | --- |
| `components/asset-passport/AssetPassport.jsx` | Self-contained dashboard component. Fully data-driven — takes one `asset` record. |
| `components/asset-passport/data/lyricTower.js` | Parsed Lyric Tower listing record. |
| `app/assets/lyric-tower/page.jsx` | Route rendering the passport. |

```bash
npm install
npm run dev     # http://localhost:3000/assets/lyric-tower
```

### Adding another asset

Copy `data/lyricTower.js`, replace the values, and render
`<AssetPassport asset={yourAsset} />`. The component reads everything from the
record — no code changes needed for a new deal.

### Data provenance

Every figure carries a `source` marker rendered as a badge in the UI:

- **Listing** — verbatim from the broker's marketing material.
- **Modeled** — Avarabrands underwriting derived from listing inputs. Assumptions
  are written inline in the data file. Not broker-warranted.

The Lyric Tower model reconciles: the lease roll sums to 385,000 SF, market rent
($22.35/SF) is the size-weighted average of the six disclosed asking rates, opex
ties to $13.75/SF, and the NOI bridge ties to the $58.75M valuation anchor at a
9.34% going-in yield.

### Asset imagery

Set `heroImage` on the asset record (e.g. `"/assets/lyric-tower/hero.jpg"`) to
replace the placeholder slot in the header.
