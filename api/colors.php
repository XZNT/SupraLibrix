<?php

require_once __DIR__ . '/../config.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    $db = Database::getInstance();
    
    $sql = "SELECT id, color_name, hex_value, position, description FROM colors ORDER BY position";
    $colors = $db->fetchAll($sql);
    
    $formattedColors = array_map(function($color) {
        return [
            'id' => (int)$color['id'],
            'name' => $color['color_name'],
            'hex' => $color['hex_value'],
            'position' => (int)$color['position'],
            'description' => $color['description']
        ];
    }, $colors);
    
    jsonResponse([
        'success' => true,
        'colors' => $formattedColors
    ]);
    
} catch (Exception $e) {
    handleError('Failed to fetch colors: ' . $e->getMessage(), 500);
}

?>
