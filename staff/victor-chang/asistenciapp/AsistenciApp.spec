# Receta de PyInstaller para la app de escritorio (spec 007 · plan v1.1 §2.11, tarea T14).
#
# Uso (desde esta carpeta, con el entorno activado):
#   ASISTENCIA_BUILD_CLOUDFLARED=/ruta/a/cloudflared \
#   ASISTENCIA_BUILD_GOOGLE_CLIENT=/ruta/a/google-client.json \
#   pyinstaller AsistenciApp.spec --noconfirm
#
# - ASISTENCIA_BUILD_CLOUDFLARED (obligatoria): el cloudflared que va dentro de la app, ya comprobado
#   (plan §2.11). En Windows, `cloudflared.exe`: la app lo busca con ese nombre (config.py).
# - ASISTENCIA_BUILD_GOOGLE_CLIENT (opcional): la llave de Google compartida (plan §2.8). Nunca está en
#   git: en las versiones publicadas llega del secreto de Actions. Sin ella, la app no tiene modo Meet.
#
# Resultado en dist/: `AsistenciApp.app` en macOS, la carpeta `AsistenciApp/` con `AsistenciApp.exe` en
# Windows. --onedir y no --onefile: --onefile se descomprime en cada arranque (plan §2.11).

import os
import re
import sys
from pathlib import Path

ROOT = Path(SPECPATH)  # noqa: F821 — SPECPATH lo pone PyInstaller
VERSION = re.search(r'__version__ = "([^"]+)"', (ROOT / "attendance" / "__init__.py").read_text()).group(1)
# El icono "A_" (icono/icono.html; se regenera con scripts/generar_icono.py).
ICON = ROOT / "icono" / ("AsistenciApp.icns" if sys.platform == "darwin" else "AsistenciApp.ico")

cloudflared = os.environ.get("ASISTENCIA_BUILD_CLOUDFLARED", "")
if not cloudflared or not Path(cloudflared).is_file():
    sys.exit("Falta ASISTENCIA_BUILD_CLOUDFLARED: la ruta al cloudflared que va dentro de la app.")

datas = [(str(ROOT / "static"), "static")]
google_client = os.environ.get("ASISTENCIA_BUILD_GOOGLE_CLIENT", "")
if google_client:
    if Path(google_client).name != "google-client.json":
        sys.exit("ASISTENCIA_BUILD_GOOGLE_CLIENT debe llamarse google-client.json.")
    datas.append((google_client, "."))  # junto a la app: config.py la busca con ese nombre
else:
    print("AVISO: sin ASISTENCIA_BUILD_GOOGLE_CLIENT, esta app no podrá tomar asistencia de Meet.")

a = Analysis(  # noqa: F821
    [str(ROOT / "app.py")],
    pathex=[str(ROOT)],
    binaries=[(cloudflared, ".")],
    datas=datas,
    # Herramientas de desarrollo y lo que la app no usa: menos peso (requisito: < 100 MB).
    excludes=["tkinter", "pytest", "_pytest", "mypy", "ruff", "PyInstaller"],
)
pyz = PYZ(a.pure)  # noqa: F821
exe = EXE(  # noqa: F821
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="AsistenciApp",
    console=False,  # sin terminal (spec 007 · HU-01)
    icon=str(ICON),
)
coll = COLLECT(exe, a.binaries, a.datas, name="AsistenciApp")  # noqa: F821

if sys.platform == "darwin":
    app = BUNDLE(  # noqa: F821
        coll,
        name="AsistenciApp.app",
        icon=str(ICON),
        bundle_identifier="io.github.changvictor.asistenciapp",
        version=VERSION,
        info_plist={
            "CFBundleDisplayName": "AsistenciApp",
            "CFBundleShortVersionString": VERSION,
            "NSHighResolutionCapable": True,
            "LSMinimumSystemVersion": "14.0",  # spec 007 §5: macOS 14 o posterior
        },
    )
