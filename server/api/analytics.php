<?php
header('Content-Type: application/json');

// Generate sample analytics data
$timeRange = $_GET['timeRange'] ?? 'month';

// Generate sales data (last 7 days for week, 30 for month, 12 for year)
$days = $timeRange === 'week' ? 7 : ($timeRange === 'month' ? 30 : 12);
$salesData = [];
$revenueData = [];

for ($i = $days; $i > 0; $i--) {
  $date = date('Y-m-d', strtotime("-$i days"));
  $sales = rand(10, 50);
  $revenue = $sales * rand(50, 200);

  $salesData[] = [
    "date" => substr($date, 5),
    "sales" => $sales
  ];
  $revenueData[] = [
    "date" => substr($date, 5),
    "revenue" => $revenue
  ];
}

// Store comparison data
$storeComparison = [
  ["name" => "Store A", "revenue" => 5200, "orders" => 120],
  ["name" => "Store B", "revenue" => 4800, "orders" => 105],
  ["name" => "Store C", "revenue" => 3600, "orders" => 85],
];

// Top products
$topProducts = [
  ["name" => "Laptop", "sales" => 45],
  ["name" => "Mouse", "sales" => 120],
  ["name" => "Desk Chair", "sales" => 35],
  ["name" => "Monitor", "sales" => 28],
];

$totalSales = array_sum(array_column($salesData, 'sales'));
$totalRevenue = array_sum(array_column($revenueData, 'revenue'));

echo json_encode([
  "salesData" => $salesData,
  "revenueData" => $revenueData,
  "storeComparison" => $storeComparison,
  "topProducts" => $topProducts,
  "totalSales" => $totalSales,
  "totalRevenue" => $totalRevenue
]);
