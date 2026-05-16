import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  const isAdminRoute = pathname.startsWith('/admin');
  const isUserRoute = pathname.startsWith('/mis-citas');

  // Sin token → bloquear rutas protegidas
  if (!token && (isAdminRoute || isUserRoute)) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const payload = jwt.verify(token!, process.env.JWT_SECRET!) as any;

    const role = payload.role;

    // 🔒 ADMIN ROUTES
    if (isAdminRoute && role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // 🔒 USER ROUTES (solo cliente o admin)
    if (isUserRoute && role !== 'cliente' && role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/mis-citas/:path*'],
};