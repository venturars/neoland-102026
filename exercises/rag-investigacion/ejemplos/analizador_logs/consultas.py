"""Consulta el RAG para cada decisión de API del analizador de logs y guarda los chunks devueltos."""
import json
import sys
from pathlib import Path

RAIZ = Path(sys.argv[1])
SALIDA = Path(sys.argv[2])
sys.path.insert(0, str(RAIZ / "scripts"))

from consultar_rag import ConsultorRAG  # noqa: E402

CONSULTAS = [
    ("taskgroup", "How do I run several coroutines concurrently and wait for all of them with asyncio.TaskGroup?", "asyncio"),
    ("taskgroup_error", "What happens to the other tasks when a task in an asyncio.TaskGroup raises an exception?", "asyncio"),
    ("timeout", "How do I apply a timeout to a block of code with asyncio.timeout?", "asyncio"),
    ("to_thread", "How do I run a blocking function in a separate thread from asyncio?", "asyncio"),
    ("tomllib", "How do I read and parse a TOML configuration file?", "tomllib"),
    ("except_star", "How do I handle exceptions from an ExceptionGroup with except*?", None),
    ("quantiles", "How do I compute percentiles or quantiles of a list of numbers?", "statistics"),
    ("counter", "How do I count occurrences and get the most common elements?", "collections"),
    ("re_named", "How do I use named groups in a regular expression and get them as a dict?", "re"),
]

consultor = ConsultorRAG.local()
resultado = {}
for clave, pregunta, modulo in CONSULTAS:
    filtros = {"modulo": modulo} if modulo else None
    chunks = consultor.consultar(pregunta, filtros=filtros)
    resultado[clave] = {
        "pregunta": pregunta,
        "filtro": modulo,
        "chunks": [
            {"fuente": c["fuente"], "score": round(c["score_reranking"], 2), "filtrado": c.get("filtrado"),
             "texto": c["texto"]}
            for c in chunks
        ],
    }
    print(f"{clave:16} filtro={modulo!s:12} -> " + ", ".join(f'{c["fuente"]}({c["score_reranking"]:.1f})' for c in chunks))

SALIDA.write_text(json.dumps(resultado, ensure_ascii=False, indent=1), encoding="utf-8")
