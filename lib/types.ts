export type Workspace = 'personal' | 'agency';

export type TransactionType = 'income' | 'expense';

export type LoanType = 'taken' | 'given';

export type LoanStatus = 'active' | 'completed' | 'overdue' | 'paused';

export type InstallmentFrequency = 'weekly' | 'monthly' | 'quarterly' | 'custom';

export type AccountType = 'cash' | 'bank' | 'mobile' | 'savings' | 'investment';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export type ClientStatus = 'active' | 'inactive' | 'prospect';

export interface Transaction {
  id: string;
  workspace: Workspace;
  type: TransactionType;
  amount: number;
  currency: string;
  category: string;
  subcategory?: string;
  description: string;
  date: string;
  account: string;
  paymentMethod: string;
  tags?: string[];
  isRecurring?: boolean;
  recurringPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  notes?: string;
}

export interface Installment {
  id: string;
  loanId: string;
  amount: number;
  date: string;
  status: 'paid' | 'due' | 'overdue' | 'partial';
  paidAmount: number;
  notes?: string;
}

export interface Loan {
  id: string;
  type: LoanType;
  workspace: Workspace;
  personName: string;
  personContact?: string;
  originalAmount: number;
  remainingAmount: number;
  paidAmount: number;
  currency: string;
  startDate: string;
  endDate?: string;
  installmentAmount: number;
  installmentFrequency: InstallmentFrequency;
  nextPaymentDate: string;
  hasInterest: boolean;
  interestRate?: number;
  status: LoanStatus;
  installments: Installment[];
  notes?: string;
  purpose?: string;
}

export interface Account {
  id: string;
  workspace: Workspace;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  bankName?: string;
  accountNumber?: string;
  color: string;
}

export interface Client {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  totalPaid: number;
  totalDue: number;
  status: ClientStatus;
  createdAt: string;
  notes?: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
  items: InvoiceItem[];
  notes?: string;
  invoiceNumber: string;
}

export interface AppState {
  theme: 'light' | 'dark';
  workspace: Workspace;
  transactions: Transaction[];
  loans: Loan[];
  accounts: Account[];
  clients: Client[];
  invoices: Invoice[];
}

export type AppAction =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_WORKSPACE'; payload: Workspace }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_LOAN'; payload: Loan }
  | { type: 'UPDATE_LOAN'; payload: Loan }
  | { type: 'DELETE_LOAN'; payload: string }
  | { type: 'ADD_PAYMENT'; payload: { loanId: string; installment: Installment } }
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'UPDATE_ACCOUNT'; payload: Account }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'UPDATE_INVOICE'; payload: Invoice }
  | { type: 'DELETE_INVOICE'; payload: string }
  | { type: 'LOAD_STATE'; payload: AppState };
