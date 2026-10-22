"""Comprueba rutas genéricas y anonimización de antecedentes."""
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]

def test_generic_paths():
    lines = (ROOT/'README.md').read_text(encoding='utf-8').splitlines()
    assert [line for line in lines if line.startswith('cd staff/')] == ['cd staff/<usuario>/asistenciapp'] * 2

def test_no_inherited_personal_references():
    for folder in [ROOT, ROOT/'specs']:
        files = folder.glob('*.md') if folder == ROOT else folder.rglob('*.md')
        for file in files:
            if '004-quitar-referencias-personales' in file.parts:
                continue
            assert 'victor' not in file.read_text(encoding='utf-8').lower(), str(file)

def test_historical_results_preserved():
    text = (ROOT/'specs/001-checkin-codigo/tasks.md').read_text(encoding='utf-8')
    for expected in ['2026-10-20: registro correcto desde un móvil con datos móviles.', '2026-10-20: el panel se abre directamente.', '2026-10-20: dos columnas y tildes correctas.', '2026-10-20: pasos 1–5 correctos.']:
        assert expected in text
    spec = (ROOT/'specs/001-checkin-codigo/spec.md').read_text(encoding='utf-8')
    assert 'Todas resueltas el 2026-10-19: las propuestas quedaron aceptadas.' in spec
    assert 'se detecta que un alumno puede registrar a compañeros ausentes con otros nombres' in spec
