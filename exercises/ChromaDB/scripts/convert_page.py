from pathlib import Path

from bs4 import BeautifulSoup

from convert_block import convert_block
from convert_inline import convert_inline


def convert_page(html_dir: Path, page: str) -> str:
    html_path = html_dir / page
    if not html_path.is_file():
        raise RuntimeError(f"Docs page not found: {page}")

    soup = BeautifulSoup(html_path.read_text(encoding="utf-8"), "lxml")
    body = soup.select_one("div.body")
    if body is None:
        raise RuntimeError(f"Page has no div.body: {page}")
    heading = body.find("h1")
    if heading is None:
        raise RuntimeError(f"Page has no title: {page}")

    title = convert_inline(heading).strip().replace("`", "")
    area = page.split("/")[0].removesuffix(".html")
    name = page.split("/")[-1].removesuffix(".html")

    kind = "guide"
    if page.startswith("deprecations/"):
        kind = "deprecation"
    if page.startswith("whatsnew/"):
        kind = "whatsnew"

    # El módulo sale del id que Sphinx pone a su sección: module-pathlib
    module = ""
    module_section = body.find(
        id=lambda value: value is not None and value.startswith("module-")
    )
    if module_section is not None:
        module = module_section.get("id").removeprefix("module-")

    removal_version = ""
    if "pending-removal-in-" in name:
        removal_version = name.split("pending-removal-in-")[1]

    front_matter = [
        "---",
        f"page: {page}",
        f"title: {title}",
        f"area: {area}",
        f"kind: {kind}",
    ]
    if module != "":
        front_matter.append(f"module: {module}")
    if removal_version != "":
        front_matter.append(f"removal_version: {removal_version}")
    front_matter.append("---")

    markdown = "\n".join(front_matter) + "\n\n" + convert_block(body, 0) + "\n"
    return markdown
