'use client';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AppAction, AppState, Installment, Loan } from './types';
import { SEED_ACCOUNTS, SEED_CLIENTS, SEED_INVOICES, SEED_LOANS, SEED_TRANSACTIONS } from './seed-data';
import { calculateNextPaymentDate, isOverdue, toISODate } from './utils';

const STORAGE_KEY = 'financeapp_state_v1';

const initialState: AppState = {
  theme: 'light',
  workspace: 'personal',
  transactions: SEED_TRANSACTIONS,
  loans: SEED_LOANS,
  accounts: SEED_ACCOUNTS,
  clients: SEED_CLIENTS,
  invoices: SEED_INVOICES,
};

function applyPaymentToLoan(loan: Loan, installment: Installment): Loan {
  const newRemaining = Math.max(0, loan.remainingAmount - installment.paidAmount);
  const newPaid = loan.paidAmount + installment.paidAmount;
  const nextDate = calculateNextPaymentDate(installment.date, loan.installmentFrequency);
  const newStatus = newRemaining === 0 ? 'completed' : isOverdue(nextDate) ? 'overdue' : 'active';
  return {
    ...loan,
    remainingAmount: newRemaining,
    paidAmount: newPaid,
    nextPaymentDate: nextDate,
    status: newStatus,
    installments: [...loan.installments, installment],
  };
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_STATE': return action.payload;
    case 'SET_THEME': return { ...state, theme: action.payload };
    case 'SET_WORKSPACE': return { ...state, workspace: action.payload };

    case 'ADD_TRANSACTION': return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_TRANSACTION': return { ...state, transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TRANSACTION': return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };

    case 'ADD_LOAN': return { ...state, loans: [action.payload, ...state.loans] };
    case 'UPDATE_LOAN': return { ...state, loans: state.loans.map(l => l.id === action.payload.id ? action.payload : l) };
    case 'DELETE_LOAN': return { ...state, loans: state.loans.filter(l => l.id !== action.payload) };
    case 'ADD_PAYMENT': return {
      ...state,
      loans: state.loans.map(l => l.id === action.payload.loanId ? applyPaymentToLoan(l, action.payload.installment) : l),
    };

    case 'ADD_ACCOUNT': return { ...state, accounts: [action.payload, ...state.accounts] };
    case 'UPDATE_ACCOUNT': return { ...state, accounts: state.accounts.map(a => a.id === action.payload.id ? action.payload : a) };
    case 'DELETE_ACCOUNT': return { ...state, accounts: state.accounts.filter(a => a.id !== action.payload) };

    case 'ADD_CLIENT': return { ...state, clients: [action.payload, ...state.clients] };
    case 'UPDATE_CLIENT': return { ...state, clients: state.clients.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CLIENT': return { ...state, clients: state.clients.filter(c => c.id !== action.payload) };

    case 'ADD_INVOICE': return { ...state, invoices: [action.payload, ...state.invoices] };
    case 'UPDATE_INVOICE': return { ...state, invoices: state.invoices.map(i => i.id === action.payload.id ? action.payload : i) };
    case 'DELETE_INVOICE': return { ...state, invoices: state.invoices.filter(i => i.id !== action.payload) };

    default: return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AppState;
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      }
    } catch {
      // use initial state
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
  }, [state.theme]);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppState(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used inside AppProvider');
  return ctx;
}

export function useWorkspaceTransactions() {
  const { state } = useAppState();
  return state.transactions.filter(t => t.workspace === state.workspace);
}

export function useWorkspaceLoans() {
  const { state } = useAppState();
  return state.loans.filter(l => l.workspace === state.workspace);
}

export function useWorkspaceAccounts() {
  const { state } = useAppState();
  return state.accounts.filter(a => a.workspace === state.workspace);
}
