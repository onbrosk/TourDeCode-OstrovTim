ALTER TABLE stops
  ADD COLUMN lines VARCHAR(255) NOT NULL DEFAULT '',
  ADD COLUMN transfer_lines VARCHAR(255);

INSERT INTO stops (
  id,
  name,
  lines,
  is_transfer,
  transfer_lines,
  x,
  y,
  wheelchair_accessible,
  has_shelter,
  has_bench,
  has_ticket_machine,
  has_display,
  image_url
) VALUES
  (1, 'Turing Terminal', 'A', FALSE, NULL, 20.15, 25.85, TRUE, TRUE, TRUE, FALSE, TRUE, NULL),
  (2, 'Ada Exchange', 'A;B', TRUE, 'A;B', 39.37, 24.84, TRUE, TRUE, TRUE, TRUE, TRUE, NULL),
  (3, 'Pixel Park', 'A', FALSE, NULL, 57.21, 26.66, TRUE, FALSE, TRUE, FALSE, TRUE, NULL),
  (4, 'Byte Square', 'A;C', TRUE, 'A;C', 73.79, 25.65, TRUE, TRUE, TRUE, TRUE, TRUE, NULL),
  (5, 'Stack Garden', 'A', FALSE, NULL, 92.9, 30.53, FALSE, TRUE, TRUE, FALSE, FALSE, NULL),
  (6, 'Hopper Hall', 'B', FALSE, NULL, 30.44, 6.01, TRUE, TRUE, FALSE, TRUE, TRUE, NULL),
  (7, 'Compiler Court', 'B', FALSE, NULL, 44.13, 39.73, TRUE, FALSE, TRUE, FALSE, TRUE, NULL),
  (8, 'Kernel Hub', 'B;C', TRUE, 'B;C', 50.67, 56.59, TRUE, TRUE, TRUE, TRUE, TRUE, NULL),
  (9, 'Syntax Square', 'B', FALSE, NULL, 51.92, 72.59, FALSE, TRUE, TRUE, FALSE, TRUE, NULL),
  (10, 'Lambda Lane', 'B', FALSE, NULL, 58.63, 86.35, TRUE, FALSE, TRUE, FALSE, FALSE, NULL),
  (11, 'Campus Gate', 'B', FALSE, NULL, 65.03, 106.23, TRUE, TRUE, TRUE, TRUE, TRUE, NULL),
  (12, 'Edison East', 'C', FALSE, NULL, 2.11, 88.9, FALSE, TRUE, FALSE, FALSE, FALSE, NULL),
  (13, 'Notebook Quay', 'C', FALSE, NULL, 26.37, 74.6, TRUE, FALSE, TRUE, FALSE, TRUE, NULL),
  (14, 'Library Loop', 'C', FALSE, NULL, 58.21, 45.25, TRUE, TRUE, TRUE, FALSE, TRUE, NULL),
  (15, 'Quantum Commons', 'C', FALSE, NULL, 91.29, 15.86, TRUE, TRUE, TRUE, TRUE, FALSE, NULL)
