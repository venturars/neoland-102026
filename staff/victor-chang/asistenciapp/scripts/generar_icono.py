"""Genera el icono de la app de escritorio desde icono/icono.html (spec 007 · T14). Solo en macOS.

Pasos: Chrome sin ventana hace una captura de 1024 px con fondo transparente (`AsistenciApp.png`);
`sips` la reduce a cada tamaño; `iconutil` crea `AsistenciApp.icns` (macOS) y este script escribe
`AsistenciApp.ico` (Windows) con los PNG dentro. Sin dependencias nuevas: Chrome y las herramientas
del sistema. El resultado se sube a git, así que las compilaciones de Actions no necesitan Chrome.

Uso: python scripts/generar_icono.py
"""

import struct
import subprocess
import tempfile
from pathlib import Path

FOLDER = Path(__file__).resolve().parent.parent / "icono"
# Rutas completas: las herramientas del sistema y Chrome, no lo que haya primero en el PATH (S607).
CHROME = Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
SIPS = "/usr/bin/sips"
ICONUTIL = "/usr/bin/iconutil"
# macOS: nombre del archivo del iconset → tamaño en píxeles.
ICONSET = {
    "icon_16x16.png": 16,
    "icon_16x16@2x.png": 32,
    "icon_32x32.png": 32,
    "icon_32x32@2x.png": 64,
    "icon_128x128.png": 128,
    "icon_128x128@2x.png": 256,
    "icon_256x256.png": 256,
    "icon_256x256@2x.png": 512,
    "icon_512x512.png": 512,
    "icon_512x512@2x.png": 1024,
}
ICO_SIZES = (16, 24, 32, 48, 64, 128, 256)


def main() -> None:
    """Genera el PNG grande, el .icns y el .ico en icono/."""
    big = FOLDER / "AsistenciApp.png"
    _screenshot(FOLDER / "icono.html", big)
    with tempfile.TemporaryDirectory() as work:
        iconset = Path(work) / "AsistenciApp.iconset"
        iconset.mkdir()
        for name, size in ICONSET.items():
            _resize(big, size, iconset / name)
        # S603: programa del sistema con argumentos fijos, sin shell.
        subprocess.run([ICONUTIL, "-c", "icns", str(iconset), "-o", str(FOLDER / "AsistenciApp.icns")], check=True)  # noqa: S603
        pngs = []
        for size in ICO_SIZES:
            target = Path(work) / f"{size}.png"
            _resize(big, size, target)
            pngs.append((size, target.read_bytes()))
    (FOLDER / "AsistenciApp.ico").write_bytes(_ico(pngs))
    for name in ("AsistenciApp.png", "AsistenciApp.icns", "AsistenciApp.ico"):
        print(f"  {name}: {(FOLDER / name).stat().st_size // 1024} KB")  # noqa: T201 — herramienta de terminal


def _screenshot(page: Path, target: Path) -> None:
    subprocess.run(  # noqa: S603 — Chrome con argumentos fijos, sin shell
        [
            str(CHROME),
            "--headless",
            "--disable-gpu",
            "--hide-scrollbars",
            "--allow-file-access-from-files",
            "--default-background-color=00000000",
            "--window-size=1024,1024",
            f"--screenshot={target}",
            page.as_uri(),
        ],
        check=True,
        capture_output=True,
    )


def _resize(source: Path, size: int, target: Path) -> None:
    subprocess.run(  # noqa: S603 — programa del sistema con argumentos fijos, sin shell
        [SIPS, "-z", str(size), str(size), str(source), "--out", str(target)], check=True, capture_output=True
    )


def _ico(pngs: list[tuple[int, bytes]]) -> bytes:
    # Formato ICO con PNG dentro (Windows Vista o posterior): cabecera, una entrada por tamaño y los PNG.
    header = struct.pack("<HHH", 0, 1, len(pngs))
    offset = len(header) + 16 * len(pngs)
    entries, data = b"", b""
    for size, png in pngs:
        side = 0 if size >= 256 else size  # 0 significa 256 en una entrada ICO
        entries += struct.pack("<BBBBHHII", side, side, 0, 0, 1, 32, len(png), offset + len(data))
        data += png
    return header + entries + data


if __name__ == "__main__":
    main()
