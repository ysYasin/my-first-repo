'use client';
import React, { useState } from 'react';
import { Plus, Search, Users, Trash2, Edit3, Mail, Phone, Building2 } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { Client } from '@/lib/types';
import { useAppState } from '@/lib/store';
import { formatCurrency, toISODate } from '@/lib/utils';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';
import { FormField, Input, Select, Textarea } from '../ui/FormField';

const statusColor = { active: 'green', inactive: 'gray', prospect: 'amber' } as const;

export default function ClientList() {
  const { state, dispatch } = useAppState();
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editClient, setEditClient] = useState<Client | null>(null);

  const clients = state.clients.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.company?.toLowerCase().includes(search.toLowerCase()));

  function del(id: string) {
    if (confirm('Delete this client?')) dispatch({ type: 'DELETE_CLIENT', payload: id });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-3 py-2 flex-1 max-w-xs">
          <Search size={15} className="text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search clients..." className="bg-transparent text-sm outline-none w-full placeholder-gray-400 text-gray-700 dark:text-gray-300" />
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)} icon={<Plus size={14} />}>Add Client</Button>
      </div>

      {clients.length === 0 ? (
        <Card className="p-8 text-center">
          <Users size={32} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-400 text-sm">No clients yet</p>
          <Button size="sm" className="mt-3" onClick={() => setAddOpen(true)}>Add First Client</Button>
        </Card>
      ) : (
        <div className="grid gap-3">
          {clients.map(client => (
            <Card key={client.id} className="p-4 group">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center shrink-0">
                  <span className="text-purple-700 dark:text-purple-300 font-bold text-sm">{client.name[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{client.name}</p>
                    <Badge label={client.status} color={statusColor[client.status]} dot />
                  </div>
                  {client.company && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Building2 size={11} />{client.company}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-1">
                    {client.email && <span className="flex items-center gap-1 text-xs text-gray-400"><Mail size={11} />{client.email}</span>}
                    {client.phone && <span className="flex items-center gap-1 text-xs text-gray-400"><Phone size={11} />{client.phone}</span>}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-400">Total Paid</p>
                  <p className="font-bold text-emerald-600 text-sm">{formatCurrency(client.totalPaid)}</p>
                  {client.totalDue > 0 && <>
                    <p className="text-xs text-gray-400 mt-1">Due</p>
                    <p className="font-semibold text-red-500 text-sm">{formatCurrency(client.totalDue)}</p>
                  </>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setEditClient(client)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400"><Edit3 size={13} /></button>
                  <button onClick={() => del(client.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add Client">
        <ClientForm onClose={() => setAddOpen(false)} />
      </Modal>
      <Modal open={!!editClient} onClose={() => setEditClient(null)} title="Edit Client">
        {editClient && <ClientForm onClose={() => setEditClient(null)} initial={editClient} />}
      </Modal>
    </div>
  );
}

function ClientForm({ onClose, initial }: { onClose: () => void; initial?: Client }) {
  const { dispatch } = useAppState();
  const [form, setForm] = useState({
    name: initial?.name ?? '', company: initial?.company ?? '',
    email: initial?.email ?? '', phone: initial?.phone ?? '',
    status: initial?.status ?? 'active', notes: initial?.notes ?? '',
    totalPaid: initial?.totalPaid.toString() ?? '0', totalDue: initial?.totalDue.toString() ?? '0',
  });
  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const client: Client = {
      id: initial?.id ?? uuid(), name: form.name, company: form.company || undefined,
      email: form.email || undefined, phone: form.phone || undefined,
      status: form.status as Client['status'], notes: form.notes || undefined,
      totalPaid: parseFloat(form.totalPaid) || 0, totalDue: parseFloat(form.totalDue) || 0,
      createdAt: initial?.createdAt ?? toISODate(),
    };
    dispatch({ type: initial ? 'UPDATE_CLIENT' : 'ADD_CLIENT', payload: client });
    onClose();
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <FormField label="Full Name" required>
        <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Client name" required />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Company">
          <Input value={form.company} onChange={e => set('company', e.target.value)} placeholder="Company" />
        </FormField>
        <FormField label="Status">
          <Select value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="prospect">Prospect</option>
          </Select>
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Email">
          <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@example.com" />
        </FormField>
        <FormField label="Phone">
          <Input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="017..." />
        </FormField>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Total Paid (৳)">
          <Input type="number" min="0" value={form.totalPaid} onChange={e => set('totalPaid', e.target.value)} />
        </FormField>
        <FormField label="Amount Due (৳)">
          <Input type="number" min="0" value={form.totalDue} onChange={e => set('totalDue', e.target.value)} />
        </FormField>
      </div>
      <div className="flex gap-2 pt-1">
        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
        <Button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-700">{initial ? 'Update' : 'Add Client'}</Button>
      </div>
    </form>
  );
}
