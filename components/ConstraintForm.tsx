
import React, { useState } from 'react';
import { Constraints } from '../types';

interface Props {
  onSubmit: (constraints: Constraints) => void;
  isLoading: boolean;
}

const ConstraintForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<Constraints>({
    domain: 'Software Engineering',
    problem: 'Reducing churn for a SaaS productivity tool using AI agents.',
    budgetLimit: 'Under $50k initial R&D',
    timeline: '3 months to MVP',
    otherRequirements: 'Must prioritize user privacy and low latency.'
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Define Constraints</h2>
      <p className="text-slate-500 mb-8">Precise constraints act as "scaffolding" for AI creativity, preventing decision fatigue.</p>
      
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Domain</label>
          <input 
            type="text" 
            value={formData.domain}
            onChange={e => setFormData({...formData, domain: e.target.value})}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="e.g., Marketing, Hardware, Education"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">The Problem / Challenge</label>
          <textarea 
            rows={3}
            value={formData.problem}
            onChange={e => setFormData({...formData, problem: e.target.value})}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="What are we trying to solve?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Budget Limit</label>
            <input 
              type="text" 
              value={formData.budgetLimit}
              onChange={e => setFormData({...formData, budgetLimit: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="e.g. < $1,000"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Timeline</label>
            <input 
              type="text" 
              value={formData.timeline}
              onChange={e => setFormData({...formData, timeline: e.target.value})}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              placeholder="e.g. 6 months"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Other Requirements</label>
          <textarea 
            rows={2}
            value={formData.otherRequirements}
            onChange={e => setFormData({...formData, otherRequirements: e.target.value})}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="Any specific must-haves or constraints?"
          />
        </div>

        <button 
          disabled={isLoading}
          type="submit"
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 disabled:bg-slate-300 disabled:shadow-none"
        >
          {isLoading ? 'Processing...' : 'Start Systematic Process'}
        </button>
      </form>
    </div>
  );
};

export default ConstraintForm;
