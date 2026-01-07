Write-Host "=== Checking Git Status ===" -ForegroundColor Cyan
git status

Write-Host "`n=== Latest Commit ===" -ForegroundColor Cyan
git log --oneline -1

Write-Host "`n=== Files in Latest Commit ===" -ForegroundColor Cyan
git show --name-only --pretty=format: HEAD

Write-Host "`n`n=== Checking for CategoryUpdate in Git ===" -ForegroundColor Cyan
$files = git ls-files | Select-String "CategoryUpdate"
if ($files) {
    Write-Host "CategoryUpdate.tsx IS tracked in git:" -ForegroundColor Green
    $files
} else {
    Write-Host "CategoryUpdate.tsx is NOT tracked in git!" -ForegroundColor Red
}

Write-Host "`n=== Checking if file exists locally ===" -ForegroundColor Cyan
if (Test-Path "component\categoryManagement\CategoryUpdate.tsx") {
    Write-Host "File EXISTS locally" -ForegroundColor Green
} else {
    Write-Host "File DOES NOT exist locally" -ForegroundColor Red
}

Write-Host "`n=== Adding and committing the file ===" -ForegroundColor Cyan
git add component/categoryManagement/CategoryUpdate.tsx
git commit -m "Add CategoryUpdate component"
git push origin main

Write-Host "`nDone!" -ForegroundColor Green

