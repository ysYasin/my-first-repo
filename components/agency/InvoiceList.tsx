'use client';
import React, { useState } from 'react';
import { Plus, FileText, Trash2, Edit3, CheckCircle } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { Invoice } from '@/lib/types';
import { useAppState } from '@/lib/store';
import { formatCurrency, formatDate, toISODate, addDays } from '@/lib/utils';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { invoiceStatusBadge } from '../ui/Badge';
import { FormField, Input, Select, Textarea } from '../ui/FormField';

export default function InvoiceList() {
  const { state, dispatch } = useAppState();
  const [addOpen, setAddOpen] = useState(false);
  const [editInv, setEditInv] = useState<Invoice | null>(null);

  const invoices = [...state.invoices].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  function del(id: string) {
    if (confirm('Delete this invoice?')) dispatch({ type: 'DELETE_INVOICE', payload: id });
  }
  function markPaid(inv: Invoice) {
    dispatch({ type: 'UPDATE_INVOICE', payload: { ...inv, status: 'paid' } });
  }

  const totals = {
    paid: invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0),
    pending: invoices.filter(i => i.status === 'sent').reduce((s, i) => s + i.amount, 0),
    overdue: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0),
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Collected', value: totals.paid, color: 'text-emerald-600' },
          { label: 'Pending', value: totals.pending, color: 'text-blue-600' },
          { label: 'Overdue', value: totals.overdue, color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{s.label}</p>
            <p className={`font-bold text-lg mt-1 ${s.color}`}>{formatCurrency(s.value)}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setAddOpen(true)} icon={<Plus size={14} />} className="bg-purple-600 hover:bg-purple-700">New Invoice</Button>
      </div>

      {invoices.length === 0 ? (
        <Card className="p-8 text-center">
          <FileText size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-400 text-sm">No invoices yet</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {invoices.map(inv => (
            <Card key={inv.id} className="p-4 group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950">
                  <FileText size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-gray-900 dark:text-white">{inv.invoiceNumber}</p>
                    {invoiceStatusBadge(inv.status)}
                  </div>
                  <p className="text-xs text-gray-500">{inv.clientName} · Due {formatDate(inv.dueDate)}</p>
                </div>
                <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(inv.amount, inv.currency)}</p>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {inv.status !== 'paid' && (
                    <button onClick={() => markPaid(inv)} className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950 text-gray-400 hover:text-emerald-600" title="Mark Paid">
                      <CheckCircle size={13} />
                    </button>
                  )}
                  <button onClick={() => setEditInv(inv)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"><Edit3 size={13} /></button>
                  <button onClick={() => del(inv.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="New Invoice" size="lg">
        <InvoiceForm onClose={() => setAddOpen(false)} />
      </Modal>
      <Modal open={!!editInv} onClose={() => setEditInv(null)} title="Edit Invoice" size="lg">
        {editInv && <InvoiceForm onClose={() => setEditInv(null)} initial={editInv} />}
      </Modal>
    </div>
  );
}

function InvoiceForm({ onClose, initial }: { onClose: () => void; initial?: Invoice }) {
  const { state, dispatch } = useAppState();
  const [form, setForm] = useState({
    clientName: initial?.clientName ?? '',
    clientId: initial?.clientId ?? '',
    amount: initial?.amount.toString() ?? '',
    status: initial?.status ?? 'draft',
    dueDate: initial?.dueDate ?? addDays(toISODate(), 14),
    notes: initial?.notes ?? '',
  });
  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const nextNum = `INV-${String(state.invoices.length + 1).padStart(4, '0')}`;
    const inv: Invoice = {
      id: initial?.id ?? uuid(),
      clientId: form.clientId, clientName: form.clientName,
      amount: parseFloat(form.amount) || 0, currency: 'BDT',
      status: form.status as Invoice['status'],
      dueDate: form.dueDate, createdAt: initial?.createdAt ?? toISODate(),
      invoiceNumber: initial?.invoiceNumber ?? nextNum,
      items: [{ description: 'Services', quantity: 1, rate: parseFloat(form.amount) || 0, amount: parseFloat(form.amount) || 0 }],
      notes: form.notes || undefined,
    };
    dispatch({ type: initial ? 'UPDATE_INVOICE' : 'ADD_INVOICE', payload: inv });
    onClose();
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Client Name" required>
          <Input value={form.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Client name" required />
        </FormField>
        <FormField label="Amount (৳)" required>
          <Input type="number" min="0" value={form.amount} onChange={e => set('amount', e.target.value)} placeholder="0" required />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Status">
          <Select value={form.status} onChange={e => set('status', e.target.value)}>
            {['draft', 'sent', 'paid', 'overdue', 'cancelled'].map(s => <option key={s} className="capitalize">{s}</option>)}
          </Select>
        </FormField>
        <FormField label="Due Date">
          <Input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
        </FormField>
      </div>
      <FormField label="Notes">
        <Textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={2} placeholder="Optional..." />
      </FormField>
      <div className="flex gap-2 pt-1">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">{initial ? 'Update' : 'Create Invoice'}</Button>
      </div>
    </form>
  );
}
