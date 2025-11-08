'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function RedirectCompraDetalle() {
  const router = useRouter();
  const params = useParams();
  useEffect(() => {
    // Redirige al layout unificado. Podrías pasar un query ?focus=<id> si luego quieres auto-seleccionar.
    router.replace('/compras');
  }, [router, params]);
  return null;
}
