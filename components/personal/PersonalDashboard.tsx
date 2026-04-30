'use client';
import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAppState, useWorkspaceTransactions, useWorkspaceAccounts } from '@/lib/store';
import { formatCurrency, getMonthlyData, getCategoryTotals, sumByType, COLORS, formatDate } from '@/lib/utils';
import { StatCard } from '../ui/Card';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import TransactionForm from './TransactionForm';

export default function PersonalDashboard() {
  const { state } = useAppState();
  const transactions = useWorkspaceTransactions();
  const accounts = useWorkspaceAccounts();
  const [addOpen, setAddOpen] = useState(false);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const thisMonth = transactions.filter(t => t.date.startsWith(new Date().toISOString().slice(0, 7)));
  const income = sumByType(thisMonth, 'income');
  const expense = sumByType(thisMonth, 'expense');
  const savings = income - expense;

  const monthlyData = getMonthlyData(transactions);
  const categoryData = getCategoryTotals(transactions);
  const recent = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  const activeLoans = state.loans.filter(l => l.workspace === 'personal' && l.status === 'active');
  const loanDue = activeLoans.reduce((s, l) => s + l.installmentAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Finance</h2>
          <p className="text-sm text-gray-500 mt-0.5">{new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
        </div>
        <Button onClick={() => setAddOpen(true)} icon={<Plus size={16} />}>Add Transaction</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Balance" value={formatCurrency(totalBalance)} icon={<Wallet size={20} />} color="blue" sub={`${accounts.length} accounts`} />
        <StatCard label="Monthly Income" value={formatCurrency(income)} icon={<TrendingDown size={20} />} color="green" />
        <StatCard label="Monthly Spent" value={formatCurrency(expense)} icon={<TrendingUp size={20} />} color="red" />
        <StatCard label="Net Savings" value={formatCurrency(savings)} icon={<PiggyBank size={20} />} color={savings >= 0 ? 'green' : 'red'} />
      </div>

      {activeLoans.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                {activeLoans.length} Active Loan{activeLoans.length > 1 ? 's' : ''} — Due This Month
              </p>
              <p className="text-lg font-bold text-amber-700 dark:text-amber-400 mt-0.5">{formatCurrency(loanDue)} installments</p>
            </div>
            <a href="/loans" className="text-xs font-semibold text-amber-700 dark:text-amber-400 underline underline-offset-2">View Loans →</a>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Spending by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categoryData} cx="40%" cy="50%" outerRadius={75} dataKey="value" nameKey="name">
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" iconSize={8}
                  formatter={(val) => <span className="text-xs text-gray-600 dark:text-gray-400">{val}</span>} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No expense data yet</div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Transactions</h3>
          <a href="/personal/transactions" className="text-xs text-blue-600 dark:text-blue-400 font-medium">View all →</a>
        </div>
        {recent.length === 0 ? (
          <div className="p-6 text-center text-gray-400 text-sm">No transactions yet</div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {recent.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 px-5 py-3">
                <div className={`p-2 rounded-xl ${tx.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-950' : 'bg-red-100 dark:bg-red-950'}`}>
                  {tx.type === 'income'
                    ? <ArrowDownLeft size={14} className="text-emerald-600" />
                    : <ArrowUpRight size={14} className="text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{tx.description}</p>
                  <p className="text-xs text-gray-400">{tx.category} · {formatDate(tx.date)}</p>
                </div>
                <p className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="New Transaction">
        <TransactionForm onClose={() => setAddOpen(false)} />
      </Modal>
    </div>
  );
}
