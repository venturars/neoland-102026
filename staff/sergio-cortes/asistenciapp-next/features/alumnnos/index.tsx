'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Session = { title: string; open: boolean; error?: string };

export default function PaginaAlumnos() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("s");
  console.log('sessionId', sessionId);
  const [data, setData] = useState<Session | null>(null);
  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/s/${encodeURIComponent(sessionId)}`)
      .then((r) => r.json())
      .then(setData);
  }, [sessionId]);
  return <div>{data?.title || 'Cargando...'}</div>;
}