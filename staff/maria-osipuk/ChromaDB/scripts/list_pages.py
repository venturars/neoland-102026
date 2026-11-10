import json
from pathlib import Path

from settings import AREAS, EXTRA_PAGES


def list_pages(html_dir: Path) -> list[str]:
    if not html_dir.is_dir():
        raise RuntimeError(f"Docs folder not found: {html_dir}")

    # Páginas que se movieron: su HTML solo redirige a la página nueva
    redirects_path = html_dir / "_rediraffe_redirected.json"
    redirects = []
    if redirects_path.is_file():
        redirects_data = json.loads(redirects_path.read_text(encoding="utf-8"))
        redirects = [source.replace(".rst", ".html") for source in redirects_data]

    pages = []
    for area in AREAS:
        area_dir = html_dir / area
        if not area_dir.is_dir():
            raise RuntimeError(f"Docs area not found: {area_dir}")
        for html_path in area_dir.rglob("*.html"):
            page = html_path.relative_to(html_dir).as_posix()
            # El index.html de cada área es un índice de enlaces o repite otras páginas
            if page == f"{area}/index.html":
                continue
            if page in redirects:
                continue
            pages.append(page)

    for page in EXTRA_PAGES:
        if not (html_dir / page).is_file():
            raise RuntimeError(f"Docs page not found: {page}")
        pages.append(page)

    pages.sort()
    return pages
