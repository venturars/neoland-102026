from pathlib import Path

from merge_units import merge_units
from read_units import read_units
from settings import VERSION
from split_unit import split_unit

GUIDE_TYPES = ["section", "std term"]


def split_doc(md_path: Path) -> list[dict]:
    if not md_path.is_file():
        raise RuntimeError(f"Markdown file not found: {md_path}")

    units = read_units(md_path)
    groups = merge_units(units)

    chunks = []
    used_ids = {}
    for group in groups:
        first = group[0]
        page_info = first["page_info"]
        breadcrumb = " > ".join(
            title.replace("`", "") for title in first["breadcrumb"]
        )
        body = "\n\n".join(
            (unit["heading"] + "\n\n" + unit["content"]).strip()
            for unit in group
        )
        anchors = [unit["anchor"] for unit in group if unit["anchor"] != ""]
        symbols = [
            unit["anchor"]
            for unit in group
            if unit["type"] not in GUIDE_TYPES and unit["anchor"] != ""
        ]

        kind = page_info["kind"]
        if kind == "guide" and first["type"] not in GUIDE_TYPES:
            kind = "api"

        metadata = {
            "page": page_info["page"],
            "area": page_info["area"],
            "kind": kind,
            "breadcrumb": breadcrumb,
            "version": VERSION,
        }
        if first["anchor"] != "":
            metadata["anchor"] = first["anchor"]
        if len(anchors) > 0:
            metadata["anchors"] = anchors
        if len(symbols) > 0:
            metadata["symbols"] = symbols
        if "module" in page_info:
            metadata["module"] = page_info["module"]
        if "removal_version" in page_info:
            metadata["removal_version"] = page_info["removal_version"]
        # En el changelog, el segundo título es la release.
        if kind == "changelog" and len(first["breadcrumb"]) > 1:
            metadata["release"] = first["breadcrumb"][1]

        for piece in split_unit(body):
            # El id es estable: página, ancla y número de parte.
            key = f"{page_info['page']}#{first['anchor']}"
            number = used_ids.get(key, 0)
            used_ids[key] = number + 1
            chunks.append(
                {
                    "id": f"{key}:{number}",
                    "text": breadcrumb + "\n\n" + piece,
                    "metadata": metadata,
                }
            )
    return chunks
