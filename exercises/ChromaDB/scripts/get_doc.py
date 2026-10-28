import argparse
import sys

from find_doc import find_doc
from settings import VERSION


def get_doc() -> None:
    docs_name = "Python docs"
    if VERSION != "":
        docs_name = f"Python {VERSION} docs"
    parser = argparse.ArgumentParser(description=f"Get the {docs_name} of an exact name.")
    parser.add_argument("name", help="Full name: pathlib.Path.read_text, c.PyList_New, cmdoption-c, term-generator...")
    args = parser.parse_args()

    # La documentación tiene caracteres que la consola de Windows no imprime sin UTF-8
    sys.stdout.reconfigure(encoding="utf-8")

    results = find_doc(args.name)
    if len(results) == 0:
        print(f"{args.name}: not found in {docs_name}")
        sys.exit(1)

    for result in results:
        print(f"===== source: {result['metadata']['page']}#{args.name}")
        print()
        print(result["text"])
        print()


if __name__ == "__main__":
    get_doc()
