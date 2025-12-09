<?php
header('Content-Type: application/json');

// Simple in-memory product list (in production use a database)
$products = [
  ["id" => 1, "title" => "Laptop", "price" => 999.99, "stock" => 5, "category" => "Electronics"],
  ["id" => 2, "title" => "Mouse", "price" => 29.99, "stock" => 50, "category" => "Electronics"],
  ["id" => 3, "title" => "Desk Chair", "price" => 199.99, "stock" => 10, "category" => "Furniture"],
];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // GET /api/products — return all products (optionally filtered by storeId)
  $storeId = $_GET['storeId'] ?? null;
  echo json_encode($products);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // POST /api/products — create a new product
  $input = json_decode(file_get_contents('php://input'), true);
  $newProduct = [
    "id" => count($products) + 1,
    "title" => $input['title'] ?? '',
    "price" => floatval($input['price'] ?? 0),
    "stock" => intval($input['stock'] ?? 0),
    "category" => $input['category'] ?? ''
  ];
  $products[] = $newProduct;
  http_response_code(201);
  echo json_encode($newProduct);
  exit;
}

// Handle PUT /api/products/{id} and DELETE /api/products/{id}
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('#^/api/products/(\d+)$#', $path, $m)) {
  $id = (int)$m[1];

  if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // PUT /api/products/{id} — update product
    $input = json_decode(file_get_contents('php://input'), true);
    foreach ($products as &$p) {
      if ($p['id'] === $id) {
        $p['title'] = $input['title'] ?? $p['title'];
        $p['price'] = floatval($input['price'] ?? $p['price']);
        $p['stock'] = intval($input['stock'] ?? $p['stock']);
        $p['category'] = $input['category'] ?? $p['category'];
        echo json_encode($p);
        exit;
      }
    }
    http_response_code(404);
    echo json_encode(["error" => "Product not found"]);
    exit;
  }

  if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // DELETE /api/products/{id} — delete product
    foreach ($products as $idx => $p) {
      if ($p['id'] === $id) {
        array_splice($products, $idx, 1);
        http_response_code(204);
        exit;
      }
    }
    http_response_code(404);
    echo json_encode(["error" => "Product not found"]);
    exit;
  }
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
