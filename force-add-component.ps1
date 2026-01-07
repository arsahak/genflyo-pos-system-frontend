$ErrorActionPreference = "Continue"
$outputFile = "git-add-output.txt"

"=== Starting Git Add Process ===" | Out-File $outputFile
"" | Out-File $outputFile -Append

# Check if file exists
"Checking if CategoryUpdate.tsx exists..." | Out-File $outputFile -Append
if (Test-Path "component\categoryManagement\CategoryUpdate.tsx") {
    "YES - File exists" | Out-File $outputFile -Append
    $fileInfo = Get-Item "component\categoryManagement\CategoryUpdate.tsx"
    "File size: $($fileInfo.Length) bytes" | Out-File $outputFile -Append
} else {
    "NO - File does not exist!" | Out-File $outputFile -Append
}
"" | Out-File $outputFile -Append

# Force add the file
"Running: git add -f component/categoryManagement/CategoryUpdate.tsx" | Out-File $outputFile -Append
git add -f component/categoryManagement/CategoryUpdate.tsx 2>&1 | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

# Check git status
"Running: git status --short" | Out-File $outputFile -Append
git status --short 2>&1 | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

# Commit
"Running: git commit" | Out-File $outputFile -Append
git commit -m "Force add CategoryUpdate.tsx component file" 2>&1 | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

# Push
"Running: git push" | Out-File $outputFile -Append
git push origin main 2>&1 | Out-File $outputFile -Append
"" | Out-File $outputFile -Append

"=== Done ===" | Out-File $outputFile -Append

Write-Host "Output saved to $outputFile"

