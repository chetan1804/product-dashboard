# Start Jordan E-Commerce Server

Write-Host "🚀 Starting Jordan E-Commerce Server..." -ForegroundColor Cyan

# Navigate to server directory
Set-Location -Path "$PSScriptRoot\server"

# Check if MongoDB is running
Write-Host "`n🔍 Checking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($mongoService -and $mongoService.Status -eq 'Running') {
    Write-Host "✅ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB service not found or not running" -ForegroundColor Yellow
    Write-Host "Please start MongoDB manually or install it from:" -ForegroundColor Yellow
    Write-Host "https://www.mongodb.com/try/download/community" -ForegroundColor White
    $continue = Read-Host "`nDo you want to continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}

# Start server
Write-Host "`n🚀 Starting Node.js server on http://localhost:8000..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server`n" -ForegroundColor Yellow

npm run dev
