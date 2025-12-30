
import React from 'react';
import { Iteration, Idea } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import IdeaCard from './IdeaCard';

interface Props {
  iterations: Iteration[];
}

const IterationSummary: React.FC<Props> = ({ iterations }) => {
  const current = iterations[iterations.length - 1];
  const previous = iterations.length > 1 ? iterations[iterations.length - 2] : null;

  const chartData = iterations.map(it => ({
    name: `GEN ${it.index + 1}`,
    score: Number((it.averageScore * 10).toFixed(1))
  }));

  const topIdeas = [...current.ideas]
    .filter(i => i.score)
    .sort((a, b) => (b.score?.total || 0) - (a.score?.total || 0))
    .slice(0, 5);

  const copyToClipboard = () => {
    const report = `NEXUS CREATIVE ENGINE REPORT\n` +
      `Project Iteration: ${current.index + 1}\n` +
      `Average Quality: ${(current.averageScore * 10).toFixed(1)}%\n` +
      `Delta Improvement: ${current.deltaScore >= 0 ? '+' : ''}${(current.deltaScore * 10).toFixed(1)}%\n\n` +
      `TOP IDEAS:\n` +
      topIdeas.map((i, idx) => `${idx + 1}. ${i.title} (Score: ${(i.score!.total * 10).toFixed(1)}%)\n${i.description}\n`).join("\n") +
      `\nSUCCESS PATTERNS:\n` +
      (current.patternsIdentified?.map((p, idx) => `${idx + 1}. ${p}`).join("\n") || "Initial Generation");
    
    navigator.clipboard.writeText(report);
    alert("Technical report copied to clipboard!");
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Progress Stepper */}
      <div className="flex items-center gap-4 px-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex-1 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
              iterations.length >= step 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'bg-white border-slate-200 text-slate-300'
            }`}>
              {step}
            </div>
            <div className="hidden sm:block">
              <div className={`text-[10px] font-bold uppercase tracking-wider ${iterations.length >= step ? 'text-indigo-600' : 'text-slate-300'}`}>
                Stage {step}
              </div>
              <div className={`text-xs font-semibold ${iterations.length >= step ? 'text-slate-900' : 'text-slate-400'}`}>
                {step === 1 ? 'Foundations' : step === 2 ? 'Optimization' : 'Peak Evolution'}
              </div>
            </div>
            {step < 3 && <div className={`flex-grow h-[2px] mx-4 transition-colors ${iterations.length > step ? 'bg-indigo-600' : 'bg-slate-200'}`}></div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Analytics Block */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
              <button 
                onClick={copyToClipboard}
                className="p-3 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all border border-slate-100"
                title="Copy Report"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-1 4h.01M9 16h5m0 0l-1-1m1 1l-1 1" />
                </svg>
              </button>
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Generation Output {current.index + 1}</h2>
              <p className="text-slate-400 mt-1 font-medium">Quantitative analysis of the evolutionary gradient.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
              <StatCard label="Mean Quality" value={`${(current.averageScore * 10).toFixed(1)}%`} sub="Aggregate Score" />
              <StatCard label="Population" value="20" sub="Diverse Ideas" />
              <StatCard label="Delta" value={`${current.deltaScore >= 0 ? '+' : ''}${(current.deltaScore * 10).toFixed(1)}%`} sub="vs Prev Gen" highlight />
              <StatCard label="Stage" value={current.index + 1} sub="Evolutionary Step" />
            </div>

            <div className="h-64 w-full -mx-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#cbd5e1', fontSize: 11, fontWeight: 700}} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    cursor={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '4 4' }}
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px 16px' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xl font-bold text-slate-800 tracking-tight">Top Performers</h3>
              <div className="h-[2px] flex-grow mx-8 bg-slate-100"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topIdeas.map((idea, idx) => (
                <IdeaCard key={idea.id} idea={idea} rank={idx + 1} />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="space-y-8">
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              Success Patterns
            </h3>
            
            <div className="space-y-4">
              {current.patternsIdentified ? (
                current.patternsIdentified.map((pattern, idx) => (
                  <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Pattern 0{idx + 1}</div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">{pattern}</p>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-500 italic text-sm">
                  Initial generation. Patterns will emerge in the next iteration.
                </div>
              )}
            </div>
          </div>

          <div className="bg-indigo-50 rounded-[2rem] p-8 border border-indigo-100">
             <h4 className="text-indigo-900 font-bold mb-2">The 7.2x Advantage</h4>
             <p className="text-indigo-700/70 text-sm leading-relaxed mb-6">
               Research proves that systematic AI evolution is 7.2x more effective than traditional brainstorming. 
               Structure beats total freedom.
             </p>
             <div className="bg-white rounded-2xl p-6 shadow-sm shadow-indigo-100">
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Total Improvement</div>
                <div className="text-4xl font-black text-indigo-600 tracking-tighter">
                  +{(current.averageScore / (iterations[0]?.averageScore || 1) * 100 - 100).toFixed(0)}%
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Tabular Full Data */}
      <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-8">Generation Manifest</h3>
        <div className="overflow-x-auto -mx-10 px-10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px] tracking-widest">
                <th className="pb-6 pr-4">Concept</th>
                <th className="pb-6 pr-4">Mechanism</th>
                <th className="pb-6 text-right">Metric</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {current.ideas.map((idea) => (
                <tr key={idea.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 pr-4 font-bold text-slate-800 align-top whitespace-nowrap">{idea.title}</td>
                  <td className="py-5 pr-4 text-slate-500 leading-relaxed max-w-lg">{idea.description}</td>
                  <td className="py-5 text-right align-top font-black text-indigo-600">
                    {idea.score ? `${(idea.score.total * 10).toFixed(1)}%` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, highlight = false }: { label: string, value: string | number, sub: string, highlight?: boolean }) => (
  <div className={`p-4 rounded-2xl border transition-all ${highlight ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-100' : 'bg-slate-50 border-slate-100 text-slate-900'}`}>
    <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${highlight ? 'text-indigo-200' : 'text-slate-400'}`}>{label}</div>
    <div className="text-xl font-black tracking-tight">{value}</div>
    <div className={`text-[10px] font-medium opacity-60 ${highlight ? 'text-indigo-100' : 'text-slate-500'}`}>{sub}</div>
  </div>
);

export default IterationSummary;
