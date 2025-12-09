# Jordan E-Commerce - Node.js + MongoDB Setup Script

Write-Host "🚀 Jordan E-Commerce Setup" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "`n📦 Checking Node.js installation..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
  $nodeVersion = node --version
  Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
}
else {
  Write-Host "❌ Node.js is NOT installed!" -ForegroundColor Red
  Write-Host "Please download and install from: https://nodejs.org/" -ForegroundColor Yellow
  exit 1
}

# Check if MongoDB is installed
Write-Host "`n📦 Checking MongoDB installation..." -ForegroundColor Yellow
if (Get-Command mongod -ErrorAction SilentlyContinue) {
  Write-Host "✅ MongoDB is installed" -ForegroundColor Green
}
else {
  Write-Host "⚠️  MongoDB is NOT installed!" -ForegroundColor Yellow
  Write-Host "Please download and install from: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
  $continue = Read-Host "Do you want to continue without MongoDB? (y/n)"
  if ($continue -ne "y") {
    exit 1
  }
}

# Navigate to server directory
Write-Host "`n📁 Navigating to server directory..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\server"

# Install dependencies
Write-Host "`n📦 Installing server dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
}
else {
  Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
  exit 1
}

# Start MongoDB if not running
Write-Host "`n🔄 Checking MongoDB status..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue
if ($mongoService) {
  if ($mongoService.Status -ne 'Running') {
    Write-Host "Starting MongoDB service..." -ForegroundColor Yellow
    Start-Service MongoDB
    Start-Sleep -Seconds 2
  }
  Write-Host "✅ MongoDB service is running" -ForegroundColor Green
}
else {
  Write-Host "⚠️  MongoDB service not found. Make sure MongoDB is running manually." -ForegroundColor Yellow
}

# Seed database
Write-Host "`n🌱 Seeding database..." -ForegroundColor Yellow
npm run seed

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Database seeded successfully" -ForegroundColor Green
}
else {
  Write-Host "⚠️  Database seeding failed. You may need to start MongoDB manually." -ForegroundColor Yellow
}

# Done
Write-Host "`n" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "✨ Setup Complete!" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan

Write-Host "`nTo start the server, run:" -ForegroundColor Yellow
Write-Host "  cd server" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White

Write-Host "`nServer will be available at:" -ForegroundColor Yellow
Write-Host "  http://localhost:8000" -ForegroundColor White

Write-Host "`n📚 API Documentation available in:" -ForegroundColor Yellow
Write-Host "  server\SETUP.md" -ForegroundColor White
