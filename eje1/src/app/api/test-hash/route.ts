// src/app/api/test-hash/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function GET() {
  const hash = await bcrypt.hash('admin123', 10);

  return NextResponse.json({ hash });
}