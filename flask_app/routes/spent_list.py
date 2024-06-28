from flask import Blueprint, jsonify
from models import SpentList
from utils import get_session

spent_list_bp = Blueprint('spent_list', __name__)


@spent_list_bp.route('/spentlists', methods=['GET'])
def get_spentlists():
    """
    Endpoint para obtener todas las entradas de la tabla SpentList.

    Devuelve:
        Una lista de diccionarios JSON, cada uno representando una fila en la tabla SpentList.
    """
    with get_session() as session:
        spentlists = session.query(SpentList).all()
        return jsonify([{'id': spentlist.id, 'name': spentlist.name, 'isconcertado': spentlist.isconcertado} for spentlist in spentlists])
