import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;
  // Reenviar al backend real
  const params = new URLSearchParams();
  params.append('email', email);
  params.append('password', password);
  const res = await fetch('http://localhost:8000/iniciar-sesion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString()
  });
  const data = await res.json();
  if (!res.ok) {
    // Always return error as { detail: ... }
    let errorDetail = typeof data === "string" ? data : data.detail || "Error al iniciar sesión";
    return NextResponse.json({ detail: errorDetail }, { status: res.status });
  }
  return NextResponse.json(data);
}
