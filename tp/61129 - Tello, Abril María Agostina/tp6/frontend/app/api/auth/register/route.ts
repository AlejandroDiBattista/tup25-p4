import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Dummy handler for /api/auth/register
  return NextResponse.json({ ok: true });
}
