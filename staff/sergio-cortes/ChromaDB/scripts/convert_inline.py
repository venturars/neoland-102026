import re

from bs4 import Comment, NavigableString, Tag


def convert_inline(element: Tag | NavigableString) -> str:
    if isinstance(element, Comment):
        return ""
    if isinstance(element, NavigableString):
        return re.sub(r"\s+", " ", str(element))

    classes = element.get("class") or []
    if "headerlink" in classes:
        return ""
    if element.name == "br":
        return " "
    if element.name == "code" or element.name == "kbd":
        code = re.sub(r"\s+", " ", element.get_text()).strip()
        if code == "":
            return ""
        return f"`{code}`"

    text = "".join(convert_inline(child) for child in element.children)
    if element.name in ["strong", "b"] and text.strip() != "":
        return f"**{text.strip()}**"
    if element.name in ["em", "i"] and text.strip() != "":
        return f"*{text.strip()}*"
    return text
