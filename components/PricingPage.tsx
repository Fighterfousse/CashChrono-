import React, { useState } from 'react';
import { Check, Star, CreditCard, Lock, Loader2 } from 'lucide-react';

interface PricingPageProps {
  onSelectPlan: (plan: 'free' | 'premium') => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onSelectPlan }) => {
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'premium' | null>(null);
  const [step, setStep] = useState<'select' | 'payment'>('select');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelect = (plan: 'free' | 'premium') => {
    setSelectedPlan(plan);
    if (plan === 'premium') {
        setStep('payment');
    } else {
        onSelectPlan('free');
    }
  };

  const handlePayment = (e: React.FormEvent) => {
      e.preventDefault();
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          onSelectPlan('premium');
      }, 2000);
  };

  if (step === 'payment') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center py-10 px-6">
            <div className="glass-panel max-w-md w-full p-8 rounded-3xl border border-rose-500/30 animate-scale-in relative">
                <button 
                    onClick={() => setStep('select')}
                    className="absolute top-6 right-6 text-xs text-slate-400 hover:text-white"
                >
                    Cancel
                </button>
                
                <div className="flex items-center mb-6 space-x-3">
                    <div className="p-3 bg-rose-500/20 rounded-full text-rose-500">
                        <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Secure Payment</h3>
                        <p className="text-xs text-slate-400">Encrypted by dark matter technology</p>
                    </div>
                </div>

                <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10 flex justify-between items-center">
                    <div>
                        <div className="text-sm font-bold text-white">Elder Plan</div>
                        <div className="text-xs text-slate-400">Monthly Subscription</div>
                    </div>
                    <div className="text-xl font-bold text-rose-400">$12.00</div>
                </div>

                <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Card Number</label>
                        <div className="relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                                type="text" 
                                placeholder="0000 0000 0000 0000" 
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-rose-500 focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Expiry</label>
                            <input 
                                type="text" 
                                placeholder="MM/YY" 
                                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-rose-500 focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">CVC</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
                                <input 
                                    type="text" 
                                    placeholder="123" 
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-9 pr-4 text-white focus:border-rose-500 focus:outline-none"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={isProcessing}
                        className="w-full py-4 mt-4 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold rounded-xl shadow-lg shadow-rose-900/30 transition-all flex items-center justify-center"
                    >
                        {isProcessing ? <Loader2 className="animate-spin w-5 h-5" /> : 'Confirm Subscription'}
                    </button>
                </form>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-20 px-6">
        <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose your Path</h2>
            <p className="text-slate-400 text-lg">Investment in one's future is the first step to wealth.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full">
            
            {/* Free Plan */}
            <div className="glass-panel p-10 rounded-3xl border border-white/5 relative overflow-hidden animate-slide-up delay-100 hover:border-slate-500/30 transition-colors group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Star className="w-32 h-32" />
                </div>
                <h3 className="text-2xl font-bold text-slate-200 mb-2">Fledgling</h3>
                <div className="text-4xl font-bold text-white mb-6">$0 <span className="text-lg text-slate-500 font-normal">/ month</span></div>
                <p className="text-slate-400 mb-8 h-12">Perfect for those just beginning their journey into the night.</p>
                
                <ul className="space-y-4 mb-10">
                    {['Basic Expense Tracking', 'Monthly Overview', 'Standard Categories', '7-Day History'].map(feat => (
                        <li key={feat} className="flex items-center text-slate-300">
                            <Check className="w-5 h-5 text-slate-500 mr-3" />
                            {feat}
                        </li>
                    ))}
                </ul>

                <button 
                    onClick={() => handleSelect('free')}
                    className="w-full py-4 rounded-xl border border-white/10 hover:bg-white/5 font-bold transition-all"
                >
                    Select Free
                </button>
            </div>

            {/* Premium Plan */}
            <div className="glass-panel p-10 rounded-3xl border-2 border-rose-500/50 relative overflow-hidden animate-slide-up delay-200 hover:border-rose-500 transition-colors shadow-[0_0_40px_-10px_rgba(225,29,72,0.3)]">
                <div className="absolute top-0 right-0 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Most Popular
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Elder</h3>
                <div className="text-4xl font-bold text-white mb-6">$12 <span className="text-lg text-slate-500 font-normal">/ month</span></div>
                <p className="text-slate-400 mb-8 h-12">Total command over your empire with AI foresight.</p>
                
                <ul className="space-y-4 mb-10">
                    {['Unlimited Transactions', 'Gemini AI Predictions', 'Investment & Business Dashboards', 'Dark Mode Analytics'].map(feat => (
                        <li key={feat} className="flex items-center text-white font-medium">
                            <div className="bg-rose-500 rounded-full p-0.5 mr-3">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                            {feat}
                        </li>
                    ))}
                </ul>

                <button 
                    onClick={() => handleSelect('premium')}
                    className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg shadow-rose-900/40"
                >
                    Become an Elder
                </button>
            </div>

        </div>
    </div>
  );
};