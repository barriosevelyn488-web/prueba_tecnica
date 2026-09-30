-- Datos de prueba iniciales: 3 Candidatos
INSERT INTO candidates (name, email, years_of_experience) VALUES
('Ana Gómez', 'ana.gomez@example.com', 3),
('Carlos Pérez', 'carlos.perez@example.com', 5),
('Sofía Torres', 'sofia.torres@example.com', 1);

-- Datos de prueba iniciales: 2 Vacantes (una OPEN y otra CLOSED)
INSERT INTO vacancies (title, min_years_experience, status) VALUES
('Backend Developer Node.js', 2, 'OPEN'),
('Frontend React Junior', 1, 'CLOSED');

-- Datos de prueba iniciales: Postulaciones relacionales
INSERT INTO applications (candidate_id, vacancy_id, cover_letter, source, score, priority, status) VALUES
(1, 1, 'Hola, tengo experiencia sólida en Node.js y Express.', 'JOB_BOARD', 85.50, 'HIGH', 'IN_REVIEW'),
(2, 1, 'Me entusiasma mucho participar en el desarrollo de APIs REST.', 'REFERRAL', 92.00, 'TOP', 'RECEIVED'),
(3, 2, 'Busco una oportunidad para crecer profesionalmente.', 'OTHER', 60.00, 'LOW', 'REJECTED');
