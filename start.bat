@echo off
setlocal

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%flask_app"
set "FRONTEND_DIR=%ROOT_DIR%react_app"

where python >nul 2>nul || (echo No se encontro Python en PATH.& exit /b 1)
where node >nul 2>nul || (echo No se encontro Node.js en PATH.& exit /b 1)
where npm >nul 2>nul || (echo No se encontro npm en PATH.& exit /b 1)
node -e "if (Number(process.versions.node.split('.')[0]) !== 24) process.exit(1)" || (
  echo EconomiaCT necesita Node.js 24 LTS. Instala/activa Node 24 y vuelve a abrir esta consola.
  exit /b 1
)

echo Preparando backend Flask...
pushd "%BACKEND_DIR%" || exit /b 1
if not exist ".venv\Scripts\python.exe" (
  python -m venv .venv || exit /b 1
)
call .venv\Scripts\activate.bat || exit /b 1
python -m pip install -r requirements.txt || exit /b 1
popd

echo Iniciando Flask en http://localhost:5000
start "EconomiaCT - Backend" cmd /k "cd /d ""%BACKEND_DIR%"" && call .venv\Scripts\activate.bat && python index.py"

echo Instalando dependencias del frontend...
pushd "%FRONTEND_DIR%" || exit /b 1
call npm ci || exit /b 1

echo Construyendo frontend Vite...
call npm run build || exit /b 1
popd

echo Sirviendo frontend Vite en http://localhost:3030
start "EconomiaCT - Frontend" cmd /k "cd /d ""%FRONTEND_DIR%"" && npm run preview"

echo Aplicacion iniciada. No cierres las ventanas de backend ni frontend.
endlocal
