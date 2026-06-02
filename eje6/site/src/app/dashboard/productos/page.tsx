'use client';

import { useEffect, useState } from 'react';
import { getProducts, saveProduct, deleteProduct, generateId, getSession } from '@/lib/store';
import { Product, Category, CATEGORY_LABELS } from '@/lib/types';
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
import { Search, Plus, Pencil, Trash2, AlertTriangle, Package, Wrench } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = Object.entries(CATEGORY_LABELS) as [Category, string][];

const EMPTY_FORM: Omit<Product, 'id' | 'createdAt'> = {
  name: '',
  category: 'herramientas-manuales',
  stock: 0,
  minStock: 5,
  buyPrice: 0,
  sellPrice: 0,
};

function StockBadge({ stock, minStock }: { stock: number; minStock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FF6B00] text-black border border-neutral-900 text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-widest uppercase">
        <span className="w-1.5 h-1.5 bg-black inline-block" />
        Agotado
      </span>
    );
  }
  if (stock <= minStock) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FBBF24] text-black border border-neutral-900 text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-widest uppercase">
        <span className="w-1.5 h-1.5 bg-black inline-block" />
        Bajo
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-white text-neutral-900 border border-neutral-900 text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-widest uppercase">
      <span className="w-1.5 h-1.5 bg-emerald-600 inline-block" />
      En Stock
    </span>
  );
}

export default function ProductosPage() {
  const user = getSession();
  const isAdmin = user?.role === 'admin';

  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function reload() {
    setProducts(getProducts());
  }

  useEffect(() => { reload(); }, []);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      CATEGORY_LABELS[p.category].toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'all' || p.category === catFilter;
    return matchSearch && matchCat;
  });

  function openNew() {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setDialogOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      stock: p.stock,
      minStock: p.minStock,
      buyPrice: p.buyPrice,
      sellPrice: p.sellPrice,
    });
    setDialogOpen(true);
  }

  function handleSave() {
    if (!form.name.trim()) { toast.error('El nombre es obligatorio.'); return; }
    if (form.sellPrice <= 0) { toast.error('El precio de venta debe ser mayor a 0.'); return; }

    const product: Product = {
      id: editing?.id ?? generateId(),
      createdAt: editing?.createdAt ?? new Date().toISOString().split('T')[0],
      ...form,
    };
    saveProduct(product);
    reload();
    setDialogOpen(false);
    toast.success(editing ? 'Producto actualizado.' : 'Producto agregado.');
  }

  function handleDelete(id: string) {
    deleteProduct(id);
    reload();
    setDeleteConfirm(null);
    toast.success('Producto eliminado.');
  }

  const fmt = (n: number) => `$${n.toFixed(2)}`;

  // Generate a deterministic SKU-style code from id
  const sku = (id: string) => 'SKU-' + id.replace(/[^a-z0-9]/gi, '').slice(-6).toUpperCase().padStart(6, '0');

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="bg-white border-2 border-neutral-900 flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 py-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-[family-name:var(--font-fira-code)] tracking-widest text-neutral-500 uppercase mb-1">
            <Wrench size={12} strokeWidth={2.5} />
            <span>Catálogo · MOD-PRD</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Productos</h1>
          <p className="text-neutral-600 text-sm mt-0.5 font-[family-name:var(--font-fira-code)]">
            <span className="font-bold text-neutral-900 tabular-nums">{String(products.length).padStart(3, '0')}</span> registrados ·{' '}
            <span className="text-neutral-700">{String(filtered.length).padStart(3, '0')}</span> visibles
          </p>
        </div>
        {isAdmin && (
          <Button
            onClick={openNew}
            className="h-10 bg-[#FF6B00] hover:bg-[#E55E00] text-black font-bold border border-black cursor-pointer shrink-0 uppercase tracking-wider font-[family-name:var(--font-fira-code)]"
          >
            <Plus size={16} strokeWidth={3} className="mr-1.5" />
            Nuevo producto
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white border-2 border-neutral-900 p-3 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} strokeWidth={2.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-700 pointer-events-none" />
          <Input
            placeholder="Buscar por nombre o categoría…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-10 border-neutral-900 bg-neutral-50 focus-visible:ring-0 focus-visible:border-[#FF6B00] focus-visible:bg-white"
          />
        </div>
        <Select value={catFilter} onValueChange={(v) => setCatFilter(v ?? 'all')}>
          <SelectTrigger className="w-full sm:w-64 h-10 border-neutral-900 bg-neutral-50 font-[family-name:var(--font-fira-code)] text-xs uppercase tracking-wider">
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent className="border-2 border-neutral-900">
            <SelectItem value="all" className="font-[family-name:var(--font-fira-code)] text-xs uppercase tracking-wider">
              Todas las categorías
            </SelectItem>
            {CATEGORIES.map(([val, label]) => (
              <SelectItem key={val} value={val} className="font-[family-name:var(--font-fira-code)] text-xs uppercase tracking-wider">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white border-2 border-neutral-900">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-neutral-500">
            <Package size={36} className="mb-3 opacity-40" strokeWidth={1.5} />
            <p className="font-bold uppercase tracking-widest font-[family-name:var(--font-fira-code)] text-sm">// Sin resultados</p>
            <p className="text-xs mt-1 text-neutral-500">Ajusta los filtros o agrega un producto nuevo.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-900 text-white">
                  <th className="text-left px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)] w-32">SKU</th>
                  <th className="text-left px-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)]">Producto</th>
                  <th className="text-left px-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)] hidden md:table-cell">Categoría</th>
                  <th className="text-left px-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)]">Estado</th>
                  <th className="text-right px-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)]">Stock</th>
                  <th className="text-right px-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)] hidden sm:table-cell">P. Compra</th>
                  <th className="text-right px-2 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)] hidden sm:table-cell">P. Venta</th>
                  {isAdmin && <th className="px-4 py-2.5 w-24" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    className={`group hover:bg-[#FFF8E1] transition-colors border-l-4 border-transparent hover:border-l-[#FF6B00] ${
                      i % 2 === 1 ? 'bg-neutral-50' : ''
                    }`}
                  >
                    <td className="px-4 py-2.5 font-[family-name:var(--font-fira-code)] text-[11px] text-neutral-600 tabular-nums whitespace-nowrap">
                      {sku(p.id)}
                    </td>
                    <td className="px-2 py-2.5">
                      <div className="flex items-center gap-2">
                        {p.stock <= p.minStock && (
                          <AlertTriangle size={13} strokeWidth={2.5} className="text-[#B45309] shrink-0" aria-label="Stock bajo" />
                        )}
                        <span className="font-semibold text-neutral-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2.5 hidden md:table-cell text-neutral-600 text-[11px] font-[family-name:var(--font-fira-code)] uppercase tracking-wider">
                      {CATEGORY_LABELS[p.category]}
                    </td>
                    <td className="px-2 py-2.5">
                      <StockBadge stock={p.stock} minStock={p.minStock} />
                    </td>
                    <td className="px-2 py-2.5 text-right font-[family-name:var(--font-fira-code)] tabular-nums">
                      <span className={`font-bold ${p.stock <= p.minStock ? 'text-[#C2410C]' : 'text-neutral-900'}`}>
                        {String(p.stock).padStart(3, '0')}
                      </span>
                      <span className="text-neutral-500 text-[10px] ml-1">/{String(p.minStock).padStart(3, '0')}</span>
                    </td>
                    <td className="px-2 py-2.5 text-right hidden sm:table-cell font-[family-name:var(--font-fira-code)] text-neutral-600 tabular-nums">
                      {fmt(p.buyPrice)}
                    </td>
                    <td className="px-2 py-2.5 text-right hidden sm:table-cell font-[family-name:var(--font-fira-code)] font-bold text-neutral-900 tabular-nums">
                      {fmt(p.sellPrice)}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(p)}
                            className="p-1.5 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-[#FF6B00] transition-colors cursor-pointer bg-white"
                            aria-label={`Editar ${p.name}`}
                          >
                            <Pencil size={13} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(p.id)}
                            className="p-1.5 border border-neutral-900 text-neutral-900 hover:bg-[#FF6B00] hover:text-black transition-colors cursor-pointer bg-white"
                            aria-label={`Eliminar ${p.name}`}
                          >
                            <Trash2 size={13} strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[480px] border-2 border-neutral-900 bg-white p-0 gap-0">
          <div className="px-5 py-3 bg-neutral-900 text-white flex items-center justify-between">
            <DialogHeader>
              <DialogTitle className="text-[11px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] uppercase">
                {editing ? '> Editar producto' : '> Nuevo producto'}
              </DialogTitle>
            </DialogHeader>
            <span className="text-[10px] font-[family-name:var(--font-fira-code)] tracking-widest text-neutral-400">
              {editing ? 'EDIT/PRD' : 'NEW/PRD'}
            </span>
          </div>
          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="pname" className="text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-700 uppercase">
                Nombre <span className="text-[#FF6B00]">*</span>
              </Label>
              <Input
                id="pname"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej. Martillo de acero 1kg"
                className="border-neutral-900 bg-neutral-50 focus-visible:ring-0 focus-visible:border-[#FF6B00] focus-visible:bg-white"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pcat" className="text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-700 uppercase">
                Categoría
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm({ ...form, category: v as Category })}
              >
                <SelectTrigger id="pcat" className="border-neutral-900 bg-neutral-50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-2 border-neutral-900">
                  {CATEGORIES.map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pstock" className="text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-700 uppercase">
                  Stock inicial
                </Label>
                <Input
                  id="pstock"
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  className="border-neutral-900 bg-neutral-50 focus-visible:ring-0 focus-visible:border-[#FF6B00] focus-visible:bg-white font-[family-name:var(--font-fira-code)] tabular-nums"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pmin" className="text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-700 uppercase">
                  Stock mínimo
                </Label>
                <Input
                  id="pmin"
                  type="number"
                  min={1}
                  value={form.minStock}
                  onChange={(e) => setForm({ ...form, minStock: Number(e.target.value) })}
                  className="border-neutral-900 bg-neutral-50 focus-visible:ring-0 focus-visible:border-[#FF6B00] focus-visible:bg-white font-[family-name:var(--font-fira-code)] tabular-nums"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pbuy" className="text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-700 uppercase">
                  Precio compra ($)
                </Label>
                <Input
                  id="pbuy"
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.buyPrice}
                  onChange={(e) => setForm({ ...form, buyPrice: Number(e.target.value) })}
                  className="border-neutral-900 bg-neutral-50 focus-visible:ring-0 focus-visible:border-[#FF6B00] focus-visible:bg-white font-[family-name:var(--font-fira-code)] tabular-nums"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="psell" className="text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-700 uppercase">
                  Precio venta ($) <span className="text-[#FF6B00]">*</span>
                </Label>
                <Input
                  id="psell"
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.sellPrice}
                  onChange={(e) => setForm({ ...form, sellPrice: Number(e.target.value) })}
                  className="border-neutral-900 bg-neutral-50 focus-visible:ring-0 focus-visible:border-[#FF6B00] focus-visible:bg-white font-[family-name:var(--font-fira-code)] tabular-nums"
                />
              </div>
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
                {editing ? '> Guardar' : '> Agregar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-[400px] border-2 border-neutral-900 bg-white p-0 gap-0">
          <div className="px-5 py-3 bg-[#FF6B00] text-black flex items-center justify-between border-b border-neutral-900">
            <DialogHeader>
              <DialogTitle className="text-[11px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] uppercase flex items-center gap-2">
                <AlertTriangle size={14} strokeWidth={2.5} />
                ¿Eliminar producto?
              </DialogTitle>
            </DialogHeader>
            <span className="text-[10px] font-[family-name:var(--font-fira-code)] tracking-widest">DEL/PRD</span>
          </div>
          <div className="p-5">
            <p className="text-neutral-700 text-sm mb-4 font-[family-name:var(--font-fira-code)]">
              // Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 h-10 border-2 border-neutral-900 bg-white text-neutral-900 hover:bg-neutral-900 hover:text-white cursor-pointer uppercase tracking-wider font-[family-name:var(--font-fira-code)] font-bold"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
                className="flex-1 h-10 bg-[#FF6B00] hover:bg-[#E55E00] text-black font-bold border border-black cursor-pointer uppercase tracking-wider font-[family-name:var(--font-fira-code)]"
              >
                {'>'} Eliminar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
