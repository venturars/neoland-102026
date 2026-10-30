from pathlib import Path

from bs4 import BeautifulSoup

from convert_block import convert_block
from settings import CHANGELOG_PAGE, CHANGELOG_RELEASES, VERSION


def convert_changelog(html_dir: Path) -> str:
    html_path = html_dir / CHANGELOG_PAGE
    if not html_path.is_file():
        raise RuntimeError(f"Docs page not found: {CHANGELOG_PAGE}")

    soup = BeautifulSoup(html_path.read_text(encoding="utf-8"), "lxml")
    changelog = soup.select_one("div.body section#changelog")
    if changelog is None:
        raise RuntimeError("Changelog section not found")

    releases = []
    for release in changelog.find_all("section", recursive=False):
        title = release.find("h2").get_text().replace("¶", "").strip()
        if any(title.startswith(prefix) for prefix in CHANGELOG_RELEASES):
            releases.append(convert_block(release, 1))
    if len(releases) == 0:
        raise RuntimeError(
            f"No Python {VERSION} releases found in the changelog"
        )

    front_matter = [
        "---",
        f"page: {CHANGELOG_PAGE}",
        "title: Changelog",
        "area: whatsnew",
        "kind: changelog",
        "---",
    ]
    markdown = (
        "\n".join(front_matter)
        + "\n\n# Changelog\n\n"
        + "\n\n".join(releases)
        + "\n"
    )
    return markdown
