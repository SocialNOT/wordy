import { GoogleGenAI, Modality, HarmBlockThreshold, HarmCategory } from "@google/genai";
import { CompassSettings, ModelMode, Message } from "../types";

interface GeminiResponse {
  text: string;
  groundingMetadata?: any;
}

export const sendMessageToGemini = async (
  message: string,
  systemInstruction: string,
  compass: CompassSettings,
  history: Message[],
  mode: ModelMode
): Promise<GeminiResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let modelName = 'gemini-3-flash-preview';
  let config: any = {
    systemInstruction: systemInstruction,
    temperature: compass.temp,
    topP: compass.topp,
    frequencyPenalty: compass.freq,
    presencePenalty: compass.pres,
    safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    ]
  };

  if (mode === 'fast') {
    modelName = 'gemini-flash-lite-latest';
  } else if (mode === 'research') {
    modelName = 'gemini-3-pro-preview';
    config.tools = [{ googleSearch: {} }];
  } else if (mode === 'thinking') {
    modelName = 'gemini-3-pro-preview';
    config.thinkingConfig = { thinkingBudget: 24576 };
  } else if (mode === 'creative') {
    modelName = 'gemini-3-pro-preview';
    config.temperature = Math.max(config.temperature, 1.0);
  }

  // Convert internal Message format to Gemini API contents format
  // We skip the very first "system" init message which is usually model-role
  const contents = history.slice(1).map(m => ({
    role: m.role,
    parts: [{ text: m.text }]
  }));

  // Append the current message
  contents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: contents,
      config: config
    });

    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;

    return {
      text: response.text || "No response text generated.",
      groundingMetadata: groundingMetadata
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return { text: `Error: ${error.message || "Unknown error occurred"}` };
  }
};

export const transcribeAudio = async (audioBase64: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
                { 
                  role: 'user',
                  parts: [
                    { inlineData: { mimeType: 'audio/wav', data: audioBase64 } },
                    { text: "Transcribe this audio exactly. Do not add any conversational filler." }
                  ]
                }
            ]
        });
        return response.text || "";
    } catch (error: any) {
        console.error("Transcription Error:", error);
        throw error;
    }
};

export const generateSpeech = async (text: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ role: 'user', parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || "";
    } catch (error: any) {
        console.error("TTS Error:", error);
        throw error;
    }
}