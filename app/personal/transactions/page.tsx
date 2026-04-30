'use client';
import React, { useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import TransactionList from '@/components/personal/TransactionList';
import { useAppState } from '@/lib/store';

export default function PersonalTransactionsPage() {
  const { dispatch } = useAppState();
  useEffect(() => { dispatch({ type: 'SET_WORKSPACE', payload: 'personal' }); }, [dispatch]);
  return (
    <AppLayout title="Transactions">
      <TransactionList />
    </AppLayout>
  );
}
