CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS music_notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_link TEXT,
    user_creator_id INTEGER NOT NULL,
    title TEXT,
    description TEXT,
    FOREIGN KEY (user_creator_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY,
    name TEXT UNIQUE
);

INSERT OR IGNORE INTO categories (id, name) VALUES
    (1, 'Rock'),
    (2, 'Pop'),
    (3, 'Jazz'),
    (4, 'Blues'),
    (5, 'Clásica'),
    (6, 'Electrónica'),
    (7, 'Hip hop'),
    (8, 'Reggae'),
    (9, 'Folk'),
    (10, 'Metal'),
    (11, 'Soul'),
    (12, 'Funk'),
    (13, 'Country'),
    (14, 'Latina'),
    (15, 'R&B'),
    (16, 'Punk'),
    (17, 'Indie'),
    (18, 'Flamenco'),
    (19, 'Ópera'),
    (20, 'Banda sonora');

CREATE TABLE IF NOT EXISTS music_note_categories (
    music_note_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (music_note_id, category_id),
    FOREIGN KEY (music_note_id) REFERENCES music_notes (id),
    FOREIGN KEY (category_id) REFERENCES categories (id)
);
