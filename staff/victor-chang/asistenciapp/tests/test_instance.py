"""Tests de attendance/infra/instance.py · spec 007 CA-03; plan §2.5."""

import socket

import pytest

from attendance.domain.errors import AppError
from attendance.infra.instance import AlreadyRunningError, acquire


@pytest.fixture
def lock_port():
    """Un puerto libre para el bloqueo de cada test, sin tocar el de la app de verdad."""
    with socket.socket() as probe:
        probe.bind(("127.0.0.1", 0))
        return probe.getsockname()[1]


def test_a_second_copy_is_refused(lock_port):  # CA-03
    first = acquire(lock_port)
    try:
        with pytest.raises(AlreadyRunningError) as exc:
            acquire(lock_port)
        assert str(exc.value) == "AsistenciApp ya está abierta. Búscala en el Dock o en la barra de tareas."
    finally:
        first.release()


def test_after_releasing_it_can_be_taken_again(lock_port):  # CA-03: cerrar la app deja abrirla otra vez
    acquire(lock_port).release()
    again = acquire(lock_port)
    again.release()


def test_release_twice_does_not_fail(lock_port):  # lo suelta el finally de app.py aunque algo falle antes
    lock = acquire(lock_port)
    lock.release()
    lock.release()


def test_used_with_with_it_is_released_on_exit(lock_port):  # S7
    with acquire(lock_port):
        with pytest.raises(AlreadyRunningError):
            acquire(lock_port)
    acquire(lock_port).release()


def test_already_running_is_an_app_error():  # E3: excepción con nombre y mensaje
    assert issubclass(AlreadyRunningError, AppError)
