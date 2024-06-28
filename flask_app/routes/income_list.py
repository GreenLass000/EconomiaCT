from flask import Blueprint, jsonify
from models import IncomeList
from utils import get_session

income_list_bp = Blueprint('income_list', __name__)


@income_list_bp.route('/incomelists', methods=['GET'])
def get_incomelists():
    """
    Endpoint para obtener todas las entradas de la tabla IncomeList.

    Devuelve:
        Una lista de diccionarios JSON, cada uno representando una fila en la tabla IncomeList.
    """
    with get_session() as session:
        incomelists = session.query(IncomeList).all()
        return jsonify([{'id': incomelist.id, 'name': incomelist.name} for incomelist in incomelists])
