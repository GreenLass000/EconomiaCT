from flask import Blueprint, request, jsonify, send_file
from report.generator import generar_pdf
from utils import get_session
from models import Person, Record
from datetime import datetime, timedelta

report_bp = Blueprint('report', __name__)

@report_bp.route('/report', methods=['GET'])
def generar_reporte():
    person_id = request.args.get('person_id')
    start_date_str = request.args.get('start_date')
    end_date_str = request.args.get('end_date')

    if not person_id or not start_date_str or not end_date_str:
        return jsonify({'error': 'Missing parameters'}), 400

    try:
        start_date = datetime.strptime(start_date_str, '%Y-%m-%d')
        end_date = datetime.strptime(end_date_str, '%Y-%m-%d') + timedelta(days=1)
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400

    session = get_session()
    try:
        person = session.query(Person).filter_by(id=person_id).first()
        if not person:
            return jsonify({'error': 'Person not found'}), 404

        records = session.query(Record).filter(
            Record.person_id == person_id,
            Record.date >= start_date,
            Record.date < end_date
        ).order_by(Record.date.desc()).all()

        # Lista de datos personales
        datos_lista = [
            f"Nombre: {person.firstName}",
            f"Apellido: {person.lastName}",
            f"Desde: {start_date.strftime('%d/%m/%Y')}",
            f"Hasta: {datetime.strptime(end_date_str, '%Y-%m-%d').strftime('%d/%m/%Y')}",
        ]

        if records:
            datos_tabla = [
                [
                    record.date.strftime('%d/%m/%Y'),
                    record.concept,
                    record.description or "",
                    record.amount
                ]
                for record in records
            ]
            saldo_total = sum(record.amount for record in records)
        else:
            datos_tabla = []
            saldo_total = 0.0

        nombre_completo = f"{person.firstName} {person.lastName}"
        pdf_buffer = generar_pdf(datos_lista, datos_tabla, saldo_total, nombre_completo)
        filename = f"{person.firstName}_{person.lastName}_reporte.pdf"
        return send_file(pdf_buffer, mimetype='application/pdf', as_attachment=True, download_name=filename)

    finally:
        session.close()
