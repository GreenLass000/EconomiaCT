import io
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
)
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from report.layout import get_styles, get_table_style
from report.templates import add_header_footer


def generar_pdf(datos_lista, datos_tabla, saldo_total, nombre):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4,
                            leftMargin=2 * cm, rightMargin=2 * cm,
                            topMargin=2 * cm, bottomMargin=2 * cm)
    elementos = []
    styles = get_styles()

    # Título
    elementos.append(Paragraph(f'Caja {nombre}', styles["CenterTitle"]))
    elementos.append(Spacer(1, 12))

    # Tabla con saldo como primera fila
    encabezado = ["Fecha", "Concepto", "Descripción", "Cantidad"]
    tabla_datos = [encabezado]

    # Fila de saldo destacada
    saldo_formateado = f"{saldo_total:,.2f} €".replace(",", "X").replace(".", ",").replace("X", ".")
    saldo_color = colors.red if saldo_total < 0 else colors.green
    tabla_datos.append([
        Paragraph("<b>Saldo:</b>", styles["NormalText"]),
        "", "",
        Paragraph(f'<font color="{saldo_color}"><b>{saldo_formateado}</b></font>', styles["NormalText"])
    ])

    # Resto de registros
    for fila in datos_tabla:
        cantidad = fila[3]
        cantidad_num = float(cantidad)
        cantidad_color = colors.red if cantidad_num < 0 else colors.black
        cantidad_formateada = f"{cantidad_num:,.2f} €".replace(",", "X").replace(".", ",").replace("X", ".")

        tabla_datos.append([
            fila[0],
            fila[1],
            fila[2],
            Paragraph(f'<font color="{cantidad_color}">{cantidad_formateada}</font>', styles["NormalText"])
        ])

    tabla = Table(tabla_datos, colWidths=[4*cm, 5*cm, 5*cm, 3*cm])
    tabla.setStyle(TableStyle(get_table_style()))
    elementos.append(tabla)

    doc.build(elementos, onFirstPage=add_header_footer, onLaterPages=add_header_footer)
    buffer.seek(0)
    return buffer
