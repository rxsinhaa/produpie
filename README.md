# FinLit | The LIT Buddy 🛡️
### AI Behavioral Wealth Co-Pilot & Compounding Guardrail

[![Live Application](https://img.shields.io/badge/Live%20Demo-finlit--smoothoperators.vercel.app-71649C?style=for-the-badge&logo=vercel)](https://finlit-smoothoperators.vercel.app/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Google Gemini](https://img.shields.io/badge/AI%20Engine-Gemini%201.5%20Pro%20%26%20Flash-4285F4?style=for-the-badge&logo=google)](https://aistudio.google.com/)
[![SEBI Compliant](https://img.shields.io/badge/SEBI-Zero--PII%20%26%20Fail--Open%20SLA-22c55e?style=for-the-badge&logo=shield)](https://www.sebi.gov.in/)

> **Live Deployment:** [https://finlit-smoothoperators.vercel.app/](https://finlit-smoothoperators.vercel.app/)

---

## 📌 Executive Summary

**FinLit (The LIT Buddy)** is a next-generation, behavioral-finance-driven wealth intelligence platform designed to eliminate the **"SIP Leak"** phenomenon. In retail wealth compounding, investors systematically pause or cancel systematic investment plans during market corrections due to emotional loss aversion. 

By marrying **Explainable AI (XAI)** powered by **Google Gemini (1.5 Flash & 1.5 Pro)** with a **Deterministic Actuarial Math Engine**, **The LIT Buddy** transforms market panics into disciplined wealth-compounding opportunities without cognitive overload.

---

## ⚡ The Core Problem: The "SIP Leak"

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          THE RETAIL SIP TRAP                            │
├─────────────────────────────────────────────────────────────────────────┤
│  1. Market Pullback (-7.5% Dip)                                         │
│  2. Loss Aversion Triggers Anxiety (Prospect Theory)                    │
│  3. Investor Halts Monthly SIP (Forfeiting Discounted NAV Units)         │
│  4. Compounding Runway Breaks ➔ -₹99,583+ Deficit at Target Horizon      │
└─────────────────────────────────────────────────────────────────────────┘
```

When retail investors panic-pause their SIPs during drawdowns, they forfeit **Rupee Cost Averaging (RCA)** benefits—buying fewer units precisely when asset valuations are on sale. **The LIT Buddy** provides an empathetic **Cognitive Circuit Breaker** that translates abstract percentage drawdowns into concrete milestone impacts (e.g. *"+14.5% more units per ₹1,000; pausing delays your 2032 Dream Home by ~3 months"*).

---

## 🌟 Key Features

### 1. 🛡️ The Cognitive Circuit Breaker
- **Calm Behavioral Review**: Intercepts SIP cancellation requests with a calculated 3-second deliberate review period, using calming institutional tones (amber/navy/slate) rather than panic-inducing red badges.
- **Explainable Milestone Delays**: Replaces confusing percentages with concrete time impacts (e.g., *Pausing for 3 months delays your 2032 House Downpayment by ~3 months*).
- **SEBI 3:00 PM Cut-off Warning**: Real-time IST detection that alerts investors when a cancellation during the 2:50 PM – 3:00 PM window shifts execution into a T+1 settlement cycle.

### 2. 🤖 The LIT Buddy AI Suite (Google Gemini)
- **Pre-Pause Consequence Analysis (`gemini-1.5-flash`)**: Rapid, empathetic consequence analysis explaining the Rupee Cost Averaging discount penalty and recommending step-down alternatives.
- **On-Demand Portfolio Health & Risk Audit (`gemini-1.5-pro`)**: Deep quantitative audit analyzing asset allocation drift (e.g., 68% equity vs 70% target), 94% execution regularity, and milestone horizon health.
- **Smart Archetype Classifier (`gemini-1.5-flash`)**: 4-scenario behavioral questionnaire dynamically evaluated to output customized investor risk profiles and mitigation rules.
- **Zero-Error Architecture**: Triple-tier fallback (`Gemini 1.5 Pro` ➔ `Gemini 1.5 Flash` ➔ `Deterministic Math Engine`) ensures zero UI blocking, zero unhandled errors, and sub-200ms SLAs.

### 3. ✂️ Compounding Safety Valves
- **Step-Down SIP (50%)**: Temporarily reduces monthly contributions (e.g., ₹15,000 ➔ ₹7,500/mo) to relieve cashflow stress while preserving over 70% of the compounding trajectory.
- **Skip Single Month**: Skips only the current debit without cancelling the bank auto-debit mandate.
- **Tax-Loss Harvesting (TLH) Analyzer**: Tranche-level tax shield calculation displaying short-term capital loss offsets (20% STCG tax shield under Indian IT Act).

### 4. 📈 Institutional Market Visualizer & Pro Telemetry
- **TradingView Lightweight Charts**: Interactive 180-day time-series NAV simulator rendered in dark mode (`#0c0e12`).
- **Pro Telemetry Drawer**: Institutional analytics tracking tokenized session IDs, SEBI cut-off clocks, fail-open latency monitors, and stress test simulators.

---

## 📐 Mathematical Formulation & Algorithms

### 1. Explainable AI Risk Score Formula
The engine calculates an explainable risk score to determine whether an investor's emotional response breaches their calibrated risk barrier:

$$\text{RiskScore} = w_1 \cdot \text{GoalDeficitScore} + w_2 \cdot \left(\frac{|\text{Drawdown}_{\%}|}{\text{India VIX}}\right) + w_3 \cdot \text{HistDeviationScore}$$

- **$w_1 = 0.45$**: Milestone timeline deficit weight.
- **$w_2 = 0.35$**: Market fear & volatility ratio.
- **$w_3 = 0.20$**: Historical behavioral inconsistency score.

### 2. Rupee Cost Averaging (RCA) Unit Accumulation Advantage
$$\Delta \text{Units}_{\%} = \left( \frac{\text{NAV}_{\text{avg}} - \text{NAV}_{\text{current}}}{\text{NAV}_{\text{current}}} \right) \times 100$$

During a -7.5% market dip with NAV at ₹88.40 vs 6-month average of ₹101.20:
$$\Delta \text{Units}_{\%} = \left( \frac{101.20 - 88.40}{88.40} \right) \times 100 = +14.48\% \approx +14.5\%$$

### 3. Compounded Milestone Deficit
$$\text{Deficit} = \sum_{t=1}^{n} \text{SIP} \cdot (1 + r)^{T - t} - \sum_{t=n+1}^{T} \text{StepDown} \cdot (1 + r)^{T - t}$$

---

## 🛠️ Technology Stack

| Layer | Technology / Library | Purpose |
|---|---|---|
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) | React Server Components, Edge API routes, Turbopack |
| **UI Library** | [React 19](https://react.dev/) | Component architecture, client-side state hooks |
| **Language** | [TypeScript 5.7](https://www.typescriptlang.org/) | End-to-end type safety, strict interface contracts |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Custom Institutional Dark Mode (`#0c0e12`, `#14171f`, `#71649C`) |
| **AI Intelligence** | [@google/generative-ai](https://www.npmjs.com/package/@google/generative-ai) | Google Gemini 1.5 Pro & Flash SDK integration |
| **Data Visualization**| [Lightweight Charts 4.2](https://tradingview.github.io/lightweight-charts/) | High-performance canvas-based financial charts |
| **Icons** | [Lucide React](https://lucide.dev/) | Accessible, sleek icon set |
| **Deployment** | [Vercel](https://vercel.com/) | Edge routing, global CDN, and automated CI/CD |

---

## 📚 Academic Literature & Compliance Sources

The design and engineering of **The LIT Buddy** are grounded in peer-reviewed behavioral finance research and regulatory mandates:

1. **Prospect Theory & Loss Aversion**:
   - *Kahneman, D., & Tversky, A. (1979).* "Prospect Theory: An Analysis of Decision under Risk." *Econometrica*, 47(2), 263–291. [doi:10.2307/1914185](https://doi.org/10.2307/1914185).
   - Explains the asymmetric emotional pain of capital loss ($2.25\times$ greater than equivalent gains) triggering irrational SIP cancellations.

2. **Choice Architecture & Nudge Theory**:
   - *Thaler, R. H., & Sunstein, C. R. (2008).* *Nudge: Improving Decisions About Health, Wealth, and Happiness*. Yale University Press.
   - Informs the 3-second friction delay and gentle step-down defaults.

3. **SEBI Regulatory Circulars & Mandates**:
   - **Mutual Fund Cut-Off Timings**: *SEBI/HO/IMD/DF2/CIR/P/2020/175* — Real-time 3:00 PM IST cut-off rules governing historical NAV allocation vs T+1 settlement cycles.
   - **Zero-PII & Tokenized Data Privacy**: *SEBI Cybersecurity & Data Protection Framework for Intermediaries*.

4. **Rupee Cost Averaging Dynamics**:
   - *Association of Mutual Funds in India (AMFI)* Research Papers on Systematic Investment Plans & Retail Dollar-Cost Averaging Alpha across 10-Year Horizons (13.5% CAGR).

5. **Tax Loss Harvesting Under Indian Law**:
   - *Income-tax Act, 1961 (Govt of India)* — Section 111A (Short Term Capital Gains @ 20%) and Section 112A (Long Term Capital Gains > ₹1.25 Lakhs @ 12.5%) loss set-off provisions.

6. **Google AI & Large Language Models**:
   - *Google DeepMind (2024)* — *Gemini: A Family of Highly Capable Multimodal Models*. Technical documentation for [Gemini 1.5 Flash & Gemini 1.5 Pro](https://ai.google.dev/docs).

---

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/rxsinhaa/produpie.git
cd produpie
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```bash
cp .env.example .env.local
```
Add your Google Gemini API key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
> Obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 👥 Demo Profile

- **Persona:** Rouneet Raj Sinha (`rouneet.sinha@example.com`)
- **Portfolio AUM:** ₹22,10,000 (₹22.1 Lakhs)
- **SIP Regularity Score:** 94% on-time execution
- **Simulated Market Dip:** -7.5% localized mid-cap pullback (NAV ₹88.40 vs ₹101.20)
- **Primary Milestone:** 2032 House Downpayment (Target: ₹25,00,000)

---

## 📄 License
This project is open-source and available under the **MIT License**.
