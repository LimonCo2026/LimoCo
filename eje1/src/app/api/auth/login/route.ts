import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { correo, contrasena } = await request.json();

    if (!correo || !contrasena) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    // ================= ADMIN =================
    const [adminRows]: any = await db.query(
      'SELECT * FROM admins WHERE correo = ?',
      [correo]
    );

    if (adminRows.length > 0) {
      const admin = adminRows[0];

      const ok = await bcrypt.compare(contrasena, admin.contrasena);
      if (!ok) {
        return NextResponse.json(
          { error: 'Credenciales incorrectas' },
          { status: 401 }
        );
      }

      const token = jwt.sign(
        {
          id: admin.id_admin,
          correo: admin.correo,
          role: 'admin',
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      const res = NextResponse.json({
        ok: true,
        role: 'admin',
        user: {
          id: admin.id_admin,
          correo: admin.correo,
        },
      });

      res.cookies.set('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return res;
    }

    // ================= CLIENTE =================
    const [rows]: any = await db.query(
      'SELECT * FROM clientes WHERE correo = ?',
      [correo]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    const cliente = rows[0];

    const ok = await bcrypt.compare(contrasena, cliente.contrasena);
    if (!ok) {
      return NextResponse.json(
        { error: 'Credenciales incorrectas' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: cliente.id_cliente,
        correo: cliente.correo,
        role: 'cliente',
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const res = NextResponse.json({
      ok: true,
      role: 'cliente',
      user: {
        id: cliente.id_cliente,
        correo: cliente.correo,
        telefono: cliente.telefono,
      },
    });

    res.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;

  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}