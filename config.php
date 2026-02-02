<?php

// Application Configuration
define('APP_NAME', 'ColorGrade');
define('APP_VERSION', '1.0.0');
define('BASE_URL', '');

// Session Configuration
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Simulate logged-in user (in production, use proper authentication)
if (!isset($_SESSION['user_id'])) {
    $_SESSION['user_id'] = 1; // Default to user 1 for demo
    $_SESSION['username'] = 'sarahchen';
}

// Include database
require_once __DIR__ . '/database/config.php';

// Utility Functions
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function handleError($message, $statusCode = 400) {
    jsonResponse(['error' => $message], $statusCode);
}

function getCurrentUserId() {
    return $_SESSION['user_id'] ?? 1;
}

function timeAgo($datetime) {
    $timestamp = strtotime($datetime);
    $difference = time() - $timestamp;
    
    if ($difference < 60) {
        return 'Just now';
    } elseif ($difference < 3600) {
        $mins = floor($difference / 60);
        return $mins . ' minute' . ($mins > 1 ? 's' : '') . ' ago';
    } elseif ($difference < 86400) {
        $hours = floor($difference / 3600);
        return $hours . ' hour' . ($hours > 1 ? 's' : '') . ' ago';
    } elseif ($difference < 604800) {
        $days = floor($difference / 86400);
        return $days . ' day' . ($days > 1 ? 's' : '') . ' ago';
    } else {
        return date('M j, Y', $timestamp);
    }
}

?>
