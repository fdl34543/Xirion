import axios from "axios";
import { analyzeToken } from "../agent/analyzeToken.js";

type ScanInput = {
  address: string;
  twitter?: string;
};

function parseScanCommand(text: string): ScanInput | null {
  const parts = text.trim().split(/\s+/);

  if (parts.length < 2) return null;

  return {
    address: parts[1],
    twitter: parts[2],
  };
}

function formatTelegramResult(result: any): string {
  const { metadata, aiRisk } = result;

  return `
${metadata.name} (${metadata.symbol})

Overall Risk: ${aiRisk.overallRisk}%
Recommendation: ${getRecommendation(aiRisk.overallRisk)}

AI Analysis:
${aiRisk.summary}
`.trim();
}

function formatTelegramAnalysis(result: any): string {
  const { metadata, aiRisk } = result;

  return `
*${metadata.name} (${metadata.symbol})*

*Recommendation:* ${getRecommendation(aiRisk.overallRisk)}

*Risk Analysis*
Honeypot Risk      ${aiRisk.honeypot}%
Rug Pull Risk      ${aiRisk.rugPull}%
Liquidity Risk     ${aiRisk.liquidity}%
Concentration Risk ${aiRisk.concentration}%

*Overall Risk:* ${aiRisk.overallRisk}%

*AI Analysis:*
${aiRisk.summary}
`.trim();
}


function getRecommendation(risk: number): string {
  if (risk < 35) return "ACCUMULATE";
  if (risk < 65) return "MONITOR";
  return "AVOID";
}

export async function handleScanCommand(params: {
  baseUrl: string;
  chatId: number;
  text: string;
}) {
  const { baseUrl, chatId, text } = params;

  const input = parseScanCommand(text);

  if (!input) {
    await axios.post(`${baseUrl}/sendMessage`, {
      chat_id: chatId,
      text: "Usage: /scan <token_address> [x_link]",
    });
    return;
  }

  await axios.post(`${baseUrl}/sendMessage`, {
    chat_id: chatId,
    text: "Analyzing token. Please wait...",
  });

  try {
    const result = await analyzeToken({
      address: input.address,
      twitter: input.twitter,
    });

    const caption = formatTelegramAnalysis(result);

    if (result.metadata.logo) {
        await axios.post(`${baseUrl}/sendPhoto`, {
            chat_id: chatId,
            photo: result.metadata.logo,
            caption,
            parse_mode: "Markdown",
            reply_markup: {
            inline_keyboard: [
                [
                {
                    text: "Analyze Another Token",
                    callback_data: "analyze_token",
                },
                ],
            ],
            },
        });
        } else {
        await axios.post(`${baseUrl}/sendMessage`, {
            chat_id: chatId,
            text: caption,
            parse_mode: "Markdown",
        });
    }

  } catch (err: any) {
    await axios.post(`${baseUrl}/sendMessage`, {
      chat_id: chatId,
      text: "Failed to analyze token. Please check the address and try again.",
    });
  }
}
