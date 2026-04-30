'use client';
import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import AppLayout from '@/components/layout/AppLayout';
import { useAppState, useWorkspaceTransactions } from '@/lib/store';
import { formatCurrency, getMonthlyData, getCategoryTotals, COLORS } from '@/lib/utils';

export default function AgencyAnalyticsPage() {
  const { dispatch } = useAppState();
  const transactions = useWorkspaceTransactions();
  useEffect(() => { dispatch({ type: 'SET_WORKSPACE', payload: 'agency' }); }, [dispatch]);

  const monthly = getMonthlyData(transactions);
  const cats = getCategoryTotals(transactions);

  return (
    <AppLayout title="Analytics">
      <div className="space-y-5">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Monthly Revenue vs Expenses</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthly} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Bar dataKey="income" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Top Expense Categories</h3>
            {cats.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={cats} cx="40%" cy="50%" outerRadius={80} dataKey="value" nameKey="name">
                    {cats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" iconSize={8}
                    formatter={(val) => <span className="text-xs text-gray-600 dark:text-gray-400">{val}</span>} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-400 text-sm">No expense data</div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Monthly P&L Summary</h3>
            <div className="space-y-3">
              {monthly.slice(-3).reverse().map(m => {
                const profit = m.income - m.expense;
                return (
                  <div key={m.month} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{m.month}</p>
                      <div className="flex gap-3 text-xs text-gray-500 mt-0.5">
                        <span className="text-emerald-600">↑ {formatCurrency(m.income)}</span>
                        <span className="text-red-500">↓ {formatCurrency(m.expense)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${profit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{formatCurrency(Math.abs(profit))}</p>
                      <p className="text-xs text-gray-400">{profit >= 0 ? 'Profit' : 'Loss'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
