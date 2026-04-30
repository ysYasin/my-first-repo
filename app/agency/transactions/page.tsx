'use client';
import React, { useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import TransactionList from '@/components/personal/TransactionList';
import { useAppState } from '@/lib/store';

export default function AgencyTransactionsPage() {
  const { dispatch } = useAppState();
  useEffect(() => { dispatch({ type: 'SET_WORKSPACE', payload: 'agency' }); }, [dispatch]);
  return (
    <AppLayout title="Agency Transactions">
      <TransactionList />
    </AppLayout>
  );
}
