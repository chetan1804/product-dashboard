<?php
header('Content-Type: application/json');

// Simple in-memory store list (in production use a database)
$stores = [
  ["id" => 1, "name" => "Store A", "slug" => "store-a", "description" => "First store"],
  ["id" => 2, "name" => "Store B", "slug" => "store-b", "description" => "Second store"]
];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // GET /api/stores — return all stores
  echo json_encode($stores);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // POST /api/stores — create a new store
  $input = json_decode(file_get_contents('php://input'), true);
  $newStore = [
    "id" => count($stores) + 1,
    "name" => $input['name'] ?? '',
    "slug" => $input['slug'] ?? '',
    "description" => $input['description'] ?? ''
  ];
  $stores[] = $newStore;
  http_response_code(201);
  echo json_encode($newStore);
  exit;
}

// Handle PUT /api/stores/{id} and DELETE /api/stores/{id}
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('#^/api/stores/(\d+)$#', $path, $m)) {
  $id = (int)$m[1];

  if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // PUT /api/stores/{id} — update store
    $input = json_decode(file_get_contents('php://input'), true);
    foreach ($stores as &$s) {
      if ($s['id'] === $id) {
        $s['name'] = $input['name'] ?? $s['name'];
        $s['slug'] = $input['slug'] ?? $s['slug'];
        $s['description'] = $input['description'] ?? $s['description'];
        echo json_encode($s);
        exit;
      }
    }
    http_response_code(404);
    echo json_encode(["error" => "Store not found"]);
    exit;
  }

  if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // DELETE /api/stores/{id} — delete store
    foreach ($stores as $idx => $s) {
      if ($s['id'] === $id) {
        array_splice($stores, $idx, 1);
        http_response_code(204);
        exit;
      }
    }
    http_response_code(404);
    echo json_encode(["error" => "Store not found"]);
    exit;
  }
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
