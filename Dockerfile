# Utiliza una imagen base de Python para Flask
FROM python:3.9-slim

# Instalación de Node.js y npm para React
RUN apt-get update && apt-get install -y nodejs npm

# Instalación de MySQL
RUN apt-get update && apt-get install -y mysql-server

# Establece el directorio de trabajo para la aplicación Flask
WORKDIR /app

# Copia los archivos de requerimientos de Flask
COPY flask-app/requirements.txt .

# Instala las dependencias de Python
RUN pip install --no-cache-dir -r requirements.txt

# Copia el código de la aplicación Flask
COPY flask-app/ /app

# Establece el directorio de trabajo para la aplicación React
WORKDIR /app/react-app

# Copia los archivos de React y construye la aplicación
COPY react-app/package.json .
COPY react-app/package-lock.json .
RUN npm install
COPY react-app/ .
RUN npm run build

# Mueve la build de React al directorio de static de Flask
RUN mkdir -p /app/static
RUN cp -r build/* /app/static/

# Copia el archivo init-db.sql al contenedor
WORKDIR /app
COPY db/init-db.sql /docker-entrypoint-initdb.d/

# Configura MySQL y ejecuta el script init-db.sql
RUN service mysql start && \
    mysql -e "CREATE DATABASE IF NOT EXISTS mydb;" && \
    mysql -e "CREATE USER IF NOT EXISTS 'user'@'localhost' IDENTIFIED BY 'password';" && \
    mysql -e "GRANT ALL PRIVILEGES ON mydb.* TO 'user'@'localhost';" && \
    mysql -e "FLUSH PRIVILEGES;" && \
    mysql mydb < /docker-entrypoint-initdb.d/init-db.sql

# Expone el puerto en el que correrá Flask
EXPOSE 5000

# Comando para ejecutar MySQL y la aplicación Flask
CMD service mysql start && flask run --host=0.0.0.0
