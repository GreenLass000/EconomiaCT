from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib import colors

def get_styles():
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='CenterTitle', alignment=TA_CENTER, fontSize=16, spaceAfter=20))
    styles.add(ParagraphStyle(name='NormalText', fontSize=10, spaceAfter=5))
    return styles

def get_table_style():
    return [
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#097F8E")),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('GRID', (0, 0), (-1, -1), 0.3, colors.black),
    ]
