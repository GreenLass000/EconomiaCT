from datetime import timezone
from flask import Blueprint, jsonify, request
from models import Record, Person
from datetime import datetime
from utils import get_session

record_bp = Blueprint('record', __name__)


@record_bp.route('/record', methods=['POST'])
def add_record():
    """
    Endpoint para agregar un nuevo registro de ingreso o gasto.

    Datos JSON esperados:
        - person_id: int
        - concept: str
        - amount: float
        - description: str (opcional)

    Devuelve:
        Un diccionario JSON con los detalles del registro añadido.
    """
    data = request.get_json()
    person_id = data.get('person_id')
    concept = data.get('concept')
    amount = data.get('amount')
    description = data.get('description', '')
    isconcertado = data.get('isconcertado')

    if not person_id or not concept or not amount:
        return jsonify({'error': 'Missing required fields'}), 400

    with get_session() as session:
        person = session.query(Person).get(person_id)
        if not person:
            return jsonify({'error': 'Person not found'}), 404

        if isconcertado:
            comunidad_terapeutica_person = session.query(Person).filter_by(
                firstName="Comunidad", lastName="Terapeutica").first()
            if not comunidad_terapeutica_person:
                return jsonify({'error': 'Comunidad Terapeutica person not found'}), 404
            person_id = comunidad_terapeutica_person.id

        new_record = Record(
            person_id=person_id,
            concept=concept,
            amount=amount,
            description=description,
            date=datetime.now(timezone.utc),
        )
        session.add(new_record)
        session.commit()

        return jsonify({
            'id': new_record.id,
            'person_id': new_record.person_id,
            'concept': new_record.concept,
            'amount': new_record.amount,
            'description': new_record.description,
            'date': new_record.date
        }), 201


@record_bp.route('/record/person/<int:person_id>', methods=['GET'])
def get_records_by_person(person_id):
    """
    Endpoint para obtener todos los registros de una persona específica.

    Devuelve:
        Una lista de diccionarios JSON, cada uno representando una fila en la tabla Record para la persona especificada.
    """
    with get_session() as session:
        records = session.query(Record).filter_by(person_id=person_id).all()
        return jsonify([{
            'id': record.id,
            'person_id': record.person_id,
            'concept': record.concept,
            'amount': record.amount,
            'description': record.description,
            'date': record.date
        } for record in records])
