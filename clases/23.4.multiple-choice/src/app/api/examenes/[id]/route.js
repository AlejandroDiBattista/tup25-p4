import { NextResponse } from 'next/server';
import { getExamen } from '@/lib/db';

export async function GET(req, { params }) {
  const id = Number(params.id);
  
  const examen = getExamen(id);
  return NextResponse.json(examen);
}
