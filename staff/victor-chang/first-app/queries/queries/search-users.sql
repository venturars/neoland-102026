SELECT * FROM users WHERE instr(lower(name), lower(:text)) > 0 ORDER BY name COLLATE NOCASE, id
