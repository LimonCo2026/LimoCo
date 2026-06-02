'use client';

import { useEffect, useState } from 'react';
import { getProducts, getExits, addExit, generateId } from '@/lib/store';
import { Product, Exit } from '@/lib/types';
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
import { ArrowUpFromLine, Plus, AlertTriangle, Wrench } from 'lucide-react';
import { toast } from 'sonner';

export default function SalidasPage() {
  const [exits, setExits] = useState<Exit[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    productId: '',
    quantity: 1,
    type: 'venta' as 'venta' | 'consumo-interno',
    date: new Date().toISOString().split('T')[0],
  });

  function reload() {
    setExits(getExits());
    setProducts(getProducts());
  }

  useEffect(() => { reload(); }, []);

  const selectedProduct = products.find((p) => p.id === form.productId);
  const stockInsuficiente = selectedProduct && form.quantity > selectedProduct.stock;

  function handleSave() {
    if (!form.productId) { toast.error('Selecciona un producto.'); return; }
    if (form.quantity < 1) { toast.error('La cantidad debe ser mayor a 0.'); return; }
    if (!form.date) { toast.error('La fecha es obligatoria.'); return; }
    if (stockInsuficiente) { toast.error(`Stock insuficiente. Disponible: ${selectedProduct?.stock} u.`); return; }

    const exit: Exit = {
      id: generateId(),
      productId: form.productId,
      productName: selectedProduct!.name,
      quantity: form.quantity,
      type: form.type,
      date: form.date,
      createdAt: new Date().toISOString().split('T')[0],
    };
    addExit(exit);
    reload();
    setDialogOpen(false);
    setForm({ productId: '', quantity: 1, type: 'venta', date: new Date().toISOString().split('T')[0] });
    toast.success(`Salida de ${exit.quantity} u. de "${exit.productName}" registrada.`);
  }

  const totalUnits = exits.reduce((s, e) => s + e.quantity, 0);
  const ventas = exits.filter((e) => e.type === 'venta').length;
  const internos = exits.filter((e) => e.type === 'consumo-interno').length;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="bg-white border-2 border-neutral-900">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 py-4 border-b border-neutral-300">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-[family-name:var(--font-fira-code)] tracking-widest text-neutral-500 uppercase mb-1">
              <Wrench size={12} strokeWidth={2.5} />
              <span>Bitácora · MOD-EXT</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Salidas de inventario</h1>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="h-10 bg-[#FF6B00] hover:bg-[#E55E00] text-black font-bold border border-black cursor-pointer shrink-0 uppercase tracking-wider font-[family-name:var(--font-fira-code)]"
          >
            <Plus size={16} strokeWidth={3} className="mr-1.5" />
            Registrar salida
          </Button>
        </div>
        <div className="grid grid-cols-3 divide-x divide-neutral-300">
          <div className="px-5 py-2.5">
            <div className="text-[9px] font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-500 uppercase">Registros</div>
            <div className="text-base font-bold font-[family-name:var(--font-fira-code)] text-neutral-900 tabular-nums mt-0.5">
              {String(exits.length).padStart(3, '0')}
            </div>
          </div>
          <div className="px-5 py-2.5">
            <div className="text-[9px] font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-500 uppercase">Unidades salidas</div>
            <div className="text-base font-bold font-[family-name:var(--font-fira-code)] text-[#C2410C] tabular-nums mt-0.5">
              −{totalUnits.toLocaleString('es-MX')}
            </div>
          </div>
          <div className="px-5 py-2.5">
            <div className="text-[9px] font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-500 uppercase">Venta / Interno</div>
            <div className="text-base font-bold font-[family-name:var(--font-fira-code)] text-neutral-900 tabular-nums mt-0.5">
              {String(ventas).padStart(2, '0')} / {String(internos).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border-2 border-neutral-900">
        {exits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
            <ArrowUpFromLine size={36} className="mb-3 opacity-40" strokeWidth={1.5} />
            <p className="font-bold uppercase tracking-widest font-[family-name:var(--font-fira-code)] text-sm">// Sin salidas registradas</p>
            <p className="text-xs mt-1 text-neutral-500">Registra la primera salida de inventario.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-900 text-white">
                  <th className="text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)] w-10">#</th>
                  <th className="text-left px-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)]">Producto</th>
                  <th className="text-left px-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)] hidden md:table-cell">Categoría</th>
                  <th className="text-left px-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)] hidden sm:table-cell">Tipo</th>
                  <th className="text-right px-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)]">Cant.</th>
                  <th className="text-right px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)]">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {exits.map((e, i) => {
                  const prod = products.find((p) => p.id === e.productId);
                  const isVenta = e.type === 'venta';
                  return (
                    <tr
                      key={e.id}
                      className={`group hover:bg-[#FFF8E1] transition-colors border-l-4 border-transparent hover:border-l-[#FF6B00] ${
                        i % 2 === 1 ? 'bg-neutral-50' : ''
                      }`}
                    >
                      <td className="px-4 py-2.5 font-[family-name:var(--font-fira-code)] text-neutral-500 text-xs tabular-nums">
                        {String(i + 1).padStart(3, '0')}
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-orange-50 border border-[#C2410C] shrink-0">
                            <ArrowUpFromLine size={12} strokeWidth={2.5} className="text-[#C2410C]" />
                          </span>
                          <span className="font-semibold text-neutral-900">{e.productName}</span>
                        </div>
                      </td>
                      <td className="px-2 py-2.5 hidden md:table-cell text-neutral-600 text-[11px] font-[family-name:var(--font-fira-code)] uppercase tracking-wider">
                        {prod ? CATEGORY_LABELS[prod.category] : '—'}
                      </td>
                      <td className="px-2 py-2.5 hidden sm:table-cell">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 border text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-widest uppercase ${
                            isVenta
                              ? 'bg-[#3B82F6] text-white border-neutral-900'
                              : 'bg-white text-neutral-900 border-neutral-900'
                          }`}
                        >
                          {isVenta ? 'Venta' : 'Interno'}
                        </span>
                      </td>
                      <td className="px-2 py-2.5 text-right font-[family-name:var(--font-fira-code)] tabular-nums">
                        <span className="font-bold text-[#C2410C]">−{String(e.quantity).padStart(3, '0')}</span>
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
                <ArrowUpFromLine size={14} strokeWidth={2.5} className="text-[#FF6B00]" />
                Registrar salida
              </DialogTitle>
            </DialogHeader>
            <span className="text-[10px] font-[family-name:var(--font-fira-code)] tracking-widest text-neutral-400">NEW/EXT</span>
          </div>
          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="sprod" className="text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-700 uppercase">
                Producto <span className="text-[#FF6B00]">*</span>
              </Label>
              <Select value={form.productId} onValueChange={(v) => setForm({ ...form, productId: v ?? '', quantity: 1 })}>
                <SelectTrigger id="sprod" className="border-neutral-900 bg-neutral-50">
                  <SelectValue placeholder="Selecciona un producto…" />
                </SelectTrigger>
                <SelectContent className="border-2 border-neutral-900">
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id} disabled={p.stock === 0}>
                      {p.name} <span className="text-neutral-500 ml-1 font-[family-name:var(--font-fira-code)]">[stock: {p.stock}]</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProduct && (
              <div
                className={`border-2 px-3 py-2 text-sm font-[family-name:var(--font-fira-code)] flex items-center justify-between ${
                  stockInsuficiente
                    ? 'bg-[#FFF8E1] border-[#FF6B00] text-neutral-900'
                    : 'bg-orange-50 border-[#C2410C] text-orange-900'
                }`}
              >
                {stockInsuficiente ? (
                  <span className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-bold">
                    <AlertTriangle size={13} strokeWidth={2.5} className="text-[#FF6B00]" />
                    Stock insuficiente
                  </span>
                ) : (
                  <span className="text-[10px] tracking-widest uppercase">// Stock disponible</span>
                )}
                <span className="font-bold tabular-nums">
                  {String(selectedProduct.stock).padStart(3, '0')} U.
                </span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="sqty" className="text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-700 uppercase">
                  Cantidad <span className="text-[#FF6B00]">*</span>
                </Label>
                <Input
                  id="sqty"
                  type="number"
                  min={1}
                  max={selectedProduct?.stock ?? undefined}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  className="border-neutral-900 bg-neutral-50 focus-visible:ring-0 focus-visible:border-[#FF6B00] focus-visible:bg-white font-[family-name:var(--font-fira-code)] tabular-nums"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="sdate" className="text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-700 uppercase">
                  Fecha <span className="text-[#FF6B00]">*</span>
                </Label>
                <Input
                  id="sdate"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="border-neutral-900 bg-neutral-50 focus-visible:ring-0 focus-visible:border-[#FF6B00] focus-visible:bg-white font-[family-name:var(--font-fira-code)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="stype" className="text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-700 uppercase">
                Tipo de salida
              </Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm({ ...form, type: v as 'venta' | 'consumo-interno' })}
              >
                <SelectTrigger id="stype" className="border-neutral-900 bg-neutral-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-2 border-neutral-900">
                  <SelectItem value="venta">Venta</SelectItem>
                  <SelectItem value="consumo-interno">Consumo interno</SelectItem>
                </SelectContent>
              </Select>
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
                disabled={!!stockInsuficiente}
                className="flex-1 h-10 bg-[#FF6B00] hover:bg-[#E55E00] text-black font-bold border border-black cursor-pointer uppercase tracking-wider font-[family-name:var(--font-fira-code)] disabled:opacity-40 disabled:cursor-not-allowed"
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
