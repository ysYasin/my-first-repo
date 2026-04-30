import { Account, Client, Invoice, Loan, Transaction } from './types';
import { toISODate, addMonths, addDays } from './utils';

const today = toISODate();

export const SEED_ACCOUNTS: Account[] = [
  { id: 'acc-1', workspace: 'personal', name: 'Cash in Hand', type: 'cash', balance: 12500, currency: 'BDT', color: '#10b981' },
  { id: 'acc-2', workspace: 'personal', name: 'Dutch Bangla Bank', type: 'bank', balance: 85000, currency: 'BDT', bankName: 'DBBL', color: '#3b82f6' },
  { id: 'acc-3', workspace: 'personal', name: 'bKash', type: 'mobile', balance: 4200, currency: 'BDT', color: '#ec4899' },
  { id: 'acc-4', workspace: 'personal', name: 'Savings Fund', type: 'savings', balance: 150000, currency: 'BDT', color: '#8b5cf6' },
  { id: 'acc-5', workspace: 'agency', name: 'Agency Current Account', type: 'bank', balance: 320000, currency: 'BDT', bankName: 'Islami Bank', color: '#8b5cf6' },
  { id: 'acc-6', workspace: 'agency', name: 'Agency Cash', type: 'cash', balance: 25000, currency: 'BDT', color: '#f59e0b' },
];

export const SEED_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', workspace: 'personal', type: 'income', amount: 45000, currency: 'BDT', category: 'Salary', description: 'Monthly salary', date: addMonths(today, -1), account: 'acc-2', paymentMethod: 'bank' },
  { id: 'tx-2', workspace: 'personal', type: 'expense', amount: 8500, currency: 'BDT', category: 'Rent', description: 'Monthly rent', date: addDays(addMonths(today, -1), 1), account: 'acc-2', paymentMethod: 'bank' },
  { id: 'tx-3', workspace: 'personal', type: 'expense', amount: 3200, currency: 'BDT', category: 'Food & Dining', description: 'Grocery shopping', date: addDays(addMonths(today, -1), 5), account: 'acc-1', paymentMethod: 'cash' },
  { id: 'tx-4', workspace: 'personal', type: 'expense', amount: 1200, currency: 'BDT', category: 'Transport', description: 'Uber & rickshaw', date: addDays(addMonths(today, -1), 7), account: 'acc-3', paymentMethod: 'mobile' },
  { id: 'tx-5', workspace: 'personal', type: 'expense', amount: 5000, currency: 'BDT', category: 'Family', description: 'Parents monthly', date: addDays(addMonths(today, -1), 3), account: 'acc-2', paymentMethod: 'bank' },
  { id: 'tx-6', workspace: 'personal', type: 'income', amount: 45000, currency: 'BDT', category: 'Salary', description: 'Monthly salary', date: addDays(today, -28), account: 'acc-2', paymentMethod: 'bank' },
  { id: 'tx-7', workspace: 'personal', type: 'expense', amount: 8500, currency: 'BDT', category: 'Rent', description: 'Monthly rent', date: addDays(today, -25), account: 'acc-2', paymentMethod: 'bank' },
  { id: 'tx-8', workspace: 'personal', type: 'expense', amount: 2800, currency: 'BDT', category: 'Food & Dining', description: 'Restaurant', date: addDays(today, -10), account: 'acc-1', paymentMethod: 'cash' },
  { id: 'tx-9', workspace: 'personal', type: 'expense', amount: 800, currency: 'BDT', category: 'Subscriptions', description: 'Netflix, Spotify', date: addDays(today, -15), account: 'acc-3', paymentMethod: 'mobile' },
  { id: 'tx-10', workspace: 'agency', type: 'income', amount: 85000, currency: 'BDT', category: 'Client Payment', description: 'ABC Corp — Project Alpha', date: addDays(today, -20), account: 'acc-5', paymentMethod: 'bank' },
  { id: 'tx-11', workspace: 'agency', type: 'expense', amount: 25000, currency: 'BDT', category: 'Meta Ads', description: 'FB campaign Q1', date: addDays(today, -18), account: 'acc-5', paymentMethod: 'bank' },
  { id: 'tx-12', workspace: 'agency', type: 'expense', amount: 30000, currency: 'BDT', category: 'Payroll', description: 'Team salaries', date: addDays(today, -5), account: 'acc-5', paymentMethod: 'bank' },
  { id: 'tx-13', workspace: 'agency', type: 'income', amount: 55000, currency: 'BDT', category: 'Client Payment', description: 'XYZ Ltd — Retainer', date: addDays(today, -8), account: 'acc-5', paymentMethod: 'bank' },
  { id: 'tx-14', workspace: 'agency', type: 'expense', amount: 8000, currency: 'BDT', category: 'Software', description: 'Adobe CC, Slack', date: addDays(today, -12), account: 'acc-5', paymentMethod: 'bank' },
];

export const SEED_LOANS: Loan[] = [
  {
    id: 'loan-1',
    type: 'taken',
    workspace: 'personal',
    personName: 'Rahim Bhai',
    personContact: '01711-000001',
    originalAmount: 80,
    remainingAmount: 56,
    paidAmount: 24,
    currency: 'BDT',
    startDate: addMonths(today, -3),
    installmentAmount: 8,
    installmentFrequency: 'monthly',
    nextPaymentDate: addMonths(today, 0),
    hasInterest: false,
    status: 'active',
    purpose: 'Emergency cash',
    installments: [
      { id: 'ins-1', loanId: 'loan-1', amount: 8, date: addMonths(today, -2), status: 'paid', paidAmount: 8 },
      { id: 'ins-2', loanId: 'loan-1', amount: 8, date: addMonths(today, -1), status: 'paid', paidAmount: 8 },
      { id: 'ins-3', loanId: 'loan-1', amount: 8, date: addDays(today, -5), status: 'paid', paidAmount: 8 },
    ],
    notes: 'Borrowed for emergency. Pay back ৳8 every month.',
  },
  {
    id: 'loan-2',
    type: 'given',
    workspace: 'personal',
    personName: 'Karim Friend',
    personContact: '01812-000002',
    originalAmount: 50000,
    remainingAmount: 35000,
    paidAmount: 15000,
    currency: 'BDT',
    startDate: addMonths(today, -3),
    installmentAmount: 5000,
    installmentFrequency: 'monthly',
    nextPaymentDate: addDays(today, 5),
    hasInterest: false,
    status: 'active',
    purpose: 'Business startup',
    installments: [
      { id: 'ins-4', loanId: 'loan-2', amount: 5000, date: addMonths(today, -2), status: 'paid', paidAmount: 5000 },
      { id: 'ins-5', loanId: 'loan-2', amount: 5000, date: addMonths(today, -1), status: 'paid', paidAmount: 5000 },
      { id: 'ins-6', loanId: 'loan-2', amount: 5000, date: addDays(today, -3), status: 'paid', paidAmount: 5000 },
    ],
    notes: 'Lent for business. Monthly ৳5,000 return.',
  },
  {
    id: 'loan-3',
    type: 'taken',
    workspace: 'agency',
    personName: 'Investor Mosharraf',
    personContact: '01911-000003',
    originalAmount: 200000,
    remainingAmount: 140000,
    paidAmount: 60000,
    currency: 'BDT',
    startDate: addMonths(today, -6),
    installmentAmount: 10000,
    installmentFrequency: 'monthly',
    nextPaymentDate: addDays(today, 10),
    hasInterest: true,
    interestRate: 10,
    status: 'active',
    purpose: 'Agency expansion',
    installments: [
      { id: 'ins-7', loanId: 'loan-3', amount: 10000, date: addMonths(today, -5), status: 'paid', paidAmount: 10000 },
      { id: 'ins-8', loanId: 'loan-3', amount: 10000, date: addMonths(today, -4), status: 'paid', paidAmount: 10000 },
      { id: 'ins-9', loanId: 'loan-3', amount: 10000, date: addMonths(today, -3), status: 'paid', paidAmount: 10000 },
      { id: 'ins-10', loanId: 'loan-3', amount: 10000, date: addMonths(today, -2), status: 'paid', paidAmount: 10000 },
      { id: 'ins-11', loanId: 'loan-3', amount: 10000, date: addMonths(today, -1), status: 'paid', paidAmount: 10000 },
      { id: 'ins-12', loanId: 'loan-3', amount: 10000, date: addDays(today, -2), status: 'paid', paidAmount: 10000 },
    ],
    notes: '10% annual interest. Business expansion fund.',
  },
];

export const SEED_CLIENTS: Client[] = [
  { id: 'cl-1', name: 'Rahim Ahmed', company: 'ABC Corporation', email: 'rahim@abc.com', phone: '01711-111111', totalPaid: 145000, totalDue: 25000, status: 'active', createdAt: addMonths(today, -5) },
  { id: 'cl-2', name: 'Sara Begum', company: 'XYZ Limited', email: 'sara@xyz.com', phone: '01812-222222', totalPaid: 88000, totalDue: 0, status: 'active', createdAt: addMonths(today, -3) },
  { id: 'cl-3', name: 'Jahir Khan', company: 'Fresh Startup', email: 'jahir@fresh.com', phone: '01611-333333', totalPaid: 0, totalDue: 30000, status: 'prospect', createdAt: addDays(today, -10) },
];

export const SEED_INVOICES: Invoice[] = [
  { id: 'inv-1', clientId: 'cl-1', clientName: 'ABC Corporation', amount: 25000, currency: 'BDT', status: 'sent', dueDate: addDays(today, 7), createdAt: addDays(today, -7), invoiceNumber: 'INV-0001', items: [{ description: 'Social Media Management', quantity: 1, rate: 25000, amount: 25000 }] },
  { id: 'inv-2', clientId: 'cl-2', clientName: 'XYZ Limited', amount: 45000, currency: 'BDT', status: 'paid', dueDate: addMonths(today, -1), createdAt: addMonths(today, -2), invoiceNumber: 'INV-0002', items: [{ description: 'Digital Marketing Package', quantity: 1, rate: 45000, amount: 45000 }] },
  { id: 'inv-3', clientId: 'cl-3', clientName: 'Fresh Startup', amount: 30000, currency: 'BDT', status: 'draft', dueDate: addDays(today, 14), createdAt: addDays(today, -3), invoiceNumber: 'INV-0003', items: [{ description: 'Brand Identity + Strategy', quantity: 1, rate: 30000, amount: 30000 }] },
];
