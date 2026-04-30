'use client';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  gradient?: string;
}

export default function Card({ children, className = '', hover, onClick, gradient }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800
        rounded-2xl shadow-sm
        ${hover ? 'hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer' : ''}
        ${gradient ? `bg-gradient-to-br ${gradient}` : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label, value, sub, icon, trend, color = 'blue',
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'blue' | 'purple' | 'green' | 'amber' | 'red';
}) {
  const colors = {
    blue: { bg: 'bg-blue-50 dark:bg-blue-950', icon: 'text-blue-600 dark:text-blue-400', val: 'text-blue-700 dark:text-blue-300' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-950', icon: 'text-purple-600 dark:text-purple-400', val: 'text-purple-700 dark:text-purple-300' },
    green: { bg: 'bg-emerald-50 dark:bg-emerald-950', icon: 'text-emerald-600 dark:text-emerald-400', val: 'text-emerald-700 dark:text-emerald-300' },
    amber: { bg: 'bg-amber-50 dark:bg-amber-950', icon: 'text-amber-600 dark:text-amber-400', val: 'text-amber-700 dark:text-amber-300' },
    red: { bg: 'bg-red-50 dark:bg-red-950', icon: 'text-red-600 dark:text-red-400', val: 'text-red-700 dark:text-red-300' },
  };
  const c = colors[color];
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide truncate">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${c.val}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.value >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              <span>{trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-gray-400 font-normal">{trend.label}</span>
            </div>
          )}
        </div>
        {icon && <div className={`p-2.5 rounded-xl ${c.bg} ${c.icon} ml-3 flex-shrink-0`}>{icon}</div>}
      </div>
    </Card>
  );
}
