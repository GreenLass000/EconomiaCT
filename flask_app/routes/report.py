from flask import Blueprint, Flask, request, send_file
from report.generator import generar_pdf

report_bp = Blueprint('report', __name__)

app = Flask(__name__)
app.import_blueprint(report_bp)

@report_bp.route('/reports', methods=['GET'])
def generar_reporte():
    datos = request.json
    lista_datos = datos.get("lista", [])
    tabla_datos = datos.get("tabla", [])

    if not lista_datos or not tabla_datos:
        return {"error": "Datos insuficientes"}, 400

    pdf_buffer = generar_pdf(lista_datos, tabla_datos)
    return send_file(pdf_buffer, mimetype="application/pdf", as_attachment=True, download_name="reporte.pdf")

if __name__ == "__main__":
    app.run(debug=True)