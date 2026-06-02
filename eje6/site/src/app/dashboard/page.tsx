'use client';

import { useEffect, useState } from 'react';
import {
  getProducts,
  getEntries,
  getExits,
  getLowStockProducts,
  getTodayEntries,
  getTodayExits,
  getSession,
} from '@/lib/store';
import { Product, Entry, Exit } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';
import {
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  Activity,
  Wrench,
  ChevronRight,
} from 'lucide-react';

interface Stat {
  label: string;
  code: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accentBg: string;
  accentBorder: string;
  accentText: string;
}

function StatTile({ label, code, value, sub, icon: Icon, accentBg, accentBorder, accentText }: Stat) {
  return (
    <div className={`bg-white border border-neutral-900 border-l-[6px] ${accentBorder} flex`}>
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between">
          <span className="text-[10px] font-[family-name:var(--font-fira-code)] tracking-[0.18em] text-neutral-500 uppercase">
            {label}
          </span>
          <span className={`text-[10px] font-[family-name:var(--font-fira-code)] font-bold ${accentText}`}>
            [{code}]
          </span>
        </div>
        <div className="mt-3 flex items-end justify-between gap-3">
          <p className="text-[34px] leading-none font-bold text-neutral-900 font-[family-name:var(--font-fira-code)] tabular-nums tracking-tight">
            {String(value).padStart(2, '0')}
          </p>
          <div className={`w-9 h-9 ${accentBg} flex items-center justify-center shrink-0 border border-neutral-900`}>
            <Icon size={18} strokeWidth={2.5} className="text-black" />
          </div>
        </div>
        {sub && (
          <p className="text-[11px] text-neutral-600 mt-3 pt-2 border-t border-dashed border-neutral-300 font-[family-name:var(--font-fira-code)] tracking-wide">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ stock, minStock }: { stock: number; minStock: number }) {
  if (stock === 0) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#FF6B00] text-black border border-neutral-900 text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-widest uppercase">
        <span className="w-1.5 h-1.5 bg-black inline-block" />
        Agotado
      </span>
    );
  }
  if (stock < minStock) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#FBBF24] text-black border border-neutral-900 text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-widest uppercase">
        <span className="w-1.5 h-1.5 bg-black inline-block" />
        Bajo
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white text-neutral-900 border border-neutral-900 text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-widest uppercase">
      <span className="w-1.5 h-1.5 bg-emerald-600 inline-block" />
      En Stock
    </span>
  );
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [exits, setExits] = useState<Exit[]>([]);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [todayEntries, setTodayEntries] = useState<Entry[]>([]);
  const [todayExits, setTodayExits] = useState<Exit[]>([]);
  const user = getSession();

  useEffect(() => {
    setProducts(getProducts());
    setEntries(getEntries());
    setExits(getExits());
    setLowStock(getLowStockProducts());
    setTodayEntries(getTodayEntries());
    setTodayExits(getTodayExits());
  }, []);

  const stats: Stat[] = [
    {
      label: 'Total productos',
      code: 'PRD',
      value: products.length,
      sub: 'En catálogo activo',
      icon: Package,
      accentBg: 'bg-[#3B82F6]',
      accentBorder: 'border-l-[#1E40AF]',
      accentText: 'text-[#1E40AF]',
    },
    {
      label: 'Entradas hoy',
      code: 'ENT',
      value: todayEntries.reduce((s, e) => s + e.quantity, 0),
      sub: `${todayEntries.length} movimiento${todayEntries.length !== 1 ? 's' : ''}`,
      icon: ArrowDownToLine,
      accentBg: 'bg-emerald-500',
      accentBorder: 'border-l-emerald-700',
      accentText: 'text-emerald-700',
    },
    {
      label: 'Salidas hoy',
      code: 'EXT',
      value: todayExits.reduce((s, e) => s + e.quantity, 0),
      sub: `${todayExits.length} movimiento${todayExits.length !== 1 ? 's' : ''}`,
      icon: ArrowUpFromLine,
      accentBg: 'bg-[#FF6B00]',
      accentBorder: 'border-l-[#FF6B00]',
      accentText: 'text-[#C2410C]',
    },
    {
      label: 'Stock crítico',
      code: 'ALR',
      value: lowStock.length,
      sub: lowStock.length > 0 ? 'Requieren atención' : 'Sin alertas activas',
      icon: AlertTriangle,
      accentBg: lowStock.length > 0 ? 'bg-[#FBBF24]' : 'bg-neutral-200',
      accentBorder: lowStock.length > 0 ? 'border-l-[#B45309]' : 'border-l-neutral-400',
      accentText: lowStock.length > 0 ? 'text-[#B45309]' : 'text-neutral-500',
    },
  ];

  // Merge recent activity
  type ActivityItem =
    | { kind: 'entry'; item: Entry; date: string }
    | { kind: 'exit'; item: Exit; date: string };

  const recentActivity: ActivityItem[] = [
    ...entries.slice(0, 8).map((e) => ({ kind: 'entry' as const, item: e, date: e.createdAt })),
    ...exits.slice(0, 8).map((e) => ({ kind: 'exit' as const, item: e, date: e.createdAt })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  const totalUnits = products.reduce((s, p) => s + p.stock, 0);

  return (
    <div className="space-y-5">
      {/* Header bar */}
      <div className="bg-white border-2 border-neutral-900">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 py-4 border-b border-neutral-300">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-[family-name:var(--font-fira-code)] tracking-widest text-neutral-500 uppercase mb-1">
              <Wrench size={12} strokeWidth={2.5} />
              <span>Panel principal · DSH-001</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Bienvenido, {user?.name?.split(' ')[0]}.
            </h1>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-[family-name:var(--font-fira-code)]">
            <span className="flex items-center gap-2 px-2.5 py-1 bg-neutral-900 text-white tracking-widest uppercase">
              <span className="w-1.5 h-1.5 bg-emerald-400 inline-block animate-pulse" />
              Operativo
            </span>
            <span className="hidden sm:inline text-neutral-600 tracking-wider uppercase">
              {new Date().toLocaleDateString('es-MX', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-300 border-b border-neutral-300">
          {[
            { k: 'UNID. EN ALMACÉN', v: totalUnits.toLocaleString('es-MX') },
            { k: 'MOVS. HOY', v: String(todayEntries.length + todayExits.length).padStart(3, '0') },
            { k: 'CATEGORÍAS', v: '06' },
            { k: 'ALERTAS', v: String(lowStock.length).padStart(2, '0') },
          ].map((m) => (
            <div key={m.k} className="px-5 py-2.5">
              <div className="text-[9px] font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-500 uppercase">
                {m.k}
              </div>
              <div className="text-base font-bold font-[family-name:var(--font-fira-code)] text-neutral-900 tabular-nums mt-0.5">
                {m.v}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatTile key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent activity */}
        <div className="lg:col-span-2 bg-white border-2 border-neutral-900">
          <div className="px-4 py-3 border-b-2 border-neutral-900 flex items-center justify-between bg-neutral-50">
            <div className="flex items-center gap-2">
              <Activity size={14} strokeWidth={2.5} className="text-neutral-900" />
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)]">
                Bitácora de movimientos
              </h2>
            </div>
            <span className="text-[10px] font-[family-name:var(--font-fira-code)] text-neutral-500 tracking-widest uppercase">
              Últimos {recentActivity.length}
            </span>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-neutral-500 text-sm px-5 py-10 text-center font-[family-name:var(--font-fira-code)] tracking-wider uppercase">
              // Sin movimientos registrados
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-neutral-100 border-b border-neutral-300">
                <tr className="text-[10px] font-[family-name:var(--font-fira-code)] tracking-widest text-neutral-600 uppercase">
                  <th className="text-left px-4 py-2 font-bold w-10">#</th>
                  <th className="text-left px-2 py-2 font-bold">Producto</th>
                  <th className="text-left px-2 py-2 font-bold">Tipo</th>
                  <th className="text-right px-2 py-2 font-bold">Cant.</th>
                  <th className="text-right px-4 py-2 font-bold">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {recentActivity.map((act, i) => {
                  const isEntry = act.kind === 'entry';
                  const detail = isEntry
                    ? `Prov. ${(act.item as Entry).supplier}`
                    : (act.item as Exit).type === 'venta'
                    ? 'Venta'
                    : 'Consumo int.';
                  return (
                    <tr
                      key={i}
                      className="hover:bg-[#FFF8E1] transition-colors border-l-4 border-transparent hover:border-l-[#FF6B00]"
                    >
                      <td className="px-4 py-2.5 font-[family-name:var(--font-fira-code)] text-neutral-500 text-xs tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </td>
                      <td className="px-2 py-2.5">
                        <div className="font-medium text-neutral-900 truncate max-w-[260px]">
                          {act.item.productName}
                        </div>
                        <div className="text-[11px] text-neutral-500 font-[family-name:var(--font-fira-code)] truncate">
                          {detail}
                        </div>
                      </td>
                      <td className="px-2 py-2.5">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 border text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-widest uppercase ${
                            isEntry
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-700'
                              : 'bg-orange-50 text-[#C2410C] border-[#C2410C]'
                          }`}
                        >
                          {isEntry ? <ArrowDownToLine size={10} strokeWidth={3} /> : <ArrowUpFromLine size={10} strokeWidth={3} />}
                          {isEntry ? 'IN' : 'OUT'}
                        </span>
                      </td>
                      <td
                        className={`px-2 py-2.5 text-right font-bold font-[family-name:var(--font-fira-code)] tabular-nums ${
                          isEntry ? 'text-emerald-800' : 'text-[#C2410C]'
                        }`}
                      >
                        {isEntry ? '+' : '−'}{String(act.item.quantity).padStart(3, '0')}
                      </td>
                      <td className="px-4 py-2.5 text-right text-[11px] text-neutral-500 font-[family-name:var(--font-fira-code)] tabular-nums">
                        {act.date}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Low stock preview */}
        <div className="bg-white border-2 border-neutral-900">
          <div className="px-4 py-3 border-b-2 border-neutral-900 flex items-center justify-between bg-neutral-50">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} strokeWidth={2.5} className="text-[#B45309]" />
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)]">
                Stock crítico
              </h2>
            </div>
            {lowStock.length > 0 && (
              <span className="bg-[#FF6B00] text-black text-[10px] font-bold px-1.5 py-0.5 border border-neutral-900 font-[family-name:var(--font-fira-code)] tabular-nums">
                {String(lowStock.length).padStart(2, '0')}
              </span>
            )}
          </div>
          {lowStock.length === 0 ? (
            <p className="text-neutral-500 text-sm px-5 py-10 text-center font-[family-name:var(--font-fira-code)] tracking-wider uppercase">
              // Niveles dentro de rango
            </p>
          ) : (
            <>
              <ul className="divide-y divide-neutral-200">
                {lowStock.slice(0, 6).map((p, i) => {
                  const pct = Math.min(100, Math.round((p.stock / Math.max(1, p.minStock)) * 100));
                  return (
                    <li key={p.id} className="px-4 py-2.5 hover:bg-[#FFF8E1] transition-colors group">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-[family-name:var(--font-fira-code)] text-neutral-500 tabular-nums">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <p className="text-sm font-semibold text-neutral-900 truncate">{p.name}</p>
                          </div>
                          <p className="text-[10px] text-neutral-500 mt-0.5 font-[family-name:var(--font-fira-code)] tracking-wider uppercase ml-6">
                            {CATEGORY_LABELS[p.category]}
                          </p>
                        </div>
                        <StatusBadge stock={p.stock} minStock={p.minStock} />
                      </div>

                      {/* Stock bar */}
                      <div className="ml-6 mt-2">
                        <div className="flex items-center justify-between text-[10px] font-[family-name:var(--font-fira-code)] tabular-nums">
                          <span className="text-neutral-600">
                            STOCK <span className="text-neutral-900 font-bold">{String(p.stock).padStart(3, '0')}</span> / MIN <span className="text-neutral-700">{String(p.minStock).padStart(3, '0')}</span>
                          </span>
                          <span className={p.stock === 0 ? 'text-[#C2410C] font-bold' : 'text-[#B45309] font-bold'}>
                            {pct}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-neutral-200 border border-neutral-400 mt-1 overflow-hidden">
                          <div
                            className={`h-full ${p.stock === 0 ? 'bg-[#FF6B00]' : 'bg-[#FBBF24]'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {lowStock.length > 6 && (
                <a
                  href="/dashboard/alertas"
                  className="flex items-center justify-center gap-1 px-4 py-2.5 border-t-2 border-neutral-900 bg-neutral-900 text-white text-[11px] font-bold tracking-widest uppercase font-[family-name:var(--font-fira-code)] hover:bg-[#FF6B00] hover:text-black transition-colors cursor-pointer"
                >
                  Ver {lowStock.length - 6} alerta{lowStock.length - 6 !== 1 ? 's' : ''} más
                  <ChevronRight size={12} strokeWidth={3} />
                </a>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer signature */}
      <div className="flex items-center justify-between text-[10px] font-[family-name:var(--font-fira-code)] text-neutral-500 tracking-widest uppercase border-t border-neutral-300 pt-3">
        <span>// STOCKPRO — Sistema Interno de Ferretería</span>
        <span>UTC{new Date().getTimezoneOffset() > 0 ? '-' : '+'}{String(Math.abs(new Date().getTimezoneOffset() / 60)).padStart(2, '0')}:00</span>
      </div>
    </div>
  );
}
