import os
from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Obtener la URI de la base de datos desde las variables de entorno
DATABASE_URI = os.getenv('DATABASE_URI')
