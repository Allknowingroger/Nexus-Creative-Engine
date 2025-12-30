
import React from 'react';
import { Idea } from '../types';

interface Props {
  idea: Idea;
  rank?: number;
}

const IdeaCard: React.FC<Props> = ({ idea, rank }) => {
  const s = idea.score;

  return (
    <div className="bg-white border border-slate-100 rounded-[1.5rem] p-6 transition-all hover:shadow-xl hover:shadow-indigo-500/5 group">
      <div className="flex justify-between items-start mb-5">
        <div className="flex gap-4 items-center">
          {rank !== undefined && (
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-black flex items-center justify-center border border-indigo-100">
              {rank}
            </div>
          )}
          <h3 className="text-lg font-extrabold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{idea.title}</h3>
        </div>
        {s && (
          <div className="flex flex-col items-end">
             <span className="text-xl font-black text-indigo-600 tracking-tighter">{(s.total * 10).toFixed(1)}%</span>
             <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Score</span>
          </div>
        )}
      </div>
      
      <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
        {idea.description}
      </p>

      {s && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-[10px] uppercase font-black text-slate-300">
            <ScoreBar label="Novelty" value={s.novelty} color="bg-blue-500" />
            <ScoreBar label="Feasibility" value={s.feasibility} color="bg-emerald-500" />
            <ScoreBar label="Impact" value={s.impact} color="bg-indigo-500" />
            <ScoreBar label="Efficiency" value={s.costEfficiency} color="bg-amber-500" />
          </div>
          {idea.rationale && (
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <p className="text-[10px] italic text-slate-500 leading-tight">
                <span className="font-bold uppercase text-slate-400 not-italic mr-1">Judge Rationale:</span>
                {idea.rationale}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ScoreBar = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex justify-between items-center tracking-widest">
      <span>{label}</span>
      <span className="text-slate-700">{value}/10</span>
    </div>
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${value * 10}%` }}></div>
    </div>
  </div>
);

export default IdeaCard;
