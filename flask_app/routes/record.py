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


@record_bp.route('/record/<int:record_id>', methods=['PUT'])
def update_record(record_id):
    """
    Endpoint para actualizar un registro existente.
    """
    data = request.get_json()
    concept = data.get('concept')
    amount = data.get('amount')
    description = data.get('description')

    if not concept or amount is None:
        return jsonify({'error': 'Missing required fields'}), 400

    with get_session() as session:
        record = session.query(Record).get(record_id)
        if not record:
            return jsonify({'error': 'Record not found'}), 404

        record.concept = concept
        record.amount = amount
        record.description = description
        session.commit()

        return jsonify({
            'id': record.id,
            'person_id': record.person_id,
            'concept': record.concept,
            'amount': record.amount,
            'description': record.description,
            'date': record.date
        })


@record_bp.route('/record/<int:record_id>', methods=['DELETE'])
def delete_record(record_id):
    """
    Endpoint para eliminar un registro existente.
    """
    with get_session() as session:
        record = session.query(Record).get(record_id)
        if not record:
            return jsonify({'error': 'Record not found'}), 404

        session.delete(record)
        session.commit()

        return jsonify({'message': 'Record deleted successfully'}), 200
