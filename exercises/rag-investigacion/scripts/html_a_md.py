"""Convierte a Markdown el HTML de Sphinx (div.body).

Uso:  uv run --no-project --with markdownify --with beautifulsoup4 python -I scripts/html_a_md.py ORIGEN_HTML DESTINO_MD
Omite índices y páginas de navegación (SKIP) y las carpetas que empiezan por «_».
"""
import sys, pathlib, re
from bs4 import BeautifulSoup
from markdownify import MarkdownConverter

SRC = pathlib.Path(sys.argv[1]); DST = pathlib.Path(sys.argv[2])
SKIP = re.compile(r'^(genindex.*|py-modindex|search|404|improve-page.*|download|contents)\.html$')

class C(MarkdownConverter):
    def convert_pre(self, el, text, parent_tags=None, **kw):
        code = el.get_text()
        lang = "python" if ("highlight-python" in " ".join(el.parent.get("class", [])) or "highlight-pycon" in " ".join(el.parent.get("class", []))) else ""
        return f"\n```{lang}\n{code.rstrip()}\n```\n\n"

ok = skipped = failed = 0
for f in sorted(SRC.rglob("*.html")):
    rel = f.relative_to(SRC)
    if SKIP.match(f.name) or rel.parts[0].startswith("_"):
        skipped += 1; continue
    try:
        soup = BeautifulSoup(f.read_text(encoding="utf-8"), "html.parser")
        body = soup.select_one("div.body") or soup.select_one("main")
        if body is None: raise ValueError("sin cuerpo")
        for t in body.select("a.headerlink, script, style"): t.decompose()
        md = C(heading_style="ATX", bullets="-").convert_soup(body)
        md = re.sub(r"\n{3,}", "\n\n", md).strip() + "\n"
        out = DST / rel.with_suffix(".md"); out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(md, encoding="utf-8"); ok += 1
    except Exception as e:
        failed += 1; print("FALLO", rel, e)
print(f"convertidos={ok} omitidos={skipped} fallos={failed}")
