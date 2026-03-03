import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Banknote, 
  Briefcase, 
  TrendingUp, 
  PiggyBank, 
  Menu, 
  X,
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  DollarSign,
  Calendar,
  Target,
  LineChart,
  ChevronRight,
  Droplets,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { Transaction, TransactionType, Category, SummaryCardData, User } from '../types';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { SummaryCards } from './SummaryCards';
import { Charts } from './Charts';
import { AIInsights } from './AIInsights';
import { storageService } from '../services/storage';

type ViewType = 'overview' | 'salary' | 'business' | 'sales' | 'savings' | 'investment';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const currency = user.currency || '$';

  // Initialize Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const isDarkMode = savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Load data on mount
  useEffect(() => {
    if (user) {
      const data = storageService.getTransactions(user.id);
      setTransactions(data);
    }
  }, [user]);

  // Save data on change
  useEffect(() => {
    if (user) {
      storageService.saveTransactions(user.id, transactions);
    }
  }, [transactions, user]);

  const addTransaction = (data: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...data,
      id: crypto.randomUUID(),
    };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Filtering Logic ---
  const getFilteredTransactions = () => {
    switch (currentView) {
      case 'salary':
        return transactions.filter(t => t.category === Category.SALARY || t.category === Category.OTHER); // Allow Other for salary adjustments
      case 'business':
        return transactions.filter(t => t.category === Category.BUSINESS || t.category === Category.BUSINESS_EXPENSE);
      case 'sales':
        return transactions.filter(t => t.category === Category.SALES);
      case 'savings':
        return transactions.filter(t => t.category === Category.SAVINGS);
      case 'investment':
        return transactions.filter(t => t.category === Category.INVESTMENT);
      default:
        return transactions;
    }
  };

  const filteredTransactions = getFilteredTransactions();

  // --- Dynamic Summary Data Calculation ---
  const getSummaryCards = (): SummaryCardData[] => {
    const format = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n).replace('$', currency);
    
    if (currentView === 'overview') {
      const income = transactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
      const expense = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);
      const balance = income - expense;
      return [
        { title: 'Total Balance', value: format(balance), colorClass: balance >= 0 ? 'text-emerald-500' : 'text-rose-500', bgClass: '', icon: Wallet },
        { title: 'Total Income', value: format(income), colorClass: 'text-emerald-500', bgClass: '', icon: ArrowUpCircle },
        { title: 'Total Expenses', value: format(expense), colorClass: 'text-rose-500', bgClass: '', icon: ArrowDownCircle },
      ];
    }
    
    if (currentView === 'salary') {
      const salaryTx = filteredTransactions.filter(t => t.type === TransactionType.INCOME); // Only count income for stats
      const totalEarned = salaryTx.reduce((acc, t) => acc + t.amount, 0);
      const avgPay = salaryTx.length > 0 ? totalEarned / salaryTx.length : 0;
      return [
        { title: 'Total Salary Earned', value: format(totalEarned), colorClass: 'text-emerald-500', bgClass: '', icon: Banknote },
        { title: 'Average Paycheck', value: format(avgPay), colorClass: 'text-blue-500', bgClass: '', icon: DollarSign },
        { title: 'Paychecks Received', value: salaryTx.length.toString(), colorClass: 'text-indigo-500', bgClass: '', icon: Calendar },
      ];
    }

    if (currentView === 'business') {
      const revenue = filteredTransactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
      const expenses = filteredTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);
      const profit = revenue - expenses;
      return [
        { title: 'Business Revenue', value: format(revenue), colorClass: 'text-emerald-500', bgClass: '', icon: TrendingUp },
        { title: 'Business Expenses', value: format(expenses), colorClass: 'text-rose-500', bgClass: '', icon: ArrowDownCircle },
        { title: 'Net Profit', value: format(profit), colorClass: profit >= 0 ? 'text-emerald-500' : 'text-rose-500', bgClass: '', icon: Wallet },
      ];
    }

    if (currentView === 'sales') {
      const totalSales = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);
      const count = filteredTransactions.length;
      const avgSale = count > 0 ? totalSales / count : 0;
      return [
        { title: 'Total Sales Volume', value: format(totalSales), colorClass: 'text-emerald-500', bgClass: '', icon: TrendingUp },
        { title: 'Average Sale', value: format(avgSale), colorClass: 'text-blue-500', bgClass: '', icon: Target },
        { title: 'Transactions', value: count.toString(), colorClass: 'text-slate-600 dark:text-slate-200', bgClass: '', icon: Calendar },
      ];
    }

    if (currentView === 'savings') {
      const totalSaved = filteredTransactions.reduce((acc, t) => acc + t.amount, 0);
      // Simple heuristic: last 30 days
      const now = new Date();
      const monthAgo = new Date(now.setDate(now.getDate() - 30));
      const recentSavings = filteredTransactions.filter(t => new Date(t.date) > monthAgo).reduce((acc, t) => acc + t.amount, 0);

      return [
        { title: 'Total Savings', value: format(totalSaved), colorClass: 'text-emerald-500', bgClass: '', icon: PiggyBank },
        { title: 'Last 30 Days', value: format(recentSavings), colorClass: 'text-indigo-500', bgClass: '', icon: Calendar },
        { title: 'Contributions', value: filteredTransactions.length.toString(), colorClass: 'text-slate-600 dark:text-slate-200', bgClass: '', icon: ArrowUpCircle },
      ];
    }

    if (currentView === 'investment') {
      const invested = filteredTransactions.filter(t => t.type === TransactionType.EXPENSE).reduce((acc, t) => acc + t.amount, 0);
      const returns = filteredTransactions.filter(t => t.type === TransactionType.INCOME).reduce((acc, t) => acc + t.amount, 0);
      const performance = returns - invested;
      
      return [
        { title: 'Total Invested', value: format(invested), colorClass: 'text-blue-500', bgClass: '', icon: Wallet },
        { title: 'Total Returns', value: format(returns), colorClass: 'text-emerald-500', bgClass: '', icon: TrendingUp },
        { title: 'Net Performance', value: format(performance), colorClass: performance >= 0 ? 'text-emerald-500' : 'text-rose-500', bgClass: '', icon: performance >= 0 ? ArrowUpCircle : ArrowDownCircle },
      ];
    }

    return [];
  };

  // --- Determine Default Category & if generic expenses allowed ---
  const getDefaultCategory = (): Category | undefined => {
    switch(currentView) {
      case 'salary': return Category.SALARY;
      case 'business': return Category.BUSINESS;
      case 'sales': return Category.SALES;
      case 'savings': return Category.SAVINGS;
      case 'investment': return Category.INVESTMENT;
      default: return undefined;
    }
  };

  const getAllowGeneralExpenses = (): boolean => {
      return currentView === 'overview' || currentView === 'salary';
  };

  // --- Navigation Items ---
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'salary', label: 'Salary Tracker', icon: Banknote },
    { id: 'business', label: 'Business Hub', icon: Briefcase },
    { id: 'sales', label: 'Sales Analytics', icon: TrendingUp },
    { id: 'savings', label: 'Savings Goal', icon: PiggyBank },
    { id: 'investment', label: 'Investments', icon: LineChart },
  ];

  const getPageTitle = () => {
    const item = navItems.find(n => n.id === currentView);
    return item ? item.label : 'Dashboard';
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans text-slate-900 dark:text-white bg-transparent transition-colors duration-300">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white/80 dark:bg-black/80 backdrop-blur-md p-4 flex items-center justify-between sticky top-0 z-50 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-rose-600 to-red-900 rounded-xl flex items-center justify-center shadow-lg shadow-rose-900/50">
            <Droplets className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Cash Chrono</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white/80 dark:bg-black/60 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen flex-shrink-0 flex flex-col
        ${mobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-red-900 rounded-xl flex items-center justify-center shadow-rose-600/40 shadow-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
            <Droplets className="w-5 h-5 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight font-outfit">Cash Chrono</h1>
        </div>

        <nav className="px-4 py-2 space-y-1.5 flex-1">
          <div className="px-4 py-3 text-xs font-bold text-slate-500 dark:text-rose-500/80 uppercase tracking-widest">
            Main Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as ViewType);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group border border-transparent ${
                  isActive 
                    ? 'bg-rose-50 dark:bg-rose-600/20 text-rose-600 dark:text-white border-rose-200 dark:border-rose-600/30 shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white hover:border-slate-100 dark:hover:border-white/5'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                    <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-rose-500 dark:group-hover:text-rose-400/80'}`} />
                    <span className="font-medium tracking-wide">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-rose-500 dark:text-rose-400 animate-fade-in" />}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 mb-2">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center text-rose-600 dark:text-rose-200 font-bold text-sm">
                        {user.username ? user.username.charAt(0).toUpperCase() : user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800 dark:text-white">{user.username || user.name}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{user.plan === 'premium' ? 'Elder' : 'Fledgling'}</span>
                    </div>
                </div>
            </div>
            <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center space-x-2 py-3 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-white hover:bg-rose-50 dark:hover:bg-white/5 rounded-xl transition-all"
            >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Log Out</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen scroll-smooth relative z-10">
        <div className="p-6 md:p-10 max-w-[1600px] mx-auto space-y-8">
            
          {/* Animated Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-fade-in">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight drop-shadow-sm dark:drop-shadow-md">{getPageTitle()}</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                {currentView === 'overview' 
                  ? "Your financial heartbeat."
                  : `Analysis of your ${currentView} flow.`
                }
              </p>
            </div>
            
            <div className="flex items-center gap-4">
                {/* Theme Toggle */}
                <button 
                    onClick={toggleTheme}
                    className="p-2.5 rounded-full bg-white/50 dark:bg-black/40 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10 transition-all"
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="hidden md:flex items-center space-x-2 px-5 py-2.5 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-full border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md transition-all cursor-default">
                    <Calendar className="w-4 h-4 text-rose-500" />
                    <span>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
          </header>

          {/* Key is important here to trigger the slideUp animation on view change */}
          <div key={currentView} className="space-y-8 animate-slide-up">
              
              {/* Summary Cards */}
              <SummaryCards cards={getSummaryCards()} />

              {/* Main Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Left Column: Form & AI */}
                <div className="space-y-8 xl:col-span-1">
                  <TransactionForm 
                    onAddTransaction={addTransaction} 
                    defaultCategory={getDefaultCategory()} 
                    allowGeneralExpenses={getAllowGeneralExpenses()}
                    currency={currency}
                  />
                  <AIInsights transactions={filteredTransactions} />
                </div>

                {/* Right Column: Charts & List */}
                <div className="xl:col-span-2 space-y-8">
                  <Charts transactions={filteredTransactions} currency={currency} />
                  
                  <div className="glass-panel rounded-3xl overflow-hidden">
                     <div className="p-8 border-b border-slate-200/50 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-black/20">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white">{currentView === 'overview' ? 'Recent Transactions' : `${getPageTitle()} History`}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your flow</p>
                        </div>
                        <span className="text-xs font-bold px-3 py-1.5 bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-500/20 rounded-full">
                            {filteredTransactions.length} Records
                        </span>
                     </div>
                     <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} currency={currency} />
                  </div>
                </div>

              </div>
          </div>
        </div>
      </main>
    </div>
  );
};