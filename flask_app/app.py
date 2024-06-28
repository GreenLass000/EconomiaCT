from flask import Flask
from routes import income_list_bp, spent_list_bp, person_bp, record_bp
from utils import init_db
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={
     r"/*": {"origins": [
         "http://localhost:3000",
         "http://83.58.177.180:3000",
         "http://26.43.27.30:3000"
     ]}})

# Inicializar la base de datos
init_db()

# Registrar blueprints
app.register_blueprint(income_list_bp)
app.register_blueprint(spent_list_bp)
app.register_blueprint(person_bp)
app.register_blueprint(record_bp)
