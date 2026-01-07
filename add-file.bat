@echo off
cd "F:\POS Software\frontend"
echo === Adding CategoryUpdate.tsx ===
git add component/categoryManagement/CategoryUpdate.tsx
echo.
echo === Committing ===
git commit -m "Add CategoryUpdate component for category edit page"
echo.
echo === Pushing to origin main ===
git push origin main
echo.
echo === Done! ===
pause

