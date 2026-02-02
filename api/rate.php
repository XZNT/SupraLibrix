<?php

require_once __DIR__ . '/../config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    handleError('Method not allowed', 405);
}

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['post_id']) || !isset($input['color_id'])) {
        handleError('Missing required fields: post_id and color_id');
    }
    
    $postId = (int)$input['post_id'];
    $colorId = (int)$input['color_id'];
    $userId = getCurrentUserId();
    
    $db = Database::getInstance();
    
    // Verify post exists
    $post = $db->fetch("SELECT id FROM posts WHERE id = ?", [$postId]);
    if (!$post) {
        handleError('Post not found', 404);
    }
    
    // Verify color exists
    $color = $db->fetch("SELECT id, color_name, hex_value FROM colors WHERE id = ?", [$colorId]);
    if (!$color) {
        handleError('Color not found', 404);
    }
    
    // Check if user already rated this post
    $existingRating = $db->fetch(
        "SELECT id FROM ratings WHERE post_id = ? AND user_id = ?",
        [$postId, $userId]
    );
    
    if ($existingRating) {
        // Update existing rating
        $sql = "UPDATE ratings SET color_id = ?, created_at = CURRENT_TIMESTAMP WHERE post_id = ? AND user_id = ?";
        $db->query($sql, [$colorId, $postId, $userId]);
        $message = 'Rating updated successfully';
    } else {
        // Insert new rating
        $sql = "INSERT INTO ratings (post_id, user_id, color_id) VALUES (?, ?, ?)";
        $db->query($sql, [$postId, $userId, $colorId]);
        $message = 'Rating submitted successfully';
    }
    
    // Get updated total ratings count
    $totalRatings = $db->fetch(
        "SELECT COUNT(*) as count FROM ratings WHERE post_id = ?",
        [$postId]
    )['count'];
    
    jsonResponse([
        'success' => true,
        'message' => $message,
        'rating' => [
            'post_id' => $postId,
            'color_id' => $colorId,
            'color_name' => $color['color_name'],
            'color_hex' => $color['hex_value']
        ],
        'total_ratings' => (int)$totalRatings
    ]);
    
} catch (Exception $e) {
    handleError('Failed to submit rating: ' . $e->getMessage(), 500);
}

?>
