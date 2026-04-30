'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Building2, CreditCard, TrendingUp, Wallet, Shield, ArrowRight, Landmark } from 'lucide-react';
import { useAppState } from '@/lib/store';

export default function HomePage() {
  const { dispatch } = useAppState();
  const router = useRouter();

  function goTo(workspace: 'personal' | 'agency', path: string) {
    dispatch({ type: 'SET_WORKSPACE', payload: workspace });
    router.push(path);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col">
      <header className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
            <Landmark size={18} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-gray-900 dark:text-white text-lg">FinanceOS</span>
            <span className="hidden sm:inline text-xs text-gray-400 ml-2">Smart Financial Manager</span>
          </div>
        </div>
        <Link href="/loans" className="flex items-center gap-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 hover:underline">
          <CreditCard size={15} />
          Loans
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="text-center mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Shield size={12} />
            Secure · Private · Local-first
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Your Complete
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Finance Hub</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg">
            Manage personal expenses, agency accounts, and loans — all in one beautiful dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-4xl">
          <WorkspaceCard
            title="Personal Finance"
            subtitle="Daily expenses, savings, family & more"
            icon={<User size={28} />}
            color="blue"
            features={['Daily expense tracking', 'Income & savings', 'Family budgeting', 'Bank accounts', 'Personal loans']}
            onClick={() => goTo('personal', '/personal')}
          />
          <WorkspaceCard
            title="Agency Finance"
            subtitle="Clients, invoices, payroll & analytics"
            icon={<Building2 size={28} />}
            color="purple"
            features={['Client management', 'Invoice tracking', 'Ad spend tracking', 'Team salaries', 'Business loans']}
            onClick={() => goTo('agency', '/agency')}
          />
          <WorkspaceCard
            title="Loan Manager"
            subtitle="Smart debt & installment tracking"
            icon={<CreditCard size={28} />}
            color="amber"
            features={['Loans taken & given', 'Auto installment tracking', 'Payment history', 'Overdue alerts', 'Progress tracking']}
            onClick={() => router.push('/loans')}
            featured
          />
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl w-full text-center">
          {[
            { icon: Wallet, label: 'Multi-account', sub: 'Cash, Bank, Mobile' },
            { icon: TrendingUp, label: 'Analytics', sub: 'Charts & insights' },
            { icon: CreditCard, label: 'Loan Tracking', sub: 'Auto installments' },
            { icon: Shield, label: 'Private', sub: 'Local storage' },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center mx-auto">
                <Icon size={18} className="text-gray-600 dark:text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-5 text-xs text-gray-400">
        FinanceOS · Data stored locally in your browser · {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function WorkspaceCard({
  title, subtitle, icon, color, features, onClick, featured,
}: {
  title: string; subtitle: string; icon: React.ReactNode; color: 'blue' | 'purple' | 'amber';
  features: string[]; onClick: () => void; featured?: boolean;
}) {
  const styles = {
    blue: { bg: 'from-blue-600 to-blue-700', light: 'bg-blue-50 dark:bg-blue-950', text: 'text-blue-600 dark:text-blue-400', check: 'text-blue-500', border: 'border-blue-200 dark:border-blue-800' },
    purple: { bg: 'from-purple-600 to-purple-700', light: 'bg-purple-50 dark:bg-purple-950', text: 'text-purple-600 dark:text-purple-400', check: 'text-purple-500', border: 'border-purple-200 dark:border-purple-800' },
    amber: { bg: 'from-amber-500 to-orange-500', light: 'bg-amber-50 dark:bg-amber-950', text: 'text-amber-600 dark:text-amber-400', check: 'text-amber-500', border: 'border-amber-200 dark:border-amber-800' },
  };
  const s = styles[color];

  return (
    <button
      onClick={onClick}
      className={`group text-left bg-white dark:bg-gray-900 border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${featured ? s.border : 'border-gray-100 dark:border-gray-800'}`}
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.bg} flex items-center justify-center text-white shadow-lg mb-4 group-hover:scale-105 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 mb-4">{subtitle}</p>
      <ul className="space-y-1.5">
        {features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className={`text-base leading-none ${s.check}`}>✓</span>
            {f}
          </li>
        ))}
      </ul>
      <div className={`flex items-center gap-1 mt-5 text-sm font-semibold ${s.text} group-hover:gap-2 transition-all`}>
        Open <ArrowRight size={15} />
      </div>
    </button>
  );
}
