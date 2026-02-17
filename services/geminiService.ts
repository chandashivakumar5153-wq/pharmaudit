
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ForensicReport } from "../types.ts";

export class GeminiService {
  constructor() {}

  async analyzeMedicine(
    imageData: string,
    mimeType: string
  ): Promise<ForensicReport> {
    // Initialize GoogleGenAI directly before the call to ensure the latest configuration is used.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-preview';
    
    const prompt = `
      Act as a Senior Pharmaceutical Forensic Auditor specialized in the Indian market (CDSCO standards).
      Analyze this medicine packaging image.
      
      STAGE 1: EXTRACT DATA
      - Brand Name, Generic Name (API), Manufacturer, Address, Batch Number, Mfg/Exp Dates, License Number (DL No).
      - Analyze logo placement, font, color consistency. Check for QR/DataMatrix.

      STAGE 2: VERIFICATION (Use Google Search Grounding)
      - Verify if the License Number corresponds to the Manufacturer in CDSCO database.
      - Check if Batch Number format matches standard formats for this specific manufacturer.
      - Search for recent Drug Alerts or Recalls for this Brand or Batch in India (2025-2026).

      STAGE 3: FORENSIC REASONING
      - Identify misspellings, blurry micro-text, or non-standard logo gradients.
      - Flag data mismatches.

      IMPORTANT: Provide a detailed analysis.
      You MUST end your response with a valid JSON block enclosed in triple backticks \`\`\`json ... \`\`\`.
      The JSON MUST follow this structure:
      {
        "authenticity_score": number (0-100),
        "status": "Verified" | "Suspect" | "Counterfeit",
        "extracted_data": { 
          "brand": "string", 
          "generic_name": "string",
          "manufacturer": "string",
          "manufacturer_address": "string",
          "batch": "string", 
          "license": "string",
          "mfg_date": "string",
          "exp_date": "string"
        },
        "visual_forensics": { 
          "findings": ["string"], 
          "red_flags": ["string"],
          "assets": {
            "logo_analysis": "string",
            "font_analysis": "string",
            "qr_present": boolean
          }
        },
        "grounding_check": { 
          "manufacturer_verified": boolean, 
          "batch_valid": boolean, 
          "alerts_found": ["string"] 
        },
        "recommendation": "string",
        "reasoning_summary": "string"
      }
    `;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            { inlineData: { data: imageData, mimeType } },
            { text: prompt }
          ]
        },
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("Empty response from model.");
      }
      
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      
      if (!jsonMatch) {
        throw new Error("Could not extract forensic data from model response.");
      }

      const report: ForensicReport = JSON.parse(jsonMatch[1]);
      
      // Extract grounding sources from groundingMetadata.groundingChunks
      const sources: Array<{ title: string; uri: string }> = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web) {
            sources.push({ title: chunk.web.title, uri: chunk.web.uri });
          }
        });
      }
      
      report.grounding_check.sources = sources;
      return report;
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      throw error;
    }
  }
}
