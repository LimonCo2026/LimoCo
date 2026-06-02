'use client';

import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/store';
import { Product, Category, CATEGORY_LABELS } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, TrendingDown, TrendingUp, Package, Wrench, ChevronDown, ChevronUp } from 'lucide-react';

interface CategoryReport {
  category: Category;
  label: string;
  products: Product[];
  totalStock: number;
  totalBuyValue: number;
  totalSellValue: number;
  lowStockCount: number;
}

export default function ReportesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [byCategory, setByCategory] = useState<CategoryReport[]>([]);
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  useEffect(() => {
    const all = getProducts();
    setProducts(all);

    const grouped = Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
      const prods = all.filter((p) => p.category === cat);
      return {
        category: cat as Category,
        label,
        products: prods,
        totalStock: prods.reduce((s, p) => s + p.stock, 0),
        totalBuyValue: prods.reduce((s, p) => s + p.stock * p.buyPrice, 0),
        totalSellValue: prods.reduce((s, p) => s + p.stock * p.sellPrice, 0),
        lowStockCount: prods.filter((p) => p.stock <= p.minStock).length,
      };
    });
    setByCategory(grouped);
  }, []);

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const totalBuyValue = products.reduce((s, p) => s + p.stock * p.buyPrice, 0);
  const totalSellValue = products.reduce((s, p) => s + p.stock * p.sellPrice, 0);
  const totalLowStock = products.filter((p) => p.stock <= p.minStock).length;

  const fmt = (n: number) =>
    n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 });

  function exportCSV() {
    const header = 'Nombre,Categoría,Stock,Mínimo,Precio Compra,Precio Venta,Valor Compra,Valor Venta';
    const rows = products.map((p) =>
      [
        `"${p.name}"`,
        `"${CATEGORY_LABELS[p.category]}"`,
        p.stock,
        p.minStock,
        p.buyPrice,
        p.sellPrice,
        (p.stock * p.buyPrice).toFixed(2),
        (p.stock * p.sellPrice).toFixed(2),
      ].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventario-stockpro-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const summary = [
    { label: 'Total productos', code: 'PRD', value: String(products.length).padStart(3, '0'), icon: Package, accentBg: 'bg-[#3B82F6]', accentBorder: 'border-l-[#1E40AF]', accentText: 'text-[#1E40AF]' },
    { label: 'Unidades en stock', code: 'STK', value: totalStock.toLocaleString('es-MX'), icon: BarChart3, accentBg: 'bg-emerald-500', accentBorder: 'border-l-emerald-700', accentText: 'text-emerald-700' },
    { label: 'Valor de compra', code: 'CMP', value: fmt(totalBuyValue), icon: TrendingDown, accentBg: 'bg-[#FBBF24]', accentBorder: 'border-l-[#B45309]', accentText: 'text-[#B45309]' },
    { label: 'Valor de venta', code: 'VTA', value: fmt(totalSellValue), icon: TrendingUp, accentBg: 'bg-[#FF6B00]', accentBorder: 'border-l-[#FF6B00]', accentText: 'text-[#C2410C]' },
  ];

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="bg-white border-2 border-neutral-900 flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 py-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-[family-name:var(--font-fira-code)] tracking-widest text-neutral-500 uppercase mb-1">
            <Wrench size={12} strokeWidth={2.5} />
            <span>Analítica · MOD-RPT</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Reporte de inventario</h1>
          <p className="text-neutral-600 text-sm mt-0.5 font-[family-name:var(--font-fira-code)] tracking-wider">
            // Generado {new Date().toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
          </p>
        </div>
        <Button
          onClick={exportCSV}
          className="h-10 bg-neutral-900 text-white hover:bg-[#FF6B00] hover:text-black border border-black cursor-pointer shrink-0 uppercase tracking-wider font-[family-name:var(--font-fira-code)] font-bold"
        >
          <Download size={16} strokeWidth={2.5} className="mr-1.5" />
          Exportar CSV
        </Button>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {summary.map((s) => (
          <div key={s.label} className={`bg-white border border-neutral-900 border-l-[6px] ${s.accentBorder} p-4`}>
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-[family-name:var(--font-fira-code)] tracking-[0.18em] text-neutral-500 uppercase">
                {s.label}
              </span>
              <span className={`text-[10px] font-[family-name:var(--font-fira-code)] font-bold ${s.accentText}`}>
                [{s.code}]
              </span>
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <p className="text-2xl leading-none font-bold text-neutral-900 font-[family-name:var(--font-fira-code)] tabular-nums tracking-tight break-all">
                {s.value}
              </p>
              <div className={`w-9 h-9 ${s.accentBg} flex items-center justify-center shrink-0 border border-neutral-900`}>
                <s.icon size={18} strokeWidth={2.5} className="text-black" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* By category */}
      <div className="bg-white border-2 border-neutral-900">
        <div className="px-4 py-3 border-b-2 border-neutral-900 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2">
            <BarChart3 size={14} strokeWidth={2.5} className="text-neutral-900" />
            <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)]">
              Desglose por categoría
            </h2>
          </div>
          <span className="text-[10px] font-[family-name:var(--font-fira-code)] text-neutral-500 tracking-widest uppercase">
            {String(byCategory.length).padStart(2, '0')} categorías
          </span>
        </div>

        <ul className="divide-y-2 divide-neutral-200">
          {byCategory.map((cat) => {
            const isOpen = expandedCat === cat.category;
            return (
              <li key={cat.category}>
                <button
                  onClick={() => setExpandedCat(isOpen ? null : cat.category)}
                  className={`w-full px-4 py-3 flex items-center gap-4 hover:bg-[#FFF8E1] transition-colors cursor-pointer text-left border-l-4 ${
                    isOpen ? 'border-l-[#FF6B00] bg-neutral-50' : 'border-l-transparent hover:border-l-[#FF6B00]'
                  }`}
                >
                  <span className="text-xs font-bold font-[family-name:var(--font-fira-code)] uppercase tracking-wider text-neutral-900 shrink-0 w-48 truncate">
                    {cat.label}
                  </span>
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase tracking-widest font-[family-name:var(--font-fira-code)]">Productos</span>
                      <span className="font-bold font-[family-name:var(--font-fira-code)] text-neutral-900 tabular-nums">
                        {String(cat.products.length).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-neutral-500 block uppercase tracking-widest font-[family-name:var(--font-fira-code)]">Unidades</span>
                      <span className="font-bold font-[family-name:var(--font-fira-code)] text-neutral-900 tabular-nums">
                        {cat.totalStock.toLocaleString('es-MX')}
                      </span>
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-[9px] text-neutral-500 block uppercase tracking-widest font-[family-name:var(--font-fira-code)]">Valor venta</span>
                      <span className="font-bold font-[family-name:var(--font-fira-code)] text-neutral-900 tabular-nums">
                        {fmt(cat.totalSellValue)}
                      </span>
                    </div>
                    <div className="hidden sm:block">
                      <span className="text-[9px] text-neutral-500 block uppercase tracking-widest font-[family-name:var(--font-fira-code)]">Stock bajo</span>
                      <span className={`font-bold font-[family-name:var(--font-fira-code)] tabular-nums ${cat.lowStockCount > 0 ? 'text-[#C2410C]' : 'text-emerald-700'}`}>
                        {String(cat.lowStockCount).padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                  <span className="text-neutral-700 shrink-0 border border-neutral-900 p-1 bg-white">
                    {isOpen ? <ChevronUp size={12} strokeWidth={3} /> : <ChevronDown size={12} strokeWidth={3} />}
                  </span>
                </button>

                {isOpen && cat.products.length > 0 && (
                  <div className="border-t-2 border-neutral-900 bg-neutral-50">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-neutral-900 text-white">
                          <th className="text-left px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)]">Nombre</th>
                          <th className="text-right px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)]">Stock</th>
                          <th className="text-right px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)] hidden sm:table-cell">P. Compra</th>
                          <th className="text-right px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)] hidden sm:table-cell">P. Venta</th>
                          <th className="text-right px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)]">Valor total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {cat.products.map((p, i) => (
                          <tr
                            key={p.id}
                            className={`hover:bg-[#FFF8E1] transition-colors ${i % 2 === 1 ? 'bg-white' : 'bg-neutral-50'}`}
                          >
                            <td className="px-4 py-2">
                              <span className={p.stock <= p.minStock ? 'text-[#C2410C] font-semibold' : 'text-neutral-900'}>
                                {p.name}
                              </span>
                              {p.stock <= p.minStock && (
                                <span className="ml-2 text-[9px] text-[#C2410C] font-bold font-[family-name:var(--font-fira-code)] tracking-widest uppercase">
                                  ● BAJO
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-right font-[family-name:var(--font-fira-code)] text-neutral-900 tabular-nums">
                              {String(p.stock).padStart(3, '0')}
                            </td>
                            <td className="px-3 py-2 text-right font-[family-name:var(--font-fira-code)] text-neutral-600 hidden sm:table-cell tabular-nums">
                              ${p.buyPrice.toFixed(2)}
                            </td>
                            <td className="px-3 py-2 text-right font-[family-name:var(--font-fira-code)] text-neutral-600 hidden sm:table-cell tabular-nums">
                              ${p.sellPrice.toFixed(2)}
                            </td>
                            <td className="px-4 py-2 text-right font-[family-name:var(--font-fira-code)] font-bold text-neutral-900 tabular-nums">
                              {fmt(p.stock * p.sellPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-neutral-900 text-white border-t-2 border-neutral-900">
                          <td className="px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)]">
                            // Subtotal
                          </td>
                          <td className="px-3 py-2 text-right font-[family-name:var(--font-fira-code)] font-bold tabular-nums">
                            {String(cat.totalStock).padStart(3, '0')}
                          </td>
                          <td className="hidden sm:table-cell" />
                          <td className="hidden sm:table-cell" />
                          <td className="px-4 py-2 text-right font-[family-name:var(--font-fira-code)] font-bold text-[#FF6B00] tabular-nums">
                            {fmt(cat.totalSellValue)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                {isOpen && cat.products.length === 0 && (
                  <div className="border-t-2 border-neutral-900 px-5 py-4 text-sm text-neutral-500 font-[family-name:var(--font-fira-code)] tracking-wider uppercase bg-neutral-50">
                    // Sin productos en esta categoría
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Grand total */}
      <div className="bg-neutral-950 text-white border-2 border-neutral-900">
        <div className="px-5 py-2 bg-black border-b border-neutral-800 flex items-center justify-between">
          <span className="text-[11px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] uppercase text-[#FF6B00]">
            // Total general
          </span>
          <span className="text-[10px] font-[family-name:var(--font-fira-code)] tracking-widest text-neutral-500 uppercase">
            GT/01
          </span>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="sm:col-span-2 border-r-0 sm:border-r border-neutral-800 sm:pr-5">
            <p className="text-neutral-500 text-[10px] font-[family-name:var(--font-fira-code)] tracking-widest uppercase mb-1">
              Valor total del inventario · Precio venta
            </p>
            <p className="text-3xl font-bold font-[family-name:var(--font-fira-code)] tabular-nums text-white tracking-tight">
              {fmt(totalSellValue)}
            </p>
          </div>
          <div>
            <p className="text-neutral-500 text-[10px] font-[family-name:var(--font-fira-code)] tracking-widest uppercase mb-1">
              Costo de adquisición
            </p>
            <p className="text-xl font-bold font-[family-name:var(--font-fira-code)] tabular-nums text-neutral-300">
              {fmt(totalBuyValue)}
            </p>
            <p className="text-[10px] text-emerald-400 mt-1 font-[family-name:var(--font-fira-code)] tracking-widest uppercase tabular-nums">
              Margen +{totalBuyValue > 0 ? ((totalSellValue / totalBuyValue - 1) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>

      {totalLowStock > 0 && (
        <div className="bg-[#FFF8E1] border-2 border-[#FF6B00] px-4 py-3 flex items-start gap-3">
          <div className="w-7 h-7 bg-[#FF6B00] border border-black flex items-center justify-center shrink-0 mt-0.5">
            <TrendingDown size={14} strokeWidth={2.5} className="text-black" />
          </div>
          <p className="text-sm text-neutral-900 font-[family-name:var(--font-fira-code)]">
            <span className="font-bold uppercase tracking-widest text-[10px] text-[#C2410C] block mb-0.5">
              // Aviso de stock
            </span>
            <strong className="tabular-nums">{String(totalLowStock).padStart(2, '0')} producto{totalLowStock !== 1 ? 's' : ''}</strong> {totalLowStock !== 1 ? 'tienen' : 'tiene'} stock por debajo del mínimo. Revisa <strong>Alertas</strong> para tomar acción.
          </p>
        </div>
      )}
    </div>
  );
}
