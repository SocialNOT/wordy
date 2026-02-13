import { Framework, Persona, LinguisticControl } from '../types';

interface PromptEngineInput {
  basePrompt: string;
  activePersona: Persona | null;
  activeFrameworks: Framework[];
  activeLinguistics: LinguisticControl[];
  contextChunks?: string[];
}

export class PromptEngine {
  static constructSystemPrompt(input: PromptEngineInput): string {
    const parts: string[] = [];

    // 1. Base Layer
    parts.push("### CORE INSTRUCTIONS");
    parts.push(input.basePrompt);
    parts.push("You are the Cognitive Operating System (WoT). You prioritize structure, precision, and user intent.");

    // 2. Identity Layer (Persona)
    if (input.activePersona) {
      parts.push("\n### ACTIVE PERSONA");
      parts.push(`IDENTITY: ${input.activePersona.name}`);
      parts.push(input.activePersona.system_prompt);
    }

    // 3. Framework Layer (Logic)
    if (input.activeFrameworks.length > 0) {
      parts.push("\n### STRUCTURAL FRAMEWORKS");
      parts.push("You must adhere to the following reasoning structures:");
      input.activeFrameworks.forEach(fw => {
        parts.push(`\n[FRAMEWORK: ${fw.name}]`);
        parts.push(fw.content);
      });
    }

    // 4. Linguistic Control Layer (Constraints)
    if (input.activeLinguistics.length > 0) {
      parts.push("\n### LINGUISTIC CONSTRAINTS");
      parts.push("The following constraints are non-negotiable:");
      input.activeLinguistics.forEach(ctrl => {
        parts.push(`- ${ctrl.name}: ${ctrl.system_instruction}`);
      });
    }

    // 5. Dynamic Context Layer (RAG)
    if (input.contextChunks && input.contextChunks.length > 0) {
      parts.push("\n### RETRIEVED CONTEXT");
      input.contextChunks.forEach((chunk, i) => {
        parts.push(`[CHUNK ${i+1}]: ${chunk}`);
      });
    }

    return parts.join("\n");
  }
}
