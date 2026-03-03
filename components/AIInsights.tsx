import React, { useState } from 'react';
import { BrainCircuit, RefreshCw, Lightbulb, Sparkles } from 'lucide-react';
import { Transaction } from '../types';
import { getFinancialAnalysis } from '../services/geminiService';

interface AIInsightsProps {
  transactions: Transaction[];
}

export const AIInsights: React.FC<AIInsightsProps> = ({ transactions }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await getFinancialAnalysis(transactions);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group border border-rose-200 dark:border-rose-500/20">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-200 dark:bg-rose-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-30 -translate-y-1/2 translate-x-1/2 pointer-events-none animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px] opacity-20 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold flex items-center tracking-wide text-slate-900 dark:text-white">
            <BrainCircuit className="w-6 h-6 mr-3 text-rose-500 dark:text-rose-400" />
            AI Oracle
          </h3>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-white/50 dark:bg-rose-500/10 hover:bg-white dark:hover:bg-rose-500/20 backdrop-blur-md rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-200 transition-all disabled:opacity-50 border border-rose-200 dark:border-rose-500/20 hover:shadow-md"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2 text-rose-500 dark:text-rose-400" />
            )}
            {analysis ? 'Consult Again' : 'Consult AI'}
          </button>
        </div>

        {!analysis && !loading && (
          <div className="text-slate-500 dark:text-slate-300 text-sm leading-relaxed border-l-2 border-rose-300 dark:border-rose-500/30 pl-4">
            <p className="mb-2">Unlock insights from your data.</p>
            <p className="opacity-80">Tap the consult button to let Gemini analyze your spending flow.</p>
          </div>
        )}

        {loading && (
            <div className="flex flex-col items-center justify-center py-10 text-rose-500 dark:text-rose-200 animate-fade-in">
                <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4 shadow-lg shadow-rose-500/20"></div>
                <p className="text-sm font-medium animate-pulse">Reading the omens...</p>
            </div>
        )}

        {analysis && !loading && (
          <div className="animate-fade-in">
             <div className="whitespace-pre-wrap font-light text-slate-700 dark:text-slate-200 leading-relaxed bg-white/60 dark:bg-black/40 p-6 rounded-2xl border border-white/20 dark:border-white/5 backdrop-blur-sm shadow-inner">
                {analysis}
             </div>
             <div className="mt-4 flex items-center text-xs text-rose-500/60 dark:text-rose-400/60 justify-end">
                <Lightbulb className="w-3 h-3 mr-1.5" />
                <span>Powered by Gemini 2.5 Flash</span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};