import { GoogleGenAI, ThinkingLevel } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateDeepReflection(thought: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `You are the Oracle of the Void. A user has brought you a complex, heavy burden: "${thought}".
      Analyze the core psychological or emotional weight of this thought. 
      Provide a profound, multi-layered perspective that untangles the burden. 
      Do not give generic advice. Speak with cosmic, objective empathy. 
      Keep the response under 100 words, focusing on a deep realization that allows them to let it go.`,
      config: { 
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        temperature: 0.7
      }
    });
    return response.text?.trim() || "The void sees the weight you carry. It is valid, but it is not permanent. Let it dissolve.";
  } catch (error) {
    console.error("Error generating deep reflection:", error);
    return "The void sees the weight you carry. It is valid, but it is not permanent. Let it dissolve.";
  }
}
