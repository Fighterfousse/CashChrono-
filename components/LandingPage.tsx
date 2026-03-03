import React, { useEffect, useRef } from 'react';
import { ArrowRight, Droplets, Star, BrainCircuit, Activity, Lock, Briefcase, TrendingUp, PiggyBank } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Intersection Observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Mouse tracking for "spotlight" effect on cards
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.querySelectorAll('.spotlight-card').forEach((card) => {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-white overflow-x-hidden bg-transparent">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/5 dark:bg-black/5 backdrop-blur-lg border-b border-slate-200/10 dark:border-white/5 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-red-950 rounded-xl flex items-center justify-center shadow-lg shadow-rose-900/20 group-hover:scale-110 transition-transform duration-500 ease-out-expo">
              <Droplets className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight font-outfit bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">Cash Chrono</span>
          </div>
          <div className="flex items-center space-x-10">
            <div className="hidden md:flex space-x-8">
              {['Dashboards', 'Features', 'Reviews'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-white transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-600 dark:bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>
            <button 
              onClick={onGetStarted}
              className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-full hover:bg-rose-600 dark:hover:bg-rose-500 dark:hover:text-white transition-all duration-300 text-sm shadow-lg shadow-slate-900/20 hover:shadow-rose-500/30 hover:scale-105 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 min-h-[90vh] flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="flex flex-col items-center text-center">
            
            {/* Animated Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border border-rose-500/20 bg-rose-500/5 text-rose-500 dark:text-rose-400 text-xs font-bold uppercase tracking-widest mb-10 animate-reveal" style={{animationDelay: '0.1s'}}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <span>AI-Driven Financial Intelligence</span>
            </div>

            {/* Hero Text with Staggered Reveal */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.1] tracking-tight mb-8 max-w-5xl mx-auto">
              <span className="block overflow-hidden">
                <span className="block animate-text-slide-up" style={{animationDelay: '0.2s'}}>Master your wealth</span>
              </span>
              <span className="block overflow-hidden">
                <span className="block animate-text-slide-up" style={{animationDelay: '0.4s'}}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-red-500 to-orange-500 dark:from-rose-400 dark:via-red-400 dark:to-orange-400">
                    from the shadows.
                  </span>
                </span>
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 max-w-2xl leading-relaxed animate-reveal" style={{animationDelay: '0.6s'}}>
              Cash Chrono is more than a tracker. It is a sentient ledger.
              Categorize salaries, business ventures, and investments with 
              <span className="text-rose-600 dark:text-rose-400 font-semibold"> Gemini 2.5 Flash</span> precision.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-reveal" style={{animationDelay: '0.8s'}}>
              <button 
                onClick={onGetStarted}
                className="group relative px-8 py-4 bg-rose-600 text-white font-bold rounded-full overflow-hidden shadow-[0_0_40px_-10px_rgba(225,29,72,0.5)] hover:shadow-[0_0_60px_-15px_rgba(225,29,72,0.7)] transition-all duration-500 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
                <span className="flex items-center relative z-10">
                  Start Tracking <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="px-8 py-4 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-semibold rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                Watch Protocol Demo
              </button>
            </div>
          </div>
        </div>
        
        {/* Background Dynamic Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-rose-500/20 rounded-full blur-[120px] animate-float opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] animate-float opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen" style={{animationDelay: '-3s'}}></div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-slate-200/50 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mb-8 animate-reveal">Trusted by leading financial entities</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 items-center opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                {['Vortex Capital', 'Apex Ledger', 'Quantum Fund', 'Nebula Corp', 'Horizon Ventures'].map((brand, i) => (
                    <div key={i} className="flex items-center gap-2 group cursor-default hover:scale-110 transition-transform">
                        <div className="w-8 h-8 rounded bg-slate-400 dark:bg-slate-600 group-hover:bg-rose-500 transition-colors transform rotate-45 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <span className="text-xl font-bold text-slate-500 dark:text-slate-300 group-hover:text-rose-600 dark:group-hover:text-white transition-colors">{brand}</span>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Main Dashboard Showcase Section */}
      <section id="dashboards" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-24 reveal-on-scroll">
                 <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-slate-900 dark:text-white">Command your Empire</h2>
                 <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">Three specialized interfaces. One unified truth.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Business Hub Card */}
                <div className="spotlight-card bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 h-[500px] flex flex-col relative overflow-hidden group hover:border-rose-500/50 transition-all duration-500 reveal-on-scroll">
                     {/* Spotlight */}
                     <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{background: 'radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(244, 63, 94, 0.1), transparent 40%)'}}></div>
                     
                     <div className="mb-8 relative z-10">
                         <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400 mb-4">
                             <Briefcase className="w-6 h-6" />
                         </div>
                         <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Business Hub</h3>
                         <p className="text-slate-500 dark:text-slate-400 text-sm">Track P&L, revenue streams, and burn rate in real-time.</p>
                     </div>

                     {/* CSS Mockup */}
                     <div className="mt-auto relative bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl p-4 shadow-xl group-hover:translate-y-[-10px] transition-transform duration-500">
                         <div className="flex justify-between items-end h-32 gap-2">
                             {[40, 70, 45, 90, 65, 85].map((h, i) => (
                                 <div key={i} className="w-full bg-rose-100 dark:bg-rose-500/20 rounded-t relative overflow-hidden group-hover:bg-rose-200 dark:group-hover:bg-rose-500/40 transition-colors">
                                     <div className="absolute bottom-0 w-full bg-rose-500 transition-all duration-1000" style={{height: `${h}%`}}></div>
                                 </div>
                             ))}
                         </div>
                         <div className="mt-3 flex justify-between text-xs font-mono text-slate-400">
                             <span>REVENUE</span>
                             <span className="text-rose-500">+24.5%</span>
                         </div>
                     </div>
                </div>

                {/* Investment Card */}
                <div className="spotlight-card bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 h-[500px] flex flex-col relative overflow-hidden group hover:border-blue-500/50 transition-all duration-500 reveal-on-scroll" style={{transitionDelay: '100ms'}}>
                     <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{background: 'radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.1), transparent 40%)'}}></div>
                     
                     <div className="mb-8 relative z-10">
                         <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                             <TrendingUp className="w-6 h-6" />
                         </div>
                         <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Investment</h3>
                         <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor assets, crypto allocations, and market ROI.</p>
                     </div>

                     {/* CSS Mockup */}
                     <div className="mt-auto relative bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl p-4 shadow-xl group-hover:translate-y-[-10px] transition-transform duration-500">
                         <div className="relative h-32 w-full flex items-end">
                             <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                                 <path d="M0,100 C20,80 40,90 60,50 C80,20 100,40 120,10 C140,30 160,20 200,0" fill="none" stroke="#3b82f6" strokeWidth="3" className="drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                 <path d="M0,100 L200,100" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                             </svg>
                             {/* Floating dots */}
                             <div className="absolute top-[10%] right-[10%] w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-[0_0_15px_#3b82f6]"></div>
                         </div>
                         <div className="mt-3 flex justify-between text-xs font-mono text-slate-400">
                             <span>PORTFOLIO</span>
                             <span className="text-blue-500">+$12k</span>
                         </div>
                     </div>
                </div>

                {/* Savings Card */}
                <div className="spotlight-card bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 h-[500px] flex flex-col relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-500 reveal-on-scroll" style={{transitionDelay: '200ms'}}>
                     <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{background: 'radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.1), transparent 40%)'}}></div>
                     
                     <div className="mb-8 relative z-10">
                         <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                             <PiggyBank className="w-6 h-6" />
                         </div>
                         <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Vault & Savings</h3>
                         <p className="text-slate-500 dark:text-slate-400 text-sm">Automated goal tracking for your long-term liquidity.</p>
                     </div>

                     {/* CSS Mockup */}
                     <div className="mt-auto relative bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl p-4 shadow-xl group-hover:translate-y-[-10px] transition-transform duration-500 flex items-center justify-center h-40">
                         <div className="relative w-28 h-28">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200 dark:text-slate-800" />
                                <circle cx="56" cy="56" r="50" stroke="#10b981" strokeWidth="8" fill="transparent" strokeDasharray="314" strokeDashoffset="70" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-2xl font-bold text-slate-900 dark:text-white">78%</span>
                                <span className="text-[10px] text-emerald-500 dark:text-emerald-400 uppercase">Funded</span>
                            </div>
                         </div>
                     </div>
                </div>
            </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center reveal-on-scroll">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-slate-900 dark:text-white">The Immortal Advantage</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                Why rely on archaic spreadsheets when you can wield an evolving AI assistant? 
                Designed for the modern elite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-auto md:grid-rows-2 gap-6 h-auto md:h-[800px]">
            
            {/* Card 1: AI Core - Large */}
            <div className="spotlight-card md:col-span-2 md:row-span-2 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-[2rem] p-12 relative overflow-hidden group hover:border-rose-500/30 transition-all duration-700 reveal-on-scroll">
              {/* Spotlight Gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                   style={{background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(244, 63, 94, 0.06), transparent 40%)'}}></div>
              
              <div className="absolute top-0 right-0 p-12 opacity-5 dark:opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700">
                 <BrainCircuit className="w-64 h-64 text-slate-900 dark:text-white" />
              </div>

              <div className="relative z-10 h-full flex flex-col">
                  <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/20 rounded-2xl flex items-center justify-center mb-8 text-rose-600 dark:text-rose-400">
                    <BrainCircuit className="w-8 h-8" />
                  </div>
                  <h3 className="text-4xl font-bold mb-6 text-slate-900 dark:text-white">Gemini AI Core</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xl leading-relaxed max-w-lg mb-10">
                    Our integrated Gemini 2.5 Flash model doesn't just log numbers. It understands context. 
                    It categorizes "Blood Bags" as essential supplies and "Sunscreen" as... unnecessary risk.
                  </p>
                  
                  {/* Interactive Mock UI */}
                  <div className="mt-auto bg-slate-100 dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/5 p-6 backdrop-blur-sm shadow-2xl transform group-hover:translate-y-[-10px] transition-transform duration-500">
                     <div className="flex items-center space-x-4 mb-4 border-b border-slate-200 dark:border-white/5 pb-4">
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                        <span className="text-xs font-mono text-rose-500 uppercase tracking-widest">Live Analysis</span>
                     </div>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="h-2 w-1/3 bg-slate-200 dark:bg-white/10 rounded"></div>
                            <div className="h-2 w-1/4 bg-rose-500/40 rounded"></div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="h-2 w-1/2 bg-slate-200 dark:bg-white/10 rounded"></div>
                            <div className="h-2 w-1/5 bg-emerald-500/40 rounded"></div>
                        </div>
                         <div className="p-3 bg-rose-500/10 rounded-lg mt-2 text-xs text-rose-600 dark:text-rose-300 font-mono">
                            &gt; Anomaly detected in sector 7 expenses. Recommendation: Liquidation.
                        </div>
                     </div>
                  </div>
              </div>
            </div>

            {/* Card 2: Dashboard */}
            <div className="spotlight-card bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500 reveal-on-scroll">
               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                   style={{background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.06), transparent 40%)'}}></div>
               
               <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                 <Activity className="w-6 h-6" />
               </div>
               <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Real-time P&L</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Instant visualization of your business health. Track revenue vs expenses with zero latency.</p>
            </div>

            {/* Card 3: Security */}
            <div className="spotlight-card bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-[2rem] p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-500 reveal-on-scroll">
               <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                   style={{background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.06), transparent 40%)'}}></div>
               
               <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                 <Lock className="w-6 h-6" />
               </div>
               <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Vault Security</h3>
               <p className="text-slate-500 dark:text-slate-400 text-sm">Your financial data is encrypted with protocols that would baffle even the most ancient cryptographers.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-32 bg-slate-50/50 dark:bg-black/20 border-t border-slate-200 dark:border-white/5">
         <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold mb-20 text-center reveal-on-scroll text-slate-900 dark:text-white">Whispers from the Dark</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { name: "Vlad T.", role: "CEO, Night Industries", text: "Finally, a dashboard that understands that blood bags are a business expense, not groceries. The categorization is impeccable." },
                    { name: "Selene C.", role: "Asset Manager", text: "The AI predictions are scary accurate. It knew I was going over budget on ammo before I did. Essential for survival." },
                    { name: "Carmilla K.", role: "Art Collector", text: "Beautiful UI. The crimson glow makes me feel right at home while managing my centuries-old estate." }
                ].map((review, i) => (
                    <div key={i} className="bg-white dark:bg-black/40 p-10 rounded-[2rem] border border-slate-200 dark:border-white/5 relative group reveal-on-scroll hover:-translate-y-2 transition-transform duration-500 hover:shadow-xl hover:shadow-rose-900/5">
                        <div className="flex gap-1 mb-6 text-rose-500">
                            {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg italic leading-relaxed">"{review.text}"</p>
                        <div className="flex items-center mt-auto border-t border-slate-100 dark:border-white/5 pt-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-white/10 dark:to-white/5 rounded-full flex items-center justify-center font-bold text-slate-600 dark:text-white mr-4">
                                {review.name.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 dark:text-white text-base">{review.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">{review.role}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* Contact / CTA Section */}
      <section id="about" className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
            <div className="bg-slate-900 dark:bg-gradient-to-b dark:from-white/5 dark:to-transparent rounded-[3rem] p-12 md:p-24 border border-slate-200 dark:border-white/10 relative overflow-hidden reveal-on-scroll">
                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/20 rounded-full blur-[100px] animate-pulse-slow -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to ascend?</h2>
                        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                            Join the ranks of the financially enlightened. Control your empire with the precision it deserves.
                            Immortality is optional, but financial freedom is mandatory.
                        </p>
                        <form className="space-y-4 max-w-md">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input type="email" placeholder="Enter your email" className="flex-1 bg-white/10 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all" />
                                <button className="px-8 py-4 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-500 transition-all shadow-lg shadow-rose-900/30">
                                    Join Waitlist
                                </button>
                            </div>
                            <p className="text-xs text-slate-500">No spam. Only critical intel.</p>
                        </form>
                    </div>
                    <div className="hidden md:block relative">
                        {/* Decorative UI Element */}
                        <div className="glass-card p-8 rounded-3xl border border-white/10 transform rotate-3 hover:rotate-0 transition-transform duration-700 hover:scale-105">
                             <div className="flex items-center justify-between mb-8">
                                 <div>
                                     <div className="text-sm text-slate-400 uppercase tracking-wider font-bold">Total Net Worth</div>
                                     <div className="text-4xl font-bold text-white mt-1">$12,450,000</div>
                                 </div>
                                 <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                                     <Activity className="w-8 h-8" />
                                 </div>
                             </div>
                             <div className="h-32 flex items-end space-x-2">
                                 {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                     <div key={i} className="flex-1 bg-rose-500/20 rounded-t-lg hover:bg-rose-500/60 transition-colors" style={{height: `${h}%`}}></div>
                                 ))}
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-200/50 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Droplets className="w-5 h-5 text-rose-600 dark:text-white" />
                <span className="font-bold text-slate-900 dark:text-white tracking-tight">Cash Chrono</span>
            </div>
            <p className="text-slate-500 dark:text-slate-600 text-sm">&copy; 2024 Cash Chrono. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};