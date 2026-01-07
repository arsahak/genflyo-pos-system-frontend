Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Fixing CategoryUpdate.tsx Git Issue" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if file exists
Write-Host "1. Checking if file exists locally..." -ForegroundColor Yellow
if (Test-Path "component\categoryManagement\CategoryUpdate.tsx") {
    Write-Host "   ✓ File EXISTS at: component\categoryManagement\CategoryUpdate.tsx" -ForegroundColor Green
} else {
    Write-Host "   ✗ File DOES NOT EXIST!" -ForegroundColor Red
    exit 1
}

# Check if file is tracked by git
Write-Host ""
Write-Host "2. Checking if file is tracked in git..." -ForegroundColor Yellow
$tracked = git ls-files | Select-String "CategoryUpdate.tsx"
if ($tracked) {
    Write-Host "   ✓ File IS tracked: $tracked" -ForegroundColor Green
} else {
    Write-Host "   ✗ File is NOT tracked in git" -ForegroundColor Red
}

# Check if file is ignored
Write-Host ""
Write-Host "3. Checking if file is ignored by git..." -ForegroundColor Yellow
$ignored = git check-ignore "component\categoryManagement\CategoryUpdate.tsx"
if ($ignored) {
    Write-Host "   ✗ File IS IGNORED: $ignored" -ForegroundColor Red
} else {
    Write-Host "   ✓ File is NOT ignored" -ForegroundColor Green
}

# Show current git status
Write-Host ""
Write-Host "4. Current git status:" -ForegroundColor Yellow
git status --short

# Add the file
Write-Host ""
Write-Host "5. Adding CategoryUpdate.tsx to git..." -ForegroundColor Yellow
git add component/categoryManagement/CategoryUpdate.tsx
Write-Host "   ✓ File added" -ForegroundColor Green

# Show status after add
Write-Host ""
Write-Host "6. Git status after adding:" -ForegroundColor Yellow
git status --short

# Commit the file
Write-Host ""
Write-Host "7. Committing the file..." -ForegroundColor Yellow
$commitOutput = git commit -m "Add CategoryUpdate component for category edit functionality" 2>&1
Write-Host $commitOutput

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✓ Committed successfully" -ForegroundColor Green
} else {
    Write-Host "   ! Commit result: $commitOutput" -ForegroundColor Yellow
}

# Push to remote
Write-Host ""
Write-Host "8. Pushing to remote..." -ForegroundColor Yellow
git push origin main
Write-Host "   ✓ Pushed to origin/main" -ForegroundColor Green

# Verify file is now tracked
Write-Host ""
Write-Host "9. Verifying file is now tracked..." -ForegroundColor Yellow
$trackedAfter = git ls-files | Select-String "CategoryUpdate.tsx"
if ($trackedAfter) {
    Write-Host "   ✓ SUCCESS! File is now tracked: $trackedAfter" -ForegroundColor Green
} else {
    Write-Host "   ✗ FAILED! File is still not tracked" -ForegroundColor Red
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Done! Check Vercel for new deployment" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

