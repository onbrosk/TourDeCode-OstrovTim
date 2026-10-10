INSERT INTO members (name, surname)
SELECT 'Kristián', 'Kurimský' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM members WHERE surname = 'Kurimský');

INSERT INTO members (name, surname)
SELECT 'Lucia', 'Dugasová' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM members WHERE surname = 'Dugasová');

INSERT INTO members (name, surname)
SELECT 'Moussa', 'Rehahla' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM members WHERE surname = 'Rehahla')