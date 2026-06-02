'use client';

import { useEffect, useState } from 'react';
import { getProducts, getEntries, addEntry, generateId } from '@/lib/store';
import { Product, Entry } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowDownToLine, Plus, Wrench } from 'lucide-react';
import { toast } from 'sonner';

export default function EntradasPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    productId: '',
    quantity: 1,
    supplier: '',
    date: new Date().toISOString().split('T')[0],
  });

  function reload() {
    setEntries(getEntries());
    setProducts(getProducts());
  }

  useEffect(() => { reload(); }, []);

  const selectedProduct = products.find((p) => p.id === form.productId);

  function handleSave() {
    if (!form.productId) { toast.error('Selecciona un producto.'); return; }
    if (form.quantity < 1) { toast.error('La cantidad debe ser mayor a 0.'); return; }
    if (!form.supplier.trim()) { toast.error('El proveedor es obligatorio.'); return; }
    if (!form.date) { toast.error('La fecha es obligatoria.'); return; }

    const entry: Entry = {
      id: generateId(),
      productId: form.productId,
      productName: selectedProduct!.name,
      quantity: form.quantity,
      supplier: form.supplier.trim(),
      date: form.date,
      createdAt: new Date().toISOString().split('T')[0],
    };
    addEntry(entry);
    reload();
    setDialogOpen(false);
    setForm({ productId: '', quantity: 1, supplier: '', date: new Date().toISOString().split('T')[0] });
    toast.success(`Entrada de ${entry.quantity} u. de "${entry.productName}" registrada.`);
  }

  const totalUnits = entries.reduce((s, e) => s + e.quantity, 0);

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="bg-white border-2 border-neutral-900">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 py-4 border-b border-neutral-300">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-[family-name:var(--font-fira-code)] tracking-widest text-neutral-500 uppercase mb-1">
              <Wrench size={12} strokeWidth={2.5} />
              <span>Bitácora · MOD-ENT</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Entradas de mercancía</h1>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="h-10 bg-[#FF6B00] hover:bg-[#E55E00] text-black font-bold border border-black cursor-pointer shrink-0 uppercase tracking-wider font-[family-name:var(--font-fira-code)]"
          >
            <Plus size={16} strokeWidth={3} className="mr-1.5" />
            Registrar entrada
          </Button>
        </div>
        <div className="grid grid-cols-2 divide-x divide-neutral-300">
          <div className="px-5 py-2.5">
            <div className="text-[9px] font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-500 uppercase">
              Registros
            </div>
            <div className="text-base font-bold font-[family-name:var(--font-fira-code)] text-neutral-900 tabular-nums mt-0.5">
              {String(entries.length).padStart(3, '0')}
            </div>
          </div>
          <div className="px-5 py-2.5">
            <div className="text-[9px] font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-500 uppercase">
              Unidades ingresadas
            </div>
            <div className="text-base font-bold font-[family-name:var(--font-fira-code)] text-emerald-700 tabular-nums mt-0.5">
              +{totalUnits.toLocaleString('es-MX')}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border-2 border-neutral-900">
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
            <ArrowDownToLine size={36} className="mb-3 opacity-40" strokeWidth={1.5} />
            <p className="font-bold uppercase tracking-widest font-[family-name:var(--font-fira-code)] text-sm">// Sin entradas registradas</p>
            <p className="text-xs mt-1 text-neutral-500">Registra la primera entrada de mercancía.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-900 text-white">
                  <th className="text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)] w-10">#</th>
                  <th className="text-left px-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)]">Producto</th>
                  <th className="text-left px-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)] hidden md:table-cell">Categoría</th>
                  <th className="text-right px-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)]">Cant.</th>
                  <th className="text-left px-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)] hidden sm:table-cell">Proveedor</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)]">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {entries.map((e, i) => {
                  const prod = products.find((p) => p.id === e.productId);
                  return (
                    <tr
                      key={e.id}
                      className={`group hover:bg-[#FFF8E1] transition-colors border-l-4 border-transparent hover:border-l-emerald-700 ${
                        i % 2 === 1 ? 'bg-neutral-50' : ''
                      }`}
                    >
                      <td className="px-4 py-2.5 font-[family-name:var(--font-fira-code)] text-neutral-500 text-xs tabular-nums">
                        {String(i + 1).padStart(3, '0')}
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-emerald-50 border border-emerald-700 shrink-0">
                            <ArrowDownToLine size={12} strokeWidth={2.5} className="text-emerald-700" />
                          </span>
                          <span className="font-semibold text-neutral-900">{e.productName}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2.5 hidden md:table-cell text-neutral-600 text-[11px] font-[family-name:var(--font-fira-code)] uppercase tracking-wider">
                        {prod ? CATEGORY_LABELS[prod.category] : '—'}
                      </td>
                      <td className="px-2 py-2.5 text-right font-[family-name:var(--font-fira-code)] tabular-nums">
                        <span className="font-bold text-emerald-700">+{String(e.quantity).padStart(3, '0')}</span>
                      </td>
                      <td className="px-2 py-2.5 hidden sm:table-cell text-neutral-700 text-sm">
                        {e.supplier}
                      </td>
                      <td className="px-4 py-2.5 text-right text-neutral-600 font-[family-name:var(--font-fira-code)] text-xs tabular-nums">
                        {e.date}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[440px] border-2 border-neutral-900 bg-white p-0 gap-0">
          <div className="px-5 py-3 bg-neutral-900 text-white flex items-center justify-between">
            <DialogHeader>
              <DialogTitle className="text-[11px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] uppercase flex items-center gap-2">
                <ArrowDownToLine size={14} strokeWidth={2.5} className="text-emerald-400" />
                Registrar entrada
              </DialogTitle>
            </DialogHeader>
            <span className="text-[10px] font-[family-name:var(--font-fira-code)] tracking-widest text-neutral-400">NEW/ENT</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="eprod" className="text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-700 uppercase">
                Producto <span className="text-[#FF6B00]">*</span>
              </Label>
              <Select value={form.productId} onValueChange={(v) => setForm({ ...form, productId: v ?? '' })}>
                <SelectTrigger id="eprod" className="border-neutral-900 bg-neutral-50">
                  <SelectValue placeholder="Selecciona un producto…" />
                </SelectTrigger>
                <SelectContent className="border-2 border-neutral-900">
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} <span className="text-neutral-500 ml-1 font-[family-name:var(--font-fira-code)]">[stock: {p.stock}]</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProduct && (
              <div className="bg-emerald-50 border-2 border-emerald-700 px-3 py-2 text-sm text-emerald-900 font-[family-name:var(--font-fira-code)] flex items-center justify-between">
                <span className="text-[10px] tracking-widest uppercase">// Stock actual</span>
                <span className="font-bold tabular-nums">
                  {String(selectedProduct.stock).padStart(3, '0')} U.
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="eqty" className="text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-700 uppercase">
                  Cantidad <span className="text-[#FF6B00]">*</span>
                </Label>
                <Input
                  id="eqty"
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  className="border-neutral-900 bg-neutral-50 focus-visible:ring-0 focus-visible:border-[#FF6B00] focus-visible:bg-white font-[family-name:var(--font-fira-code)] tabular-nums"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edate" className="text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-700 uppercase">
                  Fecha <span className="text-[#FF6B00]">*</span>
                </Label>
                <Input
                  id="edate"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="border-neutral-900 bg-neutral-50 focus-visible:ring-0 focus-visible:border-[#FF6B00] focus-visible:bg-white font-[family-name:var(--font-fira-code)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="esup" className="text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-700 uppercase">
                Proveedor <span className="text-[#FF6B00]">*</span>
              </Label>
              <Input
                id="esup"
                value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                placeholder="Nombre del proveedor"
                className="border-neutral-900 bg-neutral-50 focus-visible:ring-0 focus-visible:border-[#FF6B00] focus-visible:bg-white"
              />
            </div>

            <div className="flex gap-2 pt-3 border-t border-neutral-300">
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="flex-1 h-10 border-2 border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-900 hover:text-white cursor-pointer uppercase tracking-wider font-[family-name:var(--font-fira-code)] font-bold"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 h-10 bg-[#FF6B00] hover:bg-[#E55E00] text-black font-bold border border-black cursor-pointer uppercase tracking-wider font-[family-name:var(--font-fira-code)]"
              >
                {'>'} Registrar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
