import { GoogleGenAI } from "@google/genai";

// HARD PROMPT as requested
const HARD_PROMPT = `High quality photo restoration. Restore this image to high definition, fix damages, remove scratches and noise. If parts of the body are missing or damaged (e.g., arms, legs, hands, feet), reconstruct them naturally to complete the subject. Colorize it naturally with realistic skin tones and environment colors. Output a photorealistic result.`;

export const restoreImage = async (base64Image: string): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key chưa được cấu hình.");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Remove header if present (e.g., "data:image/png;base64,")
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: HARD_PROMPT,
          },
          {
            inlineData: {
              mimeType: 'image/jpeg', // Standardize input as jpeg contextually
              data: cleanBase64,
            },
          },
        ],
      },
    });

    // Parse response to find the image part
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("Không nhận được dữ liệu ảnh từ AI.");

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Đã xảy ra lỗi khi xử lý ảnh.");
  }
};