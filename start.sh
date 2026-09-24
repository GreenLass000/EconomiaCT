#!/usr/bin/env bash

set -Eeuo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/flask_app"
FRONTEND_DIR="$ROOT_DIR/react_app"

if [[ -s "$HOME/.nvm/nvm.sh" ]]; then
  # shellcheck disable=SC1090
  source "$HOME/.nvm/nvm.sh"
  nvm use --silent "$(tr -d '\r\n' < "$FRONTEND_DIR/.nvmrc")"
fi

command -v python3 >/dev/null || { echo "No se encontró python3." >&2; exit 1; }
command -v node >/dev/null || { echo "No se encontró Node.js." >&2; exit 1; }
command -v npm >/dev/null || { echo "No se encontró npm." >&2; exit 1; }
node -e 'if (Number(process.versions.node.split(".")[0]) !== 24) process.exit(1)' || {
  echo "EconomiaCT necesita Node.js 24 LTS. Activa la versión indicada en react_app/.nvmrc." >&2
  exit 1
}

echo "Preparando backend Flask..."
cd "$BACKEND_DIR"
if [[ ! -x .venv/bin/python ]]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
python -m pip install -r requirements.txt

echo "Iniciando Flask en http://localhost:5000"
gnome-terminal -- bash -c "cd '$BACKEND_DIR' && source .venv/bin/activate && python index.py; exec bash"

echo "Preparando frontend Vite..."
cd "$FRONTEND_DIR"
npm ci
npm run build

echo "Sirviendo frontend Vite en http://localhost:3000"
gnome-terminal -- bash -c "cd '$FRONTEND_DIR' && npm run preview; exec bash"
