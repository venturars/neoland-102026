import time
from collections import Counter

from settings import MD_DIR, MERGE_BELOW, SPLIT_ABOVE
from split_doc import split_doc


def count_chunks() -> None:
    if not MD_DIR.is_dir():
        raise RuntimeError(
            f"Markdown folder not found: {MD_DIR}. Run scripts/convert_docs.py"
        )

    start = time.time()
    md_paths = sorted(
        path for path in MD_DIR.rglob("*.md") if path.name != "LICENSE.md"
    )
    chunks = []
    for md_path in md_paths:
        chunks = chunks + split_doc(md_path)

    ids = [chunk["id"] for chunk in chunks]
    if len(ids) != len(set(ids)):
        raise RuntimeError("Duplicated chunk ids")

    sizes = sorted(len(chunk["text"]) for chunk in chunks)
    areas = Counter(chunk["metadata"]["area"] for chunk in chunks)
    kinds = Counter(chunk["metadata"]["kind"] for chunk in chunks)
    oversized = [chunk for chunk in chunks if len(chunk["text"]) > SPLIT_ABOVE]

    for area, count in areas.most_common():
        print(f"{area:<14}{count:>7}")
    print(f"{'TOTAL':<14}{len(chunks):>7}")
    print(f"Kinds: {dict(kinds.most_common())}")
    print(
        (
            f"Median: {sizes[len(sizes) // 2]}  "
            f"p90: {sizes[len(sizes) * 9 // 10]}  max: {sizes[-1]}"
        )
    )
    print(
        "Below "
        f"{MERGE_BELOW}: {sum(1 for size in sizes if size < MERGE_BELOW)}"
    )
    print(f"Above {SPLIT_ABOVE}: {len(oversized)}")
    for chunk in sorted(
        oversized, key=lambda chunk: len(chunk["text"]), reverse=True
    )[:10]:
        print(f"  {len(chunk['text']):>6}  {chunk['id']}")
    print(f"Time: {time.time() - start:.1f} s")


if __name__ == "__main__":
    count_chunks()
