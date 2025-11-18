#!/usr/bin/env bash
set -euo pipefail

# Resolve the project root based on this script location.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [[ $# -lt 1 ]]; then
  echo "Uso: $0 <archivo_streamlit.py> [opciones-de-streamlit]" >&2
  exit 1
fi

APP="$1"
shift

cd "$PROJECT_ROOT"

# Asegurarse de que las dependencias estén sincronizadas antes de correr.
uv sync

# Ejecutar Streamlit dentro del entorno uv.
uv run streamlit run "$APP" "$@"
