import { Transaction, User } from '../types';

// Keys
const USER_KEY = 'cash_chrono_user';
const DATA_KEY = 'cash_chrono_transactions_';

export const storageService = {
  // Auth
  register: async (userDetails: Omit<User, 'id'>): Promise<User> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newUser: User = {
      ...userDetails,
      id: 'u_' + Math.random().toString(36).substring(2, 9),
    };
    
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  login: async (email: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, we would validate password against DB.
    // Here we just check if the stored user matches the email, or we create a mock one if in dev mode?
    // For this demo, we will retrieve the stored user if it exists, otherwise simulate a login success for a generic user 
    // IF registration was skipped (which we don't allow anymore, but for safety).
    
    const stored = localStorage.getItem(USER_KEY);
    if (stored) {
        const user = JSON.parse(stored);
        if (user.email === email) return user;
    }
    
    // If no user found in local storage match, return null (login failed)
    // But for the sake of the demo flow, if someone tries to login without signing up first, 
    // we might want to prompt them.
    return null;
  },

  logout: () => {
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Data
  getTransactions: (userId: string): Transaction[] => {
    const stored = localStorage.getItem(DATA_KEY + userId);
    return stored ? JSON.parse(stored) : [];
  },

  saveTransactions: (userId: string, transactions: Transaction[]) => {
    localStorage.setItem(DATA_KEY + userId, JSON.stringify(transactions));
  }
};