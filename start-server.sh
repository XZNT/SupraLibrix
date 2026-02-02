#!/bin/bash

# ColorGrade Server Startup Script

echo "🎨 Starting ColorGrade Server..."
echo ""

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP 7.4 or higher."
    echo "   Ubuntu/Debian: sudo apt-get install php php-sqlite3"
    echo "   macOS: brew install php"
    exit 1
fi

# Display PHP version
PHP_VERSION=$(php -v | head -n 1)
echo "✓ $PHP_VERSION"

# Check if SQLite extension is available
if ! php -m | grep -q sqlite3; then
    echo "❌ SQLite3 extension is not enabled."
    echo "   Please install php-sqlite3 package."
    exit 1
fi

echo "✓ SQLite3 extension enabled"
echo ""

# Set port (default: 8000)
PORT=${1:-8000}

# Check if port is in use
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port $PORT is already in use. Trying port $((PORT+1))..."
    PORT=$((PORT+1))
fi

echo "🚀 Starting PHP development server on http://localhost:$PORT"
echo ""
echo "   📱 Open in browser: http://localhost:$PORT"
echo "   🛑 Press Ctrl+C to stop the server"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start PHP built-in server
php -S localhost:$PORT
