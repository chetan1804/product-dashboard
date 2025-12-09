<?php
header('Content-Type: application/json');

// Simple in-memory attributes list
$attributes = [
  ["id" => 1, "name" => "Color", "type" => "color", "options" => "Red, Blue, Green, Black"],
  ["id" => 2, "name" => "Size", "type" => "size", "options" => "S, M, L, XL, XXL"],
  ["id" => 3, "name" => "Weight", "type" => "number", "options" => ""],
];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // GET /api/attributes
  echo json_encode($attributes);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // POST /api/attributes
  $input = json_decode(file_get_contents('php://input'), true);
  $newAttribute = [
    "id" => count($attributes) + 1,
    "name" => $input['name'] ?? '',
    "type" => $input['type'] ?? 'text',
    "options" => $input['options'] ?? ''
  ];
  $attributes[] = $newAttribute;
  http_response_code(201);
  echo json_encode($newAttribute);
  exit;
}

// Handle PUT /api/attributes/{id} and DELETE /api/attributes/{id}
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('#^/api/attributes/(\d+)$#', $path, $m)) {
  $id = (int)$m[1];

  if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    foreach ($attributes as &$a) {
      if ($a['id'] === $id) {
        $a['name'] = $input['name'] ?? $a['name'];
        $a['type'] = $input['type'] ?? $a['type'];
        $a['options'] = $input['options'] ?? $a['options'];
        echo json_encode($a);
        exit;
      }
    }
    http_response_code(404);
    echo json_encode(["error" => "Attribute not found"]);
    exit;
  }

  if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    foreach ($attributes as $idx => $a) {
      if ($a['id'] === $id) {
        array_splice($attributes, $idx, 1);
        http_response_code(204);
        exit;
      }
    }
    http_response_code(404);
    echo json_encode(["error" => "Attribute not found"]);
    exit;
  }
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
