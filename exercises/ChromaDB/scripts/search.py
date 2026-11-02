import argparse
import sys

from search_docs import search_docs
from settings import VERSION


def search() -> None:
    docs_name = "Python docs"
    if VERSION != "":
        docs_name = f"Python {VERSION} docs"
    parser = argparse.ArgumentParser(
        description=f"Search the {docs_name} by meaning."
    )
    parser.add_argument(
        "question", help="What you are looking for, in English"
    )
    parser.add_argument(
        "-n", type=int, default=5, help="Number of results (default 5)"
    )
    parser.add_argument(
        "--area",
        help="Only this docs area: library, c-api, reference, tutorial...",
    )
    parser.add_argument(
        "--module", help="Only this module: pathlib, json, asyncio..."
    )
    parser.add_argument(
        "--kind",
        help="Only this kind: api, guide, whatsnew, changelog, deprecation",
    )
    args = parser.parse_args()

    # La consola de Windows no imprime esta documentación sin UTF-8.
    sys.stdout.reconfigure(encoding="utf-8")

    results = search_docs(
        args.question, args.n, args.area, args.module, args.kind
    )
    if len(results) == 0:
        print("No results. Try without filters.")
        return

    for position, result in enumerate(results, start=1):
        metadata = result["metadata"]
        source = metadata["page"]
        if "anchor" in metadata:
            source = f"{source}#{metadata['anchor']}"
        print(f"===== [{position}] distance {result['distance']:.3f}")
        print(f"source: {source}")
        print()
        print(result["text"])
        print()


if __name__ == "__main__":
    search()
