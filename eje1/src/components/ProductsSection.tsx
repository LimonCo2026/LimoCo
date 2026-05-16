'use client';

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

interface Producto {
  id_producto: number;
  producto: string;
  precio: number;
  stock: number;
}

export default function ProductsSection() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/productos')
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar los productos');
        return res.json();
      })
      .then((data: Producto[]) => {
        setProductos(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <section
      id="productos"
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
          Productos Barbería Limón
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
          Nuestros Productos
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
          CARGANDO PRODUCTOS...
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
          {productos.map(producto => (
            <ProductCard
              key={producto.id_producto}
              {...producto}
            />
          ))}
        </div>
      )}
    </section>
  );
}   