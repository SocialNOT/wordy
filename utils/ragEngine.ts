import { Framework, Persona, TrainingPhase, RagChunk } from '../types';
import { FRAMEWORKS } from '../data/frameworks';
import { PERSONAS } from '../data/personas';
import { TRAINING_MODULES } from '../data/training';

/**
 * A lightweight Client-Side RAG (Retrieval Augmented Generation) engine.
 * It indexes the static knowledge base (Frameworks, Personas, Training) 
 * and performs weighted keyword matching to find relevant context.
 */
export class RagEngine {
  private static tokenize(text: string): Set<string> {
    return new Set(
      text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 3) // Filter stop words roughly by length
    );
  }

  private static calculateScore(queryTokens: Set<string>, contentTokens: Set<string>): number {
    let matches = 0;
    queryTokens.forEach(token => {
      if (contentTokens.has(token)) matches++;
    });
    return matches / Math.max(1, queryTokens.size); // Normalize score
  }

  static search(query: string, limit: number = 2): string[] {
    const queryTokens = this.tokenize(query);
    if (queryTokens.size === 0) return [];

    const chunks: RagChunk[] = [];

    // 1. Index Frameworks
    FRAMEWORKS.forEach(fw => {
      const content = `${fw.name} ${fw.description} ${fw.content}`;
      const score = this.calculateScore(queryTokens, this.tokenize(content));
      if (score > 0.2) {
        chunks.push({
          sourceId: fw.id,
          sourceType: 'Framework',
          text: `[Definition: ${fw.name}] ${fw.description}. \nStructure: ${fw.content}`,
          relevance: score
        });
      }
    });

    // 2. Index Personas
    PERSONAS.forEach(p => {
      const content = `${p.name} ${p.description} ${p.system_prompt}`;
      const score = this.calculateScore(queryTokens, this.tokenize(content));
      if (score > 0.2) {
        chunks.push({
          sourceId: p.id,
          sourceType: 'Persona',
          text: `[Identity: ${p.name}] ${p.description}. \nPrompt: ${p.system_prompt}`,
          relevance: score
        });
      }
    });

    // 3. Index Training Material
    TRAINING_MODULES.forEach(phase => {
      phase.modules.forEach(mod => {
        const content = `${mod.title} ${mod.content}`;
        const score = this.calculateScore(queryTokens, this.tokenize(content));
        if (score > 0.3) { // Higher threshold for training content
          chunks.push({
            sourceId: mod.id,
            sourceType: 'Training',
            text: `[Knowledge: ${mod.title}] ${mod.content}`,
            relevance: score
          });
        }
      });
    });

    // Sort by relevance and take top N
    return chunks
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit)
      .map(chunk => chunk.text);
  }
}
