
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ConstraintForm from './components/ConstraintForm';
import IterationSummary from './components/IterationSummary';
import { generateIdeas, scoreIdeas, extractPatterns } from './services/geminiService';
import { Constraints, Iteration, AppState, Idea } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.SETUP);
  const [constraints, setConstraints] = useState<Constraints | null>(null);
  const [iterations, setIterations] = useState<Iteration[]>([]);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const runSystematicProcess = useCallback(async (initialConstraints: Constraints) => {
    setConstraints(initialConstraints);
    setState(AppState.GENERATING);
    setLoadingMessage("Stage 1: Generating 20 diverse ideas...");

    try {
      // First generation
      const ideas = await generateIdeas(initialConstraints);
      
      setState(AppState.SCORING);
      setLoadingMessage("Stage 2: Quantitatively scoring ideas based on 4-dimension rubric...");
      const scoredIdeas = await scoreIdeas(ideas);

      const avg = scoredIdeas.reduce((sum, idea) => sum + (idea.score?.total || 0), 0) / scoredIdeas.length;
      
      const firstIteration: Iteration = {
        index: 0,
        ideas: scoredIdeas,
        averageScore: avg,
        deltaScore: 0
      };

      setIterations([firstIteration]);
      setState(AppState.REVIEWING);
    } catch (error) {
      console.error(error);
      alert("An error occurred during generation. Please check your API key.");
      setState(AppState.SETUP);
    }
  }, []);

  const evolveIteration = async () => {
    if (!constraints || iterations.length === 0) return;

    const currentIteration = iterations[iterations.length - 1];
    setState(AppState.EVOLVING);
    setLoadingMessage("Stage 3: Extracting success patterns and evolving the next batch...");

    try {
      // Find top 5 to extract patterns
      const top5 = [...currentIteration.ideas]
        .filter(i => i.score)
        .sort((a, b) => (b.score?.total || 0) - (a.score?.total || 0))
        .slice(0, 5);
      
      const patterns = await extractPatterns(top5);
      
      setLoadingMessage("Stage 1: Generating 20 refined ideas using evolved patterns...");
      const nextIdeas = await generateIdeas(constraints, { ...currentIteration, patternsIdentified: patterns });

      setLoadingMessage("Stage 2: Re-scoring refined ideas...");
      const nextScoredIdeas = await scoreIdeas(nextIdeas);

      const nextAvg = nextScoredIdeas.reduce((sum, idea) => sum + (idea.score?.total || 0), 0) / nextScoredIdeas.length;
      
      const nextIteration: Iteration = {
        index: iterations.length,
        ideas: nextScoredIdeas,
        averageScore: nextAvg,
        deltaScore: nextAvg - currentIteration.averageScore,
        patternsIdentified: patterns
      };

      setIterations(prev => [...prev, nextIteration]);
      setState(AppState.REVIEWING);
    } catch (error) {
      console.error(error);
      alert("Failed to evolve iteration.");
      setState(AppState.REVIEWING);
    }
  };

  const reset = () => {
    setState(AppState.SETUP);
    setIterations([]);
    setConstraints(null);
  };

  // Pre-calculate state flags to avoid TypeScript narrowing errors in conditional JSX blocks
  // This solves the 'no overlap' comparison errors on line 101/102
  const isGeneratingOrScoring = state === AppState.GENERATING || state === AppState.SCORING;
  const isEvolving = state === AppState.EVOLVING;
  const isAnyLoadingState = isGeneratingOrScoring || isEvolving;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        {state === AppState.SETUP && (
          <ConstraintForm 
            onSubmit={runSystematicProcess} 
            isLoading={isGeneratingOrScoring} 
          />
        )}

        {isAnyLoadingState && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-bold text-slate-800">{loadingMessage}</h2>
            <p className="text-slate-400 mt-2">Nexus Engine is analyzing scientific constraints...</p>
          </div>
        )}

        {(state === AppState.REVIEWING || state === AppState.FINISHED) && (
          <div className="space-y-6">
             <IterationSummary iterations={iterations} />
          </div>
        )}
      </main>

      {/* Persistent Call to Action */}
      {(state === AppState.REVIEWING || state === AppState.FINISHED) && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-200 p-4 shadow-2xl z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="hidden md:block">
               <p className="text-slate-500 text-sm">Iteration <span className="font-bold text-indigo-600">{iterations.length}</span> complete.</p>
               <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Recommended: 3 iterations for peak efficiency.</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button 
                onClick={reset}
                className="flex-1 md:flex-none px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-all"
              >
                Reset Process
              </button>
              <button 
                onClick={evolveIteration}
                disabled={iterations.length >= 5}
                className="flex-1 md:flex-none px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 disabled:bg-slate-300 disabled:shadow-none"
              >
                {iterations.length >= 5 ? 'Max Iterations' : 'Evolve Next Generation →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
