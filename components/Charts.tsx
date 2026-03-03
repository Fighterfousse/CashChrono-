import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Transaction, TransactionType } from '../types';

interface ChartsProps {
  transactions: Transaction[];
  currency: string;
}

// Vibrant colors for dark mode, adjusted for light
const COLORS = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4'];
const INCOME_COLORS = ['#10b981', '#34d399', '#6ee7b7', '#059669', '#047857'];

export const Charts: React.FC<ChartsProps> = ({ transactions, currency }) => {
  if (transactions.length === 0) {
    return (
      <div className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center h-80 text-center border border-slate-200 dark:border-white/5">
        <div className="bg-slate-100 dark:bg-white/5 p-6 rounded-full mb-4 border border-slate-200 dark:border-white/10">
            <span className="text-4xl opacity-50 grayscale">📊</span>
        </div>
        <h3 className="text-slate-800 dark:text-white font-bold text-lg">No data to visualize</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Add your first transaction to see your financial insights.</p>
      </div>
    );
  }

  const expensesByCategory = transactions
    .filter((t) => t.type === TransactionType.EXPENSE)
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const expensePieData = Object.entries(expensesByCategory).map(([name, value]) => ({ name, value }));

  const incomeByCategory = transactions
    .filter((t) => t.type === TransactionType.INCOME)
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const incomePieData = Object.entries(incomeByCategory).map(([name, value]) => ({ name, value }));

  const groupedByDate = transactions.reduce((acc, curr) => {
    const date = curr.date;
    if (!acc[date]) acc[date] = { date, income: 0, expense: 0 };
    if (curr.type === TransactionType.INCOME) acc[date].income += curr.amount;
    else acc[date].expense += curr.amount;
    return acc;
  }, {} as Record<string, { date: string; income: number; expense: number }>);

  const trendData = (Object.values(groupedByDate) as Array<{ date: string; income: number; expense: number }>)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14); 

  return (
    <div className="space-y-8">
      {/* Row 1: Income Trend */}
      <div className="glass-panel p-8 rounded-3xl flex flex-col transition-all hover:border-rose-400 dark:hover:border-rose-500/30">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center">
            <span className="w-3 h-3 bg-rose-500 rounded-full mr-3 animate-pulse shadow-[0_0_10px_#f43f5e]"></span>
            Income Trend
            </h3>
            <select className="text-sm border-slate-200 dark:border-white/10 border rounded-lg px-3 py-1.5 text-slate-600 dark:text-slate-300 bg-white/50 dark:bg-black/20 focus:outline-none hover:bg-white dark:hover:bg-white/5">
                <option>Last 14 Days</option>
            </select>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.2)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {month:'short', day:'numeric'})} 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} 
                tickFormatter={(val) => `${currency}${val}`} 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.3)', padding: '12px', color: '#f8fafc' }}
                cursor={{ stroke: '#f43f5e', strokeWidth: 1, strokeDasharray: '4 4' }}
                formatter={(value: number) => [`${currency}${value.toFixed(2)}`, 'Income']}
                labelStyle={{ color: '#cbd5e1' }}
                itemStyle={{ color: '#f43f5e' }}
              />
              <Area 
                type="monotone" 
                dataKey="income" 
                stroke="#f43f5e" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorIncome)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income Sources */}
        <div className="glass-panel p-8 rounded-3xl flex flex-col transition-all hover:border-rose-400 dark:hover:border-rose-500/30">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Income Sources</h3>
          <div className="flex-1 min-h-[300px]">
            {incomePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={incomePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    cornerRadius={6}
                    stroke="none"
                  >
                    {incomePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${currency}${value.toFixed(2)}`, 'Amount']}
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', padding: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span className="text-slate-600 dark:text-slate-400 font-medium ml-1">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <p>No income data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="glass-panel p-8 rounded-3xl flex flex-col transition-all hover:border-rose-400 dark:hover:border-rose-500/30">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Expense Breakdown</h3>
          <div className="flex-1 min-h-[300px]">
            {expensePieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    cornerRadius={6}
                    stroke="none"
                  >
                    {expensePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [`${currency}${value.toFixed(2)}`, 'Amount']}
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', padding: '12px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span className="text-slate-600 dark:text-slate-400 font-medium ml-1">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <p>No expense data available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};