'use client';

interface CutCardProps {
  id_corte: number;
  nombre: string;
  precio: number;
  descripcion: string;
  onSelect?: (id: number) => void;
  selected?: boolean;
}

export default function CutCard({ id_corte, nombre, precio, descripcion, onSelect, selected }: CutCardProps) {
  return (
    <div
      onClick={() => onSelect?.(id_corte)}
      style={{
        background: selected ? '#131313' : '#0f0f0f',
        border: selected ? '1px solid rgba(202,255,0,0.5)' : '1px solid rgba(255,255,255,0.07)',
        borderRadius: '10px',
        padding: '2rem',
        cursor: onSelect ? 'pointer' : 'default',
        position: 'relative',
        transition: 'all 0.25s ease',
        fontFamily: "'Barlow', sans-serif",
      }}
    >
      {/* Barra top al seleccionar */}
      {selected && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '2px', background: '#caff00', borderRadius: '10px 10px 0 0',
        }} />
      )}

      {/* Precio decorativo de fondo */}
      <span style={{
        position: 'absolute', top: '1rem', right: '1.25rem',
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '3.5rem', lineHeight: '1',
        color: selected ? 'rgba(202,255,0,0.12)' : 'rgba(255,255,255,0.04)',
        pointerEvents: 'none',
      }}>
        ${precio}
      </span>

      <h3 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '1.5rem',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: selected ? '#caff00' : '#ffffff',
        margin: '0 0 0.6rem',
        transition: 'color 0.2s',
      }}>
        {nombre}
      </h3>

      <p style={{
        fontSize: '0.875rem',
        color: 'rgba(255,255,255,0.45)',
        lineHeight: '1.7',
        margin: '0 0 1.5rem',
      }}>
        {descripcion || 'Sin descripción disponible.'}
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        {onSelect && (
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: selected ? '#caff00' : 'rgba(255,255,255,0.25)',
            transition: 'color 0.2s',
          }}>
            {selected ? '✓ Seleccionado' : 'Seleccionar'}
          </span>
        )}
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '2rem',
          color: '#caff00',
          lineHeight: '1',
          marginLeft: 'auto',
        }}>
          ${precio}
        </span>
      </div>
    </div>
  );
}
