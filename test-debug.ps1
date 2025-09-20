# API Key Manager Debug Test Script
Write-Host "🧪 Testing API Key Manager Debug Version" -ForegroundColor Green

# 1. Check if dist directory exists
if (-not (Test-Path "dist")) {
    Write-Host "❌ Error: dist directory not found!" -ForegroundColor Red
    Write-Host "Please run 'npm run build' first." -ForegroundColor Yellow
    exit 1
}

# 2. Check if debug executable exists
$debugExe = "src-tauri\target\debug\api-key-manager.exe"
if (-not (Test-Path $debugExe)) {
    Write-Host "❌ Error: Debug executable not found!" -ForegroundColor Red
    Write-Host "Please run 'cargo build' in src-tauri directory first." -ForegroundColor Yellow
    exit 1
}

# 3. Check dist contents
Write-Host "📁 Checking dist directory contents..." -ForegroundColor Cyan
Get-ChildItem "dist" | ForEach-Object {
    Write-Host "   📄 $($_.Name)" -ForegroundColor White
}

# 4. Check if any existing processes are running
$existingProcesses = Get-Process -Name "api-key-manager" -ErrorAction SilentlyContinue
if ($existingProcesses) {
    Write-Host "⚠️  Found existing API Key Manager processes:" -ForegroundColor Yellow
    $existingProcesses | ForEach-Object {
        Write-Host "   🔄 PID: $($_.Id)" -ForegroundColor White
    }
    Write-Host "Stopping existing processes..." -ForegroundColor Yellow
    $existingProcesses | Stop-Process -Force
    Start-Sleep -Seconds 2
}

# 5. Launch the application
Write-Host "🚀 Launching API Key Manager (Debug)..." -ForegroundColor Green
Write-Host "Working directory: $(Get-Location)" -ForegroundColor Cyan

$process = Start-Process -FilePath $debugExe -PassThru -WindowStyle Hidden

# 6. Wait a moment and check if process started
Start-Sleep -Seconds 3

$runningProcess = Get-Process -Id $process.Id -ErrorAction SilentlyContinue
if ($runningProcess) {
    Write-Host "✅ Application started successfully!" -ForegroundColor Green
    Write-Host "   📊 Process ID: $($runningProcess.Id)" -ForegroundColor White
    Write-Host "   💾 Memory Usage: $([math]::Round($runningProcess.WorkingSet64 / 1MB, 2)) MB" -ForegroundColor White
    
    # Check if window is visible
    Write-Host "🔍 Application should now be visible as a floating toolbar." -ForegroundColor Cyan
    Write-Host "If you see a blank window, there might be a frontend loading issue." -ForegroundColor Yellow
} else {
    Write-Host "❌ Application failed to start or crashed immediately!" -ForegroundColor Red
    exit 1
}

Write-Host "`n🎯 Test completed. Check if the floating toolbar is visible and functional." -ForegroundColor Green
