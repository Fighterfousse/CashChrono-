import React, { useState, useEffect, useRef } from 'react';
import { Plus, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { Transaction, TransactionType, Category } from '../types';
import { suggestCategory } from '../services/geminiService';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  defaultCategory?: Category; 
  allowGeneralExpenses: boolean;
  currency: string;
}

const INCOME_CATEGORIES = [
  Category.SALARY,
  Category.BUSINESS,
  Category.SALES,
  Category.INVESTMENT,
  Category.SAVINGS,
  Category.OTHER
];

const EXPENSE_CATEGORIES = [
  Category.BUSINESS_EXPENSE,
  Category.INVESTMENT, 
  Category.FOOD,
  Category.TRANSPORT,
  Category.HOUSING,
  Category.UTILITIES,
  Category.ENTERTAINMENT,
  Category.HEALTHCARE,
  Category.SHOPPING,
  Category.OTHER
];

const DRAFT_KEY = 'cash_chrono_draft';

export const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction, defaultCategory, allowGeneralExpenses, currency }) => {
  // Initialize state from localStorage if available (Draft Restoration)
  const getDraft = () => {
    try {
        const saved = localStorage.getItem(DRAFT_KEY);
        return saved ? JSON.parse(saved) : null;
    } catch (e) {
        return null;
    }
  };
  
  const draft = getDraft();

  const [description, setDescription] = useState(draft?.description || '');
  const [amount, setAmount] = useState(draft?.amount || '');
  const [date, setDate] = useState(draft?.date || new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<TransactionType>(draft?.type || TransactionType.EXPENSE);
  const [category, setCategory] = useState<string>(draft?.category || Category.FOOD);
  
  const [isSuggesting, setIsSuggesting] = useState(false);
  const isMounted = useRef(false);

  // Save draft on every change
  useEffect(() => {
    if (isMounted.current) {
        const draftData = { description, amount, type, category, date };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
    }
  }, [description, amount, type, category, date]);

  // View/Category Logic
  useEffect(() => {
    if (!isMounted.current) {
        // On initial mount, if we loaded a draft and we are in 'Overview' (no defaultCategory),
        // we trust the draft values (initialized in useState). 
        // If defaultCategory IS present (e.g. Salary View), we must enforce it, overriding the draft.
        if (defaultCategory) {
            setCategory(defaultCategory);
            if ([Category.SALARY, Category.SALES, Category.BUSINESS].includes(defaultCategory)) {
                setType(TransactionType.INCOME);
            } else {
                setType(TransactionType.EXPENSE);
            }
        } else if (!draft) {
             // If no draft and no default category, set standard defaults
            if (allowGeneralExpenses) {
                setType(TransactionType.EXPENSE);
                setCategory(Category.FOOD);
            } else {
                setType(TransactionType.INCOME);
                setCategory(Category.SALARY);
            }
        }
        isMounted.current = true;
    } else {
        // On subsequent updates (e.g. View Change)
        if (defaultCategory) {
            setCategory(defaultCategory);
            if ([Category.SALARY, Category.SALES, Category.BUSINESS].includes(defaultCategory)) {
                setType(TransactionType.INCOME);
            } else {
                setType(TransactionType.EXPENSE);
            }
        } else {
             // Switching back to Overview or similar
            if (allowGeneralExpenses) {
                // Only reset if type is incompatible? 
                // Or just strictly enforce defaults when switching views?
                // Let's strictly enforce defaults when view props change to keep navigation predictable
                setType(TransactionType.EXPENSE);
                setCategory(Category.FOOD);
            } else {
                setType(TransactionType.INCOME);
                setCategory(Category.SALARY);
            }
        }
    }
  }, [defaultCategory, allowGeneralExpenses]); // Dependency array ensures this runs when view changes

  // Helper to update category defaults when switching types manually
  useEffect(() => {
    if (isMounted.current && !defaultCategory) {
        // Only auto-switch category if the current category is invalid for the new type
        // OR if we want to provide a better UX. 
        // The original code forced a reset. Let's check if current category fits.
        const isIncome = type === TransactionType.INCOME;
        const currentCat = category as Category;
        
        if (isIncome && !INCOME_CATEGORIES.includes(currentCat)) {
             setCategory(Category.SALARY);
        } else if (!isIncome && !EXPENSE_CATEGORIES.includes(currentCat)) {
             setCategory(Category.FOOD);
        }
    }
  }, [type, defaultCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    onAddTransaction({
      description,
      amount: parseFloat(amount),
      type,
      category,
      date,
    });

    // Clear Form
    setDescription('');
    setAmount('');
    // Reset to defaults based on view
    if (defaultCategory) {
      setCategory(defaultCategory);
    } else {
      setCategory(type === TransactionType.INCOME ? Category.SALARY : Category.FOOD);
    }
    
    // Clear Draft
    localStorage.removeItem(DRAFT_KEY);
  };

  const handleAutoCategorize = async () => {
    if (!description) return;
    setIsSuggesting(true);
    const suggested = await suggestCategory(description);
    
    setCategory(suggested);
    
    if (INCOME_CATEGORIES.includes(suggested as Category)) {
        setType(TransactionType.INCOME);
    } else if (EXPENSE_CATEGORIES.includes(suggested as Category) && suggested !== Category.OTHER) {
        setType(TransactionType.EXPENSE);
    }
    
    setIsSuggesting(false);
  };

  let availableCategories = type === TransactionType.INCOME ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  
  if (!allowGeneralExpenses && type === TransactionType.EXPENSE) {
      if (defaultCategory === Category.BUSINESS) {
          availableCategories = [Category.BUSINESS_EXPENSE];
      } else if (defaultCategory === Category.INVESTMENT) {
          availableCategories = [Category.INVESTMENT];
      }
  }

  return (
    <div className="glass-panel p-8 rounded-3xl h-full flex flex-col relative overflow-hidden">
      {/* Subtle red glow effect in background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center relative z-10">
        <span className="bg-rose-100 dark:bg-rose-500/20 p-2 rounded-lg mr-3 border border-rose-200 dark:border-rose-500/30">
            <Plus className="w-5 h-5 text-rose-500 dark:text-rose-400" />
        </span>
        New Transaction
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col relative z-10">
        {/* Custom Toggle Switch */}
        <div className="bg-slate-200/60 dark:bg-black/40 border border-slate-200 dark:border-white/10 p-1.5 rounded-xl flex relative cursor-pointer">
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg shadow-sm transition-all duration-300 ease-spring ${
                type === TransactionType.INCOME ? 'translate-x-[100%] translate-x-1.5' : 'translate-x-0'
            }`}
          ></div>
          <button
            type="button"
            onClick={() => setType(TransactionType.EXPENSE)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg relative z-10 transition-colors ${
              type === TransactionType.EXPENSE ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType(TransactionType.INCOME)}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg relative z-10 transition-colors ${
              type === TransactionType.INCOME ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            Income
          </button>
        </div>

        {/* Amount & Date */}
        <div className="grid grid-cols-2 gap-5">
          <div className="group">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Amount</label>
            <div className="relative transition-all duration-200 focus-within:scale-[1.02]">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">{currency}</span>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3.5 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 font-semibold text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition-all"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="group">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Date</label>
            <div className="relative transition-all duration-200 focus-within:scale-[1.02]">
                <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-slate-900 dark:text-white font-medium transition-all"
                />
            </div>
          </div>
        </div>

        {/* Description with AI Trigger */}
        <div className="group">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
          <div className="flex space-x-3">
            <div className="flex-1 relative transition-all duration-200 focus-within:scale-[1.01]">
                <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 transition-all"
                placeholder={type === TransactionType.INCOME ? "e.g. Freelance Project" : "e.g. Dark Coffee"}
                />
            </div>
            <button
              type="button"
              onClick={handleAutoCategorize}
              disabled={!description || isSuggesting}
              className={`px-4 rounded-xl transition-all duration-300 flex items-center justify-center border border-slate-200 dark:border-white/10 ${
                  isSuggesting 
                  ? 'bg-rose-500/20 text-rose-400' 
                  : 'bg-white/50 dark:bg-white/5 text-rose-500 dark:text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/50 hover:scale-105 hover:shadow-md'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none`}
              title="Auto-categorize with AI"
            >
              {isSuggesting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Category */}
        <div className="group">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Category</label>
          <div className="relative">
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3.5 bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 text-slate-900 dark:text-white font-medium appearance-none transition-all hover:bg-white/60 dark:hover:bg-white/5 cursor-pointer"
            >
                {availableCategories.map((cat) => (
                <option key={cat} value={cat} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {cat}
                </option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <div className="pt-2 mt-auto">
            <button
            type="submit"
            className={`w-full py-4 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center space-x-2 overflow-hidden relative group border border-white/10 ${
                type === TransactionType.INCOME 
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 dark:from-emerald-900 dark:to-emerald-600 dark:hover:from-emerald-800 dark:hover:to-emerald-500' 
                : 'bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 dark:from-rose-900 dark:to-red-600 dark:hover:from-rose-800 dark:hover:to-red-500'
            }`}
            >
            {/* Button Shine Effect */}
            <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            
            <span className="relative z-10">Add {type === TransactionType.INCOME ? 'Income' : 'Expense'}</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
        </div>
      </form>
    </div>
  );
};
