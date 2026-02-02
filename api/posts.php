<?php

require_once __DIR__ . '/../config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $db = Database::getInstance();
    $userId = getCurrentUserId();
    
    // Get offset for pagination
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
    
    // Fetch posts with author and rating info
    $sql = "
        SELECT 
            p.id,
            p.content,
            p.image,
            p.created_at,
            u.id as author_id,
            u.name as author_name,
            u.username as author_username,
            u.avatar as author_avatar,
            u.bio as author_bio,
            COUNT(DISTINCT r.id) as total_ratings,
            ur.color_id as user_rating_color_id,
            c.color_name as user_rating_color_name,
            c.hex_value as user_rating_color_hex
        FROM posts p
        INNER JOIN users u ON p.author_id = u.id
        LEFT JOIN ratings r ON p.id = r.post_id
        LEFT JOIN ratings ur ON p.id = ur.post_id AND ur.user_id = ?
        LEFT JOIN colors c ON ur.color_id = c.id
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
    ";
    
    $posts = $db->fetchAll($sql, [$userId, $limit, $offset]);
    
    // Format posts for response
    $formattedPosts = array_map(function($post) {
        return [
            'id' => (int)$post['id'],
            'content' => $post['content'],
            'image' => $post['image'],
            'created_at' => $post['created_at'],
            'time_ago' => timeAgo($post['created_at']),
            'author' => [
                'id' => (int)$post['author_id'],
                'name' => $post['author_name'],
                'username' => $post['author_username'],
                'avatar' => $post['author_avatar'],
                'bio' => $post['author_bio']
            ],
            'total_ratings' => (int)$post['total_ratings'],
            'user_rating' => $post['user_rating_color_id'] ? [
                'color_id' => (int)$post['user_rating_color_id'],
                'color_name' => $post['user_rating_color_name'],
                'color_hex' => $post['user_rating_color_hex']
            ] : null
        ];
    }, $posts);
    
    // Get total count for pagination
    $totalCount = $db->fetch("SELECT COUNT(*) as count FROM posts")['count'];
    
    jsonResponse([
        'success' => true,
        'posts' => $formattedPosts,
        'pagination' => [
            'offset' => $offset,
            'limit' => $limit,
            'total' => (int)$totalCount,
            'has_more' => ($offset + $limit) < $totalCount
        ]
    ]);
    
} catch (Exception $e) {
    handleError('Failed to fetch posts: ' . $e->getMessage(), 500);
}

?>
