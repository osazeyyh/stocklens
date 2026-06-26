# StockLens

A neobank-style stock return estimator for the Nigerian Exchange (NGX) and US markets. Enter a hypothetical investment amount, pick a time period, and see how top stocks would have performed — ranked by historical return, with confidence scores, sparklines, and deep per-stock analysis.

**Live:** [stocklens-tawny.vercel.app](https://stocklens-tawny.vercel.app)

> Educational only — not financial advice.

---

## Features

- **Return estimation** — enter any amount in NGN or USD and instantly see projected returns across top stocks
- **Market toggle** — switch between NGX (Nigerian Exchange) and US markets
- **Period toggle** — 1Y, 3Y, and 5Y historical windows
- **Stock cards** — sparkline, return %, tag badge, and confidence score at a glance
- **Top performer teaser** — highlights the #1 stock and what your amount would have grown to
- **Detail drawer** — tap any card to open a full slide-up panel with:
  - Full price history chart (Recharts area chart with portfolio value overlay)
  - Confidence score (Sharpe ratio + max drawdown + consistency, scored 0–100)
  - Hold period analysis — avg return and win rate for 3m / 6m / 1Y / 2Y / 3Y windows
  - Stock metadata (P/E, market cap, 52-week range, dividend yield)
  - Sell checklist based on the historically optimal hold window
- **Stock tags**
  - `quick-trade` — recent momentum + volume spike (>6% return in last 20 days, volume 1.25× baseline)
  - `long-hold` — consistent performer
  - `hidden-gem` — small-cap stock with >20% return
- **Mock data fallback** — seeded geometric Brownian motion (GBM) fallback when Yahoo Finance is blocked (e.g. on Vercel free tier)

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties (dark theme) |
| Charts | Recharts |
| Data | yahoo-finance2 + seeded GBM mock fallback |
| UI primitives | Radix UI (Dialog, Slider, Tooltip) |
| Icons | Lucide React |
| Animation | Framer Motion |

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                  # Main page — amount input, toggles, stock grid, drawer
│   ├── layout.tsx
│   ├── globals.css               # CSS custom properties (dark theme tokens)
│   └── api/
│       ├── top-stocks/route.ts   # Fetches + ranks stocks by historical return
│       └── stock/[ticker]/route.ts  # Full 5Y history + quote for detail drawer
├── components/
│   ├── StockCard.tsx
│   ├── StockDetailDrawer.tsx     # Radix Dialog slide-up panel
│   ├── HistoricalChart.tsx
│   ├── HoldPeriodAnalysis.tsx
│   ├── ConfidenceBar.tsx
│   ├── StockMeta.tsx
│   ├── Sparkline.tsx
│   ├── MarketPeriodToggle.tsx
│   └── AmountInput.tsx
└── lib/
    ├── ngx-stocks.ts             # NGX stock list (tickers use .LG suffix, e.g. DANGCEM.LG)
    ├── us-stocks.ts              # US stock list
    ├── yahoo-finance.ts          # Yahoo Finance data fetching
    ├── mock-data.ts              # Seeded GBM fallback data
    ├── confidence.ts             # Sharpe ratio + drawdown + consistency → 0–100 score
    ├── calculations.ts           # Optimal hold period computation
    └── format.ts                 # Currency + percent formatters
```

---

## Confidence score

Computed in `src/lib/confidence.ts` from three signals, then bucketed:

| Band | Score |
|---|---|
| High | ≥ 70 |
| Medium | 45 – 69 |
| Low | < 45 |

Signals: annualised Sharpe ratio, max drawdown (capped at 50%), and a consistency score (% of rolling 30-day windows with positive return).

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No API keys required — data is fetched from Yahoo Finance via `yahoo-finance2`. The mock fallback kicks in automatically if Yahoo Finance is unreachable.

---

## Deployment

Deployed on Vercel. The mock data fallback (`src/lib/mock-data.ts`) exists because Yahoo Finance rate-limits requests from Vercel's shared IP ranges. The fallback uses a seeded GBM model so results are deterministic per ticker.
