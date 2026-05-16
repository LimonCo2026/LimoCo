'use client';

import { useEffect, useState } from 'react';

interface Cita {
  id_cita: number;
  fecha: string;
  precio: number;
  cliente: string;
  telefono: string;
  barbero: string;
  corte: string;
}

export default function AdminPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarCitas = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/admin/citas');

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al cargar citas');
      }

      // Asegurar que siempre sea arreglo
      setCitas(Array.isArray(data) ? data : []);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al cargar citas');
      setCitas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const eliminarCita = async (id: number) => {
    const confirmar = confirm('¿Eliminar esta cita?');

    if (!confirmar) return;

    try {
      const res = await fetch(`/api/admin/citas/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al eliminar');
      }

      setCitas(prev =>
        prev.filter(c => c.id_cita !== id)
      );

    } catch (err: any) {
      console.error(err);
      alert(err.message || 'No se pudo eliminar la cita');
    }
  };

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
          maxWidth: '1200px',
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
          Panel Administrador
        </h1>

        {loading ? (
          <p>Cargando citas...</p>

        ) : error ? (
          <p
            style={{
              color: '#ff7b7b',
            }}
          >
            ⚠ {error}
          </p>

        ) : citas.length === 0 ? (
          <p
            style={{
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            No hay citas registradas.
          </p>

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
                  <strong>Cliente:</strong> {cita.cliente}
                </p>

                <p>
                  <strong>Teléfono:</strong> {cita.telefono}
                </p>

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

                <button
                  onClick={() =>
                    eliminarCita(cita.id_cita)
                  }
                  style={{
                    marginTop: '1rem',
                    background: '#ff4d4d',
                    border: 'none',
                    color: '#fff',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 700,
                  }}
                >
                  Eliminar cita
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}