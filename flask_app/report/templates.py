from reportlab.lib.pagesizes import A4
from reportlab.platypus import Image
from reportlab.pdfgen import canvas
from .config import LOGO_PATH, TITLE

def add_header_footer(canvas, doc):
    width, height = A4
    
    # Header
    logo = Image(LOGO_PATH, width=80, height=80)
    logo.drawOn(canvas, 40, height - 100)
    canvas.setFont("Helvetica-Bold", 14)
    canvas.drawString(140, height - 80, TITLE)
    
    # Footer
    canvas.setFont("Helvetica", 10)
    canvas.drawString(270, 40, f"Pagina {doc.page}")