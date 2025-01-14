#!/bin/bash

# Lanzar la aplicación Flask

# Navegar al directorio de la aplicación Flask
cd flask_app || exit

# Crear un entorno virtual (opcional, si es necesario)
echo "Creando entorno virtual..."
python3 -m venv .venv
if [ $? -ne 0 ]; then
    exit 0
fi

# Activar el entorno virtual
echo "Activando entorno virtual..."
source .venv/bin/activate
if [ $? -ne 0 ]; then
    exit 0
fi

# Instalar dependencias (opcional, si es necesario)
echo "Instalando dependencias de Flask..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    exit 0
fi

# Lanzar la aplicación Flask
echo "Iniciando la aplicación Flask..."
gnome-terminal -- bash -c "python3 index.py; exec bash"

# Esperar unos segundos para asegurarnos de que la aplicación Flask está corriendo
sleep 5

# Navegar al directorio de la aplicación React
cd ../react_app || exit

# Instalar dependencias de React (opcional, si es necesario)
echo "Instalando dependencias de React..."
npm install
if [ $? -ne 0 ]; then
    exit 0
fi

# Instalar serve globalmente siempre
echo "Instalando o actualizando serve globalmente..."
npm install -g serve
if [ $? -ne 0 ]; then
    echo "Fallo al instalar serve. Verifica permisos y conexión a internet."
    exit 0
fi

# Construir la aplicación React
echo "Construyendo la aplicación React..."
npm run build
if [ $? -ne 0 ]; then
    exit 0
fi

# Lanzar la aplicación React usando serve
echo "Iniciando la aplicación React..."
gnome-terminal -- bash -c "serve -s build; exec bash"

# Pausar para mantener la terminal abierta (opcional)
read -p "Presiona cualquier tecla para continuar..."
