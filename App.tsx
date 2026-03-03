import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { PricingPage } from './components/PricingPage';
import { storageService } from './services/storage';
import { User } from './types';

type AppView = 'landing' | 'pricing' | 'auth' | 'dashboard';

function App() {
  const [view, setView] = useState<AppView>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session
  useEffect(() => {
    const currentUser = storageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setView('dashboard');
    }
    setIsLoading(false);
  }, []);

  const handleGetStarted = () => {
    setView('pricing');
  };

  const handlePlanSelected = (plan: 'free' | 'premium') => {
    // In a real app, you'd handle stripe/payment here
    // For now, move to auth
    setView('auth');
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('dashboard');
  };

  const handleLogout = () => {
    storageService.logout();
    setUser(null);
    setView('landing');
  };

  if (isLoading) {
    return <div className="min-h-screen bg-black"></div>;
  }

  return (
    <>
        {view === 'landing' && <LandingPage onGetStarted={handleGetStarted} />}
        
        {view === 'pricing' && <PricingPage onSelectPlan={handlePlanSelected} />}
        
        {view === 'auth' && <AuthPage onLogin={handleLogin} />}
        
        {view === 'dashboard' && user && (
            <Dashboard user={user} onLogout={handleLogout} />
        )}
    </>
  );
}

export default App;