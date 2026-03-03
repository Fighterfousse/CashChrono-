export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum Category {
  // Income Categories
  SALARY = 'Salary',
  BUSINESS = 'Business',
  SALES = 'Sales',
  INVESTMENT = 'Investment',
  SAVINGS = 'Savings',
  
  // Expense Categories
  BUSINESS_EXPENSE = 'Business Expense', 
  FOOD = 'Food & Drink',
  TRANSPORT = 'Transportation',
  HOUSING = 'Housing',
  UTILITIES = 'Utilities',
  ENTERTAINMENT = 'Entertainment',
  HEALTHCARE = 'Healthcare',
  SHOPPING = 'Shopping',
  
  OTHER = 'Other',
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: TransactionType;
  category: Category | string;
}

export interface SummaryCardData {
  title: string;
  value: string;
  colorClass: string;
  bgClass: string;
  icon: any;
}

export interface User {
  id: string;
  name: string;
  username: string;
  age: string;
  email: string;
  currency: string; // e.g., '$', '€', '£', '¥'
  plan?: 'free' | 'premium';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}