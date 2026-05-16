import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any;

    // 🔥 FIX: tu JWT usa "id", no "id_cliente"
    const id_cliente = payload.id;

    const [rows]: any = await db.query(
      `
      SELECT
        c.id_cita,
        c.fecha,
        c.precio,
        b.nombre AS barbero,
        co.nombre AS corte
      FROM citas c
      JOIN barberos b ON c.id_barbero = b.id_barbero
      JOIN cortes co ON c.id_corte = co.id_corte
      WHERE c.id_cliente = ?
      ORDER BY c.fecha DESC
      `,
      [id_cliente]
    );

    return NextResponse.json(rows);

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}