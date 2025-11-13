import { NextResponse } from 'next/server';
import { getPreguntas } from '@/lib/db';

export async function GET(req) {
  const preguntas = getPreguntas().slice(0, 10); 
  return NextResponse.json(preguntas);
}
