"use client";

import React, { useEffect, useRef, useState } from 'react';

import ServicesSection from '@/components/ServicesSection';
import ProductsSection from '@/components/ProductsSection';

import BookingModal from '@/components/BookingModal';
import AuthModal from '@/components/AuthModal';

import { useAuth } from '@/context/AuthContext';

export default function HomePage() {

  const heroRef = useRef<HTMLDivElement>(null);

  const { cliente } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const { left, top, width, height } = el.getBoundingClientRect();

      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;

      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    };

    el.addEventListener('mousemove', onMove);

    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400&display=swap');

        :root {
          --lime: #caff00;
          --lime-dim: rgba(202,255,0,0.12);
          --lime-glow: rgba(202,255,0,0.25);
          --ink: #0a0a0a;
          --card: #111111;
          --card-border: rgba(255,255,255,0.07);
          --muted: rgba(255,255,255,0.45);
          --ff-display: 'Bebas Neue', sans-serif;
          --ff-body: 'Barlow', sans-serif;
        }

        .hp-root {
          background: var(--ink);
          color: #fff;
          font-family: var(--ff-body);
          overflow-x: hidden;
        }

        .hp-hero {
          --mx: 50%;
          --my: 50%;
          position: relative;
          min-height: 92vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 8rem 1.5rem 6rem;
          overflow: hidden;
        }

        .hp-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              600px circle at var(--mx) var(--my),
              rgba(202,255,0,0.06),
              transparent 50%
            ),
            radial-gradient(
              ellipse 80% 60% at 50% 0%,
              rgba(202,255,0,0.04),
              transparent
            );
          pointer-events: none;
        }

        .hp-hero::after {
          content: '';
          position: absolute;
          inset: 0;

          background-image:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 80px,
              rgba(255,255,255,0.018) 80px,
              rgba(255,255,255,0.018) 81px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 80px,
              rgba(255,255,255,0.018) 80px,
              rgba(255,255,255,0.018) 81px
            );

          pointer-events: none;
        }

        .hp-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--lime);
          background: rgba(202,255,0,0.08);
          border: 1px solid rgba(202,255,0,0.2);
          padding: 0.4rem 1rem;
          border-radius: 100px;
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }

        .hp-title {
          font-family: var(--ff-display);
          font-size: clamp(4rem, 10vw, 8rem);
          line-height: 0.9;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin: 0 0 1.5rem;
          position: relative;
          z-index: 1;
        }

        .hp-title em {
          font-style: normal;
          color: var(--lime);
          display: block;
        }

        .hp-subtitle {
          color: var(--muted);
          font-size: clamp(0.95rem, 2vw, 1.1rem);
          max-width: 520px;
          line-height: 1.75;
          margin: 0 auto 2.5rem;
          position: relative;
          z-index: 1;
        }

        .hp-hero-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .hp-btn-cta {
          background: var(--lime);
          color: var(--ink);
          font-family: var(--ff-body);
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 0.9rem 2rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .hp-btn-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(202,255,0,0.35);
        }

        .hp-scroll-hint {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: rgba(255,255,255,0.2);
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          z-index: 1;
        }

        .hp-scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(
            to bottom,
            rgba(202,255,0,0.4),
            transparent
          );
        }

        .hp-stats {
          border-top: 1px solid rgba(202,255,0,0.12);
          border-bottom: 1px solid rgba(202,255,0,0.12);
          background: rgba(202,255,0,0.03);
          padding: 1.75rem 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        }

        .hp-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem 3rem;
        }

        .hp-stat-num {
          font-family: var(--ff-display);
          font-size: 2rem;
          color: var(--lime);
        }

        .hp-stat-label {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .hp-band {
          margin: 0;
          background: var(--lime);
          padding: 1.5rem 2rem;
          overflow: hidden;
        }

        .hp-band-track {
          display: flex;
          gap: 3rem;
          width: max-content;
          animation: marquee 18s linear infinite;
        }

        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .hp-band-item {
          font-family: var(--ff-display);
          font-size: 1.1rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .hp-band-dot {
          width: 5px;
          height: 5px;
          background: rgba(10,10,10,0.35);
          border-radius: 50%;
        }

        .hp-footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          padding: 4rem 2rem 3rem;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 2rem;
          max-width: 1100px;
          margin: 0 auto;
          align-items: end;
        }

        .hp-footer-brand {
          font-family: var(--ff-display);
          font-size: 2.5rem;
          letter-spacing: 0.1em;
          color: var(--lime);
          margin: 0 0 0.5rem;
        }

        .hp-footer-addr {
          font-size: 0.85rem;
          color: var(--muted);
          margin: 0 0 0.25rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .hp-footer-copy {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.2);
        }

        .hp-footer-hours {
          text-align: right;
        }

        .hp-footer-hours-title {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--lime);
          margin-bottom: 0.75rem;
        }

        .hp-footer-hour-row {
          font-size: 0.82rem;
          color: var(--muted);
          margin-bottom: 4px;
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }
      `}</style>

      <div className="hp-root">

        <section id="inicio" className="hp-hero" ref={heroRef}>

          <span className="hp-badge">
            Estilo &amp; Tradición
          </span>

          <h1 className="hp-title">
            Cortes con<br />
            <em>Frescura</em>
            Única
          </h1>

          <p className="hp-subtitle">
            En Barbería Limón no solo cortamos el cabello;
            perfeccionamos tu estilo con técnicas clásicas y
            las últimas tendencias urbanas.
          </p>

          <div className="hp-hero-actions">

            <button
              className="hp-btn-cta"
              onClick={() => {
                if (!cliente) setShowModal(true);
                else setShowBooking(true);
              }}
            >
              ✂ Reserva tu Turno
            </button>

          </div>

          <div className="hp-scroll-hint">
            <div className="hp-scroll-line" />
            <span>Scroll</span>
          </div>

        </section>

        <div className="hp-stats">
          {[
            { num: '6+', label: 'Años de experiencia' },
            { num: '3K+', label: 'Clientes satisfechos' },
            { num: '4.9', label: 'Calificación promedio' },
            { num: '3', label: 'Barberos expertos' },
          ].map(s => (
            <div className="hp-stat" key={s.label}>
              <span className="hp-stat-num">{s.num}</span>
              <span className="hp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <ServicesSection />

        <div className="hp-band">
          <div className="hp-band-track">
            {Array(2)
              .fill([
                'Cortes de precisión',
                'Perfilado de barba',
                'Afeitado clásico',
                'Tratamientos capilares',
                'Diseño de línea',
                'Barbería Limón',
                'Cortes de precisión',
                'Perfilado de barba',
                'Afeitado clásico',
                'Tratamientos capilares',
                'Diseño de línea',
                'Barbería Limón'
              ])
              .flat()
              .map((t, i) => (
                <span className="hp-band-item" key={i}>
                  {t}
                  <span className="hp-band-dot" />
                </span>
              ))}
          </div>
        </div>

        <ProductsSection />

        <footer id="contacto">

          <div className="hp-footer">

            <div>

              <p className="hp-footer-brand">
                Barbería Limón
              </p>

              <p className="hp-footer-addr">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>

                Av. Principal #123, Colonia Centro
              </p>

              <p className="hp-footer-copy">
                &copy; {new Date().getFullYear()} Barbería Limón.
                Todos los derechos reservados.
              </p>

            </div>

            <div className="hp-footer-hours">

              <p className="hp-footer-hours-title">
                Horarios
              </p>

              <div className="hp-footer-hour-row">
                <span>Lun – Sab</span>
                <span>11:00am – 6:00pm</span>
              </div>

              <div className="hp-footer-hour-row">
                <span>Descanso diario</span>
                <span>3:00pm – 4:00pm</span>
              </div>

              <div className="hp-footer-hour-row">
                <span>Domingo</span>
                <span>Cerrado</span>
              </div>

            </div>

          </div>

        </footer>

      </div>

      {showModal && (
        <AuthModal onClose={() => setShowModal(false)} />
      )}

      {showBooking && (
        <BookingModal onClose={() => setShowBooking(false)} />
      )}

    </>
  );
}