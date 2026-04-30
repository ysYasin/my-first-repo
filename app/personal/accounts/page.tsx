'use client';
import React, { useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import AccountCards from '@/components/personal/AccountCards';
import { useAppState } from '@/lib/store';

export default function PersonalAccountsPage() {
  const { dispatch } = useAppState();
  useEffect(() => { dispatch({ type: 'SET_WORKSPACE', payload: 'personal' }); }, [dispatch]);
  return (
    <AppLayout title="Accounts">
      <AccountCards />
    </AppLayout>
  );
}
