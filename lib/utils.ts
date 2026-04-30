import { Loan, Transaction } from './types';

export function formatCurrency(amount: number, currency = 'BDT'): string {
  const symbols: Record<string, string> = {
    BDT: '৳',
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹',
  };
  const sym = symbols[currency] ?? currency + ' ';
  return `${sym}${amount.toLocaleString('en-BD', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short',
  });
}

export function toISODate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return toISODate(d);
}

export function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function calculateNextPaymentDate(lastDate: string, frequency: Loan['installmentFrequency']): string {
  switch (frequency) {
    case 'weekly': return addDays(lastDate, 7);
    case 'monthly': return addMonths(lastDate, 1);
    case 'quarterly': return addMonths(lastDate, 3);
    default: return addMonths(lastDate, 1);
  }
}

export function isOverdue(dateStr: string): boolean {
  return new Date(dateStr) < new Date(toISODate());
}

export function getDaysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - new Date(toISODate()).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getLoanProgress(loan: Loan): number {
  if (loan.originalAmount === 0) return 100;
  return Math.min(100, Math.round((loan.paidAmount / loan.originalAmount) * 100));
}

export function groupByMonth(transactions: Transaction[]): Record<string, Transaction[]> {
  return transactions.reduce<Record<string, Transaction[]>>((acc, tx) => {
    const key = tx.date.slice(0, 7);
    (acc[key] = acc[key] ?? []).push(tx);
    return acc;
  }, {});
}

export function sumByType(transactions: Transaction[], type: 'income' | 'expense'): number {
  return transactions.filter(t => t.type === type).reduce((s, t) => s + t.amount, 0);
}

export function getMonthlyData(transactions: Transaction[]): { month: string; income: number; expense: number }[] {
  const grouped = groupByMonth(transactions);
  return Object.keys(grouped)
    .sort()
    .slice(-6)
    .map(month => ({
      month: new Date(month + '-01').toLocaleString('default', { month: 'short' }),
      income: sumByType(grouped[month], 'income'),
      expense: sumByType(grouped[month], 'expense'),
    }));
}

export function getCategoryTotals(transactions: Transaction[]): { name: string; value: number }[] {
  const map: Record<string, number> = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => { map[t.category] = (map[t.category] ?? 0) + t.amount; });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));
}

export const PERSONAL_EXPENSE_CATEGORIES = [
  'Food & Dining', 'Transport', 'Family', 'Rent', 'Shopping', 'Medical',
  'Education', 'Entertainment', 'Utility Bills', 'Subscriptions', 'Savings', 'Miscellaneous',
];

export const PERSONAL_INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Business', 'Investment', 'Rental', 'Gift', 'Other',
];

export const AGENCY_EXPENSE_CATEGORIES = [
  'Meta Ads', 'Google Ads', 'Software', 'Payroll', 'Client Acquisition',
  'Office', 'Equipment', 'Production', 'Contractor', 'Travel', 'Marketing', 'Miscellaneous',
];

export const AGENCY_INCOME_CATEGORIES = [
  'Client Payment', 'Project Revenue', 'Retainer', 'Consulting', 'Commission', 'Other',
];

export const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];

export const ACCOUNT_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];
