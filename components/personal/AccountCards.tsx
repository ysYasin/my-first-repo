'use client';
import React, { useState } from 'react';
import { Plus, Wallet, Banknote, Smartphone, PiggyBank, TrendingUp, Trash2 } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { Account } from '@/lib/types';
import { useAppState, useWorkspaceAccounts } from '@/lib/store';
import { formatCurrency, ACCOUNT_COLORS } from '@/lib/utils';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { FormField, Input, Select } from '../ui/FormField';

const typeIcons: Record<string, React.ElementType> = {
  cash: Banknote, bank: Wallet, mobile: Smartphone, savings: PiggyBank, investment: TrendingUp,
};

export default function AccountCards() {
  const { state, dispatch } = useAppState();
  const accounts = useWorkspaceAccounts();
  const [addOpen, setAddOpen] = useState(false);

  const totalBalance = accounts.reduce((s, a) => s + a.balance, 0);

  function del(id: string) {
    if (confirm('Delete this account?')) dispatch({ type: 'DELETE_ACCOUNT', payload: id });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Balance</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalBalance)}</p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)} icon={<Plus size={14} />}>Add Account</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {accounts.map(acc => {
          const Icon = typeIcons[acc.type] ?? Wallet;
          return (
            <div key={acc.id} className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 group">
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl" style={{ backgroundColor: acc.color + '20' }}>
                  <Icon size={18} style={{ color: acc.color }} />
                </div>
                <button onClick={() => del(acc.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-gray-300 hover:text-red-500 transition-all">
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-500 capitalize">{acc.type}</p>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mt-0.5">{acc.name}</p>
                {acc.bankName && <p className="text-xs text-gray-400">{acc.bankName}</p>}
                <p className="text-xl font-bold mt-2" style={{ color: acc.color }}>{formatCurrency(acc.balance, acc.currency)}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Account">
        <AddAccountForm onClose={() => setAddOpen(false)} />
      </Modal>
    </div>
  );
}

function AddAccountForm({ onClose }: { onClose: () => void }) {
  const { state, dispatch } = useAppState();
  const [form, setForm] = useState({ name: '', type: 'bank', balance: '', currency: 'BDT', bankName: '', color: ACCOUNT_COLORS[0] });
  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const acc: Account = {
      id: uuid(), workspace: state.workspace,
      name: form.name, type: form.type as Account['type'],
      balance: parseFloat(form.balance) || 0, currency: form.currency,
      bankName: form.bankName || undefined, color: form.color,
    };
    dispatch({ type: 'ADD_ACCOUNT', payload: acc });
    onClose();
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <FormField label="Account Name" required>
        <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. DBBL Savings" required />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Type">
          <Select value={form.type} onChange={e => set('type', e.target.value)}>
            {['cash', 'bank', 'mobile', 'savings', 'investment'].map(t => <option key={t} className="capitalize">{t}</option>)}
          </Select>
        </FormField>
        <FormField label="Balance">
          <Input type="number" min="0" value={form.balance} onChange={e => set('balance', e.target.value)} placeholder="0" />
        </FormField>
      </div>
      <FormField label="Bank Name">
        <Input value={form.bankName} onChange={e => set('bankName', e.target.value)} placeholder="Optional" />
      </FormField>
      <FormField label="Color">
        <div className="flex gap-2">
          {ACCOUNT_COLORS.map(c => (
            <button key={c} type="button" onClick={() => set('color', c)}
              className={`w-7 h-7 rounded-full border-2 transition-all ${form.color === c ? 'border-gray-900 dark:border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>
      </FormField>
      <div className="flex gap-2 pt-1">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1">Add Account</Button>
      </div>
    </form>
  );
}
