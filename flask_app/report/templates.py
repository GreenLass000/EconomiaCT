from reportlab.platypus import Image
import os

def add_header_footer(canvas, doc):
    width, height = doc.pagesize
    canvas.saveState()

    # Logo (opcional)
    logo_path = os.path.join(os.path.dirname(__file__), '..', 'static', 'images', 'logo.png')
    if os.path.exists(logo_path):
        canvas.drawImage(logo_path, 40, height - 80, width=100, height=40)

    # Footer
    canvas.setFont('Helvetica', 9)
    canvas.drawString(40, 30, f"Página {doc.page}")
    canvas.restoreState()
