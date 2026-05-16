'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { login, registro } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<'login' | 'registro'>('login');

  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [telefono, setTelefono] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');

    if (!correo.includes('@')) {
      setError('El correo debe contener una @');
      return;
    }

    if (contrasena.length < 5) {
      setError('La contraseña debe tener al menos 5 caracteres');
      return;
    }

    if (tab === 'registro') {
      if (!/^\d{10}$/.test(telefono)) {
        setError('El teléfono debe tener exactamente 10 números');
        return;
      }
    }

    setLoading(true);

    const result =
      tab === 'login'
        ? await login(correo, contrasena)
        : await registro(correo, contrasena, telefono);

    setLoading(false);

    if (result) {
      setError(result);
      return;
    }

    // LOGIN OK → decidir por rol
    if (tab === 'login') {
      try {
        const session = await fetch('/api/auth/me');
        const data = await session.json();

        onClose();

        const role = data?.role;

        if (role === 'admin') {
          router.push('/admin');
          return;
        }

        router.push('/');
        return;

      } catch {
        setError('Error al iniciar sesión');
      }
    }

    // REGISTRO
    onClose();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700;800&display=swap');

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(4px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .modal-box {
          background: #111;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          width: 100%;
          max-width: 420px;
          padding: 2.5rem;
          position: relative;
          font-family: 'Barlow', sans-serif;
        }

        .modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.3);
          font-size: 1.4rem;
          cursor: pointer;
        }

        .modal-close:hover {
          color: #fff;
        }

        .modal-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.2rem;
          letter-spacing: 0.08em;
          color: #caff00;
          margin: 0 0 0.25rem;
        }

        .modal-subtitle {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.35);
          margin: 0 0 2rem;
        }

        .modal-tabs {
          display: flex;
          gap: 0;
          margin-bottom: 2rem;
          background: rgba(255,255,255,0.04);
          border-radius: 6px;
          padding: 3px;
        }

        .modal-tab {
          flex: 1;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.35);
          font-family: 'Barlow', sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-tab.active {
          background: #caff00;
          color: #0a0a0a;
        }

        .modal-field {
          margin-bottom: 1rem;
        }

        .modal-label {
          display: block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 0.4rem;
        }

        .modal-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          color: #fff;
          font-family: 'Barlow', sans-serif;
          font-size: 0.9rem;
          padding: 0.7rem 1rem;
          outline: none;
        }

        .modal-input:focus {
          border-color: rgba(202,255,0,0.5);
        }

        .modal-error {
          background: rgba(255,50,50,0.08);
          border: 1px solid rgba(255,50,50,0.2);
          border-radius: 6px;
          color: rgba(255,100,100,0.9);
          font-size: 0.82rem;
          padding: 0.65rem 1rem;
          margin-bottom: 1rem;
        }

        .modal-btn {
          width: 100%;
          background: #caff00;
          color: #0a0a0a;
          font-family: 'Barlow', sans-serif;
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.85rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
        }

        .modal-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>

          <button className="modal-close" onClick={onClose}>×</button>

          <h2 className="modal-title">
            {tab === 'login' ? 'Bienvenido' : 'Crear Cuenta'}
          </h2>

          <p className="modal-subtitle">
            {tab === 'login'
              ? 'Inicia sesión para continuar'
              : 'Regístrate para comenzar'}
          </p>

          <div className="modal-tabs">
            <button
              className={`modal-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => { setTab('login'); setError(''); }}
            >
              Iniciar Sesión
            </button>

            <button
              className={`modal-tab ${tab === 'registro' ? 'active' : ''}`}
              onClick={() => { setTab('registro'); setError(''); }}
            >
              Registrarse
            </button>
          </div>

          <div className="modal-field">
            <label className="modal-label">Correo</label>
            <input
              className="modal-input"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              type="email"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Contraseña</label>
            <input
              className="modal-input"
              value={contrasena}
              onChange={e => setContrasena(e.target.value)}
              type="password"
            />
          </div>

          {tab === 'registro' && (
            <div className="modal-field">
              <label className="modal-label">Teléfono</label>
              <input
                className="modal-input"
                value={telefono}
                onChange={e =>
                  setTelefono(e.target.value.replace(/\D/g, ''))
                }
                maxLength={10}
              />
            </div>
          )}

          {error && <div className="modal-error">⚠ {error}</div>}

          <button
            className="modal-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? 'Cargando...'
              : tab === 'login'
              ? '✂ Entrar'
              : '✂ Crear Cuenta'}
          </button>

        </div>
      </div>
    </>
  );
}