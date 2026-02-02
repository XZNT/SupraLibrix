<?php

require_once __DIR__ . '/../config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $postId = isset($_GET['post_id']) ? (int)$_GET['post_id'] : null;
    
    if (!$postId) {
        handleError('Missing required parameter: post_id');
    }
    
    $db = Database::getInstance();
    
    // Verify post exists
    $post = $db->fetch("SELECT id FROM posts WHERE id = ?", [$postId]);
    if (!$post) {
        handleError('Post not found', 404);
    }
    
    // Get color distribution for this post
    $sql = "
        SELECT 
            c.id as color_id,
            c.color_name,
            c.hex_value,
            c.position,
            COUNT(r.id) as vote_count
        FROM colors c
        LEFT JOIN ratings r ON c.id = r.color_id AND r.post_id = ?
        GROUP BY c.id
        ORDER BY c.position
    ";
    
    $colorStats = $db->fetchAll($sql, [$postId]);
    
    // Calculate total votes
    $totalVotes = array_sum(array_column($colorStats, 'vote_count'));
    
    // Format stats with percentages
    $formattedStats = array_map(function($stat) use ($totalVotes) {
        $voteCount = (int)$stat['vote_count'];
        $percentage = $totalVotes > 0 ? round(($voteCount / $totalVotes) * 100, 1) : 0;
        
        return [
            'color_id' => (int)$stat['color_id'],
            'color_name' => $stat['color_name'],
            'hex_value' => $stat['hex_value'],
            'position' => (int)$stat['position'],
            'vote_count' => $voteCount,
            'percentage' => $percentage
        ];
    }, $colorStats);
    
    // Find most and least voted colors (excluding those with 0 votes for least)
    $votedColors = array_filter($formattedStats, function($stat) {
        return $stat['vote_count'] > 0;
    });
    
    $mostVoted = null;
    $leastVoted = null;
    
    if (!empty($votedColors)) {
        usort($votedColors, function($a, $b) {
            return $b['vote_count'] - $a['vote_count'];
        });
        $mostVoted = $votedColors[0];
        $leastVoted = end($votedColors);
    }
    
    jsonResponse([
        'success' => true,
        'post_id' => $postId,
        'total_votes' => $totalVotes,
        'color_distribution' => $formattedStats,
        'insights' => [
            'most_voted' => $mostVoted,
            'least_voted' => $leastVoted,
            'unique_voters' => count($votedColors)
        ]
    ]);
    
} catch (Exception $e) {
    handleError('Failed to fetch analytics: ' . $e->getMessage(), 500);
}

?>
