import { Suspense } from 'react';
import PaginaAlumnos from '@/features/alumnnos';

export default function Page() {
  return (
    <Suspense fallback={<div>Cargando parámetros…</div>}>
      <PaginaAlumnos />
    </Suspense>
  );
}