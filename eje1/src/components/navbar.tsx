'use client';

import { useRouter } from 'next/navigation';
import BookingModal from './BookingModal';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { cliente, logout, role, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [showBooking, setShowBooking] = useState(false);
  const router = useRouter();

  const isAdmin = role === 'admin';

  const userEmail = cliente?.correo ?? '';
  const initial = userEmail ? userEmail[0].toUpperCase() : 'U';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;500;600;700;800&display=swap');

        .nb-root { font-family: 'Barlow', sans-serif; position: sticky; top: 0; z-index: 50; transition: all 0.3s ease; }
        .nb-root.scrolled { box-shadow: 0 4px 40px rgba(0,0,0,0.6); }
        .nb-bg { background-color: #0a0a0a; background-image: repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px); border-bottom: 1px solid rgba(202,255,0,0.15); }
        .nb-inner { display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; height: 68px; max-width: 1200px; margin: 0 auto; gap: 2rem; }

        .nb-logo { display: flex; flex-direction: column; line-height: 1; text-decoration: none; }
        .nb-logo-main { font-family: 'Bebas Neue', sans-serif; font-size: 1.75rem; letter-spacing: 0.12em; color: #caff00; text-shadow: 0 0 18px rgba(202,255,0,0.35); }
        .nb-logo-sub { font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(255,255,255,0.35); padding-left: 2px; }

        .nb-links { display: none; align-items: center; gap: 0.25rem; flex: 1; justify-content: center; }
        @media (min-width: 768px) { .nb-links { display: flex; } }

        .nb-link {
          position: relative;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          padding: 0.5rem 0.85rem;
          transition: color 0.2s;
        }
        .nb-link:hover { color: #caff00; }

        .nb-actions { display: flex; align-items: center; gap: 0.75rem; }

        .nb-btn-primary {
          background: #caff00;
          color: #0a0a0a;
          font-family: 'Barlow', sans-serif;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 0.55rem 1.25rem;
          border: none;
          border-radius: 3px;
          cursor: pointer;
        }

        .nb-btn-secondary {
          background: transparent;
          color: rgba(255,255,255,0.6);
          font-family: 'Barlow', sans-serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.5rem 1.1rem;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 3px;
          cursor: pointer;
        }

        .nb-user { position: relative; }

        .nb-user-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(202,255,0,0.08);
          border: 1px solid rgba(202,255,0,0.25);
          color: #caff00;
          font-family: 'Barlow', sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.5rem 1rem;
          border-radius: 3px;
          cursor: pointer;
        }

        .nb-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #111;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 0.5rem;
          min-width: 180px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.5);
        }

        .nb-dropdown-item {
          display: block;
          width: 100%;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.7);
          font-family: 'Barlow', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          text-align: left;
          padding: 0.55rem 0.75rem;
          border-radius: 5px;
          cursor: pointer;
        }

        .nb-dropdown-item:hover {
          background: rgba(255,255,255,0.06);
          color: #fff;
        }

        .nb-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #caff00;
          color: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
          flex-shrink: 0;
        }
      `}</style>

      <nav className={`nb-root ${scrolled ? 'scrolled' : ''}`}>
        <div className="nb-bg">
          <div className="nb-inner">

            <a href="/" className="nb-logo">
              <span className="nb-logo-main">Barbería Limón</span>
              <span className="nb-logo-sub">Premium Cuts</span>
            </a>

            <div className="nb-links">
              <a href="/#inicio" className="nb-link">Inicio</a>
              <a href="/#servicios" className="nb-link">Servicios</a>
              <a href="/#productos" className="nb-link">Productos</a>
              <a href="/#contacto" className="nb-link">Contacto</a>
            </div>

            <div className="nb-actions">

              <button
                className="nb-btn-primary"
                onClick={() => {
                  if (!cliente) setShowModal(true);
                  else setShowBooking(true);
                }}
              >
                ✂ Agendar Cita
              </button>

              {loading ? null : cliente ? (
                <div className="nb-user" ref={menuRef}>
                  <button
                    className="nb-user-btn"
                    onClick={() => setShowMenu(!showMenu)}
                  >
                    <div className="nb-avatar">
                      {initial}
                    </div>
                    Mi cuenta ▾
                  </button>

                  {showMenu && (
                    <div className="nb-dropdown">

                      <p style={{ fontSize: 12, opacity: 0.5, padding: 8 }}>
                        {userEmail}
                      </p>

                      {!isAdmin && (
                        <button
                          className="nb-dropdown-item"
                          onClick={() => {
                            router.push('/mis-citas');
                            setShowMenu(false);
                          }}
                        >
                          Mis citas
                        </button>
                      )}

                      {isAdmin && (
                        <button
                          className="nb-dropdown-item"
                          onClick={() => {
                            router.push('/admin');
                            setShowMenu(false);
                          }}
                        >
                          Panel Admin
                        </button>
                      )}

                      <button
                        className="nb-dropdown-item"
                        onClick={async () => {
                          await logout();
                          router.push('/');
                        }}
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="nb-btn-secondary"
                  onClick={() => setShowModal(true)}
                >
                  Iniciar Sesión
                </button>
              )}

            </div>

          </div>
        </div>
      </nav>

      {showModal && <AuthModal onClose={() => setShowModal(false)} />}
      {showBooking && <BookingModal onClose={() => setShowBooking(false)} />}
    </>
  );
}