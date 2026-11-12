CREATE TABLE students (
    roster_key TEXT PRIMARY KEY NOT NULL,
    display_name TEXT NOT NULL,
    character_slug TEXT NOT NULL,
    display_order INTEGER NOT NULL UNIQUE CHECK(typeof(display_order) = 'integer' AND display_order >= 0)
);
