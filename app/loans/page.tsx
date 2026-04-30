'use client';
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import LoansDashboard from '@/components/loans/LoansDashboard';

export default function LoansPage() {
  return (
    <AppLayout title="Loan Management">
      <LoansDashboard />
    </AppLayout>
  );
}
