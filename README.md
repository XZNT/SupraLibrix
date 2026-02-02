# 🎨 ColorGrade - Social Color Rating Platform

A modern, full-featured PHP social platform with TikTok/Reels-style scrolling, interactive color wheel grading system, and comprehensive analytics.

![ColorGrade Platform](https://img.shields.io/badge/version-1.0.0-blue.svg)
![PHP](https://img.shields.io/badge/PHP-7.4+-purple.svg)
![SQLite](https://img.shields.io/badge/SQLite-3-green.svg)

## ✨ Features

### 🎬 TikTok/Reels-Style Interface
- **Full-screen scrollable posts** with snap-scroll behavior
- **Smooth vertical scrolling** with automatic snap-to-post
- **Scroll indicators** showing current position
- **Keyboard navigation** (Arrow Up/Down)
- **Mobile-responsive design** optimized for touch

### 🎨 Interactive Color Wheel
- **12 beautiful colors** with unique personalities
- **Smooth rotation animations** and visual feedback
- **Real-time selection** with color descriptions
- **Update ratings** - change your mind anytime
- **Haptic-like feedback** with pulse animations

### 📊 Advanced Analytics
- **Slide-in analytics panel** with "Change Sides" functionality
- **Beautiful donut chart** showing color distribution
- **Percentage breakdown** for each color
- **Statistics dashboard** with key metrics
- **Most/least popular** color insights
- **Visual color bars** with animated fills

### 📱 Post Features
- **Rich media posts** with full-screen images
- **Author profiles** with avatars and bios
- **Engagement metrics** showing total ratings
- **Time stamps** with human-readable formats
- **Gradient overlays** for text readability

### 🗄️ Database Architecture
- **Users table** - profiles and authentication
- **Posts table** - content and media
- **Colors table** - 12 color mappings
- **Ratings table** - user votes with timestamps
- **Optimized queries** with proper indexing

## 🚀 Quick Start

### Prerequisites
- PHP 7.4 or higher
- SQLite3 extension enabled
- Web server (Apache/Nginx) or PHP built-in server

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd colorgrade
```

2. **Set up permissions**
```bash
chmod 755 database/
chmod 644 database/schema.sql
```

3. **Start the server**

Using PHP built-in server:
```bash
php -S localhost:8000
```

Using Apache/Nginx:
- Point your document root to the project directory
- Ensure mod_rewrite is enabled (Apache)

4. **Access the application**
```
http://localhost:8000
```

The database will be automatically initialized with seed data on first load!

## 📁 Project Structure

```
/
├── index.php                 # Main entry point
├── config.php               # Application configuration
├── api/                     # RESTful API endpoints
│   ├── posts.php           # Fetch posts with pagination
│   ├── rate.php            # Submit/update ratings
│   ├── analytics.php       # Get color distribution
│   └── colors.php          # Fetch color mappings
├── database/
│   ├── config.php          # Database connection class
│   ├── schema.sql          # Database schema & seed data
│   └── colorgrade.db       # SQLite database (auto-created)
├── assets/
│   ├── css/
│   │   ├── main.css        # Core styles & layout
│   │   ├── scroll.css      # Scroll & post styles
│   │   └── animations.css  # Modals & animations
│   └── js/
│       ├── app.js          # Main application controller
│       ├── scroll-handler.js # Scroll logic & snap
│       ├── color-wheel.js  # Color wheel component
│       └── analytics.js    # Analytics panel component
└── README.md
```

## 🎯 API Endpoints

### GET `/api/posts.php`
Fetch posts with pagination and user ratings.

**Parameters:**
- `offset` (optional) - Starting position (default: 0)
- `limit` (optional) - Number of posts (default: 20)

**Response:**
```json
{
  "success": true,
  "posts": [...],
  "pagination": {
    "offset": 0,
    "limit": 20,
    "total": 12,
    "has_more": false
  }
}
```

### POST `/api/rate.php`
Submit or update a color rating for a post.

**Body:**
```json
{
  "post_id": 1,
  "color_id": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Rating submitted successfully",
  "rating": {
    "post_id": 1,
    "color_id": 5,
    "color_name": "Emerald Green",
    "color_hex": "#00897B"
  },
  "total_ratings": 6
}
```

### GET `/api/analytics.php`
Get color distribution analytics for a post.

**Parameters:**
- `post_id` (required) - Post ID to analyze

**Response:**
```json
{
  "success": true,
  "post_id": 1,
  "total_votes": 5,
  "color_distribution": [...],
  "insights": {
    "most_voted": {...},
    "least_voted": {...},
    "unique_voters": 4
  }
}
```

### GET `/api/colors.php`
Fetch all available colors.

**Response:**
```json
{
  "success": true,
  "colors": [...]
}
```

## 🎨 Color System

The platform features 12 carefully selected colors, each with unique personality:

| Color | Hex | Meaning |
|-------|-----|---------|
| Passionate Red | #E53935 | Intense and powerful |
| Vibrant Orange | #FB8C00 | Energetic and creative |
| Sunny Yellow | #FDD835 | Optimistic and cheerful |
| Fresh Lime | #7CB342 | Refreshing and natural |
| Emerald Green | #00897B | Growth and harmony |
| Ocean Teal | #00ACC1 | Calm and balanced |
| Sky Blue | #1E88E5 | Trustworthy and serene |
| Royal Purple | #5E35B1 | Creative and luxurious |
| Mystic Violet | #8E24AA | Mysterious and inspiring |
| Hot Pink | #D81B60 | Bold and playful |
| Coral Rose | #F4511E | Warm and inviting |
| Deep Magenta | #C2185B | Passionate and confident |

## 🔧 Configuration

### Database Configuration
Edit `database/config.php` to change database settings:

```php
private $dbPath = __DIR__ . '/colorgrade.db';
```

### Session Management
The app uses PHP sessions. Default user is set in `config.php`:

```php
if (!isset($_SESSION['user_id'])) {
    $_SESSION['user_id'] = 1; // Default user for demo
}
```

### Pagination
Adjust default pagination in `api/posts.php`:

```php
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
```

## 🎨 Design System

### Color Scheme
```css
--primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--dark-bg: #0a0a0a;
--dark-card: #1a1a1a;
--text-primary: #ffffff;
--text-secondary: #a0a0a0;
```

### Typography
- Font: System fonts (-apple-system, Segoe UI, Roboto)
- Base size: 16px
- Line height: 1.6

### Animations
- Fast transitions: 0.2s
- Normal transitions: 0.3s
- Slow transitions: 0.5s

## 📱 Browser Support

- ✅ Chrome 90+ (Recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile Safari (iOS 14+)
- ✅ Chrome Mobile (Android 10+)

## 🔒 Security Features

- ✅ SQL injection protection (PDO prepared statements)
- ✅ XSS prevention (proper escaping)
- ✅ CSRF token validation (recommended for production)
- ✅ Input sanitization
- ✅ Error handling with logging

## 🚀 Performance Optimizations

- **Lazy loading** for post images
- **Request debouncing** for scroll events
- **CSS containment** for better rendering
- **Efficient SQL queries** with proper indexing
- **Minimal DOM manipulation**
- **Hardware-accelerated** CSS animations

## 🛠️ Development

### Adding New Posts
Insert directly into database:
```sql
INSERT INTO posts (author_id, content, image) 
VALUES (1, 'Your content here', 'image-url.jpg');
```

### Adding New Users
```sql
INSERT INTO users (name, username, avatar, bio) 
VALUES ('Jane Doe', 'janedoe', 'avatar-url.jpg', 'Bio here');
```

### Customizing Colors
Edit `database/schema.sql` and rebuild database:
```sql
INSERT INTO colors (color_name, hex_value, position, description) 
VALUES ('Custom Color', '#FF5733', 12, 'Description');
```

## 📊 Analytics Features

### Donut Chart
- SVG-based rendering
- Smooth animations
- Responsive sizing
- Interactive segments

### Color Breakdown
- Percentage bars
- Vote counts
- Color swatches
- Sort by popularity

### Insights
- Most popular color
- Least popular color
- Unique voters count
- Total votes

## 🌟 Key Features Implementation

### Snap Scrolling
```css
scroll-snap-type: y mandatory;
scroll-snap-align: start;
```

### Color Wheel Segments
Dynamic generation with CSS clip-path and rotation:
```javascript
const segmentAngle = 360 / colors.length;
```

### Smooth Animations
Hardware-accelerated transforms:
```css
transform: translateY(0);
transition: transform 0.3s ease;
```

## 🐛 Troubleshooting

### Database not initializing
```bash
# Check permissions
chmod 755 database/
# Delete existing database
rm database/colorgrade.db
# Refresh page to recreate
```

### Images not loading
- Check CORS settings
- Verify image URLs are accessible
- Check browser console for errors

### Scroll not working
- Ensure JavaScript is enabled
- Check browser console for errors
- Try different browser

## 📝 License

This project is open source and available under the MIT License.

## 👏 Credits

- Images: Unsplash
- Avatars: Pravatar
- Icons: Unicode Emoji
- Design inspiration: TikTok, Instagram Reels

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Made with 🎨 and ❤️ by ColorGrade Team**
