import { NextResponse } from 'next/server';
import { getResultado } from '@/lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const nro = Number(searchParams.get('nro'));
  const res = JSON.parse(searchParams.get('respuestas'));

  const resultado = getResultado(nro, res);
  return NextResponse.json({ resultado });
}
