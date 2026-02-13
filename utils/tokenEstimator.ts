import { Framework, Persona, LinguisticControl } from '../types';

// Rough estimation: 1 token ~= 4 characters for English text
const CHARS_PER_TOKEN = 4;

export const estimateTokens = (text: string): number => {
  return Math.ceil(text.length / CHARS_PER_TOKEN);
};

export const calculateCognitiveLoad = (
  persona: Persona | null,
  frameworks: Framework[],
  linguistics: LinguisticControl[],
  historyText: string
) => {
  let systemPromptSize = 0;
  
  // Base instruction size
  systemPromptSize += 200; 

  if (persona) {
    systemPromptSize += estimateTokens(persona.system_prompt);
  }

  frameworks.forEach(fw => {
    systemPromptSize += estimateTokens(fw.content);
  });

  linguistics.forEach(lx => {
    systemPromptSize += estimateTokens(lx.system_instruction);
  });

  const historySize = estimateTokens(historyText);

  return {
    systemTokens: systemPromptSize,
    historyTokens: historySize,
    total: systemPromptSize + historySize,
    // Gemini 2.0 Flash has ~1M context, but for responsiveness we aim for a "Working Memory" budget
    // Let's set a "soft limit" for the UI visualization of 32k to keep things efficient
    limit: 32000 
  };
};
