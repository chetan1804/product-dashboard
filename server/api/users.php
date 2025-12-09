<?php
header('Content-Type: application/json');

// Sample users data
$users = [
  ["id" => 1, "name" => "Super Admin", "email" => "superadmin@example.com", "role" => "superadmin"],
  ["id" => 2, "name" => "Store Admin", "email" => "storeadmin@example.com", "role" => "storeadmin"],
  ["id" => 3, "name" => "John Doe", "email" => "john@example.com", "role" => "admin"],
  ["id" => 4, "name" => "Jane Smith", "email" => "jane@example.com", "role" => "user"],
];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  echo json_encode($users);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $input = json_decode(file_get_contents('php://input'), true);
  $newUser = [
    "id" => count($users) + 1,
    "name" => $input['name'] ?? '',
    "email" => $input['email'] ?? '',
    "role" => $input['role'] ?? 'user'
  ];
  $users[] = $newUser;
  http_response_code(201);
  echo json_encode($newUser);
  exit;
}

// Handle PUT /api/users/{id} and DELETE /api/users/{id}
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
if (preg_match('#^/api/users/(\d+)$#', $path, $m)) {
  $id = (int)$m[1];

  if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);
    foreach ($users as &$u) {
      if ($u['id'] === $id) {
        $u['name'] = $input['name'] ?? $u['name'];
        $u['email'] = $input['email'] ?? $u['email'];
        $u['role'] = $input['role'] ?? $u['role'];
        echo json_encode($u);
        exit;
      }
    }
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
    exit;
  }

  if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    foreach ($users as $idx => $u) {
      if ($u['id'] === $id) {
        array_splice($users, $idx, 1);
        http_response_code(204);
        exit;
      }
    }
    http_response_code(404);
    echo json_encode(["error" => "User not found"]);
    exit;
  }
}

http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
