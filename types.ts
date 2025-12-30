
export interface Score {
  novelty: number;
  feasibility: number;
  impact: number;
  costEfficiency: number;
  total: number;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  score?: Score;
  rationale?: string;
}

export interface Iteration {
  index: number;
  ideas: Idea[];
  averageScore: number;
  deltaScore: number;
  patternsIdentified?: string[];
}

export interface Constraints {
  domain: string;
  problem: string;
  budgetLimit: string;
  timeline: string;
  otherRequirements: string;
}

export enum AppState {
  SETUP = 'SETUP',
  GENERATING = 'GENERATING',
  SCORING = 'SCORING',
  REVIEWING = 'REVIEWING',
  EVOLVING = 'EVOLVING',
  FINISHED = 'FINISHED'
}
