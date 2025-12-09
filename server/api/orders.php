<?php
header('Content-Type: application/json');

// Simple in-memory orders list
$orders = [
  ["id" => 1, "customer_name" => "John Doe", "total" => 99.99, "status" => "pending", "created_at" => "2024-12-01T10:00:00Z", "storeId" => 1],
  ["id" => 2, "customer_name" => "Jane Smith", "total" => 249.99, "status" => "shipped", "created_at" => "2024-12-02T14:30:00Z", "storeId" => 2],
  ["id" => 3, "customer_name" => "Bob Johnson", "total" => 149.99, "status" => "delivered", "created_at" => "2024-11-28T08:15:00Z", "storeId" => 1],
  ["id" => 4, "customer_name" => "Sarah Williams", "total" => 179.99, "status" => "processing", "created_at" => "2024-12-03T11:20:00Z", "storeId" => 3],
];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  // GET /api/orders — return all orders (optionally filtered by date or status)
  $dateFrom = $_GET['dateFrom'] ?? null;
  $dateTo = $_GET['dateTo'] ?? null;
  $statusFilter = $_GET['statusFilter'] ?? null;

  $filtered = $orders;
  if ($dateFrom) {
    $filtered = array_filter($filtered, fn($o) => strtotime($o['created_at']) >= strtotime($dateFrom));
  }
  if ($dateTo) {
    $filtered = array_filter($filtered, fn($o) => strtotime($o['created_at']) <= strtotime($dateTo));
  }
  if ($statusFilter) {
    $filtered = array_filter($filtered, fn($o) => $o['status'] === $statusFilter);
  }

  echo json_encode(array_values($filtered));
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // POST /api/orders — create a new order
  $input = json_decode(file_get_contents('php://input'), true);
  $newOrder = [
    "id" => count($orders) + 1,
    "customer_name" => $input['customer_name'] ?? '',
    "total" => floatval($input['total'] ?? 0),
    "status" => $input['status'] ?? 'pending',
    "created_at" => $input['created_at'] ?? date('c'),
    "storeId" => $input['storeId'] ?? 1
  ];
  $orders[] = $newOrder;
  http_response_code(201);
  echo json_encode($newOrder);
  exit;
}

// Handle PUT /api/orders/{id} and DELETE /api/orders/{id}
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('#^/api/orders/(\d+)$#', $path, $m)) {
  $id = (int)$m[1];

  if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // PUT /api/orders/{id} — update order (primarily status)
    $input = json_decode(file_get_contents('php://input'), true);
    foreach ($orders as &$o) {
      if ($o['id'] === $id) {
        $o['customer_name'] = $input['customer_name'] ?? $o['customer_name'];
        $o['total'] = floatval($input['total'] ?? $o['total']);
        $o['status'] = $input['status'] ?? $o['status'];
        echo json_encode($o);
        exit;
      }
    }
    http_response_code(404);
    echo json_encode(["error" => "Order not found"]);
    exit;
  }

  if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // DELETE /api/orders/{id} — delete order
    foreach ($orders as $idx => $o) {
      if ($o['id'] === $id) {
        array_splice($orders, $idx, 1);
        http_response_code(204);
        exit;
      }
    }
    http_response_code(404);
    echo json_encode(["error" => "Order not found"]);
    exit;
  }
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
