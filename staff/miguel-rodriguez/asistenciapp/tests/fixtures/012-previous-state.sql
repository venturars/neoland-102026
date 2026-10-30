-- Datos sintéticos generados con referencia 86fac55, antes de implementar 012.
-- metadata: {"now": 1800000006.0, "races": {"lobby": {"id": "test_fixture_2_", "entry": "test_fixture_3_0000000000000000000000000000", "tokens": {"jimena-duran": "test_fixture_4_0000000000000000000000000000", "miguel-rodriguez": "test_fixture_5_0000000000000000000000000000", "diego-torres": "test_fixture_6_0000000000000000000000000000"}}, "open": {"id": "test_fixture_7_", "entry": "test_fixture_8_0000000000000000000000000000", "tokens": {"jimena-duran": "test_fixture_9_0000000000000000000000000000", "miguel-rodriguez": "test_fixture_10_000000000000000000000000000", "diego-torres": "test_fixture_11_000000000000000000000000000"}, "success": {"operation_id": "00000000-0000-4000-8000-000000000001", "code": "6892"}, "invalid": {"operation_id": "00000000-0000-4000-8000-000000000002", "code": "bad"}, "reserved": {"operation_id": "00000000-0000-4000-8000-000000000003", "code": "6892"}}, "closed": {"id": "test_fixture_12_", "entry": "test_fixture_13_000000000000000000000000000", "tokens": {"jimena-duran": "test_fixture_14_000000000000000000000000000", "miguel-rodriguez": "test_fixture_15_000000000000000000000000000", "diego-torres": "test_fixture_16_000000000000000000000000000"}, "success": {"operation_id": "00000000-0000-4000-8000-000000000001", "code": "6892"}, "invalid": {"operation_id": "00000000-0000-4000-8000-000000000002", "code": "bad"}, "reserved": {"operation_id": "00000000-0000-4000-8000-000000000003", "code": "6892"}}, "cancelled": {"id": "test_fixture_17_", "entry": "test_fixture_18_000000000000000000000000000", "tokens": {"jimena-duran": "test_fixture_19_000000000000000000000000000", "miguel-rodriguez": "test_fixture_20_000000000000000000000000000", "diego-torres": "test_fixture_21_000000000000000000000000000"}}}}
BEGIN TRANSACTION;
CREATE TABLE blocked_addresses (
  address TEXT PRIMARY KEY
);
INSERT INTO "blocked_addresses" VALUES('192.0.2.99');
CREATE TABLE checkins (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id  TEXT NOT NULL REFERENCES sessions(id),
  name        TEXT NOT NULL,
  name_key    TEXT NOT NULL,
  checked_at  TEXT NOT NULL,
  UNIQUE (session_id, name_key)
);
INSERT INTO "checkins" VALUES(1,'test_fixture_7_','Jimena Duran','jimena duran','2027-01-15T08:00:03.000+00:00');
INSERT INTO "checkins" VALUES(2,'test_fixture_12_','Jimena Duran','jimena duran','2027-01-15T08:00:06.000+00:00');
CREATE TABLE config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
INSERT INTO "config" VALUES('teacher_token','test_fixture_1_');
CREATE TABLE race_access (
  session_id TEXT NOT NULL,
  roster_key TEXT NOT NULL,
  credential_hash TEXT NOT NULL UNIQUE,
  PRIMARY KEY(session_id,roster_key),
  FOREIGN KEY(session_id,roster_key) REFERENCES race_slots(session_id,roster_key)
);
INSERT INTO "race_access" VALUES('test_fixture_2_','jimena-duran','5f4c9869313e63534cccab5e4124a7e87a00c13294c86e13c3990cbfab003f8b');
INSERT INTO "race_access" VALUES('test_fixture_2_','miguel-rodriguez','eb41bbd117b455ea46c3e90c1240332a451a0538c3e7bb77b9c7a4998a02dc8e');
INSERT INTO "race_access" VALUES('test_fixture_2_','diego-torres','53a78788ab28ed76609695c1dd62d13d58e56ece5adedca7d97234980eb4390f');
INSERT INTO "race_access" VALUES('test_fixture_7_','jimena-duran','83b71f5d1fa6d16ba7f4ebbbafd1e27d3e6db6d752df159c8a861ae368d49d44');
INSERT INTO "race_access" VALUES('test_fixture_7_','miguel-rodriguez','04a185d8822c9698ea1ed9181328680bea9b61a96f631e023d5ea1d16639418d');
INSERT INTO "race_access" VALUES('test_fixture_7_','diego-torres','f62abc39df5dffb6c0217ce73382832f536a80d50c776735c65500b9c2760001');
INSERT INTO "race_access" VALUES('test_fixture_12_','jimena-duran','4aaa6785f6aa1f23e78a8cb787a0ff2472843920b933d9b9780156e2de12cbfc');
INSERT INTO "race_access" VALUES('test_fixture_12_','miguel-rodriguez','7ca16a1f3aef7a0d783e3a3d15fb267627ff264c9a2dd461175b00ee1f47053f');
INSERT INTO "race_access" VALUES('test_fixture_12_','diego-torres','eee134738c4090885474341381922b94bf061cbf51967b67e6650f4685055014');
INSERT INTO "race_access" VALUES('test_fixture_17_','jimena-duran','69de930c73623d39a6e9bfe395064e4d367ab7b37be5288e8f9fac915b9b9570');
INSERT INTO "race_access" VALUES('test_fixture_17_','miguel-rodriguez','0826af48d4221fe93847a0e06ab9bfda19743d868304220f7a96b78c658bdfa9');
INSERT INTO "race_access" VALUES('test_fixture_17_','diego-torres','ee355778f9d77a06044531bbf2d22eaf773f1ab29cdd42ff8997843fd58314ca');
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
INSERT INTO "race_operations" VALUES('test_fixture_7_','jimena-duran','00000000-0000-4000-8000-000000000001',1,'2aa49c79c20e03af4614edfdbb8e573adc7089275a2a67723720e3a5ba24d22a','completed','success',201,1);
INSERT INTO "race_operations" VALUES('test_fixture_7_','miguel-rodriguez','00000000-0000-4000-8000-000000000002',1,'1f7bf2e8efc4cb1eba7f83da657c9e782ecf6d0c615e5b4083a1e6e3b7b8f8b2','completed','invalid_code',422,NULL);
INSERT INTO "race_operations" VALUES('test_fixture_7_','diego-torres','00000000-0000-4000-8000-000000000003',1,'6378429b8fb9f34d922ac574014b59acbec42498a9b6b717a91b28bdf1b7d3e9','reserved',NULL,NULL,NULL);
INSERT INTO "race_operations" VALUES('test_fixture_12_','jimena-duran','00000000-0000-4000-8000-000000000001',1,'4b9cf1ea237f57314f19715d3e0f3fc524118f001cb715b5079ab6b8c857b64e','completed','success',201,2);
INSERT INTO "race_operations" VALUES('test_fixture_12_','miguel-rodriguez','00000000-0000-4000-8000-000000000002',1,'dfa2f8393ef4047d0cb82ffd868ab3ea83428c83cfc4585b3af92cdbde716e41','completed','invalid_code',422,NULL);
INSERT INTO "race_operations" VALUES('test_fixture_12_','diego-torres','00000000-0000-4000-8000-000000000003',1,'a1509c825ee0a5d512952f7e3bd898e0fd381ad19de2255ceea839f54fbba7ec','reserved',NULL,NULL,NULL);
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
INSERT INTO "race_slots" VALUES('test_fixture_2_','diego-molero','Diego Molero','node-jack',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_2_','diego-torres','Diego Torres','espantatorres',0,'listo',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_2_','ella-deyavorsky','Ella Deyavorsky','mr-wobble',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_2_','esther-patino','Esther Patino','hombre-lobo-esther',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_2_','jimena-duran','Jimena Duran','ajolote',0,'listo',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_2_','jose-miguel','Jose Miguel','jack',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_2_','luis-duque','Luis Duque','vampire-king-leo',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_2_','manuel-diaz','Manuel Diaz','fantasmiko',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_2_','maria-osipuk','Maria Osipuk','mimo',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_2_','meghan-martin','Meghan Martin','fantasma',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_2_','miguel-rodriguez','Miguel Rodriguez','yomi',0,'listo',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_2_','raul-santamaria','Raul Santamaria','calabaza-aterradora',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_2_','sergio-cortes','Sergio Cortes','harry-universe',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_2_','sergio-moras','Sergio Moras','edgar-allan-poe',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_2_','victor-chang','Victor Chang','vicwolf',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_7_','diego-molero','Diego Molero','node-jack',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_7_','diego-torres','Diego Torres','espantatorres',1,'listo',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_7_','ella-deyavorsky','Ella Deyavorsky','mr-wobble',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_7_','esther-patino','Esther Patino','hombre-lobo-esther',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_7_','jimena-duran','Jimena Duran','ajolote',1,'registrado',1);
INSERT INTO "race_slots" VALUES('test_fixture_7_','jose-miguel','Jose Miguel','jack',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_7_','luis-duque','Luis Duque','vampire-king-leo',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_7_','manuel-diaz','Manuel Diaz','fantasmiko',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_7_','maria-osipuk','Maria Osipuk','mimo',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_7_','meghan-martin','Meghan Martin','fantasma',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_7_','miguel-rodriguez','Miguel Rodriguez','yomi',1,'listo',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_7_','raul-santamaria','Raul Santamaria','calabaza-aterradora',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_7_','sergio-cortes','Sergio Cortes','harry-universe',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_7_','sergio-moras','Sergio Moras','edgar-allan-poe',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_7_','victor-chang','Victor Chang','vicwolf',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_12_','diego-molero','Diego Molero','node-jack',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_12_','diego-torres','Diego Torres','espantatorres',1,'listo',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_12_','ella-deyavorsky','Ella Deyavorsky','mr-wobble',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_12_','esther-patino','Esther Patino','hombre-lobo-esther',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_12_','jimena-duran','Jimena Duran','ajolote',1,'registrado',2);
INSERT INTO "race_slots" VALUES('test_fixture_12_','jose-miguel','Jose Miguel','jack',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_12_','luis-duque','Luis Duque','vampire-king-leo',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_12_','manuel-diaz','Manuel Diaz','fantasmiko',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_12_','maria-osipuk','Maria Osipuk','mimo',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_12_','meghan-martin','Meghan Martin','fantasma',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_12_','miguel-rodriguez','Miguel Rodriguez','yomi',1,'listo',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_12_','raul-santamaria','Raul Santamaria','calabaza-aterradora',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_12_','sergio-cortes','Sergio Cortes','harry-universe',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_12_','sergio-moras','Sergio Moras','edgar-allan-poe',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_12_','victor-chang','Victor Chang','vicwolf',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_17_','diego-molero','Diego Molero','node-jack',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_17_','diego-torres','Diego Torres','espantatorres',0,'listo',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_17_','ella-deyavorsky','Ella Deyavorsky','mr-wobble',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_17_','esther-patino','Esther Patino','hombre-lobo-esther',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_17_','jimena-duran','Jimena Duran','ajolote',0,'listo',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_17_','jose-miguel','Jose Miguel','jack',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_17_','luis-duque','Luis Duque','vampire-king-leo',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_17_','manuel-diaz','Manuel Diaz','fantasmiko',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_17_','maria-osipuk','Maria Osipuk','mimo',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_17_','meghan-martin','Meghan Martin','fantasma',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_17_','miguel-rodriguez','Miguel Rodriguez','yomi',0,'listo',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_17_','raul-santamaria','Raul Santamaria','calabaza-aterradora',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_17_','sergio-cortes','Sergio Cortes','harry-universe',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_17_','sergio-moras','Sergio Moras','edgar-allan-poe',0,'pendiente',NULL);
INSERT INTO "race_slots" VALUES('test_fixture_17_','victor-chang','Victor Chang','vicwolf',0,'pendiente',NULL);
CREATE TABLE races (
  session_id TEXT PRIMARY KEY REFERENCES sessions(id),
  prepared_at REAL NOT NULL,
  starts_at REAL,
  expires_at REAL NOT NULL,
  join_secret TEXT
);
INSERT INTO "races" VALUES('test_fixture_2_',1800000000.0,NULL,1800007200.0,'test_fixture_3_0000000000000000000000000000');
INSERT INTO "races" VALUES('test_fixture_7_',1800000000.0,1800000003.0,1800007200.0,NULL);
INSERT INTO "races" VALUES('test_fixture_12_',1800000003.0,1800000006.0,1800007203.0,NULL);
INSERT INTO "races" VALUES('test_fixture_17_',1800000006.0,NULL,1800007206.0,NULL);
CREATE TABLE registration_attempts (
  address TEXT NOT NULL,
  attempted_at REAL NOT NULL
);
INSERT INTO "registration_attempts" VALUES('192.0.2.98',1800000006.0);
CREATE TABLE sessions (
  id         TEXT PRIMARY KEY,
  title      TEXT NOT NULL,
  secret     TEXT NOT NULL,
  opened_at  TEXT NOT NULL,
  closed_at  TEXT
);
INSERT INTO "sessions" VALUES('test_fixture_2_','lobby','00000000000000000000000000000000','2027-01-15T08:00:00.000+00:00',NULL);
INSERT INTO "sessions" VALUES('test_fixture_7_','open','00000000000000000000000000000000','2027-01-15T08:00:00.000+00:00',NULL);
INSERT INTO "sessions" VALUES('test_fixture_12_','closed','00000000000000000000000000000000','2027-01-15T08:00:03.000+00:00','2027-01-15T08:00:06.000+00:00');
INSERT INTO "sessions" VALUES('test_fixture_17_','cancelled','00000000000000000000000000000000','2027-01-15T08:00:06.000+00:00','2027-01-15T08:00:06.000+00:00');
CREATE INDEX registration_attempts_address_time
ON registration_attempts(address, attempted_at);
CREATE INDEX races_expiry ON races(expires_at);
DELETE FROM "sqlite_sequence";
INSERT INTO "sqlite_sequence" VALUES('checkins',2);
COMMIT;
