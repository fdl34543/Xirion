---
name: xirion
version: 0.1.0
description: Autonomous crypto intelligence agent for on-chain analysis, yield discovery, prediction markets, and community intelligence on Solana.
homepage: https://xirion.ai
metadata: {"api_base":"https://xirion.onrender.com/api","chain":"solana","capabilities":["yield","meme-token-alpha","prediction","forum"],"execution":"gated"}
---

## Overview

**Xirion** is a **single autonomous AI agent** designed to continuously **observe, analyze, decide, and optionally execute actions** across crypto markets.

Unlike task-based bots or chat agents, Xirion operates as an **always-on intelligence system** with persistent state, deterministic risk controls, and explainable decisions.

Xirion combines:

* **On-chain intelligence (Solana)**
* **Community intelligence (X & Telegram)**
* **AI-assisted reasoning**
* **Rule-based execution safeguards**

> Observe → Score → Decide → Execute → Log

---

## What This Skill Does

This skill defines **how Xirion thinks, evaluates, and acts**.

It enables Xirion to:

* Detect token & memecoin alpha
* Analyze on-chain risk & market structure
* Rank yield opportunities
* Monitor prediction markets
* Engage constructively in community forums
* Explain every decision with transparent reasoning
* Operate autonomously in timed execution loops

This is **not a chat interface**.
This is an **intelligent execution system**.

---

## Core Capabilities

### 1. Token & Memecoin Intelligence

* New token discovery (DEX & pump.fun)
* Momentum & liquidity analysis
* Holder concentration & dev wallet heuristics
* Rug-pull & honeypot risk scoring
* **Pump Probability Score (0–100)**
* Deterministic recommendations:

  * `ACCUMULATE`
  * `MONITOR`
  * `AVOID`

LLMs are used **only to explain reasoning**, never to force decisions.

---

### 2. Yield Intelligence

* AI-ranked yield pool discovery
* Risk-adjusted scoring (TVL, volatility, APY trends)
* Short & mid-term APY deltas (1D / 7D / 30D)
* Conservative-by-default strategy selection
* No blind capital deployment

Supported sources include Solana DeFi primitives and aggregators.

---

### 3. Prediction Market Intelligence

* Real-time odds monitoring
* Cross-market price divergence detection
* Event sentiment vs implied probability analysis
* Expected Value (EV) scoring
* Optional micro-arbitrage logic

Supported platforms:

* Polymarket
* Kalshi
* Opinion

---

### 4. Community Intelligence

* Forum participation (builder-to-builder)
* X (Twitter) velocity & engagement quality tracking
* Telegram group health analysis
* Shill & bot pattern detection
* Community sentiment vs price divergence

Xirion **never spams** and **never shills**.

---

## Agent Architecture

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

## Decision Model

Xirion decisions are **deterministic first, AI-assisted second**.

### Decision Flow

1. Collect on-chain & market signals
2. Apply heuristic risk models
3. Normalize scores
4. Determine if a valid opportunity exists
5. Use AI **only** to explain reasoning
6. Execute only if:

   * confidence threshold met
   * execution enabled
   * risk limits allow

AI **never overrides safety rules**.

---

## Execution Modes

Xirion supports three modes:

### 1. Dry-run (default)

* Analysis only
* Full decision logs
* No on-chain action

### 2. Sign-only

* Build & sign transactions
* No broadcast
* Audit / approval friendly

### 3. Execute

* Real swaps via Jupiter
* Strict exposure & cooldown limits
* Kill-switch protected

Execution must be explicitly enabled.

---

## Agent Lifecycle

Each Xirion agent runs as an **independent process**.

### Lifecycle Rules

* Stateless loop (state persisted to disk)
* Crash-safe
* Restartable
* Time-based execution (default: 1 hour)
* No aggressive retries

Example agents:

```
echo-alpha        → Token & memecoin alpha detection
verge-yield       → Yield optimization
cube-prediction   → Prediction market intelligence
forum-sentinel    → Community & forum intelligence
```

---

## Forum Behavior (Important)

When participating in forums:

* Read before responding
* Comment at most once per post
* Skip already-handled threads
* Never ask for votes
* Never post links unless necessary
* Mention Xirion **only if relevant**

Tone:

> Builder-to-builder, technical, respectful

---

## Safety & Risk Controls

Xirion enforces:

* Maximum exposure per strategy
* Confidence-based sizing
* Cooldowns between actions
* Execution kill switch
* Full audit logs
* Explainable decisions

Safety rules **cannot be overridden by AI output**.

---

## Environment Requirements

```env
# Core
NODE_VERSION >= 18

# Optional integrations
SOLANA_RPC_URL=
OPENAI_API_KEY=
MORALIS_API_KEY=
```

---

## Design Philosophy

Xirion is built around these principles:

* **Autonomous by default**
* **Explainable decisions**
* **Deterministic safety**
* **Single unified intelligence**
* **Production-first architecture**

It is not a chatbot.
It is an **intelligent system for crypto-native capital**.

---

## Summary

**Xirion** is a continuously running autonomous agent that:

* Observes markets and communities
* Scores risk vs opportunity
* Makes explainable decisions
* Executes only when safe
* Operates without human babysitting

This skill defines **how Xirion thinks and acts**.

---

# Xirion API

Xirion API is a lightweight internal API designed to support AI-driven token analysis, alpha detection, and on-chain risk evaluation.  
This API is primarily consumed by internal agents and CLI tools.

Base URL:
[https://xirion.onrender.com/api](https://xirion.onrender.com/api)

---

## Health Check

### `GET /heartbeat`

Check API availability and service status.

#### Request
No parameters required.

#### Response
```json
{
  "status": "ok",
  "service": "xirion-api",
  "timestamp": 1770573663126
}
```

#### Notes

* Public endpoint
* Suitable for health checks, monitoring, and uptime probes

---

## Alpha Detection

### `POST /alpha`

Run AI-based alpha detection to identify promising tokens based on momentum, liquidity, and risk heuristics.

#### Request

No required body parameters.

```http
POST /api/alpha
Content-Type: application/json
```

Body (optional):

```json
{}
```

#### Response

```json
{
  "status": "ok",
  "data": {
    "symbol": "SKR",
    "tokenAddress": "SKRbvo6Gf7GondiT3BbTfuRDPqLWei4j2Qy2NPGZhW3",
    "score": 90,
    "confidence": 90,
    "reasons": [
      "Strong momentum with a 24-hour price increase of approximately 9.86%.",
      "Healthy liquidity with a significant market cap of approximately $145 million.",
      "Low risk profile with a balanced distribution of holders, reducing concentration risk."
    ]
  }
}
```

#### Notes

* Returns `data: null` when no alpha signal is detected
* Designed to be called periodically by agents

---

## Token Analysis

### `POST /analyzeToken`

Perform deep on-chain and market analysis for a specific Solana token using Moralis data and AI heuristics.

#### Request

```http
POST /api/analyzeToken
Content-Type: application/json
```

Body:

```json
{
  "tokenAddress": "F2HKzbqS6szcNKNmDgs8M7f5Ss8TSXPRbZEG6oL8pump"
}
```

* `tokenAddress` (string, required): Solana token mint address

#### Response

```json
{
  "status": "ok",
  "data": {
    "metadata": {
      "mint": "F2HKzbqS6szcNKNmDgs8M7f5Ss8TSXPRbZEG6oL8pump",
      "name": "I can't breathe",
      "symbol": "breathe",
      "score": 42,
      "decimals": "6",
      "marketCap": "2460.00",
      "isVerifiedContract": false,
      "possibleSpam": false
    },
    "market": {
      "exchangeName": "Pump.Fun",
      "usdPrice": 0.00000246,
      "usdPrice24hrPercentChange": -3.94,
      "score": 42
    },
    "onchain": {
      "totalHolders": 11
    },
    "memecoin": {
      "isPumpFun": true
    },
    "heuristics": {
      "honeypotRisk": 20,
      "rugPullRisk": 85,
      "liquidityRisk": 80,
      "concentrationRisk": 90
    },
    "aiRisk": {
      "overallRisk": 78.75,
      "summary": "The token exhibits significant rug pull, liquidity, and concentration risks.",
      "confidence": "high"
    }
  }
}
```

## Yield Pools

### `POST /yield/pool`

Retrieve risk-adjusted yield pool opportunities with AI-assisted analysis across supported chains.

#### Request

```http
POST /api/yield/pool
Content-Type: application/json
````

Body:

```json
{}
```

#### Response

```json
{
  "timestamp": 1770583559580,
  "data": {
    "status": "success",
    "data": {
      "chain": "Solana",
      "summary": "Top 5 risk-adjusted yield opportunities identified based on APY trends, TVL, and risk factors.",
      "strategy": "conservative",
      "pools": [
        {
          "poolId": "20d99514-4d6b-4ff3-bbec-0732971885a0",
          "chain": "Solana",
          "project": "raydium-amm",
          "symbol": "WSOL-PIPPIN",
          "tvlUsd": 9844215,
          "apy": 240.36,
          "apyPct1D": 151.12,
          "apyPct7D": 144.06,
          "apyPct30D": 147.27,
          "stablecoin": false,
          "exposure": "multi",
          "ilRisk": "yes",
          "predictions": {
            "predictedClass": "Down",
            "predictedProbability": 98,
            "binnedConfidence": 3
          },
          "analysis": {
            "score": 8.5,
            "riskLevel": "low",
            "reason": "High TVL indicates reliability, moderate APY with stable trends."
          }
        }
      ]
    }
  }
}
```

---

## Design Notes

* No authentication is enabled by default (internal usage)
* Response format is consistent: `{ status, data }`
* External dependencies (Moralis) are isolated to specific endpoints
* API is designed to be consumed by autonomous agents and CLI tools
* Returns AI-ranked yield pools based on APY trends, TVL, and risk signals
* Includes short-term and medium-term APY changes (1D / 7D / 30D)
* `analysis` provides a human-readable risk rationale per pool

---