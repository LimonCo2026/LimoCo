'use client';

import { useEffect, useState } from 'react';
import { getLowStockProducts } from '@/lib/store';
import { Product, CATEGORY_LABELS } from '@/lib/types';
import { Bell, AlertTriangle, CheckCircle, Wrench } from 'lucide-react';

function StockBar({ stock, min }: { stock: number; min: number }) {
  const pct = min > 0 ? Math.min((stock / min) * 100, 100) : 100;
  const color = stock === 0 ? 'bg-[#FF6B00]' : stock <= Math.floor(min / 2) ? 'bg-[#C2410C]' : 'bg-[#FBBF24]';

  return (
    <div className="w-full bg-neutral-200 border border-neutral-400 h-2 overflow-hidden">
      <div
        className={`h-full transition-all ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function AlertasPage() {
  const [lowStock, setLowStock] = useState<Product[]>([]);

  useEffect(() => {
    setLowStock(getLowStockProducts());
  }, []);

  const agotados = lowStock.filter((p) => p.stock === 0);
  const criticos = lowStock.filter((p) => p.stock > 0 && p.stock <= Math.floor(p.minStock / 2));
  const bajos = lowStock.filter((p) => p.stock > Math.floor(p.minStock / 2) && p.stock <= p.minStock);

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="bg-white border-2 border-neutral-900">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-5 py-4 border-b border-neutral-300">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-[family-name:var(--font-fira-code)] tracking-widest text-neutral-500 uppercase mb-1">
              <Wrench size={12} strokeWidth={2.5} />
              <span>Monitoreo · MOD-ALR</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Alertas de stock</h1>
            <p className="text-neutral-600 text-sm mt-0.5">
              Productos que requieren reabastecimiento inmediato o pronto.
            </p>
          </div>
          {lowStock.length > 0 && (
            <span className="flex items-center gap-2 px-3 py-1.5 bg-[#FF6B00] text-black border border-neutral-900 text-[11px] font-bold font-[family-name:var(--font-fira-code)] tracking-widest uppercase shrink-0">
              <span className="w-1.5 h-1.5 bg-black inline-block animate-pulse" />
              {String(lowStock.length).padStart(2, '0')} alertas activas
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 divide-x divide-neutral-300">
          <div className="px-5 py-2.5">
            <div className="text-[9px] font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-[#C2410C] uppercase">Agotados</div>
            <div className="text-base font-bold font-[family-name:var(--font-fira-code)] text-neutral-900 tabular-nums mt-0.5">
              {String(agotados.length).padStart(2, '0')}
            </div>
          </div>
          <div className="px-5 py-2.5">
            <div className="text-[9px] font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-[#B45309] uppercase">Críticos</div>
            <div className="text-base font-bold font-[family-name:var(--font-fira-code)] text-neutral-900 tabular-nums mt-0.5">
              {String(criticos.length).padStart(2, '0')}
            </div>
          </div>
          <div className="px-5 py-2.5">
            <div className="text-[9px] font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-[#92400E] uppercase">Stock bajo</div>
            <div className="text-base font-bold font-[family-name:var(--font-fira-code)] text-neutral-900 tabular-nums mt-0.5">
              {String(bajos.length).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {lowStock.length === 0 ? (
        <div className="bg-white border-2 border-neutral-900 flex flex-col items-center justify-center py-20 text-neutral-700">
          <div className="w-14 h-14 bg-emerald-500 border-2 border-neutral-900 flex items-center justify-center mb-4">
            <CheckCircle size={28} className="text-black" strokeWidth={2.5} />
          </div>
          <h2 className="text-base font-bold text-neutral-900 uppercase tracking-widest font-[family-name:var(--font-fira-code)]">
            // Sistema en rango
          </h2>
          <p className="text-sm mt-2 text-neutral-600">
            Todos los productos tienen stock por encima del mínimo.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {agotados.length > 0 && (
            <AlertSection
              code="AGT"
              title="Agotados — Sin stock"
              icon={<AlertTriangle size={14} strokeWidth={2.5} className="text-black" />}
              headerBg="bg-[#FF6B00]"
              headerText="text-black"
              products={agotados}
              level="critical"
            />
          )}

          {criticos.length > 0 && (
            <AlertSection
              code="CRT"
              title="Críticos — Stock muy bajo"
              icon={<Bell size={14} strokeWidth={2.5} className="text-black" />}
              headerBg="bg-[#FBBF24]"
              headerText="text-black"
              products={criticos}
              level="high"
            />
          )}

          {bajos.length > 0 && (
            <AlertSection
              code="BJO"
              title="Stock bajo — Por debajo del mínimo"
              icon={<Bell size={14} strokeWidth={2.5} className="text-black" />}
              headerBg="bg-neutral-200"
              headerText="text-neutral-900"
              products={bajos}
              level="warn"
            />
          )}
        </div>
      )}
    </div>
  );
}

function AlertSection({
  code,
  title,
  icon,
  headerBg,
  headerText,
  products,
  level,
}: {
  code: string;
  title: string;
  icon: React.ReactNode;
  headerBg: string;
  headerText: string;
  products: Product[];
  level: 'critical' | 'high' | 'warn';
}) {
  const stockColor =
    level === 'critical' ? 'text-[#C2410C]' : level === 'high' ? 'text-[#B45309]' : 'text-[#92400E]';

  return (
    <div className="bg-white border-2 border-neutral-900">
      <div className={`px-4 py-2.5 ${headerBg} ${headerText} border-b-2 border-neutral-900 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          {icon}
          <span className="font-bold text-[11px] uppercase tracking-[0.2em] font-[family-name:var(--font-fira-code)]">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 bg-black text-white text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-widest tabular-nums">
            {String(products.length).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-[family-name:var(--font-fira-code)] tracking-widest font-bold">
            [{code}]
          </span>
        </div>
      </div>
      <ul className="divide-y divide-neutral-200">
        {products.map((p, i) => (
          <li
            key={p.id}
            className={`px-4 py-3 hover:bg-[#FFF8E1] transition-colors border-l-4 border-transparent hover:border-l-[#FF6B00] ${
              i % 2 === 1 ? 'bg-neutral-50' : ''
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-[family-name:var(--font-fira-code)] text-neutral-500 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="font-semibold text-neutral-900 truncate">{p.name}</p>
                </div>
                <p className="text-[10px] text-neutral-500 mt-0.5 font-[family-name:var(--font-fira-code)] tracking-wider uppercase ml-6">
                  {CATEGORY_LABELS[p.category]}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold font-[family-name:var(--font-fira-code)] tabular-nums">
                  <span className={stockColor}>{String(p.stock).padStart(3, '0')}</span>
                  <span className="text-neutral-500 font-normal text-xs ml-1">/{String(p.minStock).padStart(3, '0')}</span>
                </p>
                <p className="text-[10px] text-neutral-500 font-[family-name:var(--font-fira-code)] tracking-wider uppercase mt-0.5">
                  Stock / Mín
                </p>
              </div>
            </div>
            <div className="mt-3 ml-6">
              <StockBar stock={p.stock} min={p.minStock} />
              <p className="text-[11px] text-neutral-600 mt-1.5 font-[family-name:var(--font-fira-code)]">
                {p.stock === 0
                  ? '// Sin unidades — reabastecer urgente'
                  : `// Faltan ${p.minStock - p.stock} unidad${p.minStock - p.stock !== 1 ? 'es' : ''} para alcanzar el mínimo`}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
