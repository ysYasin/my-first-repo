'use client';
import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const colors = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
};

export default function ProgressBar({ value, max = 100, color = 'blue', size = 'md', showLabel }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const h = size === 'sm' ? 'h-1.5' : 'h-2.5';
  return (
    <div className="flex items-center gap-2">
      <div className={`flex-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden ${h}`}>
        <div
          className={`${h} rounded-full transition-all duration-500 ${colors[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <span className="text-xs font-medium text-gray-500 w-9 text-right">{Math.round(pct)}%</span>}
    </div>
  );
}
