-- Drop old table if it exists
DROP TABLE IF EXISTS events CASCADE;

-- Create events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    image_url TEXT
);

-- Insert sample events
INSERT INTO events (id, title, description, start_time, end_time, location, category, image_url) VALUES
(1, 'Fall Concert', 'Live bands and food trucks on the quad.',
 '2025-10-21 18:00:00', '2025-10-21 20:00:00', 'Student Center', 'Music',
 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=600&fit=crop'),

(2, 'Career Fair', 'Meet recruiters from top companies.',
 '2025-11-05 18:00:00', '2025-11-05 20:00:00', 'Lane Stadium', 'Career',
 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop'),

(3, 'Hackathon', '24-hour campus-wide hackathon.',
 '2025-10-30 15:30:00', '2025-10-31 15:30:00', 'Goodwin Hall 190', 'Technology',
 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop'),

(4, 'Charity Run', '5K run to raise funds for local shelters.',
 '2025-10-28 08:00:00', '2025-10-28 10:00:00', 'Duck Pond Trail', 'Sports',
 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=600&fit=crop'),

(5, 'Cultural Night', 'An evening celebrating global food, music, and dance.',
 '2025-11-12 19:00:00', '2025-11-12 21:00:00', 'Burruss Auditorium', 'Culture',
 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&h=600&fit=crop'),

(6, 'Entrepreneurship Panel', 'Startup founders discuss how they built their companies.',
 '2025-11-20 17:00:00', '2025-11-20 19:00:00', 'Newman Library Multipurpose Room', 'Business',
 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop');
