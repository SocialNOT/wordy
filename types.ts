
export type View = 'console' | 'frameworks' | 'personas' | 'compass' | 'linguistic' | 'training' | 'settings' | 'roadmap';
export type LayoutMode = 'commander' | 'zen' | 'operator';
export type ModelMode = 'fast' | 'balanced' | 'research' | 'thinking' | 'creative';

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  audioData?: string; 
  groundingMetadata?: any; 
  timestamp: number;
  config?: CompassSettings;
  model?: string;
}

export type ComplexityLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Framework {
  id: string;
  name: string;
  description: string;
  category: 'Structural' | 'Strategic' | 'Reasoning' | 'Creative' | 'Business' | 'Academic' | 'Technical' | 'Ethical' | 'Linguistic' | 'Meta';
  content: string; 
  complexity: ComplexityLevel;
  tags: string[];
  usecases?: string[]; 
  keypoints?: string[]; 
}

export interface Persona {
  id: string;
  name: string;
  category: 'Academic' | 'Corporate' | 'Creative' | 'Technical' | 'Historical' | 'Abstract' | 'Legal' | 'Education' | 'Medical' | 'Data';
  description: string;
  system_prompt: string;
  default_temp?: number;
  tags: string[];
  usecases?: string[];
  keypoints?: string[];
}

export interface LinguisticControl {
  id: string;
  name: string;
  category: 'Tone' | 'Structure' | 'Vocabulary' | 'Logic' | 'Safety' | 'Perspective' | 'Format' | 'Interaction' | 'Temporal' | 'Language';
  description: string;
  system_instruction: string;
  usecases?: string[];
  keypoints?: string[];
}

export interface CompassSettings {
  temp: number;
  topp: number;
  freq: number;
  pres: number;
}

export interface TrainingModule {
  id: string;
  title: string;
  content: string;
  locked: boolean;
}

export interface TrainingPhase {
  id: string;
  phase: string;
  desc: string;
  modules: TrainingModule[];
}

export interface RagChunk {
  sourceId: string;
  sourceType: 'Framework' | 'Persona' | 'Training';
  text: string;
  relevance: number;
}

// Added SlashCommand interface for use in the Console component
export interface SlashCommand {
  id: string;
  label: string;
  desc: string;
  type: 'system' | 'persona' | 'framework';
  action: () => void;
}
