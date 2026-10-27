"""Bot de Discord: registra asistencia con el nombre visible y el código.

Proceso aparte de Flask. Lee el token en ``data/discord_token.txt``.

Uso: ``python bot_discord.py``
"""

from __future__ import annotations

import sys
import time
from datetime import datetime
from pathlib import Path

import discord
from discord import app_commands

from asistencia.domain.session import InvalidCode, SessionClosed
from asistencia.usecases.attendance import DiscordNotEnabled, check_in_discord

BASE_DIR = Path(__file__).parent
DEFAULT_DB = BASE_DIR / "data" / "asistencia.db"
TOKEN_PATH = BASE_DIR / "data" / "discord_token.txt"

MSG_NO_TOKEN = (
    "No se encontró el token del bot. "
    "Crea data/discord_token.txt con el token en una sola línea."
)
MSG_REGISTERED = "Quedas registrado como {name} a las {time}."
MSG_ALREADY = "Ya estabas registrado como {name} a las {time}."
MSG_BAD_NAME = "No pude usar tu nombre de Discord: {detail}"


def load_token(path: Path = TOKEN_PATH) -> str:
    """Lee el token del bot desde un fichero de una línea.

    :param path: ruta del fichero del token.
    :return: token sin espacios alrededor.
    :rtype: str
    :raises SystemExit: si el fichero no existe o está vacío.

    Usage::

      token = load_token()
    """
    if not path.is_file():
        raise SystemExit(f"  Error: {MSG_NO_TOKEN}")
    token = path.read_text(encoding="utf-8").strip()
    if not token:
        raise SystemExit(f"  Error: {MSG_NO_TOKEN}")
    return token


def reply_for_check_in(path, display_name: str, code: str, now=time.time) -> str:
    """Devuelve el mensaje en español tras intentar el registro.

    :param path: ruta de la base de asistencia.
    :param display_name: nombre visible de Discord.
    :param code: código de 4 cifras.
    :param now: función o callable del instante Unix.
    :return: mensaje para el alumno.
    :rtype: str

    Usage::

      text = reply_for_check_in(path, name, code)
    """
    try:
        row, created = check_in_discord(path, display_name, code, now)
    except DiscordNotEnabled as exc:
        return str(exc)
    except InvalidCode as exc:
        return str(exc)
    except SessionClosed as exc:
        return str(exc)
    except ValueError as exc:
        return MSG_BAD_NAME.format(detail=str(exc))

    checked = row["checked_at"]
    try:
        when = datetime.fromisoformat(checked).strftime("%H:%M")
    except ValueError:
        when = checked
    template = MSG_REGISTERED if created else MSG_ALREADY
    return template.format(name=row["name"], time=when)


def build_client(db_path: Path = DEFAULT_DB) -> discord.Client:
    """Construye el cliente Discord con el comando ``/asistencia``.

    :param db_path: archivo SQLite de la asistencia.
    :return: cliente listo para ``run``.
    :rtype: discord.Client

    Usage::

      client = build_client()
    """
    intents = discord.Intents.default()
    client = discord.Client(intents=intents)
    tree = app_commands.CommandTree(client)

    @tree.command(name="asistencia", description="Apúntate a la clase con el código del profesor")
    @app_commands.describe(codigo="Código de 4 cifras que muestra el profesor")
    async def asistencia(interaction: discord.Interaction, codigo: str) -> None:
        display_name = interaction.user.display_name
        text = reply_for_check_in(db_path, display_name, codigo)
        await interaction.response.send_message(text, ephemeral=True)

    @client.event
    async def on_ready() -> None:
        await tree.sync()
        print(f"  Bot conectado como {client.user}. Comando /asistencia listo.")

    return client


def main() -> None:
    """Arranca el bot con el token de ``data/discord_token.txt``."""
    DEFAULT_DB.parent.mkdir(exist_ok=True)
    token = load_token()
    client = build_client()
    client.run(token)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
