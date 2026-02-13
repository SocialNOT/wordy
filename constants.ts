import { Framework, Persona, TrainingPhase, LinguisticControl } from './types';

export const FRAMEWORKS: Framework[] = [
  { 
    id: 'race', 
    name: 'R.A.C.E', 
    description: 'Role, Action, Context, Expectation', 
    category: 'Structural', 
    content: "Role: [Insert Role]\nAction: [Insert Action]\nContext: [Insert Context]\nExpectation: [Insert Expectation]",
    complexity: 'Beginner',
    tags: ['structural']
  },
  { 
    id: 'crispe', 
    name: 'C.R.I.S.P.E', 
    description: 'Capacity, Role, Insight, Statement, Personality, Experiment', 
    category: 'Structural', 
    content: "Capacity: [Expert]\nRole: [Act as...]\nInsight: [Background info]\nStatement: [Task]\nPersonality: [Tone]\nExperiment: [Examples]",
    complexity: 'Intermediate',
    tags: ['structural', 'persona']
  },
  { 
    id: 'coast', 
    name: 'C.O.A.S.T', 
    description: 'Context, Objective, Actions, Scenarios, Tuning', 
    category: 'Strategic', 
    content: "Context: ...\nObjective: ...\nActions: ...\nScenarios: ...\nTuning: ...",
    complexity: 'Intermediate',
    tags: ['strategic']
  },
  { 
    id: 'roses', 
    name: 'R.O.S.E.S', 
    description: 'Role, Objective, Scenario, Expected Solution, Style', 
    category: 'Strategic', 
    content: "Role: ...\nObjective: ...\nScenario: ...\nSolution: ...\nStyle: ...",
    complexity: 'Intermediate',
    tags: ['strategic']
  },
  { 
    id: 'cot', 
    name: 'Chain of Thought', 
    description: 'Step-by-step reasoning', 
    category: 'Reasoning', 
    content: "Think step-by-step. Break the problem down into:\n1. Analysis\n2. Hypothesis\n3. Conclusion",
    complexity: 'Advanced',
    tags: ['reasoning']
  },
  { 
    id: 'few-shot', 
    name: 'Few-Shot Prompting', 
    description: 'Provide examples', 
    category: 'Reasoning', 
    content: "Example 1: [Input] -> [Output]\nExample 2: [Input] -> [Output]\nTask: [Input] ->",
    complexity: 'Intermediate',
    tags: ['technique']
  }
];

export const PERSONAS: Persona[] = [
  { 
    id: 'scholar', 
    name: 'Senior Research Scholar', 
    category: 'Academic', 
    description: 'Formal, Evidence-based. Prioritize peer-reviewed sources.', 
    system_prompt: "You are a Senior Research Scholar. Prioritize peer-reviewed sources, methodological rigor, and academic citation styles.",
    tags: ['academic']
  },
  { 
    id: 'cto', 
    name: 'Chief Technology Officer', 
    category: 'Technical', 
    description: 'Strategic, Scalable. Focus on architectural integrity.', 
    system_prompt: "You are a CTO. Focus on scalability, security, architectural integrity, and cost-benefit analysis of technical decisions.",
    tags: ['technical']
  },
  { 
    id: 'mentor', 
    name: 'Socratic Mentor', 
    category: 'Education', 
    description: 'Inquisitive, Patient. Uses guiding questions.', 
    system_prompt: "You are a Socratic Mentor. Do not give answers directly. Ask guiding questions to help the user discover the answer.",
    tags: ['education']
  },
  { 
    id: 'devil', 
    name: 'Devil\'s Advocate', 
    category: 'Abstract', 
    description: 'Skeptical, Analytical. Critiques assumptions.', 
    system_prompt: "You are a Devil's Advocate. Ruthlessly critique assumptions, identify edge cases, and propose counter-arguments.",
    tags: ['critical']
  },
  { 
    id: 'poet', 
    name: 'Linguistic Architect', 
    category: 'Creative', 
    description: 'Evocative, Precise. Focus on phonetics and rhythm.', 
    system_prompt: "You are a Linguistic Architect. Focus on phonetics, rhythm, lexical specificity, and rhetorical devices.",
    tags: ['creative']
  }
];

export const LINGUISTICS: LinguisticControl[] = [
  { 
    id: 'lexical', 
    name: 'Lexical Specificity', 
    category: 'Vocabulary',
    description: 'Use exact, domain-specific terminology.', 
    system_instruction: "Avoid vague words. Use precise, domain-specific terminology." 
  },
  { 
    id: 'verbs', 
    name: 'Operational Verbs', 
    category: 'Vocabulary',
    description: 'Start sentences with strong action verbs.', 
    system_instruction: "Begin instructions with strong operational verbs (e.g., 'Analyze', 'Synthesize', 'Deploy')." 
  },
  { 
    id: 'structure', 
    name: 'Structural Formatting', 
    category: 'Format',
    description: 'Use markdown, tables, and lists.', 
    system_instruction: "Format outputs using Markdown headers, bullet points, and tables for readability." 
  },
  { 
    id: 'reflection', 
    name: 'Self-Reflection', 
    category: 'Logic',
    description: 'AI critiques its own output.', 
    system_instruction: "After generating the response, critique it for bias, logical fallacies, and completeness." 
  }
];

export const TRAINING_MODULES: TrainingPhase[] = [
  {
      id: 'phase-1',
      phase: 'Phase 1: The Spark',
      desc: 'Academic Gateway & Philosophy',
      modules: [
          { id: '1.1', title: '1.1 The Genesis', content: '...', locked: false },
          { id: '1.2', title: '1.2 Cognitive Architecture', content: '...', locked: false },
          { id: '1.3', title: '1.3 The Blank Page Problem', content: '...', locked: false },
          { id: '1.4', title: '1.4 The Hallucination Gradient', content: '...', locked: true },
          { id: '1.5', title: '1.5 Mastering Stochasticity', content: '...', locked: true }
      ]
  },
  {
      id: 'phase-2',
      phase: 'Phase 2: The Frameworks',
      desc: 'Structural Mastery',
      modules: [
          { id: '2.1', title: '2.1 R.A.C.E Deep Dive', content: '...', locked: true },
          { id: '2.2', title: '2.2 Reasoning Chains', content: '...', locked: true },
          { id: '2.3', title: '2.3 Few-Shot Logic', content: '...', locked: true },
          { id: '2.4', title: '2.4 Self-Consistency', content: '...', locked: true },
          { id: '2.5', title: '2.5 Contrastive Prompting', content: '...', locked: true }
      ]
  },
  {
      id: 'phase-3',
      phase: 'Phase 3: Productivity',
      desc: 'Systematization',
      modules: [
          { id: '3.1', title: '3.1 Bulk Processing', content: '...', locked: true },
          { id: '3.2', title: '3.2 Automated Workflows', content: '...', locked: true },
          { id: '3.3', title: '3.3 Recursive Refinement', content: '...', locked: true },
          { id: '3.4', title: '3.4 Persona Orchestration', content: '...', locked: true },
          { id: '3.5', title: '3.5 Context Distillation', content: '...', locked: true }
      ]
  },
  {
      id: 'phase-4',
      phase: 'Phase 4: Mastery',
      desc: 'Architecture & Engineering',
      modules: [
          { id: '4.1', title: '4.1 Meta-Prompting', content: '...', locked: true },
          { id: '4.2', title: '4.2 The Cognitive OS', content: '...', locked: true },
          { id: '4.3', title: '4.3 Agentic Workflows', content: '...', locked: true },
          { id: '4.4', title: '4.4 Adversarial Guardrails', content: '...', locked: true },
          { id: '4.5', title: '4.5 The Final Integration', content: '...', locked: true }
      ]
  }
];

export const INITIAL_SYSTEM_PROMPT = "You are World of TEXTS, an advanced AI OS. Assist the user with precision.";