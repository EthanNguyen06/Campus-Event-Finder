INSERT INTO users (username, email, password_hash)
VALUES ('otheruser', 'other@example.com', '$2b$10$g.BogusHashForTesting12345678')
ON CONFLICT DO NOTHING;