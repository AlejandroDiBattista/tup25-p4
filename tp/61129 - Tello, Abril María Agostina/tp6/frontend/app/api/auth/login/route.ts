import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Dummy handler for /api/auth/login
  return NextResponse.json({ ok: true });
}
