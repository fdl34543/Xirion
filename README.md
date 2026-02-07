
<p align="center">
  <img src="./assets/xirion-logo.png" alt="Xirion Logo" width="260">
</p>

<p align="center">
  <strong>Xirion — Autonomous Crypto Intelligence & Execution Agent</strong>
  <br>
  <sub>On-chain + Community Intelligence for Solana</sub>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0-blue" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen" />
  <img src="https://img.shields.io/badge/solana-mainnet%20%7C%20devnet-purple" />
  <img src="https://img.shields.io/badge/license-MIT-yellow" />
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a> •
  <a href="#features">Features</a> •
  <a href="#cli">CLI</a> •
  <a href="#telegram-bot">Telegram Bot</a> •
  <a href="#architecture">Architecture</a>
</p>

---

## What is Xirion?

**Xirion** is an **autonomous AI agent** built on Solana that continuously **observes, analyzes, and executes decisions** across crypto markets.

Xirion combines:
- **On-chain intelligence**
- **Community intelligence (X & Telegram)**
- **Autonomous decision-making**
- **Optional real transaction execution**

Xirion can operate in multiple modes:
- DAO treasury management  
- Retail yield optimization  
- Token & memecoin alpha detection, analyze, and trading 
- Prediction market arbitrage  

All powered by **one unified intelligence core**.

---

## Core Problem

Crypto capital today is:
- Fragmented
- Reactive
- Overwhelmed by noise

Specifically:
- DAO treasuries sit idle or misallocated
- Retail users can’t manage yield safely
- Traders are late to memecoin & narrative pumps
- Community signals (X, Telegram) are ignored or misread

---

## Solution

**Xirion acts as an always-on autonomous agent** that:

* Scans on-chain activity across Solana in real time
* Monitors community behavior on **X & Telegram**
* Tracks **prediction market odds across platforms**
* Scores **risk vs opportunity** across yield, tokens, and events
* Explains every decision with transparent reasoning
* Executes actions when permissions allow (otherwise alerts)

> **Observe → Score → Decide → Execute → Log**

Xirion is designed to **continuously manage capital and detect alpha**
across **DAO treasuries, retail yield, token markets, and prediction markets**
using a single unified intelligence core.

---

## Features

### Intelligence Core

* On-chain momentum analysis (volume, liquidity, holders)
* Wallet & dev behavior tracking
* Liquidity & volume spike detection
* Time-based decay & anomaly detection
* Cross-market signal normalization

---

### Community Intelligence

* **X (Twitter)** velocity & engagement quality
* **Telegram** group health, growth & admin behavior
* Bot / shill detection
* Organic vs coordinated hype scoring
* Community sentiment vs price divergence

---

### Token & Memecoin Intelligence

* New token discovery (DEX & memecoin launch)
* Early momentum detection
* Rug-risk analysis (LP, dev wallet, concentration)
* **Pump Probability Score (0–100)**
* Risk classification (ACCUMULATE | MONITOR | AVOID)

---

## 🔍 Token & Memecoin Analysis (CLI Output)

Xirion provides a **clear, actionable analysis** for tokens and memecoins by combining on-chain signals, market data, and AI-driven reasoning.

### Example Output

```text
TrumpetSwan (TrumpSwan)
Logo: https://logo.moralis.io/solana-mainnet_8q96A4hmV5YZ9YypN8EHx76ySrRuwUmS8XUHmduGpump.webp

Risk Analysis
Honeypot Risk      [████░░░░░░░░░░░░░░░░] 20%
Rug Pull Risk      [██████░░░░░░░░░░░░░░] 30%
Liquidity Risk     [████████████████░░░░] 80%
Concentration Risk [███████░░░░░░░░░░░░░] 35%

Overall Risk: 51.25%

Recommendation: MONITOR

AI Analysis:
The token shows elevated liquidity risk, which significantly impacts its overall risk profile.
```

---

## 📌 Recommendation Labels

Xirion translates risk scores into **clear decision guidance**:

* **ACCUMULATE**
  Risk is relatively low. Token conditions are healthy enough to consider gradual entry.

* **MONITOR**
  Mixed signals. Potential opportunity exists, but risks require close observation.

* **AVOID**
  High risk detected. Entry is not recommended under current conditions.

---

## 🧠 How Xirion Decides

* **Heuristic Analysis**
  Deterministic risk signals (honeypot indicators, liquidity depth, concentration, pump.fun status).

* **AI Reasoning (Agent Xerion)**
  Normalizes risk scores, evaluates uncertainty, and provides human-readable explanations.

* **Rule-Based Recommendation**
  Final decision (`ACCUMULATE / MONITOR / AVOID`) is derived from risk thresholds — not hallucinated by AI.

---

## 🎯 Why This Matters

* Transparent & auditable decisions
* Safe-by-design (AI explains, rules decide)
* Suitable for CLI, Telegram, and automated agent workflows
* Hackathon-ready with real-world utility

---

### Prediction Market Intelligence

* Real-time odds monitoring across markets
* Cross-market price divergence detection
* Event sentiment vs implied probability analysis
* Expected value (EV) & risk-adjusted scoring
* Optional micro-arbitrage execution

Supported platforms:

* **Polymarket**
* **Kalshi**
* **Opinion**

---

### Decision Engine

* Opportunity ranking across domains:

  * Yield
  * Tokens & memecoins
  * Prediction markets
* Context-aware execution logic:

  * Wallet type
  * Risk profile
  * Strategy permissions
* Full decision & reasoning logs
* Dry-run or live execution

---

## Unified Agent Behavior

Xirion operates as a **single autonomous agent** with multiple strategies
running simultaneously.

Instead of switching modes, Xirion adapts its behavior based on:

* Wallet type (treasury, retail, trading)
* Risk profile
* Strategy permission
* Market conditions (DeFi, tokens, prediction markets)

This design avoids fragmentation and allows Xirion to continuously
optimize capital and detect opportunities across **DAO treasuries,
retail vaults, trading markets, and prediction markets** —
using one shared intelligence core.

---

## Solana & Market Stack

### Solana DeFi

* Swap & routing: **Jupiter**
* Yield: **Kamino, Marinade, Sanctum**
* Memecoin discovery: **pump.fun**
* On-chain indexing: **Helius**
* Oracle data: **Pyth**
* MEV / priority fees (optional): **Jito**

### Prediction Markets

* **Polymarket**
* **Kalshi**
* **Opinion** 

---

## Quick Start

### 1. Install

```bash
git clone https://github.com/your-org/xirion.git
cd xirion
npm install
cp .env.example .env

npm run build
npm install -g .
```

### 2. Configure Environment

```env
# Core
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
OPENAI_API_KEY=
MORALIS_API_KEY=

# Agent Behavior
XIRION_RISK_PROFILE=medium      # low | medium | high
XIRION_EXECUTION=true           # false = dry-run
XIRION_MAX_EXPOSURE=0.15        # 15% per strategy
```

---

## CLI

Xirion is primarily controlled via CLI.

```bash
npx xirion
or
xirion
```

### Register Telegram Bot via CLI

This will:

* Validate bot token
* Save config locally
* Enable alerts & commands via Telegram

---

## Telegram Bot

Xirion supports **Telegram as a control & alert interface**.

### Supported Commands

```
/start          → Initialize bot, show Xirion overview & main menu
/status         → Show current agent status
/scan           → Trigger token scan
/decisions      → View recent agent decisions & reasoning
/alerts on      → Enable Telegram alerts
/alerts off     → Disable Telegram alerts
/wallet         → Open wallet menu (balances, stats, funding)
```

Telegram bot can be:

* Registered via CLI

---

## Architecture

```
  ┌───────────────────────────────────────────────────────────────────────────┐
  │                                   GATEWAY                                 │
  │        CLI • Telegram Bot • HTTP API • Auth • Rate Limiting               │
  └─────────────────────────────────────┬─────────────────────────────────────┘
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                               ▼
┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
│     INTERFACES      │       │     XIRION CORE     │       │        FEEDS        │
│                     │       │   (Single Agent)    │       │                     │
├─────────────────────┤       ├─────────────────────┤       ├─────────────────────┤
│ CLI                 │       │ Observe             │       │ On-chain Data       │
│ Telegram Bot        │       │ Score               │       │ - Solana RPC        │
│ Commands & Alerts   │       │ Decide              │       │ - Helius            │
│                     │       │ Act                 │       │                     │
│                     │       │                     │       │ DeFi & Market Data  │
│                     │       │ Memory              │       │ - Jupiter           │
│                     │       │ Strategy Bus        │       │ - pump.fun          │
│                     │       │                     │       │ - Pyth              │
│                     │       │                     │       │                     │
│                     │       │                     │       │ Prediction Markets  │
│                     │       │                     │       │ - Polymarket        │
│                     │       │                     │       │ - Kalshi            │
│                     │       │                     │       │ - Opinion           │
│                     │       │                     │       │                     │
│                     │       │                     │       │ Community           │
│                     │       │                     │       │ - X                 │
│                     │       │                     │       │ - Telegram          │
└─────────────────────┘       └─────────────────────┘       └─────────────────────┘
        │                               │                               │
        └───────────────────────────────┼───────────────────────────────┘
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        ▼                               ▼                               ▼
┌─────────────────────┐       ┌─────────────────────┐       ┌─────────────────────┐
│   DECISION ENGINE   │       │      EXECUTION      │       │       ALERTING      │
│                     │       │                     │       │                     │
├─────────────────────┤       ├─────────────────────┤       ├─────────────────────┤
│ Risk Scoring        │       │ DEX Trading         │       │ Telegram Push       │
│ Opportunity Ranking │       │ (Jupiter)           │       │ CLI Output          │
│ Context Awareness   │       │                     │       │ Webhooks            │
│ (wallet & market)   │       │ Yield Deployment    │       │                     │
│                     │       │ (Kamino, etc)       │       │                     │
│ Reasoning Log       │       │                     │       │                     │
│                     │       │ Prediction Trades   │       │                     │
│                     │       │ - Polymarket        │       │                     │
│                     │       │ - Kalshi            │       │                     │
│                     │       │ - Opinion           │       │                     │
│                     │       │                     │       │                     │
│                     │       │ Dry-run / Live      │       │                     │
└─────────────────────┘       └─────────────────────┘       └─────────────────────┘
                                        │
                     ┌──────────────────┴──────────────────┐
                     ▼                                     ▼
             ┌─────────────────────┐               ┌─────────────────────┐
             │     SOLANA DeFi     │               │        STORAGE      │
             │                     │               │                     │
             ├─────────────────────┤               ├─────────────────────┤
             │ Jupiter             │               │ Agent State         │
             │ Kamino              │               │ Decisions           │
             │ Marinade            │               │ Scores              │
             │ Sanctum             │               │ Logs                │
             │ pump.fun            │               │ Market Snapshots    │
             └─────────────────────┘               └─────────────────────┘

```

---

## Safety & Transparency

* Dry-run mode by default
* Explicit permission for execution
* Configurable exposure limits
* Full decision reasoning logs
* Kill switch via CLI or env

---

## Development

```bash
npm run dev        # Development
npm run build      # Production build
npm run lint       # Lint
npm run test       # Tests
```

---

## Roadmap

* Multi-wallet agent swarm
* DAO governance integration
* On-chain reputation scoring
* Strategy marketplace
* Cross-agent coordination

---

## License

MIT — see `LICENSE`

---

<p align="center">
  <strong>Xirion</strong>
  <br>
  <sub>Autonomous intelligence for crypto-native capital</sub>
</p>
```


