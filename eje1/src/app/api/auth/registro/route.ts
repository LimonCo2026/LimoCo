import { NextResponse } from 'next/server';
import db from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
 
export async function POST(request: Request) {
  try {
    const { correo, contrasena, telefono } = await request.json();
 
    if (!correo || !contrasena) {
      return NextResponse.json({ error: 'Correo y contraseña requeridos' }, { status: 400 });
    }
 
    // Verificar si el correo ya existe
    const [existing]: any = await db.query(
      'SELECT id_cliente FROM clientes WHERE correo = ?',
      [correo]
    );
 
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Este correo ya está registrado' }, { status: 409 });
    }
 
    // Hashear contraseña
    const hash = await bcrypt.hash(contrasena, 10);
 
    // Insertar cliente
    const [result]: any = await db.query(
      'INSERT INTO clientes (correo, contrasena, telefono) VALUES (?, ?, ?)',
      [correo, hash, telefono || null]
    );
 
    const id_cliente = result.insertId;
 
    // Crear JWT
    const token = jwt.sign(
      { id_cliente, correo },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
 
    const response = NextResponse.json({
      ok: true,
      cliente: { id_cliente, correo, telefono }
    }, { status: 201 });
 
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });
 
    return response;
 
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}