INSERT INTO teams (name)
SELECT 'Ostrov Tim' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM teams WHERE name = 'Ostrov Tim')