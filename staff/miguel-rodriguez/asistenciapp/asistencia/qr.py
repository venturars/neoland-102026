"""Generación local de QR SVG, sin servicios ni extras de imágenes."""
import qrcode
from qrcode.image.svg import SvgPathFillImage


def generate_qr(link: str) -> bytes:
    """Codifica el enlace ya autorizado con cuatro módulos de margen.

    :param link: enlace vigente de entrada, sin credenciales del profesor.
    :return: documento SVG negro sobre fondo blanco.
    :rtype: bytes

    Usage::

        generate_qr("https://clase.example/race.html?r=clase#join=entrada")
    """
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, border=4, box_size=8)
    qr.add_data(link)
    qr.make(fit=True)
    return qr.make_image(image_factory=SvgPathFillImage).to_string()
