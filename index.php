<?php
require_once __DIR__ . '/config.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <meta name="theme-color" content="#0a0a0a">
    <meta name="description" content="ColorGrade - Rate and explore content with colors">
    <title>ColorGrade - Social Color Rating Platform</title>
    
    <!-- Favicon -->
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎨</text></svg>">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/scroll.css">
    <link rel="stylesheet" href="assets/css/animations.css">
    
    <!-- Preload critical resources -->
    <link rel="preconnect" href="https://images.unsplash.com">
    <link rel="preconnect" href="https://i.pravatar.cc">
</head>
<body>
    <!-- Loading Screen -->
    <div id="loading-screen" class="loading-screen">
        <div class="loading-spinner"></div>
        <div class="loading-text">Loading ColorGrade...</div>
    </div>
    
    <!-- App Container -->
    <div class="app-container">
        <!-- Header -->
        <header class="app-header">
            <div class="header-content">
                <div class="app-logo">
                    <div class="logo-icon">🎨</div>
                    <span>ColorGrade</span>
                </div>
                <div class="header-actions">
                    <img src="https://i.pravatar.cc/150?img=1" 
                         alt="User Avatar" 
                         class="user-avatar"
                         title="<?php echo $_SESSION['username']; ?>">
                </div>
            </div>
        </header>
        
        <!-- Posts Feed -->
        <div id="posts-feed" class="posts-feed">
            <!-- Posts will be dynamically loaded here -->
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="assets/js/scroll-handler.js"></script>
    <script src="assets/js/color-wheel.js"></script>
    <script src="assets/js/analytics.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>
