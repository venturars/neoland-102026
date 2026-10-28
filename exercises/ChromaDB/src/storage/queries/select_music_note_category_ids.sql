SELECT category_id
FROM music_note_categories
WHERE music_note_id = :music_note_id
ORDER BY category_id;
