'use client';
import React, { useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAppState, useWorkspaceAccounts, useWorkspaceTransactions } from '@/lib/store';
import { formatCurrency, sumByType } from '@/lib/utils';
import { StatCard } from '@/components/ui/Card';
import { PiggyBank, TrendingUp, Target, Wallet } from 'lucide-react';

export default function SavingsPage() {
  const { dispatch } = useAppState();
  const accounts = useWorkspaceAccounts();
  const transactions = useWorkspaceTransactions();

  useEffect(() => { dispatch({ type: 'SET_WORKSPACE', payload: 'personal' }); }, [dispatch]);

  const savings = accounts.filter(a => a.type === 'savings');
  const totalSavings = savings.reduce((s, a) => s + a.balance, 0);
  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  const monthKey = new Date().toISOString().slice(0, 7);
  const thisMonth = transactions.filter(t => t.date.startsWith(monthKey));
  const income = sumByType(thisMonth, 'income');
  const expense = sumByType(thisMonth, 'expense');
  const netSavings = income - expense;
  const savingsRate = income > 0 ? Math.round((netSavings / income) * 100) : 0;

  return (
    <AppLayout title="Savings Overview">
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard label="Total Savings" value={formatCurrency(totalSavings)} icon={<PiggyBank size={20} />} color="green" />
          <StatCard label="Net This Month" value={formatCurrency(netSavings)} icon={<TrendingUp size={20} />} color={netSavings >= 0 ? 'green' : 'red'} />
          <StatCard label="Savings Rate" value={`${savingsRate}%`} icon={<Target size={20} />} color={savingsRate >= 20 ? 'green' : savingsRate >= 10 ? 'amber' : 'red'} sub="of income" />
          <StatCard label="Net Worth" value={formatCurrency(totalBalance)} icon={<Wallet size={20} />} color="blue" />
        </div>

        {savings.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-8 text-center">
            <PiggyBank size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No savings accounts yet</p>
            <p className="text-sm text-gray-400 mt-1">Add a savings account from the Accounts page</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {savings.map(acc => (
              <div key={acc.id} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: acc.color + '20' }}>
                  <PiggyBank size={22} style={{ color: acc.color }} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{acc.name}</p>
                  {acc.bankName && <p className="text-xs text-gray-400">{acc.bankName}</p>}
                </div>
                <p className="text-xl font-bold" style={{ color: acc.color }}>{formatCurrency(acc.balance, acc.currency)}</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/40 dark:to-purple-950/40 border border-blue-100 dark:border-blue-900 rounded-2xl p-5">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Savings Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>✅ Aim for at least 20% savings rate</li>
            <li>✅ Build an emergency fund (3-6 months of expenses)</li>
            <li>✅ Automate transfers on salary day</li>
            <li>✅ Track and reduce recurring subscriptions</li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
