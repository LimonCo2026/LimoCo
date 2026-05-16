import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { calendar, CALENDAR_ID } from '@/lib/googleCalendar';
import jwt from 'jsonwebtoken';
 
export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT c.*, cl.correo, b.nombre AS barbero, co.nombre AS corte
      FROM citas c
      JOIN clientes cl ON c.id_cliente = cl.id_cliente
      JOIN barberos b  ON c.id_barbero = b.id_barbero
      JOIN cortes  co  ON c.id_corte   = co.id_corte
      ORDER BY c.fecha DESC
    `);
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
 
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar sesión
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
 
    const { id_barbero, id_corte, fecha, hora } = await request.json();
    // fecha: "YYYY-MM-DD"  hora: "HH:MM"
 
    if (!id_barbero || !id_corte || !fecha || !hora) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }
 
    // 2. Verificar que el slot sigue disponible (doble check)
    const [yaExiste]: any = await db.query(
      `SELECT id_cita FROM citas
       WHERE id_barbero = ?
         AND DATE(fecha) = ?
         AND TIME(fecha) = ?`,
      [id_barbero, fecha, hora + ':00']
    );
 
    if (yaExiste.length > 0) {
      return NextResponse.json({ error: 'Ese horario ya fue reservado, elige otro' }, { status: 409 });
    }
 
    // 3. Obtener info de barbero y corte
    const [[barbero]]: any = await db.query('SELECT * FROM barberos WHERE id_barbero = ?', [id_barbero]);
    const [[clienteInfo]]: any = await db.query(
      'SELECT telefono FROM clientes WHERE id_cliente = ?',
      [payload.id]
    );
    const [[corte]]:   any = await db.query('SELECT * FROM cortes   WHERE id_corte   = ?', [id_corte]);
 
    if (!barbero || !corte) {
      return NextResponse.json({ error: 'Barbero o corte no encontrado' }, { status: 404 });
    }
 
    // 4. Construir datetime completo
    const fechaHora = new Date(`${fecha}T${hora}:00`);
    const fechaFin  = new Date(fechaHora.getTime() + 45 * 60 * 1000);
 
    // 5. Guardar en BD primero
    const [result]: any = await db.query(
      'INSERT INTO citas (id_cliente, id_barbero, id_corte, fecha, precio) VALUES (?, ?, ?, ?, ?)',
      [payload.id, id_barbero, id_corte, fechaHora, corte.precio]
    );
 
    // 6. Crear evento en Google Calendar
    let eventoLink = null;
    try {
      const evento = await calendar.events.insert({
        calendarId: CALENDAR_ID,
        requestBody: {
          summary: `✂ ${corte.nombre} — barbero_${id_barbero}`,
          description: [
            `Cliente: ${payload.correo}`,
            `Teléfono: ${clienteInfo?.telefono || 'No registrado'}`,
            `Barbero: ${barbero.nombre}`,
            `Corte: ${corte.nombre}`,
            `Precio: $${corte.precio}`,
            `ID Cita BD: ${result.insertId}`,
          ].join('\n'),
          start: { dateTime: fechaHora.toISOString(), timeZone: 'America/Mexico_City' },
          end:   { dateTime: fechaFin.toISOString(),  timeZone: 'America/Mexico_City' },
          colorId: String((id_barbero % 11) + 1), // color distinto por barbero
        },
      });
      eventoLink = evento.data.htmlLink;
    } catch (calErr) {
      // Si falla el calendario la cita ya quedó en BD, no es crítico
      console.error('Google Calendar error:', calErr);
    }
 
    return NextResponse.json({
      ok: true,
      id_cita: result.insertId,
      evento_link: eventoLink,
    }, { status: 201 });
 
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
 