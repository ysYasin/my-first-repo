'use client';
import React, { useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import ClientList from '@/components/agency/ClientList';
import { useAppState } from '@/lib/store';

export default function AgencyClientsPage() {
  const { dispatch } = useAppState();
  useEffect(() => { dispatch({ type: 'SET_WORKSPACE', payload: 'agency' }); }, [dispatch]);
  return (
    <AppLayout title="Clients">
      <ClientList />
    </AppLayout>
  );
}
