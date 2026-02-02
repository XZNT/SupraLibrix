-- Database Schema for ColorGrade Social Platform

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    avatar VARCHAR(255) DEFAULT 'default-avatar.jpg',
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    image VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Color Mappings Table
CREATE TABLE IF NOT EXISTS colors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    color_name VARCHAR(50) NOT NULL UNIQUE,
    hex_value VARCHAR(7) NOT NULL,
    position INTEGER NOT NULL,
    description TEXT
);

-- Ratings Table
CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    color_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (color_id) REFERENCES colors(id) ON DELETE CASCADE,
    UNIQUE(post_id, user_id)
);

-- Insert Color Mappings (12 colors)
INSERT OR IGNORE INTO colors (color_name, hex_value, position, description) VALUES
('Passionate Red', '#E53935', 0, 'Intense and powerful'),
('Vibrant Orange', '#FB8C00', 1, 'Energetic and creative'),
('Sunny Yellow', '#FDD835', 2, 'Optimistic and cheerful'),
('Fresh Lime', '#7CB342', 3, 'Refreshing and natural'),
('Emerald Green', '#00897B', 4, 'Growth and harmony'),
('Ocean Teal', '#00ACC1', 5, 'Calm and balanced'),
('Sky Blue', '#1E88E5', 6, 'Trustworthy and serene'),
('Royal Purple', '#5E35B1', 7, 'Creative and luxurious'),
('Mystic Violet', '#8E24AA', 8, 'Mysterious and inspiring'),
('Hot Pink', '#D81B60', 9, 'Bold and playful'),
('Coral Rose', '#F4511E', 10, 'Warm and inviting'),
('Deep Magenta', '#C2185B', 11, 'Passionate and confident');

-- Seed Users
INSERT OR IGNORE INTO users (id, name, username, avatar, bio) VALUES
(1, 'Sarah Chen', 'sarahchen', 'https://i.pravatar.cc/150?img=1', 'Content creator & travel enthusiast 🌍'),
(2, 'Marcus Johnson', 'marcusj', 'https://i.pravatar.cc/150?img=12', 'Photographer | Visual storyteller 📸'),
(3, 'Elena Rodriguez', 'elenarod', 'https://i.pravatar.cc/150?img=5', 'Artist & designer crafting beauty ✨'),
(4, 'David Kim', 'davidkim', 'https://i.pravatar.cc/150?img=14', 'Tech innovator | Startup founder 🚀'),
(5, 'Maya Patel', 'mayapatel', 'https://i.pravatar.cc/150?img=9', 'Food blogger & recipe developer 🍳'),
(6, 'Alex Thompson', 'alexthompson', 'https://i.pravatar.cc/150?img=33', 'Fitness coach | Wellness advocate 💪'),
(7, 'Zoe Williams', 'zoewilliams', 'https://i.pravatar.cc/150?img=25', 'Music producer & audio engineer 🎵'),
(8, 'James Foster', 'jamesfoster', 'https://i.pravatar.cc/150?img=52', 'Adventure seeker | Mountain lover ⛰️');

-- Seed Posts
INSERT OR IGNORE INTO posts (id, author_id, content, image) VALUES
(1, 1, 'Watched the sunrise from the peak of Mount Fuji. The colors were absolutely breathtaking - nature''s perfect gradient from deep purple to golden orange. Sometimes the best moments happen when you wake up early! 🌅', 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=800&h=1200&fit=crop'),
(2, 2, 'Urban exploration at its finest. Found this incredible mural in downtown LA that perfectly captures the energy of the city. The contrast between the old brick and vibrant colors tells a story of transformation. 🎨', 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?w=800&h=1200&fit=crop'),
(3, 3, 'Creating art is about finding beauty in unexpected places. This abstract piece was inspired by the way light dances through stained glass windows. Every color has a voice - what does it say to you? ✨', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=1200&fit=crop'),
(4, 4, 'Just launched our new AI-powered analytics platform! The journey from concept to product has been incredible. Grateful for the team that made this vision a reality. Innovation never sleeps! 🚀', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1200&fit=crop'),
(5, 5, 'Homemade croissants fresh from the oven! The secret is patience and quality butter. There''s something magical about creating food that brings joy to others. Recipe coming soon! 🥐', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=1200&fit=crop'),
(6, 6, 'Morning workout complete! Remember: your body can do amazing things when you give it the right fuel and consistency. Small steps lead to big transformations. Let''s crush this week! 💪', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=1200&fit=crop'),
(7, 7, 'Studio session vibes. Working on some new beats that blend classical instruments with modern electronic sounds. Music has no boundaries - it''s all about emotion and connection. 🎵', 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=1200&fit=crop'),
(8, 8, 'Conquered the North Ridge trail today! The view from the top made every challenging step worth it. Nature reminds us that the best views come after the hardest climbs. ⛰️', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop'),
(9, 1, 'Coffee and contemplation. Found this cozy café tucked away in Kyoto. Sometimes the best discoveries happen when you''re not following a map. Where''s your favorite hidden gem? ☕', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=1200&fit=crop'),
(10, 3, 'New digital art series exploring the concept of digital nature. Using code to create organic patterns that mimic natural growth. Technology and nature aren''t opposites - they''re partners in creation. 🌿', 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800&h=1200&fit=crop'),
(11, 2, 'Golden hour in the city never disappoints. The way the setting sun reflects off glass buildings creates this incredible light show. Every photographer''s favorite time of day! 📸', 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=1200&fit=crop'),
(12, 5, 'Experimenting with fusion cuisine - Korean tacos with gochujang aioli! Food is the ultimate cultural bridge. What flavor combinations would you like to see next? 🌮', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=1200&fit=crop');

-- Seed Some Ratings (to show analytics)
INSERT OR IGNORE INTO ratings (post_id, user_id, color_id) VALUES
-- Post 1 ratings (sunrise)
(1, 2, 2), (1, 3, 1), (1, 4, 2), (1, 5, 3), (1, 6, 2),
-- Post 2 ratings (urban art)
(2, 1, 7), (2, 3, 9), (2, 4, 8), (2, 5, 7),
-- Post 3 ratings (abstract art)
(3, 1, 8), (3, 2, 10), (3, 4, 9), (3, 5, 7), (3, 6, 8),
-- Post 4 ratings (tech)
(4, 1, 6), (4, 2, 7), (4, 3, 6), (4, 5, 5),
-- Post 5 ratings (croissants)
(5, 1, 2), (5, 2, 3), (5, 3, 2), (5, 4, 11),
-- Post 6 ratings (fitness)
(6, 1, 1), (6, 2, 4), (6, 3, 1), (6, 4, 5), (6, 5, 1),
-- Post 7 ratings (music)
(7, 1, 8), (7, 2, 7), (7, 3, 9), (7, 4, 8),
-- Post 8 ratings (mountain)
(8, 1, 5), (8, 2, 4), (8, 3, 6), (8, 4, 5), (8, 5, 4);
