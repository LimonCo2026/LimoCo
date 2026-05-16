'use client';

import { useEffect, useState } from 'react';

interface Cita {
  id_cita: number;
  fecha: string;
  precio: number;
  barbero: string;
  corte: string;
}

export default function MisCitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/citas/mis-citas')
      .then(async res => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Error al cargar citas');
        }

        return data;
      })
      .then(data => {
        setCitas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setCitas([]);
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fff',
        padding: '4rem 2rem',
        fontFamily: 'Barlow, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '4rem',
            letterSpacing: '0.08em',
            color: '#caff00',
            marginBottom: '3rem',
          }}
        >
          Mis Citas
        </h1>

        {loading ? (
          <p
            style={{
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '0.08em',
            }}
          >
            Cargando citas...
          </p>
        ) : error ? (
          <div
            style={{
              background: 'rgba(255,50,50,0.08)',
              border: '1px solid rgba(255,50,50,0.2)',
              padding: '1rem 1.5rem',
              borderRadius: '8px',
              color: 'rgba(255,120,120,0.9)',
            }}
          >
            ⚠ {error}
          </div>
        ) : citas.length === 0 ? (
          <div
            style={{
              background: '#111',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '3rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '3rem',
                marginBottom: '1rem',
              }}
            >
              ✂
            </div>

            <h2
              style={{
                color: '#caff00',
                marginBottom: '0.5rem',
                fontSize: '1.5rem',
              }}
            >
              No tienes citas registradas
            </h2>

            <p
              style={{
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              Agenda tu primer corte desde la página principal.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: '1rem',
            }}
          >
            {citas.map(cita => (
              <div
                key={cita.id_cita}
                style={{
                  background: '#111',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  padding: '1.5rem',
                }}
              >
                <h2
                  style={{
                    color: '#caff00',
                    marginBottom: '1rem',
                  }}
                >
                  ✂ {cita.corte}
                </h2>

                <p>
                  <strong>Barbero:</strong> {cita.barbero}
                </p>

                <p>
                  <strong>Fecha:</strong>{' '}
                  {new Date(cita.fecha).toLocaleDateString()}
                </p>

                <p>
                  <strong>Hora:</strong>{' '}
                  {new Date(cita.fecha).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>

                <p>
                  <strong>Precio:</strong> ${cita.precio}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}