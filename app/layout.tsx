import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';

export const metadata: Metadata = {
  title: 'FinanceOS — Personal & Agency Finance',
  description: 'Manage personal finances, agency accounts, and loans in one place',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
