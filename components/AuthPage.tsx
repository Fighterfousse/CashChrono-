import React, { useState } from 'react';
import { Droplets, Mail, Lock, ArrowRight, Loader2, User, Calendar, AtSign, Globe } from 'lucide-react';
import { storageService } from '../services/storage';
import { User as UserType } from '../types';

interface AuthPageProps {
  onLogin: (user: UserType) => void;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'Dollar (USD)' },
  { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
  { code: 'GBP', symbol: '£', name: 'Pound (GBP)' },
  { code: 'JPY', symbol: '¥', name: 'Yen (JPY)' },
  { code: 'CNY', symbol: '¥', name: 'Yuan (CNY)' },
  { code: 'INR', symbol: '₹', name: 'Rupee (INR)' },
  { code: 'RUB', symbol: '₽', name: 'Ruble (RUB)' },
  { code: 'XOF', symbol: 'XOF', name: 'Franc (CFA)' },
  { code: 'CAD', symbol: 'C$', name: 'Dollar (CAD)' },
];

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(false); // Default to signup to ask for details
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    age: '',
    email: '',
    password: '',
    currency: '$'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        const user = await storageService.login(formData.email);
        if (user) {
          onLogin(user);
        } else {
          setError("No account found with this email. Please sign up.");
        }
      } else {
        // Registration
        if (!formData.name || !formData.username || !formData.age) {
            setError("Please fill in all personal details.");
            setIsLoading(false);
            return;
        }
        
        const newUser = await storageService.register({
            name: formData.name,
            username: formData.username,
            age: formData.age,
            email: formData.email,
            currency: formData.currency,
            plan: 'free' // Default, updated via pricing usually
        });
        onLogin(newUser);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden py-10">
       <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/20 rounded-full blur-[100px] animate-pulse-slow"></div>
       </div>
       
       <div className="glass-panel w-full max-w-lg p-8 md:p-10 rounded-3xl border border-white/10 relative z-10 animate-scale-in">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-red-900 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-900/50">
                <Droplets className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-center mb-2 text-white">
            {isLogin ? 'Access the Vault' : 'Initiate Protocol'}
          </h2>
          <p className="text-center text-slate-400 mb-8 text-sm">
            {isLogin ? 'Enter your credentials to resume session.' : 'We need to know who you are before you enter.'}
          </p>

          {error && (
            <div className="mb-6 p-3 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-200 text-sm text-center">
                {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
             
             {!isLogin && (
                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                    <div className="group col-span-2 md:col-span-1">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Full Name"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all"
                            />
                        </div>
                    </div>
                     <div className="group col-span-2 md:col-span-1">
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                            <input 
                                type="number" 
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Age"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all"
                            />
                        </div>
                    </div>
                    <div className="group col-span-2">
                        <div className="relative">
                            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                            <input 
                                type="text" 
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Username (Codename)"
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all"
                            />
                        </div>
                    </div>
                    <div className="group col-span-2">
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                            <select 
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all appearance-none cursor-pointer"
                            >
                                {CURRENCIES.map(curr => (
                                    <option key={curr.code} value={curr.symbol} className="bg-black text-white">
                                        {curr.name} - {curr.symbol}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
             )}

             <div className="group">
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                    <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email address"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all"
                    />
                </div>
             </div>
             
             <div className="group">
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-rose-500 transition-colors" />
                    <input 
                        type="password" 
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-all"
                    />
                </div>
             </div>

             <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold rounded-xl shadow-lg shadow-rose-900/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center mt-4"
             >
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : (
                    <>
                        {isLogin ? 'Login' : 'Create Account'}
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                )}
             </button>
          </form>

          <div className="mt-8 text-center">
            <button 
                onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                }}
                className="text-sm text-slate-400 hover:text-white transition-colors"
            >
                {isLogin ? "Don't have an identity? Sign up" : "Already initiated? Login"}
            </button>
          </div>
       </div>
    </div>
  );
};