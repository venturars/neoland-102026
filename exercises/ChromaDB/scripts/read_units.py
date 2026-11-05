import re
from pathlib import Path

ANCHOR_LINE = re.compile(r"^<!-- anchor: (.*?) \| type: (.*?) -->$")
HEADING_LINE = re.compile(r"^(#{1,6}) (.*)$")


def read_units(md_path: Path) -> list[dict]:
    if not md_path.is_file():
        raise RuntimeError(f"Markdown file not found: {md_path}")

    lines = md_path.read_text(encoding="utf-8").splitlines()
    if len(lines) == 0 or lines[0] != "---":
        raise RuntimeError(f"Markdown file has no front matter: {md_path}")

    page_info = {}
    position = 1
    while lines[position] != "---":
        key, value = lines[position].split(": ", 1)
        page_info[key] = value
        position = position + 1

    units = []
    # Pila de títulos abiertos: sirve para saber el padre y las migas de pan
    open_units = []
    anchor = ""
    unit_type = ""
    in_code = False
    for line in lines[position + 1 :]:
        if line.strip().startswith("```"):
            in_code = not in_code
        anchor_match = None
        heading_match = None
        if not in_code:
            anchor_match = ANCHOR_LINE.match(line)
            heading_match = HEADING_LINE.match(line)

        if anchor_match:
            anchor = anchor_match.group(1)
            unit_type = anchor_match.group(2)
            continue

        if heading_match:
            level = len(heading_match.group(1))
            while len(open_units) > 0 and open_units[-1]["level"] >= level:
                open_units.pop()
            parent = None
            if len(open_units) > 0:
                parent = open_units[-1]["index"]
            title = heading_match.group(2)
            breadcrumb = [unit["title"] for unit in open_units] + [title]
            if unit_type == "":
                unit_type = "section"
            unit = {
                "index": len(units),
                "page": page_info["page"],
                "page_info": page_info,
                "level": level,
                "title": title,
                "heading": line,
                "anchor": anchor,
                "type": unit_type,
                "parent": parent,
                "breadcrumb": breadcrumb,
                "lines": [],
            }
            units.append(unit)
            open_units.append(unit)
            anchor = ""
            unit_type = ""
            continue

        if len(units) > 0:
            units[-1]["lines"].append(line)

    for unit in units:
        unit["content"] = "\n".join(unit["lines"]).strip()
        del unit["lines"]
        # Si no tiene ancla propia, usa la de su padre
        if unit["anchor"] == "" and unit["parent"] is not None:
            unit["anchor"] = units[unit["parent"]]["anchor"]

    # Una sección sin texto propio sobra: su título ya va en las migas de pan.
    # Una definición sin texto se queda: su firma ya es información.
    units = [
        unit
        for unit in units
        if unit["content"] != "" or unit["type"] not in ["section", "std term"]
    ]
    return units
