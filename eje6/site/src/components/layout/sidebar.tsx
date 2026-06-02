'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logout } from '@/lib/store';
import { User } from '@/lib/types';
import {
  LayoutDashboard,
  Package,
  ArrowDownToLine,
  ArrowUpFromLine,
  Bell,
  BarChart3,
  LogOut,
  X,
  Menu,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Inicio', code: 'DSH', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/productos', label: 'Productos', code: 'PRD', icon: Package },
  { href: '/dashboard/entradas', label: 'Entradas', code: 'ENT', icon: ArrowDownToLine },
  { href: '/dashboard/salidas', label: 'Salidas', code: 'EXT', icon: ArrowUpFromLine },
  { href: '/dashboard/alertas', label: 'Alertas', code: 'ALR', icon: Bell },
  { href: '/dashboard/reportes', label: 'Reportes', code: 'RPT', icon: BarChart3 },
];

interface SidebarProps {
  user: User;
  alertCount?: number;
}

function NavLink({
  href,
  label,
  code,
  icon: Icon,
  exact,
  alertCount,
  onClick,
}: {
  href: string;
  label: string;
  code: string;
  icon: React.ElementType;
  exact?: boolean;
  alertCount?: number;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'group relative flex items-center gap-3 pl-4 pr-3 py-2.5 text-sm transition-colors duration-100 cursor-pointer border-l-4 border-transparent',
        isActive
          ? 'bg-neutral-800 text-white border-l-[#FF6B00]'
          : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
      )}
    >
      <Icon size={16} strokeWidth={2} className={isActive ? 'text-[#FF6B00]' : ''} />
      <span className="flex-1 font-medium tracking-wide">{label}</span>
      <span className="text-[10px] font-[family-name:var(--font-fira-code)] text-neutral-600 group-hover:text-neutral-500">
        {code}
      </span>
      {label === 'Alertas' && alertCount && alertCount > 0 ? (
        <span className="bg-[#FF6B00] text-white text-[10px] font-bold font-[family-name:var(--font-fira-code)] px-1.5 py-0.5 leading-none">
          {String(alertCount).padStart(2, '0')}
        </span>
      ) : null}
    </Link>
  );
}

export function Sidebar({ user, alertCount = 0 }: SidebarProps) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push('/');
  }

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo / header bar */}
      <div className="px-4 py-4 border-b-2 border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#FF6B00] flex items-center justify-center shrink-0 border border-black">
            <Package size={18} className="text-black" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-white font-bold text-[15px] tracking-[0.15em] font-[family-name:var(--font-fira-code)]">
              STOCKPRO
            </div>
            <div className="text-neutral-500 text-[10px] font-[family-name:var(--font-fira-code)] tracking-widest">
              v1.0 · INVENTORY CTRL
            </div>
          </div>
        </div>
      </div>

      {/* Section label */}
      <div className="px-4 pt-4 pb-2 text-[10px] font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-600">
        // NAVEGACIÓN
      </div>

      {/* Navigation */}
      <nav className="flex-1 pb-4 space-y-px" aria-label="Navegación principal">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.href} {...item} alertCount={alertCount} onClick={onNav} />
        ))}
      </nav>

      {/* System status strip */}
      <div className="px-4 py-2 border-t border-neutral-800 flex items-center justify-between text-[10px] font-[family-name:var(--font-fira-code)] tracking-wider">
        <span className="flex items-center gap-2 text-neutral-500">
          <span className="w-1.5 h-1.5 bg-emerald-500 inline-block" />
          SISTEMA OK
        </span>
        <span className="text-neutral-600">LOCAL</span>
      </div>

      {/* User / logout */}
      <div className="border-t-2 border-neutral-800 bg-black">
        <div className="px-4 py-3 border-b border-neutral-800">
          <div className="text-[10px] text-neutral-500 font-[family-name:var(--font-fira-code)] tracking-widest">
            OPERADOR
          </div>
          <div className="text-white text-sm font-semibold mt-0.5 truncate">{user.name}</div>
          <div className="text-neutral-500 text-[11px] font-[family-name:var(--font-fira-code)] tracking-wider uppercase">
            ROL · {user.role === 'admin' ? 'ADMIN' : 'STAFF'}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 text-xs font-bold tracking-widest text-neutral-300 hover:bg-[#FF6B00] hover:text-black transition-colors cursor-pointer uppercase font-[family-name:var(--font-fira-code)]"
        >
          <LogOut size={14} strokeWidth={2.5} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-neutral-950 text-white p-2 border border-black cursor-pointer"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/70"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          'lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-neutral-950 border-r-2 border-black transition-transform duration-150',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          className="absolute top-3 right-3 text-neutral-400 hover:text-white cursor-pointer p-1"
          onClick={() => setMobileOpen(false)}
          aria-label="Cerrar menú"
        >
          <X size={18} />
        </button>
        <SidebarContent onNav={() => setMobileOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-neutral-950 min-h-screen border-r-2 border-black">
        <SidebarContent />
      </aside>
    </>
  );
}
