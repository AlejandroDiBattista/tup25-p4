import { NextResponse } from 'next/server';
import { getPregunta } from '@/lib/db';

export async function GET(req, { params }) {
  const id = Number(params.id);
  const pregunta = getPregunta(id);
  return NextResponse.json(pregunta);
}
