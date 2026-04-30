'use client';
import React from 'react';

type Color = 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'gray' | 'pink' | 'teal';

const styles: Record<Color, string> = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  gray: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  pink: 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300',
  teal: 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300',
};

export default function Badge({ label, color = 'gray', dot }: { label: string; color?: Color; dot?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[color]}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />}
      {label}
    </span>
  );
}

export function loanStatusBadge(status: string) {
  const map: Record<string, { label: string; color: Color }> = {
    active: { label: 'Active', color: 'blue' },
    completed: { label: 'Completed', color: 'green' },
    overdue: { label: 'Overdue', color: 'red' },
    paused: { label: 'Paused', color: 'gray' },
  };
  const { label, color } = map[status] ?? { label: status, color: 'gray' as Color };
  return <Badge label={label} color={color} dot />;
}

export function invoiceStatusBadge(status: string) {
  const map: Record<string, { label: string; color: Color }> = {
    draft: { label: 'Draft', color: 'gray' },
    sent: { label: 'Sent', color: 'blue' },
    paid: { label: 'Paid', color: 'green' },
    overdue: { label: 'Overdue', color: 'red' },
    cancelled: { label: 'Cancelled', color: 'gray' },
  };
  const { label, color } = map[status] ?? { label: status, color: 'gray' as Color };
  return <Badge label={label} color={color} dot />;
}
