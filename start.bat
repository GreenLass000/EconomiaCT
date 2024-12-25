@echo off
REM Lanzar la aplicación Flask

REM Navegar al directorio de la aplicación Flask
cd flask_app

REM Crear un entorno virtual (opcional, si es necesario)
echo Creando entorno virtual...
python -m venv .venv
if %ERRORLEVEL% NEQ 0 exit /b 0

REM Activar el entorno virtual
echo Activando entorno virtual...
call .venv\Scripts\activate
if %ERRORLEVEL% NEQ 0 exit /b 0

REM Instalar dependencias (opcional, si es necesario)
echo Instalando dependencias de Flask...
call pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 exit /b 0

REM Lanzar la aplicación Flask en una nueva terminal
echo Iniciando la aplicación Flask...
start cmd /k "python index.py"

REM Esperar unos segundos para asegurarnos de que la aplicación Flask está corriendo
timeout /t 5

REM Navegar al directorio de la aplicación React
cd ..\react_app

REM Instalar dependencias de React (opcional, si es necesario)
echo Instalando dependencias de React...
call npm install
if %ERRORLEVEL% NEQ 0 exit /b 0

REM Instalar serve globalmente siempre
echo Instalando o actualizando serve globalmente...
call npm install -g serve
if %ERRORLEVEL% NEQ 0 (
    echo Fallo al instalar serve. Verifica permisos y conexión a internet.
    exit /b 0
)

REM Construir la aplicación React
echo Construyendo la aplicación React...
call npm run build
if %ERRORLEVEL% NEQ 0 exit /b 0

REM Lanzar la aplicación React usando serve en una nueva terminal
echo Iniciando la aplicación React...
start cmd /k "serve -s build"

pause
