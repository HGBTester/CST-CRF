@echo off
echo Starting CST Audit System...
start "Backend" cmd /k "cd backend && npm run dev"
start "Frontend" cmd /k "npm run dev"
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo Login: admin / admin123
exit
