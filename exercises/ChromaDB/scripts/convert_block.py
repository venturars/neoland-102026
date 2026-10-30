import re

from bs4 import Comment, NavigableString, Tag

from convert_inline import convert_inline

HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"]
BLOCKS = [
    "p",
    "div",
    "pre",
    "ul",
    "ol",
    "dl",
    "table",
    "section",
    "blockquote",
    "aside",
    "figure",
    "img",
] + HEADINGS
# Primera clase de un <dl> de Sphinx: función, clase u opción.
DEFINITION_DOMAINS = ["py", "c", "cpp", "js", "std"]
CODE_LANGUAGES = {
    "python3": "python",
    "py": "python",
    "default": "",
    "none": "",
    "text": "",
}


def convert_block(element: Tag | NavigableString, level: int) -> str:
    if isinstance(element, Comment):
        return ""
    if isinstance(element, NavigableString):
        return re.sub(r"\s+", " ", str(element)).strip()

    name = element.name
    classes = element.get("class") or []

    if name in ["script", "style", "hr"] or "headerlink" in classes:
        return ""

    if name == "section":
        heading = element.find(HEADINGS, recursive=False)
        if heading is None:
            parts = [convert_block(child, level) for child in element.children]
            return "\n\n".join(part for part in parts if part != "")
        heading_level = int(heading.name[1])
        title = convert_inline(heading).strip()
        parts = [
            (
                f"<!-- anchor: {element.get('id', '')} | type: section -->\n"
                f"{'#' * heading_level} {title}"
            )
        ]
        for child in element.children:
            if child is heading:
                continue
            parts.append(convert_block(child, heading_level))
        return "\n\n".join(part for part in parts if part != "")

    if name in HEADINGS:
        return f"{'#' * int(name[1])} {convert_inline(element).strip()}"

    if name == "p":
        text = convert_inline(element).strip()
        if "rubric" in classes and text != "":
            return f"**{text}**"
        return text

    if (
        name == "div"
        and len(classes) > 0
        and classes[0].startswith("highlight-")
    ):
        language = classes[0].removeprefix("highlight-")
        language = CODE_LANGUAGES.get(language, language)
        code = element.find("pre").get_text().rstrip("\n")
        return f"```{language}\n{code}\n```"

    if name == "pre":
        return f"```\n{element.get_text().rstrip(chr(10))}\n```"

    if name == "img":
        alt = element.get("alt", "").strip()
        if alt == "":
            return ""
        return f"[Image: {alt}]"

    if name in ["ul", "ol"]:
        items = []
        number = 1
        for item in element.find_all("li", recursive=False):
            prefix = "- "
            if name == "ol":
                prefix = f"{number}. "
                number = number + 1
            content = convert_block(item, level)
            lines = content.split("\n")
            indent = " " * len(prefix)
            item_lines = [prefix + lines[0]]
            for line in lines[1:]:
                if line == "":
                    item_lines.append("")
                else:
                    item_lines.append(indent + line)
            items.append("\n".join(item_lines))
        return "\n\n".join(items)

    if name == "dl" and len(classes) >= 2 and classes[0] in DEFINITION_DOMAINS:
        definition_level = min(level + 1, 6)
        signatures = []
        anchor = ""
        for term in element.find_all("dt", recursive=False):
            signature = (
                re.sub(r"\s+", " ", term.get_text()).replace("¶", "").strip()
            )
            signatures.append(signature)
            if anchor == "" and term.get("id"):
                anchor = term.get("id")
        parts = [
            (
                "<!-- anchor: "
                f"{anchor} | type: {classes[0]} {classes[1]} -->\n"
                f"{'#' * definition_level} `{signatures[0]}`"
            )
        ]
        for signature in signatures[1:]:
            parts.append(f"`{signature}`")
        description = element.find("dd", recursive=False)
        if description is not None:
            parts.append(convert_block(description, definition_level))
        return "\n\n".join(part for part in parts if part != "")

    if name == "dl" and "glossary" in classes:
        term_level = min(level + 1, 6)
        parts = []
        for child in element.find_all(["dt", "dd"], recursive=False):
            if child.name == "dt":
                term = convert_inline(child).strip()
                parts.append(
                    (
                        "<!-- anchor: "
                        f"{child.get('id', '')} | type: std term -->\n"
                        f"{'#' * term_level} {term}"
                    )
                )
            else:
                parts.append(convert_block(child, term_level))
        return "\n\n".join(part for part in parts if part != "")

    if name == "dl":
        parts = []
        for child in element.find_all(["dt", "dd"], recursive=False):
            if child.name == "dt":
                parts.append(f"**{convert_inline(child).strip()}**")
            else:
                parts.append(convert_block(child, level))
        return "\n\n".join(part for part in parts if part != "")

    if name == "table":
        rows = []
        for row in element.find_all("tr"):
            cells = []
            for cell in row.find_all(["th", "td"], recursive=False):
                cell_text = " ".join(convert_block(cell, level).split())
                # En una celda, la definición se queda con el nombre.
                cell_text = re.sub(
                    r"<!-- anchor: .*? -->\s*#+ ", "", cell_text
                )
                cells.append(cell_text.replace("|", "\\|"))
            rows.append(cells)
        if len(rows) == 0:
            return ""
        has_spans = element.find(attrs={"rowspan": True}) or element.find(
            attrs={"colspan": True}
        )
        same_width = all(len(row) == len(rows[0]) for row in rows)
        caption = element.find("caption")
        lines = []
        if caption is not None:
            lines.append(f"**{convert_inline(caption).strip()}**")
            lines.append("")
        if has_spans or not same_width:
            # Una tabla con celdas combinadas no cabe en Markdown.
            for row in rows:
                lines.append("- " + " | ".join(row))
            return "\n".join(lines)
        lines.append("| " + " | ".join(rows[0]) + " |")
        lines.append("|" + " --- |" * len(rows[0]))
        for row in rows[1:]:
            lines.append("| " + " | ".join(row) + " |")
        return "\n".join(lines)

    if name == "div" and "admonition" in classes:
        parts = []
        for child in element.children:
            if isinstance(child, Tag) and "admonition-title" in (
                child.get("class") or []
            ):
                parts.append(f"**{convert_inline(child).strip()}:**")
                continue
            parts.append(convert_block(child, level))
        return "\n\n".join(part for part in parts if part != "")

    if element.find(BLOCKS) is None:
        return convert_inline(element).strip()

    # Contenedor (div, li, dd, td): el texto seguido forma un párrafo.
    parts = []
    inline_text = ""
    for child in element.children:
        is_block = isinstance(child, Tag) and (
            child.name in BLOCKS or child.find(BLOCKS) is not None
        )
        if not is_block:
            inline_text = inline_text + convert_inline(child)
            continue
        if inline_text.strip() != "":
            parts.append(inline_text.strip())
        inline_text = ""
        parts.append(convert_block(child, level))
    if inline_text.strip() != "":
        parts.append(inline_text.strip())
    return "\n\n".join(part for part in parts if part != "")
