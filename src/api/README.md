# Xirion API Documentation

Xirion API is a lightweight internal API designed to support AI-driven token analysis, alpha detection, and on-chain risk evaluation.  
This API is primarily consumed by internal agents and CLI tools.

Base URL (local):
```

[http://127.0.0.1:3001/api](http://127.0.0.1:3001/api)

````

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

#### Notes

* Requires `MORALIS_API_KEY` to be set in `.env`
* Designed for deep analysis, not high-frequency calls
* Suitable for agent decision-making and risk filtering

---

## Environment Variables

The following environment variables are required:

```env
PORT=3001
MORALIS_API_KEY=your_moralis_api_key
```

Ensure `dotenv.config()` is called in the API entry point.

---

## Running the API (Local)

```bash
npx tsx src/api/index.ts
```

Expected output:

```
API running on http://127.0.0.1:3001
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

## Design Notes

* No authentication is enabled by default (internal usage)
* Response format is consistent: `{ status, data }`
* External dependencies (Moralis) are isolated to specific endpoints
* API is designed to be consumed by autonomous agents and CLI tools

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


