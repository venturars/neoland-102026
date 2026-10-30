import argparse
import shutil
import tempfile
import urllib.error
import urllib.request
import zipfile
from pathlib import Path

from settings import MD_DIR, PROJECT_DIR

DOCS_DIR = PROJECT_DIR / "python-docs"


def download_docs() -> None:
    parser = argparse.ArgumentParser(
        description="Download the official Python HTML docs for one version."
    )
    parser.add_argument("version", help="Docs version, like 3.15 or 3.14")
    args = parser.parse_args()
    version = args.version.strip()

    parts = version.split(".")
    if len(parts) != 2 or not parts[0].isdigit() or not parts[1].isdigit():
        raise RuntimeError("Version must look like 3.15 or 3.14")

    # docs.python.org publica un zip por versión (3.15), no por parche (3.15.2)
    url = f"https://docs.python.org/{version}/archives/python-{version}-docs-html.zip"
    html_dir = DOCS_DIR / f"python-{version}-docs-html"
    archive_path = DOCS_DIR / "_download.zip"
    DOCS_DIR.mkdir(parents=True, exist_ok=True)

    # Sin User-Agent el servidor responde 403
    print(f"Downloading {url}")
    request = urllib.request.Request(
        url, headers={"User-Agent": "Mozilla/5.0"}
    )
    try:
        try:
            with urllib.request.urlopen(request, timeout=120) as response:
                archive_path.write_bytes(response.read())
        except urllib.error.HTTPError as error:
            if error.code == 404:
                raise RuntimeError(
                    f"Python {version} docs were not found. "
                    "Use a version like 3.15 or 3.14"
                )
            raise RuntimeError(
                "Could not download the Python "
                f"{version} docs: HTTP {error.code}"
            )
        except urllib.error.URLError:
            raise RuntimeError(
                "Could not download the Python docs. "
                "Check the connection and try again"
            )
        except TimeoutError:
            raise RuntimeError(
                "The download timed out. Check the connection and try again"
            )

        with zipfile.ZipFile(archive_path) as zip_file:
            for info in zip_file.infolist():
                name = Path(info.filename)
                if (
                    info.filename.startswith("/")
                    or info.filename.startswith("\\")
                    or ".." in name.parts
                ):
                    raise RuntimeError(
                        f"Unsafe path in the docs archive: {info.filename}"
                    )
            with tempfile.TemporaryDirectory() as tmp:
                tmp_dir = Path(tmp)
                zip_file.extractall(tmp_dir)
                extracted = tmp_dir / html_dir.name
                if not extracted.is_dir():
                    raise RuntimeError(
                        "Docs folder not found in the archive: "
                        f"{html_dir.name}"
                    )
                for old in DOCS_DIR.glob("python-*-docs-html"):
                    if old.is_dir():
                        shutil.rmtree(old)
                shutil.move(extracted, html_dir)
    finally:
        if archive_path.exists():
            archive_path.unlink()

    version_file = DOCS_DIR / "version.txt"
    version_file.write_text(version + "\n", encoding="utf-8", newline="\n")
    # El Markdown anterior sería de otra versión
    if MD_DIR.exists():
        shutil.rmtree(MD_DIR)

    print(f"Saved {html_dir}")
    print("Next: python scripts/convert_docs.py")


if __name__ == "__main__":
    download_docs()
