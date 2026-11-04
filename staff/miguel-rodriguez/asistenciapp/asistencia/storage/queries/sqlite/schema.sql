
CREATE TABLE IF NOT EXISTS config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  secret     TEXT NOT NULL,
  opened_at  TEXT NOT NULL,
  closed_at  TEXT
);

CREATE TABLE IF NOT EXISTS checkins (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id  TEXT NOT NULL REFERENCES sessions(id),
  name        TEXT NOT NULL,
  name_key    TEXT NOT NULL,
  checked_at  TEXT NOT NULL,
  UNIQUE (session_id, name_key)
);

CREATE TABLE IF NOT EXISTS registration_attempts (
  address TEXT NOT NULL,
  attempted_at REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS registration_attempts_address_time
ON registration_attempts(address, attempted_at);
CREATE TABLE IF NOT EXISTS blocked_addresses (
  address TEXT PRIMARY KEY
);
CREATE TABLE IF NOT EXISTS races (
  session_id TEXT PRIMARY KEY REFERENCES sessions(id),
  prepared_at REAL NOT NULL,
  starts_at REAL,
  expires_at REAL NOT NULL,
  join_secret TEXT
);
CREATE INDEX IF NOT EXISTS races_expiry ON races(expires_at);
CREATE TABLE IF NOT EXISTS race_slots (
  session_id TEXT NOT NULL REFERENCES races(session_id),
  roster_key TEXT NOT NULL,
  display_name TEXT NOT NULL,
  character_slug TEXT NOT NULL,
  included_at_start INTEGER NOT NULL DEFAULT 0 CHECK(included_at_start IN (0,1)),
  state TEXT NOT NULL DEFAULT 'pendiente' CHECK(state IN ('pendiente','listo','registrado','retirado')),
  checkin_id INTEGER REFERENCES checkins(id) ON DELETE SET NULL,
  PRIMARY KEY(session_id,roster_key)
);
CREATE TABLE IF NOT EXISTS race_access (
  session_id TEXT NOT NULL,
  roster_key TEXT NOT NULL,
  credential_hash TEXT NOT NULL UNIQUE,
  PRIMARY KEY(session_id,roster_key),
  FOREIGN KEY(session_id,roster_key) REFERENCES race_slots(session_id,roster_key)
);
CREATE TABLE IF NOT EXISTS race_operations (
  session_id TEXT NOT NULL,
  roster_key TEXT NOT NULL,
  operation_id TEXT NOT NULL,
  attempt_no INTEGER NOT NULL CHECK(attempt_no BETWEEN 1 AND 3),
  payload_fingerprint TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'reserved' CHECK(state IN ('reserved','completed')),
  result_kind TEXT,
  result_status INTEGER,
  checkin_id INTEGER REFERENCES checkins(id) ON DELETE SET NULL,
  PRIMARY KEY(session_id,roster_key,operation_id),
  UNIQUE(session_id,roster_key,attempt_no),
  FOREIGN KEY(session_id,roster_key) REFERENCES race_slots(session_id,roster_key),
  CHECK((state='reserved' AND result_kind IS NULL AND result_status IS NULL AND checkin_id IS NULL)
     OR (state='completed' AND result_kind IS NOT NULL AND result_status IS NOT NULL))
);
