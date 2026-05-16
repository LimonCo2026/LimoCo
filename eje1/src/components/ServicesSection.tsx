'use client';

import { useState, useEffect } from 'react';
import CutCard from './CutCard';
import BookingModal from './BookingModal';
import AuthModal from './AuthModal';
import { useAuth } from '@/context/AuthContext';

interface Corte {
  id_corte: number;
  nombre: string;
  precio: number;
  descripcion: string;
}

export default function ServicesSection() {
  const { cliente } = useAuth();

  const [cortes, setCortes] = useState<Corte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    fetch('/api/cortes')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar los cortes');
        return res.json();
      })
      .then((data: Corte[]) => {
        setCortes(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleBooking = () => {
    if (!cliente) {
      setShowModal(true);
    } else {
      setShowBooking(true);
    }
  };

  return (
    <>
      <section
        id="servicios"
        style={{
          padding: '7rem 2rem',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#caff00',
              display: 'block',
              marginBottom: '1rem',
            }}
          >
            Lo que ofrecemos
          </span>

          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              margin: 0,
              color: '#fff',
            }}
          >
            Nuestros Cortes
          </h2>
        </div>

        {loading && (
          <p
            style={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.2em',
            }}
          >
            CARGANDO CORTES...
          </p>
        )}

        {error && (
          <div
            style={{
              padding: '1.5rem',
              background: 'rgba(255,50,50,0.05)',
              border: '1px solid rgba(255,50,50,0.15)',
              borderRadius: '8px',
              color: 'rgba(255,100,100,0.8)',
              textAlign: 'center',
            }}
          >
            ⚠ {error}
          </div>
        )}

        {!loading && !error && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
            }}
          >
            {cortes.map(corte => (
              <CutCard
                key={corte.id_corte}
                {...corte}
                selected={selectedId === corte.id_corte}
                onSelect={setSelectedId}
              />
            ))}
          </div>
        )}

        {selectedId && (
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button
              onClick={handleBooking}
              style={{
                background: '#caff00',
                color: '#0a0a0a',
                fontFamily: "'Barlow', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '0.9rem 2.5rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 0 22px rgba(202,255,0,0.45)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ✂ Agendar este Corte
            </button>
          </div>
        )}
      </section>

      {showModal && (
        <AuthModal onClose={() => setShowModal(false)} />
      )}

      {showBooking && (
        <BookingModal onClose={() => setShowBooking(false)} />
      )}
    </>
  );
}