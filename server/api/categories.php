<?php
header('Content-Type: application/json');

// Simple in-memory categories list
$categories = [
  ["id" => 1, "name" => "Electronics", "description" => "Electronic products"],
  ["id" => 2, "name" => "Furniture", "description" => "Furniture items"],
  ["id" => 3, "name" => "Clothing", "description" => "Apparel and clothing"],
];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // GET /api/categories
  echo json_encode($categories);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // POST /api/categories
  $input = json_decode(file_get_contents('php://input'), true);
  $newCategory = [
    "id" => count($categories) + 1,
    "name" => $input['name'] ?? '',
    "description" => $input['description'] ?? ''
  ];
  $categories[] = $newCategory;
  http_response_code(201);
  echo json_encode($newCategory);
  exit;
}

// Handle PUT /api/categories/{id} and DELETE /api/categories/{id}
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('#^/api/categories/(\d+)$#', $path, $m)) {
  $id = (int)$m[1];

  if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    foreach ($categories as &$c) {
      if ($c['id'] === $id) {
        $c['name'] = $input['name'] ?? $c['name'];
        $c['description'] = $input['description'] ?? $c['description'];
        echo json_encode($c);
        exit;
      }
    }
    http_response_code(404);
    echo json_encode(["error" => "Category not found"]);
    exit;
  }

  if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    foreach ($categories as $idx => $c) {
      if ($c['id'] === $id) {
        array_splice($categories, $idx, 1);
        http_response_code(204);
        exit;
      }
    }
    http_response_code(404);
    echo json_encode(["error" => "Category not found"]);
    exit;
  }
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
