'use client';
import React, { useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import AgencyDashboard from '@/components/agency/AgencyDashboard';
import { useAppState } from '@/lib/store';

export default function AgencyPage() {
  const { dispatch } = useAppState();
  useEffect(() => { dispatch({ type: 'SET_WORKSPACE', payload: 'agency' }); }, [dispatch]);
  return (
    <AppLayout title="Agency Dashboard">
      <AgencyDashboard />
    </AppLayout>
  );
}
