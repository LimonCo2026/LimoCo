import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
 
const DURACION = 45; // minutos por turno
const HORARIO = {
  inicio: 11 * 60,        // 11:00 en minutos
  fin: 18 * 60,           // 18:00 en minutos
  descansoInicio: 15 * 60, // 15:00
  descansoFin: 16 * 60,   // 16:00
};
 
function generarSlots(): string[] {
  const slots: string[] = [];
  let t = HORARIO.inicio;
 
  while (t + DURACION <= HORARIO.fin) {
    const enDescanso = t < HORARIO.descansoFin && (t + DURACION) > HORARIO.descansoInicio;
 
    if (!enDescanso) {
      const h   = String(Math.floor(t / 60)).padStart(2, '0');
      const min = String(t % 60).padStart(2, '0');
      slots.push(`${h}:${min}`);
    }
    t += DURACION;
  }
 
  return slots;
}
 
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fecha      = searchParams.get('fecha');
    const id_barbero = searchParams.get('id_barbero');

    if (!fecha || !id_barbero) {
      return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 });
    }

    // Domingo cerrado
    if (new Date(fecha + 'T12:00:00').getDay() === 0) {
      return NextResponse.json({ slots: [], mensaje: 'Cerrado los domingos' });
    }

    // Máximo 4 días de anticipación
    const hoy        = new Date();
    const fechaSol   = new Date(fecha + 'T12:00:00');
    const diffDias   = Math.round((fechaSol.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDias > 4) {
      return NextResponse.json({ slots: [], mensaje: 'Solo puedes agendar con máximo 4 días de anticipación' });
    }

    // Slots ocupados en BD
    const [rows]: any = await db.query(
      `SELECT fecha FROM citas WHERE id_barbero = ? AND DATE(fecha) = ?`,
      [id_barbero, fecha]
    );

    const ocupados: string[] = rows.map((r: any) => {
      const d = new Date(r.fecha);
      return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    });

    const ahora          = new Date();
    const minutosAhora   = ahora.getHours() * 60 + ahora.getMinutes();
    const esHoy          = fechaSol.toDateString() === ahora.toDateString();

    const todos       = generarSlots();
    const disponibles = todos.filter(s => {
      if (ocupados.includes(s)) return false;

      // Si es hoy, exigir al menos 1 hora de anticipación
      if (esHoy) {
        const [h, m]       = s.split(':').map(Number);
        const minutoSlot   = h * 60 + m;
        if (minutoSlot < minutosAhora + 60) return false;
      }

      return true;
    });

    return NextResponse.json({ slots: disponibles });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
 