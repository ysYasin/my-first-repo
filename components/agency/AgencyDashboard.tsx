'use client';
import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import { TrendingUp, TrendingDown, Users, FileText, DollarSign, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAppState, useWorkspaceTransactions, useWorkspaceAccounts } from '@/lib/store';
import { formatCurrency, formatDate, getMonthlyData, getCategoryTotals, sumByType } from '@/lib/utils';
import { StatCard } from '../ui/Card';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import TransactionForm from '../personal/TransactionForm';
import { invoiceStatusBadge } from '../ui/Badge';

export default function AgencyDashboard() {
  const { state } = useAppState();
  const transactions = useWorkspaceTransactions();
  const accounts = useWorkspaceAccounts();
  const [addOpen, setAddOpen] = useState(false);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);
  const thisMonth = transactions.filter(t => t.date.startsWith(new Date().toISOString().slice(0, 7)));
  const revenue = sumByType(thisMonth, 'income');
  const expenses = sumByType(thisMonth, 'expense');
  const profit = revenue - expenses;

  const monthlyData = getMonthlyData(transactions);
  const recent = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const recentInvoices = [...state.invoices].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);

  const activeClients = state.clients.filter(c => c.status === 'active').length;
  const pendingInvoices = state.invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.amount, 0);

  const activeLoans = state.loans.filter(l => l.workspace === 'agency' && l.status === 'active');
  const loanDue = activeLoans.reduce((s, l) => s + l.installmentAmount, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Agency Dashboard</h2>
          <p className="text-sm text-gray-500 mt-0.5">{new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</p>
        </div>
        <Button onClick={() => setAddOpen(true)} icon={<Plus size={16} />} className="bg-purple-600 hover:bg-purple-700">Add Transaction</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Cash Balance" value={formatCurrency(totalBalance)} icon={<DollarSign size={20} />} color="purple" />
        <StatCard label="Monthly Revenue" value={formatCurrency(revenue)} icon={<TrendingDown size={20} />} color="green" />
        <StatCard label="Monthly Expenses" value={formatCurrency(expenses)} icon={<TrendingUp size={20} />} color="red" />
        <StatCard label="Net Profit" value={formatCurrency(profit)} icon={<TrendingUp size={20} />} color={profit >= 0 ? 'green' : 'red'} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Active Clients" value={String(activeClients)} icon={<Users size={20} />} color="blue" />
        <StatCard label="Pending Invoices" value={formatCurrency(pendingInvoices)} icon={<FileText size={20} />} color="amber" />
        <StatCard label="Total Clients" value={String(state.clients.length)} icon={<Users size={20} />} color="purple" />
        <StatCard label="Monthly Profit%" value={revenue > 0 ? `${Math.round((profit / revenue) * 100)}%` : '0%'} icon={<TrendingUp size={20} />} color={profit >= 0 ? 'green' : 'red'} />
      </div>

      {activeLoans.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                {activeLoans.length} Active Business Loan{activeLoans.length > 1 ? 's' : ''} — Due This Month
              </p>
              <p className="text-lg font-bold text-amber-700 dark:text-amber-400 mt-0.5">{formatCurrency(loanDue)} installments</p>
            </div>
            <a href="/loans" className="text-xs font-semibold text-amber-700 dark:text-amber-400 underline underline-offset-2">View Loans →</a>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Revenue vs Expenses (6 months)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={monthlyData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} />
            <Area type="monotone" dataKey="income" stroke="#8b5cf6" fill="url(#colorRev)" strokeWidth={2} name="Revenue" />
            <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#colorExp)" strokeWidth={2} name="Expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Transactions</h3>
            <a href="/agency/transactions" className="text-xs text-purple-600 dark:text-purple-400 font-medium">View all →</a>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {recent.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 px-5 py-3">
                <div className={`p-2 rounded-xl ${tx.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-950' : 'bg-red-100 dark:bg-red-950'}`}>
                  {tx.type === 'income' ? <ArrowDownLeft size={14} className="text-emerald-600" /> : <ArrowUpRight size={14} className="text-red-500" />}
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
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Recent Invoices</h3>
            <a href="/agency/invoices" className="text-xs text-purple-600 dark:text-purple-400 font-medium">View all →</a>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {recentInvoices.map(inv => (
              <div key={inv.id} className="flex items-center gap-3 px-5 py-3">
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950">
                  <FileText size={14} className="text-purple-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{inv.clientName}</p>
                  <p className="text-xs text-gray-400">{inv.invoiceNumber} · Due {formatDate(inv.dueDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{formatCurrency(inv.amount)}</p>
                  <div className="mt-0.5">{invoiceStatusBadge(inv.status)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="New Transaction">
        <TransactionForm onClose={() => setAddOpen(false)} />
      </Modal>
    </div>
  );
}
