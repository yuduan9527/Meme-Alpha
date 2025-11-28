import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are a world-class Crypto Meme Narrative Analyst and Degen Researcher. Your job is to analyze specific meme coins based on their name and contract address. 
You have deep knowledge of internet culture, 4chan/Reddit lore, crypto twitter (CT) trends, and the psychology of FOMO.

Your analysis must be output in **Chinese (Simplified)**.

Structure your response strictly in Markdown as follows:

## 🧬 核心叙事 (Core Narrative)
[Explain the core concept. Is it a cult, a political satire, an animal token, or an abstract concept? What is the 'hook'?]

## 🎭 文化起源 (Cultural Origin)
[Where did this meme come from? Is it based on a viral video, a tweet, a celebrity event, or an existing internet meme? Detail the lore.]

## 🚀 社区氛围 & 传播力 (Community & Virality)
[Analyze the vibe. Is it toxic, wholesome, chaotic, or cult-like? How fast is it spreading? Mention key KOLs or influencers if found in search.]

## ⚖️ 风险与潜力 (Risk & Potential)
[Honest assessment. Is it a rug pull risk? Is the liquidity locked? Is it a "blue chip" meme candidate or a "pvp" rotator?]

## 💎 叙事评分 (Narrative Score: 1-10)
[Give a score specifically on the *narrative strength* and stickiness, not financial advice.]

**Crucial**: 
- You MUST use the 'googleSearch' tool to find real-time information about the specific Contract Address (CA) provided. 
- Meme coins often share names (e.g., multiple 'PEPE's), so the Contract Address is the source of truth.
- If no specific info is found for the CA, analyze the *name's* meme potential generally but warn the user that the specific CA is obscure.
- Use crypto slang where appropriate (e.g., diamond hands, jeet, fomo, alpha) but keep the analysis professional yet sharp.
`;

export const analyzeMemeNarrative = async (
  name: string,
  contractAddress: string
): Promise<AnalysisResult> => {
  try {
    const prompt = `Please analyze the meme coin: "${name}" with Contract Address (CA): ${contractAddress}. Search for this specific CA on Twitter, DexScreener, and crypto news to understand its current status and narrative.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const markdown = response.text || "Analysis failed to generate text.";

    // Extract grounding sources if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
      .filter((chunk: any) => chunk.web?.uri && chunk.web?.title)
      .map((chunk: any) => ({
        uri: chunk.web.uri,
        title: chunk.web.title,
      }));

    // Deduplicate sources based on URI
    const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());

    return {
      markdown,
      sources: uniqueSources,
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error during analysis");
  }
};