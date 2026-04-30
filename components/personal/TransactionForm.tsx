'use client';
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Transaction } from '@/lib/types';
import { useAppState } from '@/lib/store';
import { toISODate, PERSONAL_EXPENSE_CATEGORIES, PERSONAL_INCOME_CATEGORIES, AGENCY_EXPENSE_CATEGORIES, AGENCY_INCOME_CATEGORIES } from '@/lib/utils';
import Button from '../ui/Button';
import { FormField, Input, Select, Textarea } from '../ui/FormField';

interface Props {
  onClose: () => void;
  initial?: Transaction;
}

export default function TransactionForm({ onClose, initial }: Props) {
  const { state, dispatch } = useAppState();
  const isAgency = state.workspace === 'agency';

  const [form, setForm] = useState({
    type: initial?.type ?? 'expense',
    amount: initial?.amount.toString() ?? '',
    category: initial?.category ?? '',
    description: initial?.description ?? '',
    date: initial?.date ?? toISODate(),
    account: initial?.account ?? (state.accounts.find(a => a.workspace === state.workspace)?.id ?? ''),
    paymentMethod: initial?.paymentMethod ?? 'cash',
    notes: initial?.notes ?? '',
    currency: initial?.currency ?? 'BDT',
  });

  const expCats = isAgency ? AGENCY_EXPENSE_CATEGORIES : PERSONAL_EXPENSE_CATEGORIES;
  const incCats = isAgency ? AGENCY_INCOME_CATEGORIES : PERSONAL_INCOME_CATEGORIES;
  const categories = form.type === 'income' ? incCats : expCats;
  const accounts = state.accounts.filter(a => a.workspace === state.workspace);

  function set(key: string, val: string) { setForm(f => ({ ...f, [key]: val })); }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.amount || !form.category || !form.description) return;
    const tx: Transaction = {
      id: initial?.id ?? uuid(),
      workspace: state.workspace,
      type: form.type as Transaction['type'],
      amount: parseFloat(form.amount),
      currency: form.currency,
      category: form.category,
      description: form.description,
      date: form.date,
      account: form.account,
      paymentMethod: form.paymentMethod,
      notes: form.notes || undefined,
    };
    dispatch({ type: initial ? 'UPDATE_TRANSACTION' : 'ADD_TRANSACTION', payload: tx });
    onClose();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {(['expense', 'income'] as const).map(t => (
          <button key={t} type="button" onClick={() => set('type', t)}
            className={`py-2 text-sm font-medium rounded-lg transition-all capitalize ${
              form.type === t
                ? t === 'income' ? 'bg-white dark:bg-gray-900 text-emerald-600 shadow-sm' : 'bg-white dark:bg-gray-900 text-red-600 shadow-sm'
                : 'text-gray-500'
            }`}>{t}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Amount" required>
          <div className="relative">
            <span className="absolute left-3 top-2 text-sm text-gray-400">৳</span>
            <Input type="number" min="0" step="0.01" value={form.amount} onChange={e => set('amount', e.target.value)} className="pl-7" placeholder="0.00" required />
          </div>
        </FormField>
        <FormField label="Date" required>
          <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
        </FormField>
      </div>

      <FormField label="Category" required>
        <Select value={form.category} onChange={e => set('category', e.target.value)} required>
          <option value="">Select category</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </Select>
      </FormField>

      <FormField label="Description" required>
        <Input value={form.description} onChange={e => set('description', e.target.value)} placeholder="What was this for?" required />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Account">
          <Select value={form.account} onChange={e => set('account', e.target.value)}>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </Select>
        </FormField>
        <FormField label="Method">
          <Select value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value)}>
            {['cash', 'bank', 'mobile', 'card', 'cheque'].map(m => <option key={m} className="capitalize">{m}</option>)}
          </Select>
        </FormField>
      </div>

      <FormField label="Notes">
        <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Optional note..." rows={2} />
      </FormField>

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1">{initial ? 'Update' : 'Add Transaction'}</Button>
      </div>
    </form>
  );
}
