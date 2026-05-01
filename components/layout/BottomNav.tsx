'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, TrendingUp, CreditCard, Users, Building2, User } from 'lucide-react';
import { useAppState } from '@/lib/store';

export default function BottomNav() {
  const { state } = useAppState();
  const pathname = usePathname();
  const isAgency = state.workspace === 'agency';

  const personalNav = [
    { href: '/personal', icon: LayoutDashboard, label: 'Home' },
    { href: '/personal/transactions', icon: TrendingUp, label: 'Transactions' },
    { href: '/loans', icon: CreditCard, label: 'Loans' },
    { href: '/personal/accounts', icon: User, label: 'Accounts' },
  ];

  const agencyNav = [
    { href: '/agency', icon: LayoutDashboard, label: 'Home' },
    { href: '/agency/transactions', icon: TrendingUp, label: 'Transactions' },
    { href: '/loans', icon: CreditCard, label: 'Loans' },
    { href: '/agency/clients', icon: Users, label: 'Clients' },
  ];

  const nav = isAgency ? agencyNav : personalNav;
  const accent = isAgency ? 'text-purple-600 dark:text-purple-400' : 'text-blue-600 dark:text-blue-400';
  const accentBg = isAgency ? 'bg-purple-50 dark:bg-purple-950' : 'bg-blue-50 dark:bg-blue-950';

  // Hide on home page
  if (pathname === '/') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800 lg:hidden safe-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {nav.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-0 ${
                active ? accentBg : ''
              }`}>
              <Icon size={22} className={active ? accent : 'text-gray-400 dark:text-gray-500'} />
              <span className={`text-[10px] font-medium ${active ? accent : 'text-gray-400 dark:text-gray-500'}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
