
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">Nexus</h1>
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.3em]">Creative Engine</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-6">
            <HeaderLink label="Stage 1: Generate" />
            <HeaderLink label="Stage 2: Score" />
            <HeaderLink label="Stage 3: Evolve" />
          </div>
          <div className="h-8 w-[1px] bg-slate-100 hidden sm:block"></div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            Scientific Mode Active
          </div>
        </div>
      </div>
    </header>
  );
};

const HeaderLink = ({ label }: { label: string }) => (
  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 cursor-default transition-colors">
    {label}
  </span>
);

export default Header;
