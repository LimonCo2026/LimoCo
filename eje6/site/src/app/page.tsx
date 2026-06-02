'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, getSession } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Package, AlertCircle, Wrench } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) router.replace('/dashboard');
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const user = login(username.trim(), password);
    if (user) {
      router.push('/dashboard');
    } else {
      setError('Usuario o contraseña incorrectos.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex bg-[#EDEDE8]">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 bg-neutral-950 p-10 text-white border-r-2 border-black relative">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF6B00] flex items-center justify-center border border-black">
            <Package size={20} className="text-black" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <div className="text-white font-bold text-base tracking-[0.2em] font-[family-name:var(--font-fira-code)]">
              STOCKPRO
            </div>
            <div className="text-neutral-500 text-[10px] font-[family-name:var(--font-fira-code)] tracking-widest">
              v1.0 · INVENTORY CTRL
            </div>
          </div>
        </div>

        <div className="relative space-y-6">
          <div className="text-[10px] font-[family-name:var(--font-fira-code)] tracking-[0.3em] text-[#FF6B00]">
            // SISTEMA OPERATIVO
          </div>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight">
            Control de inventario<br />
            <span className="text-[#FF6B00]">en tiempo real.</span>
          </h1>
          <p className="text-neutral-400 leading-relaxed border-l-2 border-[#FF6B00] pl-3">
            Registra entradas y salidas, recibe alertas de desabasto y genera reportes al instante.
          </p>
          <div className="grid grid-cols-2 gap-px bg-neutral-800 border border-neutral-800">
            {[
              { label: '200+', desc: 'PRODUCTOS' },
              { label: '06', desc: 'CATEGORÍAS' },
              { label: 'L–S', desc: 'OPERACIÓN' },
              { label: '02', desc: 'ROLES' },
            ].map((stat) => (
              <div key={stat.desc} className="bg-neutral-950 p-4">
                <div className="text-2xl font-bold font-[family-name:var(--font-fira-code)] tabular-nums">
                  {stat.label}
                </div>
                <div className="text-neutral-500 text-[10px] mt-1 font-[family-name:var(--font-fira-code)] tracking-[0.2em]">
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-between text-[10px] font-[family-name:var(--font-fira-code)] tracking-widest text-neutral-500">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 inline-block animate-pulse" />
            CONEXIÓN LOCAL
          </span>
          <span>© {new Date().getFullYear()} · FERRETERÍA</span>
        </div>
      </div>

      {/* Right panel — login */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-[420px]">
          {/* Mobile brand */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-[#FF6B00] flex items-center justify-center border border-black">
              <Package size={18} className="text-black" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold tracking-[0.2em] font-[family-name:var(--font-fira-code)]">
              STOCKPRO
            </span>
          </div>

          {/* Card-like console panel */}
          <div className="bg-white border-2 border-neutral-900">
            {/* Title bar */}
            <div className="px-5 py-3 bg-neutral-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench size={14} strokeWidth={2.5} className="text-[#FF6B00]" />
                <span className="text-[11px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em]">
                  ACCESO · OP-LOGIN
                </span>
              </div>
              <span className="text-[10px] font-[family-name:var(--font-fira-code)] tracking-widest text-neutral-400">
                AUTH/01
              </span>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Iniciar sesión</h2>
                <p className="text-neutral-600 mt-1 text-sm">
                  Ingresa tus credenciales para continuar.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="username"
                    className="text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-700 uppercase"
                  >
                    Usuario
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    autoComplete="username"
                    placeholder="tu.usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-11 border-neutral-900 bg-neutral-50 focus-visible:ring-0 focus-visible:border-[#FF6B00] focus-visible:bg-white font-[family-name:var(--font-fira-code)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-700 uppercase"
                  >
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPass ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 border-neutral-900 bg-neutral-50 focus-visible:ring-0 focus-visible:border-[#FF6B00] focus-visible:bg-white pr-12 font-[family-name:var(--font-fira-code)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-neutral-600 hover:bg-neutral-900 hover:text-[#FF6B00] transition-colors cursor-pointer border-l border-neutral-900"
                      aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      {showPass ? <EyeOff size={16} strokeWidth={2.5} /> : <Eye size={16} strokeWidth={2.5} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="flex items-center gap-2 text-sm bg-[#FFF8E1] border-2 border-[#FF6B00] px-3 py-2 text-neutral-900"
                  >
                    <AlertCircle size={15} strokeWidth={2.5} className="text-[#FF6B00] shrink-0" />
                    <span className="font-medium">{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-[#FF6B00] hover:bg-[#E55E00] text-black font-bold border border-black cursor-pointer transition-colors uppercase tracking-[0.15em] font-[family-name:var(--font-fira-code)] disabled:opacity-50"
                >
                  {loading ? '// Autenticando…' : '> Entrar al sistema'}
                </Button>
              </form>
            </div>

            {/* Credentials panel */}
            <div className="border-t-2 border-neutral-900 bg-neutral-50">
              <div className="px-5 py-2 bg-neutral-100 border-b border-neutral-300 flex items-center justify-between">
                <span className="text-[10px] font-bold font-[family-name:var(--font-fira-code)] tracking-[0.2em] text-neutral-700 uppercase">
                  // Credenciales de prueba
                </span>
                <span className="text-[10px] font-[family-name:var(--font-fira-code)] text-neutral-500">DEMO</span>
              </div>
              <div className="p-4 font-[family-name:var(--font-fira-code)] text-xs space-y-1.5">
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <span className="text-neutral-900">
                    <span className="text-[#FF6B00] font-bold">admin</span>
                    <span className="text-neutral-400 mx-1">/</span>
                    <span className="text-neutral-700">admin123</span>
                  </span>
                  <span className="px-1.5 py-0.5 border border-neutral-900 text-[9px] font-bold tracking-widest uppercase bg-white">
                    ADMIN
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <span className="text-neutral-900">
                    <span className="text-[#FF6B00] font-bold">personal</span>
                    <span className="text-neutral-400 mx-1">/</span>
                    <span className="text-neutral-700">staff123</span>
                  </span>
                  <span className="px-1.5 py-0.5 border border-neutral-900 text-[9px] font-bold tracking-widest uppercase bg-white">
                    STAFF
                  </span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-[10px] text-neutral-500 mt-6 font-[family-name:var(--font-fira-code)] tracking-widest uppercase">
            Built with Claude Web Builder by{' '}
            <a
              href="https://tododeia.com"
              className="underline hover:text-neutral-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              Tododeia
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
