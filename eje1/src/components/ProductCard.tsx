interface ProductCardProps {
  id_producto: number;
  producto: string;
  precio: number;
  stock: number;
}

export default function ProductCard({
  producto,
  precio,
  stock,
}: ProductCardProps) {

  const disponible = stock > 0;

  return (
    <div
      style={{
        background: '#0f0f0f',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
        padding: '2rem',
      }}
    >

      <div
        style={{
          width: '55px',
          height: '55px',
          borderRadius: '10px',
          background: 'rgba(202,255,0,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        🧴
      </div>

      <h3
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '1.8rem',
          letterSpacing: '0.05em',
          marginBottom: '1.5rem',
          color: '#fff',
        }}
      >
        {producto}
      </h3>

      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >

        <span
          style={{
            color: disponible ? '#caff00' : '#ff6666',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 700,
          }}
        >
          {disponible
            ? `${stock} en stock`
            : 'Sin stock'}
        </span>

        <span
          style={{
            color: '#caff00',
            fontSize: '2rem',
            fontFamily: "'Bebas Neue', sans-serif",
          }}
        >
          ${precio}
        </span>
      </div>
    </div>
  );
}