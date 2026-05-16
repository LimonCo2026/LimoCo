import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';

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

    // Verificar admin
    if (payload.role !== 'admin') {
      return NextResponse.json(
        { error: 'Acceso denegado' },
        { status: 403 }
      );
    }

    const [rows]: any = await db.query(`
      SELECT
        citas.id_cita,
        citas.fecha,
        cortes.nombre AS corte,
        cortes.precio,
        barberos.nombre AS barbero,
        clientes.correo AS cliente,
        clientes.telefono
        FROM citas
        LEFT JOIN clientes
        ON citas.id_cliente = clientes.id_cliente
        LEFT JOIN cortes
        ON citas.id_corte = cortes.id_corte
        LEFT JOIN barberos
        ON citas.id_barbero = barberos.id_barbero
        ORDER BY citas.fecha ASC
    `);

    return NextResponse.json(rows);

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}