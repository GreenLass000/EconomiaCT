from datetime import timezone, datetime
from flask import Blueprint, jsonify, request
from models import Person
from utils import get_session

person_bp = Blueprint('person', __name__)


@person_bp.route('/persons', methods=['GET'])
def get_persons():
    """
    Endpoint para obtener todas las personas.

    Devuelve:
        Una lista de diccionarios JSON, cada uno representando una fila en la tabla Person.
    """
    with get_session() as session:
        persons = session.query(Person).all()
        return jsonify([{
            'id': person.id,
            'firstName': person.firstName,
            'lastName': person.lastName,
            'isconcertado': person.isconcertado,
            'isactive': person.isactive,
            'date_joined': person.date_joined,
            'date_left': person.date_left
        } for person in persons])


@person_bp.route('/persons/active', methods=['GET'])
def get_active_persons():
    """
    Endpoint para obtener todas las personas activas (isactive = true).

    Devuelve:
        Una lista de diccionarios JSON, cada uno representando una fila en la tabla Person.
    """
    with get_session() as session:
        active_persons = session.query(Person).filter_by(isactive=True).all()
        return jsonify([{
            'id': person.id,
            'firstName': person.firstName,
            'lastName': person.lastName,
            'isconcertado': person.isconcertado,
            'isactive': person.isactive,
            'date_joined': person.date_joined,
            'date_left': person.date_left
        } for person in active_persons])


@person_bp.route('/persons', methods=['POST'])
def add_person():
    """
    Endpoint para agregar una nueva persona.

    Datos JSON esperados:
        - firstName: str
        - lastName: str
        - isConcertado: bool

    Devuelve:
        Un diccionario JSON con los detalles de la persona añadida.
    """
    data = request.get_json()
    if 'firstName' not in data or 'lastName' not in data or 'isConcertado' not in data:
        return jsonify({'error': 'Missing required fields'}), 400

    new_person = Person(
        firstName=data['firstName'],
        lastName=data['lastName'],
        isconcertado=data['isConcertado'],
        isactive=True,
        date_joined=datetime.now(timezone.utc),
    )
    with get_session() as session:
        session.add(new_person)
        session.commit()
        # Refresca la instancia para asegurarte de que los atributos están disponibles
        session.refresh(new_person)

    return jsonify({
        'id': new_person.id,
        'firstName': new_person.firstName,
        'lastName': new_person.lastName,
        'isconcertado': new_person.isconcertado,
        'isactive': new_person.isactive,
        'date_joined': new_person.date_joined,
        'date_left': new_person.date_left
    }), 201


@person_bp.route('/person/delete/<int:id>', methods=['PATCH'])
def disable_person(id):
    """
    Endpoint para 'eliminar' una persona cambiando isactive a false y estableciendo date_left.

    Parámetros URL:
        - id: int

    Devuelve:
        Un diccionario JSON con los detalles de la persona actualizada o un error si no se encuentra la persona.
    """
    with get_session() as session:
        person = session.query(Person).get(id)
        if person is None:
            return jsonify({'error': 'Person not found'}), 404

        if not person.isactive:
            return jsonify({'error': 'Person is already inactive'}), 400

        person.isactive = False
        person.date_left = datetime.now(timezone.utc)

        session.commit()

        return jsonify({
            'id': person.id,
            'firstName': person.firstName,
            'lastName': person.lastName,
            'isconcertado': person.isconcertado,
            'isactive': person.isactive,
            'date_joined': person.date_joined,
            'date_left': person.date_left
        })

@person_bp.route('/person/<int:id>', methods=['DELETE'])
def delete_person(id):
    """
    Endpoint para eliminar una persona de la base de datos.

    Parámetros URL:
        - id: int

    Devuelve:
        Un diccionario JSON con los detalles de la persona eliminada o un error si no se encuentra la persona.
    """
    with get_session() as session:
        person = session.query(Person).get(id)
        if person is None:
            return jsonify({'error': 'Person not found'}), 404

        session.delete(person)
        session.commit()

        return jsonify({
            'id': person.id,
            'firstName': person.firstName,
            'lastName': person.lastName,
            'isconcertado': person.isconcertado,
            'isactive': person.isactive,
            'date_joined': person.date_joined,
            'date_left': person.date
        })

# @person_bp.route('/person/<int:id>', methods=['PUT'])
# def update_person(id):
#     """
#     Endpoint para editar una persona existente.

#     Parámetros URL:
#         - id: int

#     Datos JSON esperados:
#         - firstName: str (opcional)
#         - lastName: str (opcional)
#         - isConcertado: bool (opcional)
#         - isActive: bool (opcional)

#     Devuelve:
#         Un diccionario JSON con los detalles de la persona actualizada o un error si no se encuentra la persona.
#     """
#     data = request.get_json()
    
#     with get_session() as session:
#         person = session.query(Person).get(id)
#         if person is None:
#             return jsonify({'error': 'Person not found'}), 404
        
#         if 'firstName' in data:
#             person.firstName = data['firstName']
#         if 'lastName' in data:
#             person.lastName = data['lastName']
#         if 'isConcertado' in data:
#             person.isconcertado = data['isConcertado']
#         if 'isActive' in data:
#             person.isactive = data['isActive']

#         session.commit()
        
#         return jsonify({
#             'id': person.id,
#             'firstName': person.firstName,
#             'lastName': person.lastName,
#             'isconcertado': person.isconcertado,
#             'isactive': person.isactive,
#             'date_joined': person.date_joined,
#             'date_left': person.date_left
#         })
