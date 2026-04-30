'use client';
import React, { useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import InvoiceList from '@/components/agency/InvoiceList';
import { useAppState } from '@/lib/store';

export default function AgencyInvoicesPage() {
  const { dispatch } = useAppState();
  useEffect(() => { dispatch({ type: 'SET_WORKSPACE', payload: 'agency' }); }, [dispatch]);
  return (
    <AppLayout title="Invoices">
      <InvoiceList />
    </AppLayout>
  );
}
