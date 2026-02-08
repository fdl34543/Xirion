<p align="center">
  <img src="../../assets/xirion-logo.png" alt="Xirion Logo" width="260">
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

# Xirion API Documentation

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
````

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

* `address` (string, required): Solana token mint address

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

## Environment Variables

The following environment variables are required:

```env
PORT=3001
MORALIS_API_KEY=your_moralis_api_key
```

Ensure `dotenv.config()` is called in the API entry point.

---

## Running the API

```bash
npx tsx src/api/index.ts
```

Expected output:

```
API running on https://xirion.onrender.com/api
```

---

## Testing the API

A simple test runner is provided:

```bash
npx tsx src/api/test-api.ts
```

This script tests:

* `/heartbeat`
* `/alpha`
* `/analyzeToken`

---

## Roadmap (Optional)

* Request validation (schema-based)
* API key or signature-based authentication
* Rate limiting
* Async job processing for heavy analysis
* Versioned endpoints (`/v1`, `/v2`)

---

## License

MIT — see `LICENSE`

---

<p align="center">
  <strong>Xirion</strong>
  <br>
  <sub>Autonomous intelligence for crypto-native capital</sub>
</p>


