import React from 'react';
import { Trash2, ArrowUpRight, ArrowDownLeft, Calendar } from 'lucide-react';
import { Transaction, TransactionType } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  currency: string;
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, currency }) => {
  if (transactions.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="bg-slate-100 dark:bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-white/10">
          <Calendar className="w-8 h-8 text-slate-400 dark:text-slate-500" />
        </div>
        <h3 className="text-slate-800 dark:text-white font-bold text-lg">No transactions yet</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-xs mx-auto">Start adding your income and expenses above to build your history.</p>
      </div>
    );
  }

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50/80 dark:bg-black/20 border-b border-slate-200 dark:border-white/5">
            <tr>
              <th className="px-8 py-5 text-left text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider">Description</th>
              <th className="px-8 py-5 text-left text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider">Category</th>
              <th className="px-8 py-5 text-left text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider">Date</th>
              <th className="px-8 py-5 text-right text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider">Amount</th>
              <th className="px-8 py-5 text-center text-xs font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {sortedTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors group animate-fade-in">
                <td className="px-8 py-5">
                  <div className="flex items-center">
                    <div className={`p-2.5 rounded-xl mr-4 transition-transform group-hover:scale-110 shadow-sm ${
                        t.type === TransactionType.INCOME 
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'
                    }`}>
                        {t.type === TransactionType.INCOME ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-black dark:group-hover:text-white transition-colors">{t.description}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 text-xs rounded-full font-semibold border border-slate-200 dark:border-white/10 group-hover:border-rose-200 dark:group-hover:border-rose-500/30 transition-colors">
                        {t.category}
                    </span>
                </td>
                <td className="px-8 py-5 text-sm text-slate-500 font-medium">
                  {new Date(t.date).toLocaleDateString()}
                </td>
                <td className={`px-8 py-5 text-right font-bold text-base ${
                    t.type === TransactionType.INCOME ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}{currency}{t.amount.toFixed(2)}
                </td>
                <td className="px-8 py-5 text-center">
                  <button
                    onClick={() => onDelete(t.id)}
                    className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};