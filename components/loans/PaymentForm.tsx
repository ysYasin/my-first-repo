'use client';
import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Loan } from '@/lib/types';
import { useAppState } from '@/lib/store';
import { formatCurrency, toISODate } from '@/lib/utils';
import Button from '../ui/Button';
import { FormField, Input, Textarea } from '../ui/FormField';
import ProgressBar from '../ui/ProgressBar';

interface Props {
  loan: Loan;
  onClose: () => void;
}

export default function PaymentForm({ loan, onClose }: Props) {
  const { dispatch } = useAppState();
  const [amount, setAmount] = useState(loan.installmentAmount.toString());
  const [date, setDate] = useState(toISODate());
  const [notes, setNotes] = useState('');

  const payAmount = parseFloat(amount) || 0;
  const newRemaining = Math.max(0, loan.remainingAmount - payAmount);
  const newProgress = Math.round(((loan.originalAmount - newRemaining) / loan.originalAmount) * 100);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (payAmount <= 0) return;
    dispatch({
      type: 'ADD_PAYMENT',
      payload: {
        loanId: loan.id,
        installment: {
          id: uuid(),
          loanId: loan.id,
          amount: payAmount,
          date,
          status: payAmount >= loan.installmentAmount ? 'paid' : 'partial',
          paidAmount: payAmount,
          notes: notes || undefined,
        },
      },
    });
    onClose();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Lender / Borrower</span>
          <span className="font-semibold text-gray-900 dark:text-white">{loan.personName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Remaining Balance</span>
          <span className="font-bold text-amber-600">{formatCurrency(loan.remainingAmount, loan.currency)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Suggested Installment</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(loan.installmentAmount, loan.currency)}</span>
        </div>
        <ProgressBar value={loan.paidAmount} max={loan.originalAmount} color="amber" showLabel />
      </div>

      <FormField label="Payment Amount (৳)" required>
        <div className="relative">
          <span className="absolute left-3 top-2 text-sm text-gray-400">৳</span>
          <Input type="number" min="0.01" step="0.01" max={loan.remainingAmount} value={amount}
            onChange={e => setAmount(e.target.value)} className="pl-7" required />
        </div>
        <div className="flex gap-2 mt-1.5">
          {[loan.installmentAmount, loan.installmentAmount / 2, loan.remainingAmount].map((v, i) => (
            <button key={i} type="button" onClick={() => setAmount(v.toFixed(2))}
              className="text-xs px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-medium hover:bg-amber-200 transition-colors">
              {i === 0 ? 'Full installment' : i === 1 ? 'Half' : 'Full balance'}
            </button>
          ))}
        </div>
      </FormField>

      <FormField label="Payment Date">
        <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </FormField>

      <FormField label="Notes">
        <Textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Optional note..." />
      </FormField>

      {payAmount > 0 && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3 space-y-1">
          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">After this payment:</p>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Remaining</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-300">{formatCurrency(newRemaining, loan.currency)}</span>
          </div>
          <ProgressBar value={newProgress} max={100} color="green" showLabel />
          {newRemaining === 0 && (
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 text-center mt-1">🎉 Loan fully cleared!</p>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600">Record Payment</Button>
      </div>
    </form>
  );
}
