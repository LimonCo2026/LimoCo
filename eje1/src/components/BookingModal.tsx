'use client';
 
import { useState, useEffect } from 'react';
 
interface Barbero { id_barbero: number; nombre: string; }
interface Corte   { id_corte: number;   nombre: string; precio: number; }
 
interface BookingModalProps {
  corteInicial?: Corte | null;
  onClose: () => void;
}
 
const DIAS  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
 
export default function BookingModal({ corteInicial, onClose }: BookingModalProps) {
  const [barberos, setBarberos]   = useState<Barbero[]>([]);
  const [cortes, setCortes]       = useState<Corte[]>([]);
  const [barberoId, setBarberoId] = useState<number | null>(null);
  const [corteId, setCorteId]     = useState<number | null>(corteInicial?.id_corte || null);
  const [fecha, setFecha]         = useState('');
  const [slots, setSlots]         = useState<string[]>([]);
  const [hora, setHora]           = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]         = useState('');
  const [exito, setExito]         = useState('');
 
  const hoy = new Date();
  const [mesVista, setMesVista] = useState(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
 
  useEffect(() => {
    fetch('/api/barberos').then(r => r.json()).then(setBarberos);
    fetch('/api/cortes').then(r => r.json()).then(setCortes);
  }, []);
 
  useEffect(() => {
    if (!fecha || !barberoId) return;
    setHora(''); setSlots([]); setLoadingSlots(true);
    fetch(`/api/citas/slots?fecha=${fecha}&id_barbero=${barberoId}`)
      .then(r => r.json())
      .then(data => { setSlots(data.slots || []); setLoadingSlots(false); });
  }, [fecha, barberoId]);
 
  const handleAgendar = async () => {
    setError('');
    if (!barberoId || !corteId || !fecha || !hora) { setError('Completa todos los campos'); return; }
    setSubmitting(true);
    const res = await fetch('/api/citas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_barbero: barberoId, id_corte: corteId, fecha, hora }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) { setError(data.error); return; }
    setExito('¡Cita agendada! Ya aparece en el calendario de la barbería.');
  };
 
  const diasEnMes = new Date(mesVista.getFullYear(), mesVista.getMonth() + 1, 0).getDate();
  const primerDia = new Date(mesVista.getFullYear(), mesVista.getMonth(), 1).getDay();
 
  const seleccionarFecha = (dia: number) => {
    const d = new Date(mesVista.getFullYear(), mesVista.getMonth(), dia);
    if (d.getDay() === 0) return; // domingo cerrado
 
    const hoyLimpio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
    if (d < hoyLimpio) return; // fecha pasada
 
    const maxFecha = new Date(hoyLimpio);
    maxFecha.setDate(hoyLimpio.getDate() + 4);
    if (d > maxFecha) return; // más de 4 días
 
    const yyyy = d.getFullYear();
    const mm   = String(d.getMonth() + 1).padStart(2, '0');
    const dd   = String(d.getDate()).padStart(2, '0');
    setFecha(`${yyyy}-${mm}-${dd}`);
    setHora('');
  };
 
  const fechaSelObj = fecha ? new Date(fecha + 'T12:00:00') : null;
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@400;600;700;800&display=swap');
        .bm-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.82);backdrop-filter:blur(5px);z-index:100;display:flex;align-items:center;justify-content:center;padding:1rem;overflow-y:auto;}
        .bm-box{background:#111;border:1px solid rgba(255,255,255,0.08);border-radius:14px;width:100%;max-width:700px;padding:2.5rem;position:relative;font-family:'Barlow',sans-serif;}
        .bm-close{position:absolute;top:1rem;right:1rem;background:transparent;border:none;color:rgba(255,255,255,0.3);font-size:1.5rem;cursor:pointer;line-height:1;transition:color 0.2s;}
        .bm-close:hover{color:#fff;}
        .bm-title{font-family:'Bebas Neue',sans-serif;font-size:2rem;letter-spacing:0.08em;color:#caff00;margin:0 0 0.2rem;}
        .bm-sub{font-size:0.8rem;color:rgba(255,255,255,0.3);margin:0 0 2rem;}
        .bm-section{margin-bottom:1.75rem;}
        .bm-label{font-size:0.68rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:0.6rem;display:block;}
        .bm-cards{display:flex;gap:0.6rem;flex-wrap:wrap;}
        .bm-card{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;padding:0.6rem 1rem;cursor:pointer;transition:all 0.2s;font-size:0.85rem;color:rgba(255,255,255,0.55);font-weight:600;}
        .bm-card:hover{border-color:rgba(202,255,0,0.35);color:#fff;}
        .bm-card.selected{background:rgba(202,255,0,0.1);border-color:rgba(202,255,0,0.6);color:#caff00;}
        .bm-corte-precio{font-size:0.72rem;color:rgba(202,255,0,0.55);font-weight:700;display:block;margin-top:2px;}
        .bm-cal{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:1rem;}
        .bm-cal-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem;}
        .bm-cal-mes{font-family:'Bebas Neue',sans-serif;font-size:1.2rem;letter-spacing:0.08em;color:#fff;}
        .bm-cal-nav{background:transparent;border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.45);width:28px;height:28px;border-radius:5px;cursor:pointer;font-size:0.9rem;transition:all 0.2s;}
        .bm-cal-nav:hover{border-color:rgba(202,255,0,0.4);color:#caff00;}
        .bm-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;}
        .bm-cal-dow{font-size:0.62rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.2);text-align:center;padding:4px 0;}
        .bm-cal-day{aspect-ratio:1;display:flex;align-items:center;justify-content:center;border-radius:6px;font-size:0.82rem;font-weight:600;cursor:pointer;transition:all 0.2s;color:rgba(255,255,255,0.55);border:1px solid transparent;}
        .bm-cal-day:hover:not(.disabled):not(.domingo){background:rgba(202,255,0,0.08);border-color:rgba(202,255,0,0.3);color:#caff00;}
        .bm-cal-day.selected{background:rgba(202,255,0,0.15);border-color:#caff00;color:#caff00;}
        .bm-cal-day.disabled{color:rgba(255,255,255,0.15);cursor:default;}
        .bm-cal-day.domingo{color:rgba(255,80,80,0.25);cursor:not-allowed;}
        .bm-cal-day.hoy{border-color:rgba(202,255,0,0.25);}
        .bm-slots{display:flex;gap:0.5rem;flex-wrap:wrap;}
        .bm-slot{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:6px;padding:0.45rem 0.85rem;font-size:0.82rem;font-weight:700;color:rgba(255,255,255,0.5);cursor:pointer;transition:all 0.2s;letter-spacing:0.04em;}
        .bm-slot:hover{border-color:rgba(202,255,0,0.4);color:#caff00;}
        .bm-slot.selected{background:rgba(202,255,0,0.12);border-color:#caff00;color:#caff00;}
        .bm-resumen{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:1rem 1.25rem;margin-bottom:1rem;display:flex;gap:2rem;flex-wrap:wrap;}
        .bm-res-key{font-size:0.62rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.22);display:block;margin-bottom:3px;}
        .bm-res-val{font-size:0.92rem;font-weight:700;color:#fff;}
        .bm-error{background:rgba(255,50,50,0.07);border:1px solid rgba(255,50,50,0.18);border-radius:6px;color:rgba(255,100,100,0.85);font-size:0.82rem;padding:0.65rem 1rem;margin-bottom:1rem;}
        .bm-exito{background:rgba(202,255,0,0.07);border:1px solid rgba(202,255,0,0.25);border-radius:8px;color:#caff00;font-size:1rem;padding:1.5rem;text-align:center;font-weight:700;}
        .bm-btn{width:100%;background:#caff00;color:#0a0a0a;font-family:'Barlow',sans-serif;font-size:0.85rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:0.9rem;border:none;border-radius:6px;cursor:pointer;transition:all 0.2s;margin-top:0.5rem;}
        .bm-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 20px rgba(202,255,0,0.25);}
        .bm-btn:disabled{opacity:0.5;cursor:not-allowed;}
      `}</style>
 
      <div className="bm-overlay" onClick={onClose}>
        <div className="bm-box" onClick={e => e.stopPropagation()}>
          <button className="bm-close" onClick={onClose}>×</button>
          <h2 className="bm-title">Agendar Cita</h2>
          <p className="bm-sub">Lunes a Sábado · 11am – 6pm · Descanso 3–4pm · 45 min por turno</p>
 
          {exito ? (
            <div className="bm-exito">✓ {exito}</div>
          ) : (
            <>
              {/* 1. Barbero */}
              <div className="bm-section">
                <span className="bm-label">1. Elige tu barbero</span>
                <div className="bm-cards">
                  {barberos.map(b => (
                    <div key={b.id_barbero}
                      className={`bm-card ${barberoId === b.id_barbero ? 'selected' : ''}`}
                      onClick={() => { setBarberoId(b.id_barbero); setFecha(''); setHora(''); }}>
                      ✂ {b.nombre}
                    </div>
                  ))}
                </div>
              </div>
 
              {/* 2. Corte */}
              <div className="bm-section">
                <span className="bm-label">2. Elige el corte</span>
                <div className="bm-cards">
                  {cortes.map(c => (
                    <div key={c.id_corte}
                      className={`bm-card ${corteId === c.id_corte ? 'selected' : ''}`}
                      onClick={() => setCorteId(c.id_corte)}>
                      {c.nombre}
                      <span className="bm-corte-precio">${c.precio}</span>
                    </div>
                  ))}
                </div>
              </div>
 
              {/* 3. Calendario */}
              <div className="bm-section">
                <span className="bm-label">3. Elige la fecha</span>
                <div className="bm-cal">
                  <div className="bm-cal-header">
                    <button className="bm-cal-nav" onClick={() => setMesVista(new Date(mesVista.getFullYear(), mesVista.getMonth() - 1, 1))}>‹</button>
                    <span className="bm-cal-mes">{MESES[mesVista.getMonth()]} {mesVista.getFullYear()}</span>
                    <button className="bm-cal-nav" onClick={() => setMesVista(new Date(mesVista.getFullYear(), mesVista.getMonth() + 1, 1))}>›</button>
                  </div>
                  <div className="bm-cal-grid">
                    {DIAS.map(d => <div key={d} className="bm-cal-dow">{d}</div>)}
                    {Array(primerDia).fill(null).map((_, i) => <div key={`e${i}`} />)}
                    {Array(diasEnMes).fill(null).map((_, i) => {
                      const dia = i + 1;
                      const d = new Date(mesVista.getFullYear(), mesVista.getMonth(), dia);
 
                      const hoyLimpio  = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
                      const maxFecha   = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 4);
                      const esDomingo  = d.getDay() === 0;
                      const esPasado   = d < hoyLimpio;
                      const fueraRango = d > maxFecha;
                      const esHoy      = d.toDateString() === hoy.toDateString();
 
                      const yyyy = d.getFullYear();
                      const mm   = String(d.getMonth() + 1).padStart(2, '0');
                      const dd   = String(d.getDate()).padStart(2, '0');
                      const esSel = fecha === `${yyyy}-${mm}-${dd}`;
 
                      return (
                        <div key={dia}
                          className={`bm-cal-day ${esDomingo ? 'domingo' : ''} ${esPasado || fueraRango ? 'disabled' : ''} ${esHoy ? 'hoy' : ''} ${esSel ? 'selected' : ''}`}
                          onClick={() => seleccionarFecha(dia)}>
                          {dia}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
 
              {/* 4. Hora */}
              {fecha && barberoId && (
                <div className="bm-section">
                  <span className="bm-label">4. Elige la hora</span>
                  {loadingSlots ? (
                    <p style={{color:'rgba(255,255,255,0.3)',fontSize:'0.85rem'}}>Cargando horarios...</p>
                  ) : slots.length === 0 ? (
                    <p style={{color:'rgba(255,100,100,0.6)',fontSize:'0.85rem'}}>No hay horarios disponibles para este día.</p>
                  ) : (
                    <div className="bm-slots">
                      {slots.map(s => (
                        <div key={s} className={`bm-slot ${hora === s ? 'selected' : ''}`} onClick={() => setHora(s)}>{s}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
 
              {/* Resumen */}
              {barberoId && corteId && fecha && hora && (
                <div className="bm-resumen">
                  {[
                    {k:'Barbero', v: barberos.find(b => b.id_barbero === barberoId)?.nombre},
                    {k:'Corte',   v: cortes.find(c => c.id_corte === corteId)?.nombre},
                    {k:'Fecha',   v: fechaSelObj ? `${fechaSelObj.getDate()} de ${MESES[fechaSelObj.getMonth()]}` : ''},
                    {k:'Hora',    v: hora},
                    {k:'Precio',  v: `$${cortes.find(c => c.id_corte === corteId)?.precio}`},
                  ].map(item => (
                    <div key={item.k}>
                      <span className="bm-res-key">{item.k}</span>
                      <span className="bm-res-val">{item.v}</span>
                    </div>
                  ))}
                </div>
              )}
 
              {error && <div className="bm-error">⚠ {error}</div>}
 
              <button className="bm-btn" onClick={handleAgendar} disabled={submitting}>
                {submitting ? 'Agendando...' : '✂ Confirmar Cita'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
 