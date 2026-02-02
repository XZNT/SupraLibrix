# 🎨 ColorGrade Installation Guide

Complete step-by-step guide to install and run ColorGrade on your system.

## 📋 Prerequisites

### Required Software
- **PHP 7.4+** (PHP 8.x recommended)
- **SQLite3** extension
- **Web Server** (Apache/Nginx) OR PHP built-in server

### System Requirements
- **OS**: Linux, macOS, or Windows
- **RAM**: 256MB minimum
- **Disk**: 50MB free space
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+

## 🚀 Quick Start (5 minutes)

### 1. Download/Clone the Project
```bash
git clone <repository-url>
cd colorgrade
```

### 2. Install PHP (if not already installed)

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install -y php php-sqlite3
```

**macOS (using Homebrew):**
```bash
brew install php
```

**Windows:**
Download PHP from [windows.php.net](https://windows.php.net/download/) and follow the installation wizard.

### 3. Verify Installation
```bash
php --version
php -m | grep sqlite3
```

You should see PHP version 7.4 or higher and sqlite3 in the list of modules.

### 4. Start the Server

**Using the start script (Linux/macOS):**
```bash
chmod +x start-server.sh
./start-server.sh
```

**Manually:**
```bash
php -S localhost:8000
```

**Custom port:**
```bash
php -S localhost:3000
```

### 5. Open in Browser
```
http://localhost:8000
```

That's it! The database will be automatically created with seed data on first load.

## 🔧 Detailed Installation

### Method 1: Using PHP Built-in Server (Recommended for Development)

This is the easiest method for local development and testing.

1. **Navigate to project directory:**
   ```bash
   cd /path/to/colorgrade
   ```

2. **Start server:**
   ```bash
   php -S localhost:8000
   ```

3. **Access application:**
   - Main app: http://localhost:8000
   - API test: http://localhost:8000/api/posts.php

4. **Stop server:**
   Press `Ctrl + C` in the terminal

### Method 2: Using Apache

1. **Install Apache and PHP:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install apache2 php libapache2-mod-php php-sqlite3
   
   # macOS
   brew install httpd php
   ```

2. **Copy project to web directory:**
   ```bash
   # Ubuntu/Debian
   sudo cp -r /path/to/colorgrade /var/www/html/colorgrade
   
   # macOS
   sudo cp -r /path/to/colorgrade /usr/local/var/www/colorgrade
   ```

3. **Set permissions:**
   ```bash
   sudo chown -R www-data:www-data /var/www/html/colorgrade
   sudo chmod -R 755 /var/www/html/colorgrade
   sudo chmod 777 /var/www/html/colorgrade/database
   ```

4. **Enable Apache modules:**
   ```bash
   sudo a2enmod php8.3
   sudo a2enmod rewrite
   sudo systemctl restart apache2
   ```

5. **Access application:**
   ```
   http://localhost/colorgrade
   ```

### Method 3: Using Nginx + PHP-FPM

1. **Install Nginx and PHP-FPM:**
   ```bash
   sudo apt-get install nginx php-fpm php-sqlite3
   ```

2. **Create Nginx configuration:**
   ```bash
   sudo nano /etc/nginx/sites-available/colorgrade
   ```

   Add this configuration:
   ```nginx
   server {
       listen 80;
       server_name localhost;
       root /var/www/html/colorgrade;
       index index.php index.html;

       location / {
           try_files $uri $uri/ /index.php?$query_string;
       }

       location ~ \.php$ {
           fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
           fastcgi_index index.php;
           fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
           include fastcgi_params;
       }
   }
   ```

3. **Enable site and restart:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/colorgrade /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   sudo systemctl restart php8.3-fpm
   ```

4. **Access application:**
   ```
   http://localhost
   ```

## 🗄️ Database Setup

### Automatic Setup (Recommended)
The database is automatically created and seeded when you first access the application. No manual setup required!

### Manual Setup (Optional)
If you want to manually initialize the database:

```bash
cd database
sqlite3 colorgrade.db < schema.sql
```

### Reset Database
To reset the database and start fresh:

```bash
rm database/colorgrade.db
# The database will be recreated on next page load
```

### Backup Database
```bash
cp database/colorgrade.db database/colorgrade_backup_$(date +%Y%m%d).db
```

## 🔍 Verification & Testing

### Test Main Application
```bash
curl http://localhost:8000/
```
Should return the HTML page.

### Test API Endpoints

**Get all posts:**
```bash
curl http://localhost:8000/api/posts.php | json_pp
```

**Get colors:**
```bash
curl http://localhost:8000/api/colors.php | json_pp
```

**Submit a rating:**
```bash
curl -X POST http://localhost:8000/api/rate.php \
  -H "Content-Type: application/json" \
  -d '{"post_id": 1, "color_id": 5}'
```

**Get analytics:**
```bash
curl http://localhost:8000/api/analytics.php?post_id=1 | json_pp
```

All endpoints should return JSON with `"success": true`.

## 🐛 Troubleshooting

### "PHP command not found"
**Solution:** Install PHP or add it to your PATH.
```bash
# Check if PHP is installed
which php

# Install if missing (Ubuntu)
sudo apt-get install php
```

### "SQLite3 extension not enabled"
**Solution:** Install php-sqlite3 package.
```bash
# Ubuntu/Debian
sudo apt-get install php-sqlite3

# Restart server after installing
```

### "Permission denied" on database directory
**Solution:** Set proper permissions.
```bash
chmod 755 database/
chmod 666 database/colorgrade.db  # if database exists
```

### Port already in use
**Solution:** Use a different port or kill the process.
```bash
# Use different port
php -S localhost:3000

# Or kill existing process
lsof -ti:8000 | xargs kill -9
```

### Images not loading
**Solutions:**
1. Check your internet connection (images load from external CDNs)
2. Check browser console for CORS errors
3. Try a different browser

### Blank page or errors
**Solutions:**
1. Check PHP error log:
   ```bash
   tail -f /var/log/php_errors.log
   ```
2. Enable error display in PHP:
   ```php
   // Add to config.php temporarily
   ini_set('display_errors', 1);
   error_reporting(E_ALL);
   ```
3. Check browser console for JavaScript errors

### Database not initializing
**Solution:** Check permissions and manually initialize.
```bash
rm database/colorgrade.db
chmod 777 database/
# Reload page in browser
```

## 🌐 Production Deployment

### Security Checklist
- [ ] Disable PHP error display
- [ ] Implement proper authentication
- [ ] Add CSRF protection
- [ ] Use HTTPS (SSL certificate)
- [ ] Set proper file permissions
- [ ] Use environment variables for sensitive data
- [ ] Enable rate limiting
- [ ] Regular backups

### Recommended Configuration

**php.ini settings:**
```ini
display_errors = Off
error_reporting = E_ALL
max_execution_time = 30
memory_limit = 128M
upload_max_filesize = 10M
post_max_size = 10M
```

**File Permissions:**
```bash
# Files
find . -type f -exec chmod 644 {} \;

# Directories
find . -type d -exec chmod 755 {} \;

# Database directory (writable)
chmod 777 database/

# Scripts
chmod +x start-server.sh
```

### Performance Optimization
1. Enable OPcache in php.ini
2. Use a proper web server (Apache/Nginx) instead of built-in server
3. Implement caching headers
4. Minify CSS and JavaScript
5. Enable gzip compression
6. Use a CDN for static assets

## 📱 Mobile Testing

### Using ngrok (for mobile testing)
```bash
# Install ngrok
npm install -g ngrok

# Start your local server
php -S localhost:8000

# In another terminal, create tunnel
ngrok http 8000

# Access from mobile using the ngrok URL
```

## 🆘 Support

### Common Issues Reference
- Database connection issues → Check SQLite3 extension
- API errors → Check PHP error logs
- Styling issues → Clear browser cache
- JavaScript errors → Check browser console

### Debug Mode
Enable detailed error messages:
```php
// Add to config.php
define('DEBUG_MODE', true);
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

### Getting Help
1. Check browser console for JavaScript errors
2. Check server logs for PHP errors
3. Verify all prerequisites are installed
4. Review README.md for additional information

## ✅ Post-Installation

After successful installation:
1. ✓ Application loads at http://localhost:8000
2. ✓ Posts are visible with images
3. ✓ Color wheel opens when clicking "Rate this post"
4. ✓ Analytics panel opens with "Analytics" button
5. ✓ Ratings can be submitted successfully
6. ✓ Scroll navigation works smoothly

**You're all set! Enjoy using ColorGrade! 🎨**

---

For more information, see [README.md](README.md)
