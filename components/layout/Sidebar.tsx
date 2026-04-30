'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, TrendingUp, Wallet, PiggyBank, Receipt,
  Users, FileText, BarChart3, CreditCard, Landmark, X,
} from 'lucide-react';
import { useAppState } from '@/lib/store';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const personalNav = [
  { href: '/personal', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/personal/transactions', label: 'Transactions', icon: TrendingUp },
  { href: '/personal/accounts', label: 'Accounts', icon: Wallet },
  { href: '/personal/savings', label: 'Savings', icon: PiggyBank },
  { href: '/loans', label: 'Loans', icon: CreditCard },
];

const agencyNav = [
  { href: '/agency', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/agency/transactions', label: 'Transactions', icon: TrendingUp },
  { href: '/agency/clients', label: 'Clients', icon: Users },
  { href: '/agency/invoices', label: 'Invoices', icon: FileText },
  { href: '/agency/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/loans', label: 'Loans', icon: CreditCard },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { state } = useAppState();
  const pathname = usePathname();
  const isAgency = state.workspace === 'agency';
  const nav = isAgency ? agencyNav : personalNav;
  const accent = isAgency ? 'purple' : 'blue';

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onClose} />}
      <aside className={`
        fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800
        z-40 flex flex-col transform transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isAgency ? 'bg-purple-600' : 'bg-blue-600'}`}>
              <Landmark size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">FinanceOS</p>
              <p className={`text-xs font-medium ${isAgency ? 'text-purple-600' : 'text-blue-600'}`}>
                {isAgency ? 'Agency' : 'Personal'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href} onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  active
                    ? accent === 'purple'
                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'
                }`}>
                <Icon size={18} className={active ? (accent === 'purple' ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400') : ''} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 dark:border-gray-800">
          <div className={`p-3 rounded-xl ${isAgency ? 'bg-purple-50 dark:bg-purple-950' : 'bg-blue-50 dark:bg-blue-950'}`}>
            <p className={`text-xs font-semibold ${isAgency ? 'text-purple-700 dark:text-purple-300' : 'text-blue-700 dark:text-blue-300'}`}>
              {isAgency ? 'Agency Mode' : 'Personal Mode'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Switch from top bar</p>
          </div>
        </div>
      </aside>
    </>
  );
}
