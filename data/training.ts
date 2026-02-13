import { TrainingPhase } from '../types';

export const TRAINING_MODULES: TrainingPhase[] = [
  {
      id: 'phase-1',
      phase: 'Phase 1: The Spark',
      desc: 'Academic Gateway & Philosophy',
      modules: [
          { id: '1.1', title: '1.1 The Genesis: Search vs. Synthesis', locked: false, content: "# The Shift\nFrom Google (Retrieval) to Gemini (Synthesis). Stop searching, start programming language. Learn to move from 'asking questions' to 'defining parameters'." },
          { id: '1.2', title: '1.2 Cognitive Architecture', locked: false, content: "# How LLMs Think\nUnderstanding token prediction, context windows, and stochastic randomness. A model doesn't 'know' facts; it predicts the most likely next piece of data based on a massive neural network." },
          { id: '1.3', title: '1.3 The Blank Page Problem', locked: false, content: "# Regression to the Mean\nWhy vague prompts produce average results. Without specific constraints, the model defaults to the most generic possible answer found in its training data." },
          { id: '1.4', title: '1.4 The Hallucination Gradient', locked: true, content: "# Mitigating Hallucination\nUnderstanding when the model guesses vs. knows. Learning to enforce grounding and 'I don't know' thresholds. Use techniques like 'Verify before answering' and 'Provide sources for every claim'." },
          { id: '1.5', title: '1.5 Mastering Stochasticity', locked: true, content: "# The Randomness Slider\nDeep dive into Temperature and Top-P. Learn when to use high temperature for divergent creative ideation versus zero temperature for deterministic logical operations." }
      ]
  },
  {
      id: 'phase-2',
      phase: 'Phase 2: The Frameworks',
      desc: 'Structural Mastery',
      modules: [
          { id: '2.1', title: '2.1 R.A.C.E Deep Dive', locked: true, content: "# The Foundation\nMastering Role, Action, Context, and Expectation. This is the industrial standard for structural prompt design. Every complex instruction should start with a R.A.C.E skeleton." },
          { id: '2.2', title: '2.2 Reasoning Chains', locked: true, content: "# Beyond Zero-Shot\nImplementing Chain of Thought and Tree of Thought architectures. By forcing the model to 'think out loud', you increase the accuracy of complex logical deductions by up to 40%." },
          { id: '2.3', title: '2.3 Few-Shot Engineering', locked: true, content: "# Teaching by Example\nHow 3 examples are worth 1000 instructions. Providing a small set of input/output pairs allows the model to map the pattern of your intent perfectly." },
          { id: '2.4', title: '2.4 Self-Consistency & Voting', locked: true, content: "# Wisdom of the Tokens\nAdvanced reasoning patterns where you run multiple independent reasoning paths and find the consensus. Essential for high-stakes data analysis or math." },
          { id: '2.5', title: '2.5 Contrastive Prompting', locked: true, content: "# Learning from Negative Examples\nProviding 'Right' vs 'Wrong' examples to define boundaries. Differentiative learning helps the model understand nuance and avoids common pitfalls in style or logic." }
      ]
  },
  {
      id: 'phase-3',
      phase: 'Phase 3: Productivity',
      desc: 'Systematization',
      modules: [
          { id: '3.1', title: '3.1 Delimiters & Data', locked: true, content: "# Information Hygiene\nUsing XML tags, triple quotes, and headers to separate instructions from data. This prevents the model from confusing the user input with its own system rules." },
          { id: '3.2', title: '3.2 Batch Processing', locked: true, content: "# Scaling Content\nDesigning prompts that handle 100 items at once. Learn how to structure recursive tasks that process large datasets without context overflow." },
          { id: '3.3', title: '3.3 Recursive Refinement Loops', locked: true, content: "# The Iterative Loop\nPrompting the AI to critique its own work and then improve it based on that critique. This 'Multi-Turn Refinement' is how professional-grade content is generated." },
          { id: '3.4', title: '3.4 Persona Orchestration', locked: true, content: "# Multi-Agent Logic\nUsing multiple personas in a sequence to solve complex problems. For example: Writer -> Technical Editor -> Harsh Critic -> Final Polisher." },
          { id: '3.5', title: '3.5 Context Distillation', locked: true, content: "# Token Efficiency\nTechniques for compressing massive amounts of information into a 'dense core'. Learn how to maximize entropy in the minimum number of tokens to save costs and performance." }
      ]
  },
  {
      id: 'phase-4',
      phase: 'Phase 4: Mastery',
      desc: 'Architecture & Engineering',
      modules: [
          { id: '4.1', title: '4.1 Meta-Prompting', locked: true, content: "# AI Building AI\nAsking the model to design its own personas and frameworks. You act as the architect, and the model generates the granular instructions for its sub-agents." },
          { id: '4.2', title: '4.2 The Cognitive OS', locked: true, content: "# Systemic Integration\nBuilding multi-persona autonomous agentic workflows. Integrating frameworks, personas, and controls into a single, cohesive operating environment." },
          { id: '4.3', title: '4.3 Agentic Workflows', locked: true, content: "# Autonomous Logic\nBuilding loops where the AI can take an action, observe the result, and decide the next step autonomously. This is the bridge to true AI agents." },
          { id: '4.4', title: '4.4 Adversarial Guardrails', locked: true, content: "# Red Teaming Logic\nIdentifying and patching prompt vulnerabilities. Learn how to protect your system prompt from 'Jailbreak' attempts and prompt injection." },
          { id: '4.5', title: '4.5 The Final Integration', locked: true, content: "# Your Personal OS Layer\nSynthesizing everything into a single, cohesive command layer for your cognitive daily life. Designing the ultimate interface between your brain and the model." }
      ]
  }
];