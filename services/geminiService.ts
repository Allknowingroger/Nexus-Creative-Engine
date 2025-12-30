
import { GoogleGenAI, Type } from "@google/genai";
import { Idea, Score, Constraints, Iteration } from "../types";

// Always initialize GoogleGenAI with a named parameter using process.env.API_KEY exclusively
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-3-pro-preview for advanced scientific reasoning
const MODEL_NAME = 'gemini-3-pro-preview';

/**
 * Stage 1: Rapid Generation
 * Generates 20 diverse ideas based on constraints and optional patterns.
 */
export async function generateIdeas(constraints: Constraints, previousIteration?: Iteration): Promise<Idea[]> {
  const prompt = previousIteration 
    ? `SYSTEMATIC EVOLUTION TASK:
       Domain: ${constraints.domain}
       Problem: ${constraints.problem}
       Budget: ${constraints.budgetLimit}
       Timeline: ${constraints.timeline}
       Additional: ${constraints.otherRequirements}

       EVOLUTIONARY PATTERNS TO INCORPORATE:
       ${previousIteration.patternsIdentified?.map((p, i) => `${i+1}. ${p}`).join("\n")}
       
       TASK: Generate 20 high-quality ideas that double down on these patterns while strictly adhering to the original constraints. 
       Ensure high diversity in how these patterns are applied.`
    : `RAPID GENERATION TASK:
       Domain: ${constraints.domain}
       Problem: ${constraints.problem}
       Budget: ${constraints.budgetLimit}
       Timeline: ${constraints.timeline}
       Additional: ${constraints.otherRequirements}

       TASK: Generate 20 diverse, innovative, and feasibility-checked ideas. Provide a title and description for each.`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
          },
          required: ["title", "description"],
        },
      },
    },
  });

  const rawIdeas = JSON.parse(response.text || "[]");
  return rawIdeas.map((idea: any, index: number) => ({
    ...idea,
    id: `idea-${Date.now()}-${index}`,
  }));
}

/**
 * Stage 2: Quantitative Scoring with Thinking Budget
 */
export async function scoreIdeas(ideas: Idea[]): Promise<Idea[]> {
  const prompt = `SCIENTIFIC RUBRIC EVALUATION:
    Score these 20 ideas on four dimensions (0-10): 
    1. Novelty (Is it truly new?)
    2. Feasibility (Can it be executed given the constraints?)
    3. Impact (Does it solve the core problem effectively?)
    4. Cost Efficiency (Does the value exceed the investment?)

    Ideas to evaluate:
    ${JSON.stringify(ideas.map(i => ({ title: i.title, description: i.description })))}`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 4000 },
      maxOutputTokens: 8000,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            scores: {
              type: Type.OBJECT,
              properties: {
                novelty: { type: Type.NUMBER },
                feasibility: { type: Type.NUMBER },
                impact: { type: Type.NUMBER },
                costEfficiency: { type: Type.NUMBER },
              },
              required: ["novelty", "feasibility", "impact", "costEfficiency"],
            },
            rationale: { type: Type.STRING }
          },
          required: ["title", "scores", "rationale"],
        },
      },
    },
  });

  const scoresMap = JSON.parse(response.text || "[]");
  
  return ideas.map(idea => {
    const scored = scoresMap.find((s: any) => s.title === idea.title);
    if (!scored) return idea;
    
    const s = scored.scores;
    const total = (s.novelty + s.feasibility + s.impact + s.costEfficiency) / 4;
    
    return {
      ...idea,
      score: { ...s, total },
      rationale: scored.rationale
    };
  });
}

/**
 * Stage 3: Pattern Extraction for Evolution with Thinking Budget
 */
export async function extractPatterns(topIdeas: Idea[]): Promise<string[]> {
  const prompt = `PATTERN RECOGNITION ANALYTICS:
    Analyze these top-performing ideas and extract 5 high-level 'success patterns'.
    These patterns should explain WHY these ideas scored well and should be used to guide the generation of the next 20 ideas.
    
    Source Material: ${JSON.stringify(topIdeas.map(i => i.title + ": " + i.description))}`;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 2000 },
      maxOutputTokens: 3000,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
    },
  });

  return JSON.parse(response.text || "[]");
}
