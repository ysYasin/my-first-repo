'use client';
import React from 'react';
import { Menu, Sun, Moon, Bell, Building2, User } from 'lucide-react';
import { useAppState } from '@/lib/store';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onMenuToggle: () => void;
  title?: string;
}

export default function Header({ onMenuToggle, title }: HeaderProps) {
  const { state, dispatch } = useAppState();
  const router = useRouter();
  const isAgency = state.workspace === 'agency';

  function toggleTheme() {
    dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' });
  }

  function switchWorkspace() {
    const next = isAgency ? 'personal' : 'agency';
    dispatch({ type: 'SET_WORKSPACE', payload: next });
    router.push(next === 'agency' ? '/agency' : '/personal');
  }

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={onMenuToggle} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 lg:hidden">
            <Menu size={20} />
          </button>
          {title && <h1 className="text-base font-semibold text-gray-900 dark:text-white hidden sm:block">{title}</h1>}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={switchWorkspace}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              isAgency
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-950 dark:text-purple-300'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-950 dark:text-blue-300'
            }`}
          >
            {isAgency ? <Building2 size={14} /> : <User size={14} />}
            <span className="hidden sm:inline">{isAgency ? 'Agency' : 'Personal'}</span>
            <span className="sm:hidden">{isAgency ? 'A' : 'P'}</span>
          </button>

          <button onClick={toggleTheme} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
            {state.theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
