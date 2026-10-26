-- Datos ficticios generados con 010 (93c3200), antes de refactorizar 011.
BEGIN TRANSACTION;
CREATE TABLE blocked_addresses (
  address TEXT PRIMARY KEY
);
CREATE TABLE checkins (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id  TEXT NOT NULL REFERENCES sessions(id),
  name        TEXT NOT NULL,
  name_key    TEXT NOT NULL,
  checked_at  TEXT NOT NULL,
  UNIQUE (session_id, name_key)
);
INSERT INTO "checkins" VALUES(1,'wFeCKY64','Jimena Duran','jimena duran','2027-01-15T08:00:03.000+00:00');
CREATE TABLE config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
CREATE TABLE race_access (
  session_id TEXT NOT NULL,
  roster_key TEXT NOT NULL,
  credential_hash TEXT NOT NULL UNIQUE,
  PRIMARY KEY(session_id,roster_key),
  FOREIGN KEY(session_id,roster_key) REFERENCES race_slots(session_id,roster_key)
);
INSERT INTO "race_access" VALUES('wFeCKY64','jimena-duran','eec639469d39e1968c0865f80d44338993fcb821cdbf1d181b56a3a53b5436c7');
INSERT INTO "race_access" VALUES('wFeCKY64','meghan-martin','36e5763a9b75eeb6cbd7d238f38678177d615cb92a5d5d18a9f434778a0d521a');
INSERT INTO "race_access" VALUES('wFeCKY64','miguel-rodriguez','aa1d0f3554285d02eb6b014063e6716750bb16589f17e82bbae075d5b122f4e5');
CREATE TABLE race_operations (
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
INSERT INTO "race_operations" VALUES('wFeCKY64','jimena-duran','00000000-0000-4000-8000-000000000001',1,'e4f83473fa991f488c35b6d705b09f7b40f3f5e9c1230193618e61fb35419c46','completed','success',201,1);
INSERT INTO "race_operations" VALUES('wFeCKY64','meghan-martin','00000000-0000-4000-8000-000000000002',1,'c794c68c78be91a9ba1f5b961efb684485302ae15369c15896a6badeb4d80a74','completed','invalid_code',422,NULL);
INSERT INTO "race_operations" VALUES('wFeCKY64','miguel-rodriguez','00000000-0000-4000-8000-000000000003',1,'a6419d3c0e3b57dd98b22f31f54f432d72cb5e0192cd8b24f28a2345b28cb8b1','reserved',NULL,NULL,NULL);
CREATE TABLE race_slots (
  session_id TEXT NOT NULL REFERENCES races(session_id),
  roster_key TEXT NOT NULL,
  display_name TEXT NOT NULL,
  character_slug TEXT NOT NULL,
  included_at_start INTEGER NOT NULL DEFAULT 0 CHECK(included_at_start IN (0,1)),
  state TEXT NOT NULL DEFAULT 'pendiente' CHECK(state IN ('pendiente','listo','registrado','retirado')),
  checkin_id INTEGER REFERENCES checkins(id) ON DELETE SET NULL,
  PRIMARY KEY(session_id,roster_key)
);
INSERT INTO "race_slots" VALUES('wFeCKY64','diego-molero','Diego Molero','node-jack',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('wFeCKY64','diego-torres','Diego Torres','espantatorres',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('wFeCKY64','ella-deyavorsky','Ella Deyavorsky','mr-wobble',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('wFeCKY64','esther-patino','Esther Patino','hombre-lobo-esther',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('wFeCKY64','jimena-duran','Jimena Duran','ajolote',1,'registrado',1);
INSERT INTO "race_slots" VALUES('wFeCKY64','jose-miguel','Jose Miguel','jack',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('wFeCKY64','luis-duque','Luis Duque','vampire-king-leo',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('wFeCKY64','manuel-diaz','Manuel Diaz','fantasmiko',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('wFeCKY64','maria-osipuk','Maria Osipuk','mimo',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('wFeCKY64','meghan-martin','Meghan Martin','fantasma',1,'listo',NULL);
INSERT INTO "race_slots" VALUES('wFeCKY64','miguel-rodriguez','Miguel Rodriguez','yomi',1,'listo',NULL);
INSERT INTO "race_slots" VALUES('wFeCKY64','raul-santamaria','Raul Santamaria','calabaza-aterradora',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('wFeCKY64','sergio-cortes','Sergio Cortes','harry-universe',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('wFeCKY64','sergio-moras','Sergio Moras','edgar-allan-poe',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('wFeCKY64','victor-chang','Victor Chang','vicwolf',0,'pendiente',NULL);
CREATE TABLE races (
  session_id TEXT PRIMARY KEY REFERENCES sessions(id),
  prepared_at REAL NOT NULL,
  starts_at REAL,
  expires_at REAL NOT NULL,
  join_secret TEXT
);
INSERT INTO "races" VALUES('wFeCKY64',1800000000.0,1800000003.0,1800007200.0,NULL);
CREATE TABLE registration_attempts (
  address TEXT NOT NULL,
  attempted_at REAL NOT NULL
);
CREATE TABLE sessions (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  secret     TEXT NOT NULL,
  opened_at  TEXT NOT NULL,
  closed_at  TEXT
);
INSERT INTO "sessions" VALUES('wFeCKY64','Compatibilidad 011','563a50e5218f1fecabbd776af6009011','2027-01-15T08:00:00.000+00:00',NULL);
CREATE INDEX registration_attempts_address_time
ON registration_attempts(address, attempted_at);
CREATE INDEX races_expiry ON races(expires_at);
DELETE FROM "sqlite_sequence";
INSERT INTO "sqlite_sequence" VALUES('checkins',1);
COMMIT;
