from app import app

if __name__ == '__main__':
    """
    Punto de entrada principal para ejecutar la aplicación Flask.
    """
    app.run(host='0.0.0.0',port=5000, debug=True)
