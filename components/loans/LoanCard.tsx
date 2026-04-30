'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Edit3, Calendar, Phone, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Loan } from '@/lib/types';
import { useAppState } from '@/lib/store';
import { formatCurrency, formatDate, formatShortDate, getLoanProgress, getDaysUntil, isOverdue } from '@/lib/utils';
import ProgressBar from '../ui/ProgressBar';
import { loanStatusBadge } from '../ui/Badge';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import PaymentForm from './PaymentForm';
import LoanForm from './LoanForm';

export default function LoanCard({ loan }: { loan: Loan }) {
  const { dispatch } = useAppState();
  const [expanded, setExpanded] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const progress = getLoanProgress(loan);
  const daysUntil = getDaysUntil(loan.nextPaymentDate);
  const overdue = isOverdue(loan.nextPaymentDate) && loan.status === 'active';
  const isTaken = loan.type === 'taken';

  function del() {
    if (confirm(`Delete this loan with ${loan.personName}?`)) {
      dispatch({ type: 'DELETE_LOAN', payload: loan.id });
    }
  }

  const progressColor = loan.status === 'completed' ? 'green' : overdue ? 'red' : progress > 70 ? 'green' : 'amber';

  return (
    <>
      <div className={`bg-white dark:bg-gray-900 border rounded-2xl overflow-hidden transition-all ${
        overdue ? 'border-red-200 dark:border-red-800' : loan.status === 'completed' ? 'border-emerald-200 dark:border-emerald-800' : 'border-gray-100 dark:border-gray-800'
      }`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl shrink-0 ${isTaken ? 'bg-red-100 dark:bg-red-950' : 'bg-emerald-100 dark:bg-emerald-950'}`}>
              {isTaken ? <ArrowDownLeft size={18} className="text-red-500" /> : <ArrowUpRight size={18} className="text-emerald-600" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-gray-900 dark:text-white">{loan.personName}</p>
                {loanStatusBadge(loan.status)}
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isTaken ? 'bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'}`}>
                  {isTaken ? 'You owe' : 'They owe you'}
                </span>
              </div>
              {loan.purpose && <p className="text-xs text-gray-500 mt-0.5">{loan.purpose}</p>}
              {loan.personContact && (
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <Phone size={11} />{loan.personContact}
                </div>
              )}
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs text-gray-400">Remaining</p>
              <p className={`text-lg font-bold ${isTaken ? 'text-red-500' : 'text-emerald-600'}`}>
                {formatCurrency(loan.remainingAmount, loan.currency)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">of {formatCurrency(loan.originalAmount, loan.currency)}</p>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Paid: {formatCurrency(loan.paidAmount, loan.currency)}</span>
              <span>{progress}% complete</span>
            </div>
            <ProgressBar value={progress} max={100} color={progressColor} size="md" />
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-xl ${
                loan.status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : overdue ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
              }`}>
                <Calendar size={12} />
                {loan.status === 'completed'
                  ? 'Completed'
                  : overdue
                  ? `Overdue by ${Math.abs(daysUntil)} days`
                  : daysUntil === 0 ? 'Due today!'
                  : `Next: ${formatShortDate(loan.nextPaymentDate)} (${daysUntil}d)`}
              </div>
              <span className="text-xs text-gray-400">{formatCurrency(loan.installmentAmount, loan.currency)}/{loan.installmentFrequency.replace('monthly', 'mo').replace('weekly', 'wk').replace('quarterly', 'qtr')}</span>
            </div>

            <div className="flex items-center gap-1">
              {loan.status !== 'completed' && (
                <Button size="sm" onClick={() => setPayOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-white" icon={<Plus size={13} />}>
                  Pay
                </Button>
              )}
              <button onClick={() => setEditOpen(true)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                <Edit3 size={13} />
              </button>
              <button onClick={del} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-gray-400 hover:text-red-500">
                <Trash2 size={13} />
              </button>
              <button onClick={() => setExpanded(v => !v)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </div>
          </div>
        </div>

        {expanded && (
          <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Original Amount', val: formatCurrency(loan.originalAmount, loan.currency) },
                { label: 'Paid So Far', val: formatCurrency(loan.paidAmount, loan.currency) },
                { label: 'Installment', val: formatCurrency(loan.installmentAmount, loan.currency) },
                { label: 'Frequency', val: loan.installmentFrequency },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-xs text-gray-400">{s.label}</p>
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 capitalize">{s.val}</p>
                </div>
              ))}
              {loan.hasInterest && loan.interestRate && (
                <div>
                  <p className="text-xs text-gray-400">Interest Rate</p>
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{loan.interestRate}% / year</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400">Start Date</p>
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{formatDate(loan.startDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Workspace</p>
                <p className="font-semibold text-sm text-gray-800 dark:text-gray-200 capitalize">{loan.workspace}</p>
              </div>
            </div>

            {loan.notes && (
              <div className="bg-white dark:bg-gray-900 rounded-xl p-3 mb-4">
                <p className="text-xs text-gray-400 mb-1">Notes</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{loan.notes}</p>
              </div>
            )}

            {loan.installments.length > 0 && (
              <>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Payment History ({loan.installments.length})</p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {[...loan.installments].reverse().map((inst, i) => (
                    <div key={inst.id} className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-xl px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${inst.status === 'paid' ? 'bg-emerald-500' : inst.status === 'partial' ? 'bg-amber-500' : 'bg-red-500'}`} />
                        <span className="text-xs text-gray-500">{formatDate(inst.date)}</span>
                        {inst.notes && <span className="text-xs text-gray-400 italic">— {inst.notes}</span>}
                      </div>
                      <span className={`text-sm font-semibold ${inst.status === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {formatCurrency(inst.paidAmount, loan.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <Modal open={payOpen} onClose={() => setPayOpen(false)} title={`Record Payment — ${loan.personName}`}>
        <PaymentForm loan={loan} onClose={() => setPayOpen(false)} />
      </Modal>
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Loan" size="lg">
        <LoanForm onClose={() => setEditOpen(false)} initial={loan} />
      </Modal>
    </>
  );
}
