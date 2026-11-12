-- Datos ficticios generados con 010 (93c3200). Secretos deterministas solo de prueba.
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
INSERT INTO "checkins" VALUES(1,'fixture1','Jimena Duran','jimena duran','2027-01-15T08:00:03.000+00:00');
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
INSERT INTO "race_access" VALUES('fixture1','jimena-duran','4d995759617334ff007efd8fdcc8c958f2826e91d5e4157dcb1999e26d6da567');
INSERT INTO "race_access" VALUES('fixture1','meghan-martin','aafe65570be78edefd6a0a7d694df74699a324888a07c5877ac61d4de3577fad');
INSERT INTO "race_access" VALUES('fixture1','miguel-rodriguez','b8bfea9a19a324f2dff480a81926201bbee117b3a679b77eb2e093cca65247f5');
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
INSERT INTO "race_operations" VALUES('fixture1','jimena-duran','00000000-0000-4000-8000-000000000001',1,'3102cc084bd7917163eb9c51581ff4ea237a8a6c6fd610c345f619c429d92f88','completed','success',201,1);
INSERT INTO "race_operations" VALUES('fixture1','meghan-martin','00000000-0000-4000-8000-000000000002',1,'ef75b4e8a4909d2a5dc7759c3807ea1cb370dc7f1fb60bf1990b1f528449eca4','completed','invalid_code',422,NULL);
INSERT INTO "race_operations" VALUES('fixture1','miguel-rodriguez','00000000-0000-4000-8000-000000000003',1,'67076300d98dafbea434b640c36c6f8e2bee8b92cda04a57830fcd8f30863b8e','reserved',NULL,NULL,NULL);
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
INSERT INTO "race_slots" VALUES('fixture1','diego-molero','Diego Molero','node-jack',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('fixture1','diego-torres','Diego Torres','espantatorres',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('fixture1','ella-deyavorsky','Ella Deyavorsky','mr-wobble',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('fixture1','esther-patino','Esther Patino','hombre-lobo-esther',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('fixture1','jimena-duran','Jimena Duran','ajolote',1,'registrado',1);
INSERT INTO "race_slots" VALUES('fixture1','jose-miguel','Jose Miguel','jack',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('fixture1','luis-duque','Luis Duque','vampire-king-leo',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('fixture1','manuel-diaz','Manuel Diaz','fantasmiko',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('fixture1','maria-osipuk','Maria Osipuk','mimo',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('fixture1','meghan-martin','Meghan Martin','fantasma',1,'listo',NULL);
INSERT INTO "race_slots" VALUES('fixture1','miguel-rodriguez','Miguel Rodriguez','yomi',1,'listo',NULL);
INSERT INTO "race_slots" VALUES('fixture1','raul-santamaria','Raul Santamaria','calabaza-aterradora',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('fixture1','sergio-cortes','Sergio Cortes','harry-universe',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('fixture1','sergio-moras','Sergio Moras','edgar-allan-poe',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('fixture1','victor-chang','Victor Chang','vicwolf',0,'pendiente',NULL);
CREATE TABLE races (
  session_id TEXT PRIMARY KEY REFERENCES sessions(id),
  prepared_at REAL NOT NULL,
  starts_at REAL,
  expires_at REAL NOT NULL,
  join_secret TEXT
);
INSERT INTO "races" VALUES('fixture1',1800000000.0,1800000003.0,1800007200.0,NULL);
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
INSERT INTO "sessions" VALUES('fixture1','Compatibilidad 011','00000000000000000000000000000000','2027-01-15T08:00:00.000+00:00',NULL);
CREATE INDEX registration_attempts_address_time
ON registration_attempts(address, attempted_at);
CREATE INDEX races_expiry ON races(expires_at);
DELETE FROM "sqlite_sequence";
INSERT INTO "sqlite_sequence" VALUES('checkins',1);
COMMIT;
