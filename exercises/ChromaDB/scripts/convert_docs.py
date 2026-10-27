import shutil

from bs4 import BeautifulSoup

from convert_block import convert_block
from convert_changelog import convert_changelog
from convert_page import convert_page
from list_pages import list_pages
from settings import CHANGELOG_PAGE, HTML_DIR, LICENSE_PAGES, MD_DIR


def convert_docs() -> None:
    pages = list_pages(HTML_DIR)

    # Se borra la carpeta para que no queden páginas que ya no existen
    if MD_DIR.exists():
        shutil.rmtree(MD_DIR)

    for page in pages:
        md_path = MD_DIR / page.replace(".html", ".md")
        md_path.parent.mkdir(parents=True, exist_ok=True)
        md_path.write_text(convert_page(HTML_DIR, page), encoding="utf-8", newline="\n")

    changelog_path = MD_DIR / CHANGELOG_PAGE.replace(".html", ".md")
    changelog_path.parent.mkdir(parents=True, exist_ok=True)
    changelog_path.write_text(convert_changelog(HTML_DIR), encoding="utf-8", newline="\n")

    notices = ["# License\n\nThis folder is generated from the official Python 3.15 documentation."]
    for page in LICENSE_PAGES:
        soup = BeautifulSoup((HTML_DIR / page).read_text(encoding="utf-8"), "lxml")
        notices.append(convert_block(soup.select_one("div.body"), 1))
    (MD_DIR / "LICENSE.md").write_text("\n\n".join(notices) + "\n", encoding="utf-8", newline="\n")

    md_files = list(MD_DIR.rglob("*.md"))
    size = sum(md_file.stat().st_size for md_file in md_files)
    print(f"Pages converted: {len(md_files)}")
    print(f"Size: {size / 1024 / 1024:.1f} MB")


if __name__ == "__main__":
    convert_docs()
