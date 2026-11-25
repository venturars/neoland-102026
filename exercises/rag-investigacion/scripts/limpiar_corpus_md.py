"""Limpia un corpus Markdown de documentación para un RAG de una sola versión objetivo.

Uso:  uv run --no-project python -I scripts/limpiar_corpus_md.py ORIGEN DESTINO [VERSION]
      VERSION = versión objetivo, por defecto 3.15. Nunca modifica ORIGEN.

Criterios: ver «Criterios de limpieza del corpus» en TAREA_RAG_A_TEMPO.md.
Las listas de ficheros a quitar (REMOVE_FILES) son específicas de la documentación
de Python: adáptalas al corpus nuevo antes de ejecutar.
"""
import sys, pathlib, re, shutil, collections
SRC = pathlib.Path(sys.argv[1]); DST = pathlib.Path(sys.argv[2])
TARGET = tuple(int(x) for x in (sys.argv[3] if len(sys.argv) > 3 else "3.15").split("."))
TARGET_STR = ".".join(map(str, TARGET))
if DST.exists(): shutil.rmtree(DST)

REMOVE_FILES = set()
for p in SRC.rglob("*.md"):
    r = p.relative_to(SRC).as_posix()
    if r.startswith("whatsnew/") and r not in (f"whatsnew/{TARGET_STR}.md", "whatsnew/index.md"): REMOVE_FILES.add(r)
REMOVE_FILES |= {f"howto/{n}.md" for n in ("pyporting","gdb_helpers","instrumentation","perf_profiling","remote_debugging")}
REMOVE_FILES |= {f"using/{n}.md" for n in ("windows","mac","android","ios","editors","configure")}
REMOVE_FILES |= {f"{n}.md" for n in ("about","bugs","copyright","license")}
REMOVE_FILES |= {"distributing/index.md","installing/index.md","deprecations/pending-removal-in-3.13.md","deprecations/pending-removal-in-3.14.md"}

NOTE = re.compile(r'^\s*(Added|New|Changed|Deprecated|Removed) in version (\d+)\.(\d+)|^\s*(Added|Changed) in version (\d+)\.(\d+)')
KEEP_KW = re.compile(r'deprecat|remov|no longer|must|raises', re.I)
LINK = re.compile(r'(?<!!)\[((?:[^\[\]\\]|\\.)*)\]\(((?:https?://|mailto:|#|[\w./-]+\.md)[^()\s]*(?:\([^()]*\)[^()\s]*)*)(?:\s+"(?:[^"\\]|\\.)*")?\)')
stats = collections.Counter()

def old(maj, mi): return (int(maj), int(mi)) < TARGET

def link_sub(m):
    text, dest = m.group(1), m.group(2)
    if dest.startswith("https://docs.python.org") or dest.startswith("http://docs.python.org"):
        stats["enlaces docs.python.org conservados"] += 1; return m.group(0)
    stats["enlaces convertidos a texto"] += 1
    return text

def clean(rel, text):
    in_whatsnew = rel.startswith("whatsnew/") or rel.startswith("deprecations/")
    lines = text.split("\n"); out = []; i = 0; fence = False
    while i < len(lines):
        ln = lines[i]
        if re.match(r"^\s*(:\s+)?```", ln): fence = not fence; out.append(ln); i += 1; continue
        if fence: out.append(ln); i += 1; continue
        # párrafo (hasta línea en blanco)
        if ln.strip():
            if not in_whatsnew:
                m = re.match(r'^\s*(Added|New|Changed) in version (\d+)\.(\d+)', ln)
                if m and old(m.group(2), m.group(3)):
                    j = i
                    while j < len(lines) and lines[j].strip() and not lines[j].lstrip().startswith("```"): j += 1
                    para = "\n".join(lines[i:j])
                    if m.group(1) in ("Added", "New") or not KEEP_KW.search(para):
                        stats["nota %s <objetivo quitada" % ("Added" if m.group(1) in ("Added","New") else "Changed")] += 1
                        i = j; continue
                    stats["nota Changed <objetivo conservada (keyword)"] += 1
            if re.search(r'WebAssembly platforms', ln):
                j = i
                while j < len(lines) and lines[j].strip(): j += 1
                stats["párrafo WebAssembly quitado"] += 1; i = j; continue
            if re.match(r'^\[Availability\]\([^)]*\): not WASI\.\s*$', ln):
                stats["Availability 'not WASI' quitada"] += 1; i += 1; continue
            if ln.startswith("**Source code:**"):
                stats["línea Source code quitada"] += 1; i += 1
                while i < len(lines) and not lines[i].strip(): i += 1
                if i < len(lines) and lines[i].strip() == "---": i += 1
                continue
        out.append(LINK.sub(link_sub, ln)); i += 1
    return re.sub(r'\n{3,}', '\n\n', "\n".join(out)).strip() + "\n"

before = after = 0
for p in sorted(SRC.rglob("*.md")):
    rel = p.relative_to(SRC).as_posix(); t = p.read_text(encoding="utf-8"); before += len(t.encode())
    if rel in REMOVE_FILES: stats["ficheros quitados"] += 1; continue
    c = clean(rel, t); after += len(c.encode())
    o = DST / rel; o.parent.mkdir(parents=True, exist_ok=True); o.write_text(c, encoding="utf-8"); stats["ficheros conservados"] += 1
for k, v in sorted(stats.items()): print(f"{k}: {v}")
print(f"bytes antes={before/1e6:.1f}MB después={after/1e6:.1f}MB ({100*after/before:.0f}%)")
