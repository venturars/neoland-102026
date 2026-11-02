"""Dobles de las bibliotecas de Google, compartidos por test_google_auth.py y test_google_meet.py (T4)."""

import json

from attendance.infra.google_auth import SCOPES


class FakeCredentials:
    def __init__(self, scopes=SCOPES, valid=True, refresh_error=None):
        self.token = "token-falso"
        self.valid = valid
        self.granted_scopes = list(scopes)
        self.scopes = list(scopes)
        self.refresh_error = refresh_error
        self.refreshed = False

    def refresh(self, _request):
        if self.refresh_error:
            raise self.refresh_error
        self.refreshed, self.valid = True, True

    def to_json(self):
        return json.dumps({"falso": True})
