import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { ok: false, role: null, user: null },
        { status: 401 }
      );
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

    return NextResponse.json({
      ok: true,
      role: payload.role,
      user: {
        id_cliente: payload.id,
        correo: payload.correo,
      },
    });

  } catch {
    return NextResponse.json(
      { ok: false, role: null, user: null },
      { status: 401 }
    );
  }
}