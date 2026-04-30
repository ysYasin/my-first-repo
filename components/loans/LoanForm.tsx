'use client';
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Loan } from '@/lib/types';
import { useAppState } from '@/lib/store';
import { toISODate, calculateNextPaymentDate } from '@/lib/utils';
import Button from '../ui/Button';
import { FormField, Input, Select, Textarea } from '../ui/FormField';

interface Props {
  onClose: () => void;
  defaultType?: 'taken' | 'given';
  initial?: Loan;
}

export default function LoanForm({ onClose, defaultType = 'taken', initial }: Props) {
  const { state, dispatch } = useAppState();
  const [form, setForm] = useState({
    type: initial?.type ?? defaultType,
    personName: initial?.personName ?? '',
    personContact: initial?.personContact ?? '',
    originalAmount: initial?.originalAmount.toString() ?? '',
    installmentAmount: initial?.installmentAmount.toString() ?? '',
    installmentFrequency: initial?.installmentFrequency ?? 'monthly',
    startDate: initial?.startDate ?? toISODate(),
    currency: initial?.currency ?? 'BDT',
    hasInterest: initial?.hasInterest ? 'yes' : 'no',
    interestRate: initial?.interestRate?.toString() ?? '',
    purpose: initial?.purpose ?? '',
    notes: initial?.notes ?? '',
    workspace: initial?.workspace ?? state.workspace,
  });

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const orig = parseFloat(form.originalAmount);
    const inst = parseFloat(form.installmentAmount);
    if (!orig || !inst || !form.personName) return;

    const nextPayDate = calculateNextPaymentDate(form.startDate, form.installmentFrequency as Loan['installmentFrequency']);
    const loan: Loan = {
      id: initial?.id ?? uuid(),
      type: form.type as Loan['type'],
      workspace: form.workspace as Loan['workspace'],
      personName: form.personName,
      personContact: form.personContact || undefined,
      originalAmount: orig,
      remainingAmount: initial ? initial.remainingAmount : orig,
      paidAmount: initial ? initial.paidAmount : 0,
      currency: form.currency,
      startDate: form.startDate,
      installmentAmount: inst,
      installmentFrequency: form.installmentFrequency as Loan['installmentFrequency'],
      nextPaymentDate: initial?.nextPaymentDate ?? nextPayDate,
      hasInterest: form.hasInterest === 'yes',
      interestRate: form.hasInterest === 'yes' ? (parseFloat(form.interestRate) || 0) : undefined,
      status: initial?.status ?? 'active',
      installments: initial?.installments ?? [],
      purpose: form.purpose || undefined,
      notes: form.notes || undefined,
    };
    dispatch({ type: initial ? 'UPDATE_LOAN' : 'ADD_LOAN', payload: loan });
    onClose();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
        {(['taken', 'given'] as const).map(t => (
          <button key={t} type="button" onClick={() => set('type', t)}
            className={`py-2 text-sm font-medium rounded-lg transition-all capitalize ${
              form.type === t ? 'bg-white dark:bg-gray-900 text-amber-600 shadow-sm' : 'text-gray-500'
            }`}>
            {t === 'taken' ? '📥 Loan Taken' : '📤 Loan Given'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label={form.type === 'taken' ? 'Lender Name' : 'Borrower Name'} required>
          <Input value={form.personName} onChange={e => set('personName', e.target.value)} placeholder={form.type === 'taken' ? 'Who lent you money?' : 'Who borrowed from you?'} required />
        </FormField>
        <FormField label="Contact (optional)">
          <Input value={form.personContact} onChange={e => set('personContact', e.target.value)} placeholder="Phone / email" />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Total Loan Amount (৳)" required>
          <div className="relative">
            <span className="absolute left-3 top-2 text-sm text-gray-400">৳</span>
            <Input type="number" min="0" step="0.01" value={form.originalAmount}
              onChange={e => set('originalAmount', e.target.value)} className="pl-7" placeholder="0.00" required />
          </div>
        </FormField>
        <FormField label="Installment Amount (৳)" required>
          <div className="relative">
            <span className="absolute left-3 top-2 text-sm text-gray-400">৳</span>
            <Input type="number" min="0" step="0.01" value={form.installmentAmount}
              onChange={e => set('installmentAmount', e.target.value)} className="pl-7" placeholder="0.00" required />
          </div>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Payment Frequency">
          <Select value={form.installmentFrequency} onChange={e => set('installmentFrequency', e.target.value)}>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly (3 months)</option>
            <option value="custom">Custom</option>
          </Select>
        </FormField>
        <FormField label="Start Date">
          <Input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Interest?">
          <Select value={form.hasInterest} onChange={e => set('hasInterest', e.target.value)}>
            <option value="no">No Interest</option>
            <option value="yes">Yes, has interest</option>
          </Select>
        </FormField>
        {form.hasInterest === 'yes' && (
          <FormField label="Interest Rate (% per year)">
            <Input type="number" min="0" max="100" step="0.1" value={form.interestRate}
              onChange={e => set('interestRate', e.target.value)} placeholder="e.g. 10" />
          </FormField>
        )}
      </div>

      <FormField label="Workspace">
        <Select value={form.workspace} onChange={e => set('workspace', e.target.value)}>
          <option value="personal">Personal</option>
          <option value="agency">Agency</option>
        </Select>
      </FormField>

      <FormField label="Purpose">
        <Input value={form.purpose} onChange={e => set('purpose', e.target.value)} placeholder="What is this loan for?" />
      </FormField>

      <FormField label="Notes">
        <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} placeholder="Any additional details..." />
      </FormField>

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600">
          {initial ? 'Update Loan' : form.type === 'taken' ? 'Record Loan Taken' : 'Record Loan Given'}
        </Button>
      </div>
    </form>
  );
}
