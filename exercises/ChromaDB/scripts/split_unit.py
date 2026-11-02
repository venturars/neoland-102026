from settings import MERGE_MAX, SPLIT_ABOVE


def split_unit(text: str) -> list[str]:
    if text.strip() == "":
        raise RuntimeError("Cannot split an empty text")

    if len(text) <= SPLIT_ABOVE:
        return [text]

    # Bloques separados por una línea en blanco.
    # Un bloque de código nunca se corta.
    blocks = []
    block_lines = []
    in_code = False
    for line in text.split("\n"):
        if line.strip().startswith("```"):
            in_code = not in_code
        if line == "" and not in_code:
            if len(block_lines) > 0:
                blocks.append("\n".join(block_lines))
            block_lines = []
            continue
        block_lines.append(line)
    if len(block_lines) > 0:
        blocks.append("\n".join(block_lines))

    pieces = []
    piece = ""
    for block in blocks:
        if piece != "" and len(piece) + len(block) + 2 > MERGE_MAX:
            pieces.append(piece)
            piece = ""
        if piece == "":
            piece = block
        else:
            piece = piece + "\n\n" + block
    if piece != "":
        pieces.append(piece)
    return pieces
