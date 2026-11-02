"""Tests de attendance/entrypoints/web/validation.py · spec 005 CA-06; ARCHITECTURE E1."""

import pytest
from flask import Flask

from attendance.entrypoints.web.errors import MalformedRequestError
from attendance.entrypoints.web.validation import json_object, optional_str

app = Flask(__name__)


def body_of(data, content_type="application/json"):
    with app.test_request_context("/", method="POST", data=data, content_type=content_type):
        return json_object()


def test_an_object_is_read():
    assert body_of('{"name": "Ana"}') == {"name": "Ana"}


def test_no_body_counts_as_an_empty_object():  # spec 001 CA-02: abrir sin cuerpo sigue valiendo
    assert body_of("") == {}


@pytest.mark.parametrize("raw", ["[1]", '"Ana"', "5", "null", "{roto", "name=Ana"])
def test_anything_that_is_not_an_object_is_rejected(raw):
    with pytest.raises(MalformedRequestError):
        body_of(raw)


def test_form_data_is_rejected():
    with pytest.raises(MalformedRequestError):
        body_of("name=Ana", content_type="application/x-www-form-urlencoded")


def test_optional_str():
    assert optional_str({"name": "Ana"}, "name") == "Ana"
    assert optional_str({}, "name") == ""
    assert optional_str({"name": ""}, "name") == ""


@pytest.mark.parametrize("value", [None, 1234, 12.5, True, ["Ana"], {"a": 1}])
def test_optional_str_does_not_convert(value):  # E1: sin conversiones implícitas
    with pytest.raises(MalformedRequestError):
        optional_str({"name": value}, "name")
