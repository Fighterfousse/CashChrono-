import { GoogleGenAI } from "@google/genai";
import { Transaction, Category } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to categorize a transaction based on description
export const suggestCategory = async (description: string): Promise<string> => {
  if (!apiKey) return Category.OTHER;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Categorize this transaction description: "${description}". 
      The available categories are: [${Object.values(Category).join(', ')}]. 
      If it's a business related expense (e.g. server costs, office rent), use "Business Expense".
      If the description suggests receiving money (e.g., salary, freelance, refund, sales), choose a fitting Income category (Salary, Business, Sales, etc.).
      If it suggests spending money, choose a fitting Expense category.
      Return ONLY the category name.`,
    });
    
    const text = response.text?.trim();
    return text || Category.OTHER;
  } catch (error) {
    console.error("Error categorizing transaction:", error);
    return Category.OTHER;
  }
};

// Helper to provide financial advice
export const getFinancialAnalysis = async (transactions: Transaction[]): Promise<string> => {
  if (!apiKey) return "Please configure your API Key to receive AI insights.";
  if (transactions.length === 0) return "Add some transactions to get AI-powered insights!";

  try {
    // Simplify data to save tokens
    const simplifiedData = transactions.map(t => ({
      date: t.date,
      desc: t.description,
      amount: t.amount,
      type: t.type,
      cat: t.category
    })).slice(-50); // Analyze last 50 transactions to avoid token limits on large history

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Act as a financial advisor. Analyze these transactions: ${JSON.stringify(simplifiedData)}.
      Provide a helpful summary in Markdown format. 
      Include:
      1. Spending patterns observation.
      2. Income and saving opportunities.
      3. A short encouraging closing remark.
      Keep it concise (under 250 words). use emojis where appropriate.`,
    });

    return response.text || "Could not generate analysis.";
  } catch (error) {
    console.error("Error getting analysis:", error);
    return "Sorry, I encountered an error while analyzing your finances. Please try again later.";
  }
};
