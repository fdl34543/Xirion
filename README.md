
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

## Token & Memecoin Analysis (CLI Output)

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

## Recommendation Labels

Xirion translates risk scores into **clear decision guidance**:

* **ACCUMULATE**
  Risk is relatively low. Token conditions are healthy enough to consider gradual entry.

* **MONITOR**
  Mixed signals. Potential opportunity exists, but risks require close observation.

* **AVOID**
  High risk detected. Entry is not recommended under current conditions.

---

## How Xirion Decides

* **Heuristic Analysis**
  Deterministic risk signals (honeypot indicators, liquidity depth, concentration, pump.fun status).

* **AI Reasoning (Agent Xerion)**
  Normalizes risk scores, evaluates uncertainty, and provides human-readable explanations.

* **Rule-Based Recommendation**
  Final decision (`ACCUMULATE / MONITOR / AVOID`) is derived from risk thresholds — not hallucinated by AI.

---

## Why This Matters

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

## Agent Lifecycle

Each Xirion agent runs as an **independent process** with a single dedicated skill.

### Agent Principles

* **1 Agent = 1 Skill**
* Stateless execution loop (state persisted to disk)
* Crash-safe (can be restarted by supervisor)
* Dry-run or execution mode
* Fully observable via logs & Telegram alerts

Example agent roles:

```
echo-alpha        → Token & memecoin alpha detection
verlion-dao       → DAO treasury monitoring
verge-yield       → Yield optimization
cube-prediction   → Prediction market intelligence
```

---

## Alpha Detection Agent

### Overview

The **Alpha Detection Agent** continuously scans trending tokens on Solana,
analyzes them using on-chain + AI reasoning,
and optionally simulates trade execution.

### Execution Flow

```
alphaDetection agent
        │
        ▼
Moralis Trending Tokens (Top 30)
        │
        ▼
For each token:
    analyzeToken(token)
        │
        ▼
AI config decision (ai/config.ts)
        │
        ├─ no winner → idle
        │
        └─ winner selected
               │
               ▼
        Alpha alert → Telegram
               │
               ▼
        Simulated buy trade
               │
               ▼
        Trade alert → Telegram
```

### Scan Interval

* Default: **once every 1 hour**
* Loop-based execution inside agent process
* No manual `/scan` required for agent mode

---

## Token Analysis

Token analysis is handled by a **fixed, reusable module**:

```
src/agent/analyzeToken.ts
```

Characteristics:

* Deterministic scoring
* Structured JSON output
* AI-assisted reasoning
* No hallucinated decisions
* Safe to call in loops

Each token produces:

* Risk scores
* Confidence score
* Recommendation
* Explanation

---

## AI Decision Configuration

Xirion uses a centralized decision config:

```
src/ai/config.ts
```

Responsibilities:

* Normalize analysis results
* Decide whether a **winner exists**
* Allow **“no winner”** outcome
* Prevent forced decisions
* Shared across all agents

This ensures:

* Consistent behavior
* No over-trading
* Reduced false positives

---

## Alpha Detection & Trading

### Alpha Detection

The alpha agent continuously scans trending tokens and evaluates them using a deterministic scoring model based on:

* Liquidity & market structure
* Holder distribution
* Transaction quality
* Risk indicators (honeypot, rug probability)

The LLM is used **only to explain reasoning**, not to decide execution.

---

### Alpha Trade Execution

Xirion supports **real token swaps** via Jupiter with strict execution controls.

**Key principles:**

* Input exposure is fixed (SOL / USDC), not output token amount
* Trade size is deterministic and derived from confidence score
* AMM pricing determines received token amount
* No blind execution — all trades are gated and logged

### Trade Module

```
src/agent/trade/alphaTrade.ts
```

---
## Execution Modes

Xirion supports three execution modes:

### 1. Dry-run (default)

* Analyze and score tokens
* Log decisions
* No on-chain action

### 2. Sign-only

* Build and sign raw transactions
* Do not broadcast
* Useful for audits and approvals

### 3. Execute (real trade)

* Execute swaps via Jupiter
* Requires explicit enablement
* Protected by execution guards

Execution can be disabled instantly via configuration.

---

## Safety & Risk Controls

When real execution is enabled, Xirion enforces:

* Execution kill switch
* Maximum exposure per trade
* Confidence-based position sizing
* Cooldown to prevent over-trading
* Full transaction audit logs

These controls ensure trades are **intentional, bounded, and explainable**.

---

## Signing & Execution Model

Xirion intentionally separates concerns:

* **SignerAdapter**
  Responsible only for signing raw transactions for known on-chain addresses

* **ExecutionAdapter**
  Responsible for broadcasting or simulating transactions

Payment abstractions (e.g. custodial or x402-based flows) are treated separately from raw on-chain execution.

This design guarantees deterministic behavior and auditability.

---

## What it does:

* Calculates deterministic buy size based on confidence score
* Builds and executes real on-chain swaps via Jupiter (config-gated)
* Signs transactions using the configured signer (no private key exposure)
* Enforces execution safety guards (exposure limits, kill switch)
* Logs full execution details to CLI
* Sends verified trade alerts (including tx hash) to Telegram

### Example CLI Output

```text
[echo-alpha] Executing BUY for alpha token PUMP
[echo-alpha] Confidence=0.9, Score=90
[echo-alpha] BUY EXECUTED 
[echo-alpha] Amount=$1850
[echo-alpha] EntryPrice=$0.004213
[echo-alpha] TxHash=TX_1738853200123
```

---

### Alpha Alert Types

Xirion sends two types of alerts:

#### 1. Alpha Detection Alert

Triggered when a winner token is selected.

Includes:

* Token info
* Score & confidence
* AI reasoning

#### 2. Alpha Trade Alert 

Triggered after simulated buy execution.

Includes:

* Buy amount
* Entry price
* Simulated transaction hash

---

## Agent Supervisor

A supervisor agent can:

* Monitor all running agents
* Detect crashes
* Restart agents automatically
* Provide unified CLI access

This enables **long-running autonomous operation**.

---

## Design Philosophy

Xirion is built around these principles:

* **Autonomous by default**
* **Explainable decisions**
* **Safe execution**
* **Composable agents**
* **Production-first architecture**

It is not a chatbot.
It is an **intelligent execution system**.

---

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
/startagent      → Start agent(s)
/createagent     → Create new agent
/alerts off     → Disable Telegram alerts
/wallet         → Open wallet menu (balances, stats, funding)
```

Telegram bot can be:

* Registered via CLI

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
JUP_API_KEY=

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



