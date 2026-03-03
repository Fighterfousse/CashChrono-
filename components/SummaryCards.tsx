import React from 'react';
import { SummaryCardData } from '../types';

interface SummaryCardsProps {
  cards: SummaryCardData[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        // Added delay to stagger animations
        const delayClass = index === 0 ? 'delay-100' : index === 1 ? 'delay-200' : 'delay-300';
        
        // Logic for light/dark mode colors
        // We use Tailwind classes that adapt or generic logic
        let iconBg = 'bg-white/50 dark:bg-white/5';
        let iconColor = 'text-slate-700 dark:text-white';
        let borderColor = 'border-slate-200 dark:border-white/5';
        
        if (card.colorClass.includes('emerald')) {
            iconColor = 'text-emerald-600 dark:text-emerald-400';
            iconBg = 'bg-emerald-100 dark:bg-emerald-900/30';
            borderColor = 'border-emerald-100 dark:border-emerald-500/20';
        } else if (card.colorClass.includes('rose') || card.colorClass.includes('red')) {
            iconColor = 'text-rose-600 dark:text-rose-500';
            iconBg = 'bg-rose-100 dark:bg-rose-900/30';
             borderColor = 'border-rose-100 dark:border-rose-500/20';
        } else if (card.colorClass.includes('blue') || card.colorClass.includes('indigo')) {
            iconColor = 'text-blue-600 dark:text-blue-400';
            iconBg = 'bg-blue-100 dark:bg-blue-900/30';
             borderColor = 'border-blue-100 dark:border-blue-500/20';
        }

        return (
          <div 
            key={index} 
            className={`glass-panel p-8 rounded-3xl flex items-start space-x-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_0_25px_-5px_rgba(225,29,72,0.4)] border hover:border-rose-300 dark:hover:border-rose-500/50 animate-slide-up ${delayClass}`}
          >
            <div className={`p-4 rounded-2xl ${iconBg} ${iconColor} shadow-sm border ${borderColor}`}>
              <Icon className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{card.title}</p>
              <h3 className={`text-3xl font-bold tracking-tight text-slate-800 dark:text-white drop-shadow-sm`}>
                {card.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
};