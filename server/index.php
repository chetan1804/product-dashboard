<?php
header('Content-Type: application/json');

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($path === '/' || $path === '/index.php') {
  echo json_encode(["status" => "ok", "message" => "Jordan PHP API running"]);
  exit;
}

// simple router: /api/...
if (preg_match('#^/api/(.+)$#', $path, $matches)) {
  $file = __DIR__ . '/api/' . $matches[1] . '.php';
  if (file_exists($file)) {
    require $file;
    exit;
  }
}

http_response_code(404);
echo json_encode(["error" => "Not found"]);
