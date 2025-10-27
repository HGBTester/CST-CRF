@echo off
echo ========================================
echo  Starting CST Audit System
echo ========================================
echo.
echo Starting Backend (Port 5000)...
start "CST Audit Backend" cmd /k "cd backend && if not exist uploads\evidence mkdir uploads\evidence && npm run dev"

echo.
echo Starting Frontend (Port 3000)...
start "CST Audit Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo  Both servers are starting!
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Two new windows will open for backend and frontend.
echo Keep both windows open while using the application.
echo.
pause
