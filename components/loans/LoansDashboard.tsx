'use client';
import React, { useState } from 'react';
import { Plus, CreditCard, TrendingDown, TrendingUp, AlertCircle, CheckCircle2, Filter } from 'lucide-react';
import { useAppState } from '@/lib/store';
import { formatCurrency, isOverdue } from '@/lib/utils';
import { StatCard } from '../ui/Card';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import LoanCard from './LoanCard';
import LoanForm from './LoanForm';

type Tab = 'all' | 'taken' | 'given';
type WorkspaceFilter = 'all' | 'personal' | 'agency';

export default function LoansDashboard() {
  const { state } = useAppState();
  const [tab, setTab] = useState<Tab>('all');
  const [wsFilter, setWsFilter] = useState<WorkspaceFilter>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'overdue'>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [addType, setAddType] = useState<'taken' | 'given'>('taken');

  const loans = state.loans
    .filter(l => tab === 'all' || l.type === tab)
    .filter(l => wsFilter === 'all' || l.workspace === wsFilter)
    .filter(l => statusFilter === 'all' || l.status === statusFilter);

  const allLoans = state.loans;

  // Stats
  const totalTaken = allLoans.filter(l => l.type === 'taken').reduce((s, l) => s + l.remainingAmount, 0);
  const totalGiven = allLoans.filter(l => l.type === 'given').reduce((s, l) => s + l.remainingAmount, 0);
  const overdueLoans = allLoans.filter(l => l.status === 'active' && isOverdue(l.nextPaymentDate));
  const completedLoans = allLoans.filter(l => l.status === 'completed');
  const totalInstallmentsDue = allLoans.filter(l => l.status === 'active').reduce((s, l) => s + l.installmentAmount, 0);

  function openAdd(type: 'taken' | 'given') {
    setAddType(type);
    setAddOpen(true);
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Loan Management</h2>
          <p className="text-sm text-gray-500 mt-0.5">Track all your borrowings and lendings</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => openAdd('taken')} variant="secondary" size="sm" icon={<TrendingDown size={14} />}>
            Record Taken
          </Button>
          <Button onClick={() => openAdd('given')} className="bg-amber-500 hover:bg-amber-600" size="sm" icon={<TrendingUp size={14} />}>
            Record Given
          </Button>
        </div>
      </div>

      {overdueLoans.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                {overdueLoans.length} loan{overdueLoans.length > 1 ? 's are' : ' is'} overdue!
              </p>
              <p className="text-xs text-red-500 mt-0.5">
                {overdueLoans.map(l => `${l.personName} (${formatCurrency(l.installmentAmount, l.currency)})`).join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="I Owe (Remaining)"
          value={formatCurrency(totalTaken)}
          icon={<TrendingDown size={20} />}
          color="red"
          sub={`${allLoans.filter(l => l.type === 'taken' && l.status === 'active').length} active`}
        />
        <StatCard
          label="Owed to Me"
          value={formatCurrency(totalGiven)}
          icon={<TrendingUp size={20} />}
          color="green"
          sub={`${allLoans.filter(l => l.type === 'given' && l.status === 'active').length} active`}
        />
        <StatCard
          label="Monthly Installments"
          value={formatCurrency(totalInstallmentsDue)}
          icon={<CreditCard size={20} />}
          color="amber"
          sub="Due this cycle"
        />
        <StatCard
          label="Loans Cleared"
          value={String(completedLoans.length)}
          icon={<CheckCircle2 size={20} />}
          color="green"
          sub={`of ${allLoans.length} total`}
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-1 gap-0.5">
          {(['all', 'taken', 'given'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                tab === t ? 'bg-amber-500 text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}>
              {t === 'all' ? 'All' : t === 'taken' ? '📥 Taken' : '📤 Given'}
            </button>
          ))}
        </div>

        <div className="flex bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-1 gap-0.5">
          {(['all', 'personal', 'agency'] as WorkspaceFilter[]).map(w => (
            <button key={w} onClick={() => setWsFilter(w)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                wsFilter === w ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-900' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}>
              {w === 'all' ? 'All workspaces' : w}
            </button>
          ))}
        </div>

        <div className="flex bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-1 gap-0.5">
          {(['all', 'active', 'overdue', 'completed'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                statusFilter === s
                  ? s === 'overdue' ? 'bg-red-500 text-white'
                  : s === 'completed' ? 'bg-emerald-500 text-white'
                  : s === 'active' ? 'bg-blue-500 text-white'
                  : 'bg-gray-800 dark:bg-white text-white dark:text-gray-900'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {loans.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-10 text-center">
          <CreditCard size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="font-medium text-gray-500 mb-1">No loans found</p>
          <p className="text-sm text-gray-400 mb-4">Start tracking your loans and installments</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => openAdd('taken')} variant="secondary" size="sm">Record Loan Taken</Button>
            <Button onClick={() => openAdd('given')} className="bg-amber-500 hover:bg-amber-600" size="sm">Record Loan Given</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {loans.map(loan => <LoanCard key={loan.id} loan={loan} />)}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title={addType === 'taken' ? 'Record Loan Taken' : 'Record Loan Given'} size="lg">
        <LoanForm onClose={() => setAddOpen(false)} defaultType={addType} />
      </Modal>
    </div>
  );
}
