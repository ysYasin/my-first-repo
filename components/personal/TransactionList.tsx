'use client';
import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit3, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Transaction } from '@/lib/types';
import { useAppState, useWorkspaceTransactions } from '@/lib/store';
import { formatCurrency, formatDate } from '@/lib/utils';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import TransactionForm from './TransactionForm';
import Card from '../ui/Card';

export default function TransactionList() {
  const { dispatch } = useAppState();
  const transactions = useWorkspaceTransactions();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const filtered = transactions
    .filter(t => filterType === 'all' || t.type === filterType)
    .filter(t => !search || t.description.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date));

  function del(id: string) {
    if (confirm('Delete this transaction?')) dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-3 py-2 flex-1 max-w-xs">
          <Search size={15} className="text-gray-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions..." className="bg-transparent text-sm outline-none w-full text-gray-700 dark:text-gray-300 placeholder-gray-400" />
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'income', 'expense'] as const).map(f => (
            <button key={f} onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                filterType === f ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300'
              }`}>{f}</button>
          ))}
          <Button size="sm" onClick={() => setAddOpen(true)} icon={<Plus size={14} />}>Add</Button>
        </div>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400 text-sm">No transactions found</p>
            <Button size="sm" className="mt-3" onClick={() => setAddOpen(true)} icon={<Plus size={14} />}>Add Transaction</Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {filtered.map(tx => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 group transition-colors">
                <div className={`p-2 rounded-xl ${tx.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-950' : 'bg-red-100 dark:bg-red-950'}`}>
                  {tx.type === 'income'
                    ? <ArrowDownLeft size={16} className="text-emerald-600 dark:text-emerald-400" />
                    : <ArrowUpRight size={16} className="text-red-500 dark:text-red-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{tx.description}</p>
                  <p className="text-xs text-gray-400">{tx.category} · {formatDate(tx.date)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, tx.currency)}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">{tx.paymentMethod}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditTx(tx)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                    <Edit3 size={13} />
                  </button>
                  <button onClick={() => del(tx.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-gray-400 hover:text-red-500">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="New Transaction">
        <TransactionForm onClose={() => setAddOpen(false)} />
      </Modal>
      <Modal open={!!editTx} onClose={() => setEditTx(null)} title="Edit Transaction">
        {editTx && <TransactionForm onClose={() => setEditTx(null)} initial={editTx} />}
      </Modal>
    </div>
  );
}
