'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import PersonalDashboard from '@/components/personal/PersonalDashboard';
import { useAppState } from '@/lib/store';

export default function PersonalPage() {
  const { dispatch } = useAppState();
  useEffect(() => {
    dispatch({ type: 'SET_WORKSPACE', payload: 'personal' });
  }, [dispatch]);

  return (
    <AppLayout title="Personal Finance">
      <PersonalDashboard />
    </AppLayout>
  );
}
